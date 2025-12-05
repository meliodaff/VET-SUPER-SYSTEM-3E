<?php
require_once '../../config/database.php';
require_once '../../utils/cors.php';
require_once '../../utils/response.php';

$database = new Database();
$db = $database->getConnection();

if (!$db) {
    Response::error('Database connection failed');
}

$employeeId = isset($_GET['employee_id']) ? (int)$_GET['employee_id'] : null;
$period = isset($_GET['period']) ? (int)$_GET['period'] : null;
$year = isset($_GET['year']) ? (int)$_GET['year'] : null;
$month = isset($_GET['month']) ? (int)$_GET['month'] : null;

try {
    // Check if employee_payments table exists
    $checkTable = $db->query("SHOW TABLES LIKE 'employee_payments'");
    if ($checkTable->rowCount() === 0) {
        Response::success(['payments' => [], 'total_paid' => 0], 'No payment records found');
    }

    $where_conditions = [];
    $params = [];

    if ($employeeId) {
        $where_conditions[] = "employee_id = ?";
        $params[] = $employeeId;
    }

    if ($period !== null) {
        $where_conditions[] = "period = ?";
        $params[] = $period;
    }

    if ($year !== null) {
        $where_conditions[] = "year = ?";
        $params[] = $year;
    }

    if ($month !== null) {
        $where_conditions[] = "month = ?";
        $params[] = $month;
    }

    $where_clause = !empty($where_conditions) ? "WHERE " . implode(" AND ", $where_conditions) : "";

    // Check if employees table exists and get its structure
    $checkEmployeesTable = $db->query("SHOW TABLES LIKE 'employees'");
    $hasEmployeesTable = $checkEmployeesTable->rowCount() > 0;
    
    $hasId = false;
    $hasEmployeeId = false;
    $hasFirstName = false;
    $hasLastName = false;
    $joinColumn = null;
    $employeeSelect = '';
    $joinClause = '';
    
    if ($hasEmployeesTable) {
        $columnsStmt = $db->query("SHOW COLUMNS FROM employees");
        $columns = $columnsStmt->fetchAll(PDO::FETCH_COLUMN);
        $hasId = in_array('id', $columns);
        $hasEmployeeId = in_array('employee_id', $columns);
        $hasFirstName = in_array('first_name', $columns);
        $hasLastName = in_array('last_name', $columns);
        
        // Determine join column
        $joinColumn = $hasId ? 'id' : ($hasEmployeeId ? 'employee_id' : null);
        
        // Build SELECT with employee details
        $employeeFields = [];
        if ($hasFirstName) {
            $employeeFields[] = 'e.first_name';
        } else {
            $employeeFields[] = "NULL as first_name";
        }
        if ($hasLastName) {
            $employeeFields[] = 'e.last_name';
        } else {
            $employeeFields[] = "NULL as last_name";
        }
        if ($hasEmployeeId) {
            $employeeFields[] = 'e.employee_id as emp_id';
        } else {
            $employeeFields[] = "NULL as emp_id";
        }
        
        $employeeSelect = !empty($employeeFields) ? ', ' . implode(', ', $employeeFields) : '';
        $joinClause = $joinColumn ? "LEFT JOIN employees e ON ep.employee_id = e.$joinColumn" : "";
    }
    
    // Get payments with employee details
    $sql = "
        SELECT 
            ep.id,
            ep.employee_id,
            ep.amount,
            ep.payment_method,
            ep.payment_date,
            ep.period,
            ep.year,
            ep.month,
            ep.notes,
            ep.created_at$employeeSelect
        FROM employee_payments ep
        $joinClause
        $where_clause
        ORDER BY ep.payment_date DESC, ep.created_at DESC
    ";

    $stmt = $db->prepare($sql);
    $stmt->execute($params);
    $payments = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Calculate total paid
    $totalPaid = array_sum(array_column($payments, 'amount'));

    Response::success([
        'payments' => $payments,
        'total_paid' => (float)$totalPaid,
        'count' => count($payments)
    ], 'Employee payments retrieved successfully');

} catch (Exception $e) {
    Response::error('Database error: ' . $e->getMessage());
}
?>

