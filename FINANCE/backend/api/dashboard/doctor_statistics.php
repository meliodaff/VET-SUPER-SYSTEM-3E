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
    $hasEmployeeId = in_array('employee_id', $columns);
    
    // Determine primary key for JOIN
    $primaryKey = $hasId ? 'id' : ($hasEmployeeId ? 'employee_id' : 'id');
    
    // Build name field
    if ($hasName) {
        $nameField = 'e.name';
    } elseif ($hasFirstName) {
        $nameField = "CONCAT(COALESCE(e.first_name, ''), ' ', COALESCE(e.middle_name, ''), ' ', COALESCE(e.last_name, ''))";
    } else {
        $nameField = "COALESCE(e.first_name, 'Unknown')";
    }
    
    // Build WHERE clause for role filter - check for veterinarians only
    // Exclude Veterinary Technicians and other staff - only show actual veterinarians/admins
    // Only use columns that actually exist
    $whereConditions = [];
    if ($hasSystemRole && $hasPosition) {
        $conditions = ["e.system_role = 'Admin'", "e.Position LIKE '%Veterinarian%'", "e.Position LIKE '%Vet%'"];
        // Exclude Veterinary Technicians and staff
        $excludeConditions = [];
        if ($hasPosition) {
            $excludeConditions[] = "e.Position NOT LIKE '%Technician%'";
            $excludeConditions[] = "e.Position NOT LIKE '%Staff%'";
        }
        if ($hasRole) {
            $conditions[] = "e.role = 'veterinarian'";
            $conditions[] = "e.role = 'admin'";
            $excludeConditions[] = "e.role != 'staff'";
        }
        $whereConditions[] = "(" . implode(" OR ", $conditions) . ")";
        if (!empty($excludeConditions)) {
            $whereConditions[] = "(" . implode(" AND ", $excludeConditions) . ")";
        }
    } elseif ($hasSystemRole) {
        $conditions = ["e.system_role = 'Admin'"];
        $excludeConditions = [];
        if ($hasRole) {
            $conditions[] = "e.role = 'veterinarian'";
            $conditions[] = "e.role = 'admin'";
            $excludeConditions[] = "e.role != 'staff'";
        }
        $whereConditions[] = "(" . implode(" OR ", $conditions) . ")";
        if (!empty($excludeConditions)) {
            $whereConditions[] = "(" . implode(" AND ", $excludeConditions) . ")";
        }
    } elseif ($hasRole) {
        $whereConditions[] = "(e.role = 'veterinarian' OR e.role = 'admin')";
        $whereConditions[] = "e.role != 'staff'";
    } elseif ($hasPosition) {
        $whereConditions[] = "(e.Position LIKE '%Veterinarian%' OR e.Position LIKE '%Vet%')";
        $whereConditions[] = "e.Position NOT LIKE '%Technician%'";
        $whereConditions[] = "e.Position NOT LIKE '%Staff%'";
    } else {
        // If no role columns found, show all employees (fallback)
        $whereConditions = [];
    }
    
    // Get all veterinarians first, then join with invoice data
    // This ensures we show all doctors even if they have no invoices yet
    // Join invoices.employee_id with employees.employee_id (or employees.id if it exists)
    // Always use employee_id as the primary key field since that's what the database uses
    $joinCondition = $hasId ? "inv.employee_id = e.id" : "inv.employee_id = e.employee_id";
    // Always use employee_id field - it's the primary key in the employees table
    $employeeIdField = $hasEmployeeId ? "e.employee_id" : ($hasId ? "e.id" : "e.employee_id");
    
    // Build position and role fields based on what columns exist
    $positionField = "COALESCE(";
    $positionParts = [];
    if ($hasPosition) $positionParts[] = "e.Position";
    if ($hasSystemRole) $positionParts[] = "e.system_role";
    if ($hasRole) $positionParts[] = "e.role";
    $positionField .= !empty($positionParts) ? implode(", ", $positionParts) : "'Veterinarian'";
    $positionField .= ", 'Veterinarian')";
    
    $roleField = "COALESCE(";
    $roleParts = [];
    if ($hasSystemRole) $roleParts[] = "e.system_role";
    if ($hasRole) $roleParts[] = "e.role";
    $roleField .= !empty($roleParts) ? implode(", ", $roleParts) : "'Employee'";
    $roleField .= ", 'Employee')";
    
    // Ensure we always select employee_id correctly
    // Use COALESCE to handle both id and employee_id cases
    $idSelectField = $hasEmployeeId ? "e.employee_id" : ($hasId ? "COALESCE(e.id, e.employee_id)" : "e.employee_id");
    
    // Build GROUP BY clause based on existing columns
    // Always group by employee_id (or id if that's the primary key)
    $groupByFields = [$idSelectField, $nameField];
    if ($hasPosition) $groupByFields[] = "e.Position";
    if ($hasSystemRole) $groupByFields[] = "e.system_role";
    if ($hasRole) $groupByFields[] = "e.role";
    $groupByClause = implode(", ", $groupByFields);
    
    $sql = "
        SELECT 
            $idSelectField AS employee_id,
            $nameField AS doctor,
            $positionField AS position,
            $roleField AS role,
            COALESCE(COUNT(DISTINCT CASE WHEN inv.status = 'paid' AND inv.patient_id IS NOT NULL THEN inv.patient_id END), 0) AS patients_count,
            COALESCE(SUM(CASE WHEN inv.status = 'paid' THEN inv.total_amount ELSE 0 END), 0) AS total_revenue,
            COALESCE(COUNT(DISTINCT CASE WHEN inv.status = 'paid' THEN inv.id END), 0) AS paid_invoices_count
        FROM employees e
        LEFT JOIN invoices inv ON $joinCondition AND inv.status = 'paid'
    ";
    
    if (!empty($whereConditions)) {
        $sql .= " WHERE " . implode(" AND ", $whereConditions);
    }
    
    $sql .= "
        GROUP BY $groupByClause
        HAVING patients_count > 0 OR total_revenue > 0
        ORDER BY total_revenue DESC, patients_count DESC, doctor ASC
    ";
    
    // Log the SQL for debugging (remove in production)
    error_log("Doctor Statistics SQL: " . $sql);
    
    $stmt = $db->prepare($sql);
    $stmt->execute();
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Log results for debugging
    error_log("Doctor Statistics Results Count: " . count($rows));
    if (count($rows) > 0) {
        error_log("Doctor Statistics - First row sample: " . json_encode($rows[0]));
        error_log("Doctor Statistics - First row employee_id: " . ($rows[0]['employee_id'] ?? 'MISSING'));
    }
    
    // Map role/position to title
    $roleTitleMap = [
        'veterinarian' => 'General Practice',
        'Veterinarian' => 'General Practice',
        'Senior Veterinarian' => 'Senior Practice',
        'admin' => 'Head Veterinarian',
        'Admin' => 'Head Veterinarian',
        'staff' => 'Veterinary Technician',
        'Veterinary Technician' => 'Veterinary Technician'
    ];
    
    // Filter out doctors with no patients and no revenue, and exclude Veterinary Technicians
    // Only include doctors who have actual paid invoices (like surgery fees does)
    $doctor_stats = array_filter($rows, function ($row) {
        $hasData = ($row['patients_count'] ?? 0) > 0 || ($row['total_revenue'] ?? 0) > 0;
        $hasPaidInvoices = ($row['paid_invoices_count'] ?? 0) > 0;
        $position = strtolower($row['position'] ?? '');
        $role = strtolower($row['role'] ?? '');
        $isTechnician = strpos($position, 'technician') !== false || 
                       strpos($role, 'technician') !== false ||
                       strpos($position, 'staff') !== false ||
                       strpos($role, 'staff') !== false;
        // Only return doctors with paid invoices and data, excluding technicians
        return $hasData && $hasPaidInvoices && !$isTechnician;
    });
    
    $doctor_stats = array_map(function ($row) use ($roleTitleMap) {
        $avgPerPatient = ($row['patients_count'] ?? 0) > 0 
            ? ($row['total_revenue'] ?? 0) / ($row['patients_count'] ?? 1)
            : 0;
        
        $position = $row['position'] ?? $row['role'] ?? 'Veterinarian';
        $role = strtolower($row['role'] ?? '');
        
        // Try multiple possible ID fields
        $employeeId = (int) ($row['employee_id'] ?? $row['id'] ?? 0);
        
        // Log if employee_id is missing
        if ($employeeId <= 0) {
            error_log("Warning: Doctor stat has invalid employee_id. Row data: " . json_encode($row));
            error_log("Available keys in row: " . implode(", ", array_keys($row)));
        }
        
        return [
            'employee_id' => $employeeId,
            'id' => $employeeId, // Also include as 'id' for compatibility
            'doctor' => trim($row['doctor'] ?? 'Unknown Doctor'),
            'title' => $roleTitleMap[$position] ?? $roleTitleMap[$role] ?? $position ?? 'Veterinarian',
            'role' => $role,
            'patients' => (int) ($row['patients_count'] ?? 0),
            'revenue' => (float) ($row['total_revenue'] ?? 0),
            'avg_per_patient' => (float) $avgPerPatient,
            'paid_invoices' => (int) ($row['paid_invoices_count'] ?? 0)
        ];
    }, $doctor_stats);
    
    // Log the final doctor stats before returning
    error_log("Doctor Statistics - Final count: " . count($doctor_stats));
    if (count($doctor_stats) > 0) {
        error_log("Doctor Statistics - First doctor employee_id: " . ($doctor_stats[0]['employee_id'] ?? 'missing'));
    }
    
    // Re-index array after filtering
    $doctor_stats = array_values($doctor_stats);
    
    // Always return an array, even if empty
    Response::success($doctor_stats);
    
} catch (Exception $e) {
    Response::error('Database error: ' . $e->getMessage());
}
?>
