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
    $hasEmployeeId = in_array('employee_id', $columns);
    $hasRole = in_array('role', $columns);
    $hasSystemRole = in_array('system_role', $columns);
    $hasPosition = in_array('Position', $columns);
    
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
    
    // Get doctor surgery fees from invoice_items, services, invoices, and employees
    // Use LEFT JOIN to ensure we get all doctors, even if they have no surgeries
    $joinCondition = $hasId ? "inv.employee_id = e.id" : "inv.employee_id = e.employee_id";
    $employeeIdField = $hasId ? "e.id" : "e.employee_id";
    
    // Build WHERE clause for veterinarians
    // Only use columns that actually exist
    $whereConditions = [];
    if ($hasSystemRole && $hasPosition) {
        $conditions = ["e.system_role = 'Admin'", "e.Position LIKE '%Veterinarian%'", "e.Position LIKE '%Vet%'"];
        if ($hasRole) {
            $conditions[] = "e.role = 'veterinarian'";
            $conditions[] = "e.role = 'admin'";
        }
        $whereConditions[] = "(" . implode(" OR ", $conditions) . ")";
    } elseif ($hasSystemRole) {
        $conditions = ["e.system_role = 'Admin'"];
        if ($hasRole) {
            $conditions[] = "e.role = 'veterinarian'";
            $conditions[] = "e.role = 'admin'";
        }
        $whereConditions[] = "(" . implode(" OR ", $conditions) . ")";
    } elseif ($hasRole) {
        $whereConditions[] = "(e.role = 'veterinarian' OR e.role = 'admin')";
    } elseif ($hasPosition) {
        $whereConditions[] = "(e.Position LIKE '%Veterinarian%' OR e.Position LIKE '%Vet%')";
    }
    
    $whereClause = !empty($whereConditions) ? "WHERE " . implode(" AND ", $whereConditions) : "";
    
    $stmt = $db->prepare("
        SELECT 
            $nameField AS doctor,
            COALESCE(COUNT(DISTINCT CASE WHEN s.category = 'Surgery' AND inv.status = 'paid' THEN ii.id END), 0) AS surgeries_count,
            COALESCE(SUM(CASE WHEN s.category = 'Surgery' AND inv.status = 'paid' THEN ii.line_total ELSE 0 END), 0) AS total_fees
        FROM employees e
        LEFT JOIN invoices inv ON $joinCondition
        LEFT JOIN invoice_items ii ON ii.invoice_id = inv.id
        LEFT JOIN services s ON ii.service_id = s.id
        $whereClause
        GROUP BY $employeeIdField, $nameField
        HAVING surgeries_count > 0
        ORDER BY total_fees DESC, surgeries_count DESC
    ");
    // Log the SQL for debugging (remove in production)
    error_log("Doctor Surgery Fees SQL: " . $stmt->queryString);
    
    $stmt->execute();
    $rows = $stmt->fetchAll();
    
    // Log results for debugging
    error_log("Doctor Surgery Fees Results Count: " . count($rows));
    
    $surgery_fees = array_map(function ($row) {
        return [
            'doctor' => trim($row['doctor'] ?? 'Unknown Doctor'),
            'surgeries' => (int) ($row['surgeries_count'] ?? 0),
            'total_fees' => (float) ($row['total_fees'] ?? 0)
        ];
    }, $rows);
    
    // Always return an array, even if empty
    Response::success($surgery_fees);
    
} catch (Exception $e) {
    Response::error('Database error: ' . $e->getMessage());
}
?>
