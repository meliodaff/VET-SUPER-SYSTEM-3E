<?php
require_once '../../config/database.php';
require_once '../../utils/cors.php';
require_once '../../utils/response.php';

session_start();

if (!isset($_SESSION['admin_id'])) {
    Response::unauthorized('Please login first');
}

$database = new Database();
$db = $database->getConnection();

$employee_id = isset($_GET['employee_id']) ? (int)$_GET['employee_id'] : 0;

error_log("Doctor Detail Request - employee_id: " . $employee_id);

if ($employee_id <= 0) {
    error_log("Doctor Detail Error - Invalid employee_id: " . $employee_id);
    Response::error('Employee ID is required');
}

try {
    // Check what columns exist in employees table
    $columnsStmt = $db->query("SHOW COLUMNS FROM employees");
    $columns = $columnsStmt->fetchAll(PDO::FETCH_COLUMN);
    $hasId = in_array('id', $columns);
    $hasName = in_array('name', $columns);
    $hasFirstName = in_array('first_name', $columns);
    $hasRole = in_array('role', $columns);
    $hasSystemRole = in_array('system_role', $columns);
    $hasPosition = in_array('Position', $columns);
    
    // Determine primary key
    $primaryKey = $hasId ? 'id' : 'employee_id';
    
    // Build name field
    if ($hasName) {
        $nameField = 'name';
    } elseif ($hasFirstName) {
        $nameField = "CONCAT(COALESCE(first_name, ''), ' ', COALESCE(middle_name, ''), ' ', COALESCE(last_name, ''))";
    } else {
        $nameField = "COALESCE(first_name, 'Unknown')";
    }
    
    // Build position and role fields based on what columns exist
    $positionField = "COALESCE(";
    $positionParts = [];
    if ($hasPosition) $positionParts[] = "Position";
    if ($hasSystemRole) $positionParts[] = "system_role";
    if ($hasRole) $positionParts[] = "role";
    $positionField .= !empty($positionParts) ? implode(", ", $positionParts) : "'Veterinarian'";
    $positionField .= ", 'Veterinarian')";
    
    $roleField = "COALESCE(";
    $roleParts = [];
    if ($hasSystemRole) $roleParts[] = "system_role";
    if ($hasRole) $roleParts[] = "role";
    $roleField .= !empty($roleParts) ? implode(", ", $roleParts) : "'Employee'";
    $roleField .= ", 'Employee')";
    
    // Get doctor basic info - use employee_id as the ID field
    $idField = $hasId ? "id" : "employee_id";
    $sql = "
        SELECT 
            $idField AS id,
            $nameField AS name,
            $positionField AS position,
            $roleField AS role,
            COALESCE(rate, 0) AS salary,
            hire_date
        FROM employees
        WHERE $primaryKey = ?
    ";
    error_log("Doctor Detail SQL: " . $sql);
    error_log("Doctor Detail - Looking for employee_id: " . $employee_id);
    
    $stmt = $db->prepare($sql);
    $stmt->execute([$employee_id]);
    $doctor = $stmt->fetch();
    
    error_log("Doctor Detail - Found doctor: " . ($doctor ? 'Yes' : 'No'));
    
    if (!$doctor) {
        error_log("Doctor Detail Error - Doctor not found for employee_id: " . $employee_id);
        Response::error('Doctor not found');
    }
    
    // Get patient statistics - use the same primary key for JOIN
    $stmt = $db->prepare("
        SELECT 
            COUNT(DISTINCT inv.patient_id) AS total_patients,
            COUNT(DISTINCT CASE WHEN inv.status = 'paid' THEN inv.id END) AS paid_invoices,
            COUNT(DISTINCT inv.id) AS total_invoices,
            COALESCE(SUM(CASE WHEN inv.status = 'paid' THEN inv.total_amount ELSE 0 END), 0) AS total_revenue,
            COALESCE(AVG(CASE WHEN inv.status = 'paid' THEN inv.total_amount ELSE 0 END), 0) AS avg_invoice_amount
        FROM invoices inv
        WHERE inv.employee_id = ?
    ");
    $stmt->execute([$employee_id]);
    $stats = $stmt->fetch();
    
    // Get monthly revenue trend (last 6 months)
    $stmt = $db->prepare("
        SELECT
            DATE_FORMAT(inv.invoice_date, '%Y-%m') as month,
            COALESCE(SUM(CASE WHEN inv.status = 'paid' THEN inv.total_amount ELSE 0 END), 0) as revenue
        FROM invoices inv
        WHERE inv.employee_id = ? 
        AND inv.invoice_date >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
        GROUP BY DATE_FORMAT(inv.invoice_date, '%Y-%m')
        ORDER BY month ASC
    ");
    $stmt->execute([$employee_id]);
    $monthly_revenue = $stmt->fetchAll();
    
    // Get top services by revenue
    $stmt = $db->prepare("
        SELECT
            s.name AS service_name,
            s.category,
            COUNT(ii.id) AS times_used,
            COALESCE(SUM(ii.line_total), 0) AS total_revenue
        FROM invoice_items ii
        JOIN invoices inv ON ii.invoice_id = inv.id
        LEFT JOIN services s ON ii.service_id = s.id
        WHERE inv.employee_id = ? AND inv.status = 'paid'
        GROUP BY s.id, s.name, s.category
        ORDER BY total_revenue DESC
        LIMIT 10
    ");
    $stmt->execute([$employee_id]);
    $top_services = $stmt->fetchAll();
    
    // Map role to title
    $roleTitleMap = [
        'veterinarian' => 'General Practice',
        'Veterinarian' => 'General Practice',
        'Senior Veterinarian' => 'Senior Practice',
        'admin' => 'Head Veterinarian',
        'Admin' => 'Head Veterinarian',
        'staff' => 'Veterinary Technician',
        'Veterinary Technician' => 'Veterinary Technician'
    ];
    
    $avgPerPatient = ($stats['total_patients'] ?? 0) > 0 
        ? ($stats['total_revenue'] ?? 0) / ($stats['total_patients'] ?? 1)
        : 0;
    
    error_log("Doctor Detail - Statistics: " . json_encode($stats));
    error_log("Doctor Detail - Monthly Revenue Count: " . count($monthly_revenue));
    error_log("Doctor Detail - Top Services Count: " . count($top_services));
    
    $responseData = [
        'doctor' => [
            'id' => (int) ($doctor['id'] ?? $employee_id),
            'name' => $doctor['name'] ?? 'Unknown Doctor',
            'title' => $roleTitleMap[$doctor['position']] ?? $roleTitleMap[strtolower($doctor['role'] ?? '')] ?? $doctor['position'] ?? 'Veterinarian',
            'role' => strtolower($doctor['role'] ?? ''),
            'salary' => isset($doctor['salary']) ? (float) $doctor['salary'] : 0,
            'hire_date' => $doctor['hire_date'] ?? null
        ],
        'statistics' => [
            'total_patients' => (int) ($stats['total_patients'] ?? 0),
            'paid_invoices' => (int) ($stats['paid_invoices'] ?? 0),
            'total_invoices' => (int) ($stats['total_invoices'] ?? 0),
            'total_revenue' => (float) ($stats['total_revenue'] ?? 0),
            'avg_invoice_amount' => (float) ($stats['avg_invoice_amount'] ?? 0),
            'avg_per_patient' => (float) $avgPerPatient
        ],
        'monthly_revenue' => array_map(function ($row) {
            return [
                'month' => $row['month'],
                'revenue' => (float) $row['revenue']
            ];
        }, $monthly_revenue),
        'top_services' => array_map(function ($row) {
            return [
                'service_name' => $row['service_name'] ?? 'Unknown Service',
                'category' => $row['category'] ?? 'General',
                'times_used' => (int) ($row['times_used'] ?? 0),
                'total_revenue' => (float) ($row['total_revenue'] ?? 0)
            ];
        }, $top_services)
    ];
    
    error_log("Doctor Detail - Response data prepared successfully");
    Response::success($responseData);
    
} catch (Exception $e) {
    error_log("Doctor Detail Exception: " . $e->getMessage());
    error_log("Doctor Detail Exception Trace: " . $e->getTraceAsString());
    Response::error('Database error: ' . $e->getMessage());
}
?>

