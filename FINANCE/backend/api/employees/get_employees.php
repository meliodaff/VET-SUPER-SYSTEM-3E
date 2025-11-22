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
    // Check if employees table exists
    $checkStmt = $db->query("SHOW TABLES LIKE 'employees'");
    if ($checkStmt->rowCount() === 0) {
        Response::error('Employees table does not exist in the database');
    }
    
    // First, get the actual column names from the table
    $columnsStmt = $db->query("SHOW COLUMNS FROM employees");
    $columns = $columnsStmt->fetchAll(PDO::FETCH_COLUMN);
    
    // Build SELECT query dynamically based on actual columns
    $selectFields = [];
    $hasId = in_array('id', $columns);
    $hasEmployeeId = in_array('employee_id', $columns);
    
    // Use employee_id as primary key if id doesn't exist
    $primaryKey = $hasId ? 'id' : ($hasEmployeeId ? 'employee_id' : null);
    
    if ($hasId) {
        $selectFields[] = 'id';
    }
    if ($hasEmployeeId) {
        $selectFields[] = "COALESCE(employee_id, '') as employee_id";
    } else {
        $selectFields[] = "'' as employee_id";
    }
    
    // Add other columns if they exist
    $otherColumns = ['rfid', 'first_name', 'middle_name', 'last_name', 'rate', 
                     'date_of_birth', 'gender', 'contact_email', 'phone_number', 
                     'address', 'profile_image_url', 'hire_date', 'employment_type', 
                     'Position', 'department', 'system_role'];
    
    foreach ($otherColumns as $col) {
        if (in_array($col, $columns)) {
            if ($col === 'first_name' || $col === 'last_name') {
                $selectFields[] = "COALESCE($col, '') as $col";
            } elseif ($col === 'rate') {
                $selectFields[] = "COALESCE($col, 0) as $col";
            } else {
                $selectFields[] = $col;
            }
        } else {
            // Add null/empty defaults for missing columns
            if ($col === 'rate') {
                $selectFields[] = "0 as $col";
            } elseif ($col === 'first_name' || $col === 'last_name') {
                $selectFields[] = "'' as $col";
            } else {
                $selectFields[] = "NULL as $col";
            }
        }
    }
    
    $selectClause = implode(', ', $selectFields);
    $orderBy = $primaryKey ? "ORDER BY COALESCE(hire_date, '1970-01-01') DESC, $primaryKey DESC" : "ORDER BY COALESCE(hire_date, '1970-01-01') DESC";
    
    $sql = "SELECT $selectClause FROM employees $orderBy";
    $stmt = $db->prepare($sql);
    $stmt->execute();
    $rows = $stmt->fetchAll();
    
    // If no employees found, return empty array instead of error
    if (empty($rows)) {
        Response::success([]);
    }
    
    $employees = array_map(function ($employee) {
        // Calculate monthly salary from rate (assuming rate is per day/hour, convert to monthly)
        // If rate is already monthly, use it directly
        $monthly_salary = isset($employee['rate']) ? (float) $employee['rate'] : 0;
        
        // Determine status from employment_type
        $status = 'Active';
        if (isset($employee['employment_type'])) {
            $employment_type = strtolower($employee['employment_type']);
            if (strpos($employment_type, 'leave') !== false || strpos($employment_type, 'on leave') !== false) {
                $status = 'On Leave';
            } elseif (strpos($employment_type, 'contractor') !== false) {
                $status = 'Contractor';
            } elseif (strpos($employment_type, 'part-time') !== false) {
                $status = 'Part-Time';
            } elseif (strpos($employment_type, 'active') !== false) {
                $status = 'Active';
            }
        }
        
        // Use employee_id as id if id doesn't exist
        $recordId = isset($employee['id']) ? (int) $employee['id'] : 
                    (isset($employee['employee_id']) && is_numeric($employee['employee_id']) ? (int) $employee['employee_id'] : 
                    (isset($employee['employee_id']) ? $employee['employee_id'] : 0));
        
        return [
            'id' => $recordId,
            'employee_id' => $employee['employee_id'] ?? '',
            'rfid' => $employee['rfid'] ?? null,
            'first_name' => $employee['first_name'] ?? '',
            'middle_name' => $employee['middle_name'] ?? null,
            'last_name' => $employee['last_name'] ?? '',
            'rate' => isset($employee['rate']) ? (float) $employee['rate'] : 0,
            'date_of_birth' => $employee['date_of_birth'] ?? null,
            'gender' => $employee['gender'] ?? null,
            'contact_email' => $employee['contact_email'] ?? null,
            'phone_number' => $employee['phone_number'] ?? null,
            'address' => $employee['address'] ?? null,
            'profile_image_url' => $employee['profile_image_url'] ?? null,
            'hire_date' => $employee['hire_date'] ?? null,
            'employment_type' => $employee['employment_type'] ?? null,
            'position' => $employee['Position'] ?? null,
            'department' => $employee['department'] ?? null,
            'system_role' => $employee['system_role'] ?? null,
            'monthly_salary' => $monthly_salary,
            'status' => $status
        ];
    }, $rows);
    
    Response::success($employees);
    
} catch (Exception $e) {
    Response::error('Database error: ' . $e->getMessage());
}
?>
