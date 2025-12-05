<?php
require_once '../../config/database.php';
require_once '../../utils/cors.php';
require_once '../../utils/response.php';

$database = new Database();
$db = $database->getConnection();

if (!$db) {
    Response::error('Database connection failed');
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    Response::error('Method not allowed', 405);
}

$data = json_decode(file_get_contents("php://input"), true);

// Expected payload:
// {
//   employee_id: number,
//   amount: number,
//   payment_method: string, // 'cash' | 'bank_transfer' | 'check' | ...
//   payment_date: 'YYYY-MM-DD', // optional, defaults to today
//   period: number, // 1 or 2 (first or second half of month)
//   year: number,
//   month: number,
//   notes: string // optional
// }

$employeeId = isset($data['employee_id']) ? (int)$data['employee_id'] : null;
$amount = isset($data['amount']) ? (float)$data['amount'] : null;
$paymentMethod = isset($data['payment_method']) ? trim($data['payment_method']) : 'bank_transfer';
$paymentDate = !empty($data['payment_date']) ? $data['payment_date'] : null;
$period = isset($data['period']) ? (int)$data['period'] : null;
$year = isset($data['year']) ? (int)$data['year'] : null;
$month = isset($data['month']) ? (int)$data['month'] : null;
$notes = isset($data['notes']) ? trim($data['notes']) : null;

// Data validation
if (!$employeeId || $employeeId <= 0) {
    Response::error('Valid employee_id is required');
}

if (!$amount || $amount <= 0) {
    Response::error('Amount must be greater than zero');
}

if (!$period || ($period !== 1 && $period !== 2)) {
    Response::error('Period must be 1 or 2');
}

if (!$year || $year < 2020 || $year > 2100) {
    Response::error('Year must be between 2020 and 2100');
}

if (!$month || $month < 1 || $month > 12) {
    Response::error('Month must be between 1 and 12');
}

if ($paymentMethod && !in_array($paymentMethod, ['cash', 'bank_transfer', 'check', 'credit_card', 'debit_card'])) {
    Response::error('Invalid payment method');
}

try {
    // Check if employees table exists
    $checkEmployeesTable = $db->query("SHOW TABLES LIKE 'employees'");
    if ($checkEmployeesTable->rowCount() === 0) {
        Response::error('Employees table does not exist in the database');
    }
    
    // Check what columns exist in employees table
    $columnsStmt = $db->query("SHOW COLUMNS FROM employees");
    $columns = $columnsStmt->fetchAll(PDO::FETCH_COLUMN);
    $hasId = in_array('id', $columns);
    $hasEmployeeId = in_array('employee_id', $columns);
    
    // Build SELECT query dynamically
    $selectFields = [];
    if ($hasId) {
        $selectFields[] = 'id';
    }
    if ($hasEmployeeId) {
        $selectFields[] = 'employee_id';
    }
    if (in_array('first_name', $columns)) {
        $selectFields[] = 'first_name';
    }
    if (in_array('last_name', $columns)) {
        $selectFields[] = 'last_name';
    }
    
    // Determine primary key and build WHERE clause
    $primaryKey = $hasId ? 'id' : ($hasEmployeeId ? 'employee_id' : null);
    
    if (!$primaryKey) {
        Response::error('Employees table structure is invalid');
    }
    
    // Build WHERE clause to match by either id or employee_id
    $whereClause = [];
    $whereParams = [];
    
    if ($hasId && $hasEmployeeId) {
        $whereClause[] = "(id = ? OR employee_id = ?)";
        $whereParams = [$employeeId, $employeeId];
    } elseif ($hasId) {
        $whereClause[] = "id = ?";
        $whereParams = [$employeeId];
    } elseif ($hasEmployeeId) {
        $whereClause[] = "employee_id = ?";
        $whereParams = [$employeeId];
    }
    
    $selectClause = !empty($selectFields) ? implode(', ', $selectFields) : '*';
    $sql = "SELECT $selectClause FROM employees WHERE " . implode(' AND ', $whereClause);
    
    $stmt = $db->prepare($sql);
    $stmt->execute($whereParams);
    $employee = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$employee) {
        Response::error('Employee not found');
    }
    
    // Normalize employee data - determine the correct ID to use for employee_payments table
    // The employee_payments.employee_id should reference the primary key of employees table
    if ($hasId && isset($employee['id'])) {
        $actualEmployeeId = (int)$employee['id'];
    } elseif ($hasEmployeeId && isset($employee['employee_id'])) {
        // If employee_id is numeric, use it; otherwise try to use the input employeeId
        if (is_numeric($employee['employee_id'])) {
            $actualEmployeeId = (int)$employee['employee_id'];
        } else {
            // If employee_id is not numeric, we need to find the numeric ID
            // Try to use the input employeeId if it's numeric
            $actualEmployeeId = is_numeric($employeeId) ? (int)$employeeId : null;
        }
    } else {
        // Fallback: use the input employeeId if it's numeric
        $actualEmployeeId = is_numeric($employeeId) ? (int)$employeeId : null;
    }
    
    if ($actualEmployeeId === null || $actualEmployeeId <= 0) {
        Response::error('Unable to determine valid employee ID');
    }
    
    // Use the actual employee ID for the payment record
    $employeeId = $actualEmployeeId;
    
    // Default payment_date to today if not provided
    if ($paymentDate === null || $paymentDate === '') {
        $paymentDateExpr = "CURDATE()";
        $usePaymentDateParam = false;
    } else {
        $paymentDateExpr = "?";
        $usePaymentDateParam = true;
    }

    // Check if employee_payments table exists, if not create it
    $checkTable = $db->query("SHOW TABLES LIKE 'employee_payments'");
    if ($checkTable->rowCount() === 0) {
        // Create employee_payments table
        $createTable = $db->exec("
            CREATE TABLE IF NOT EXISTS employee_payments (
                id INT AUTO_INCREMENT PRIMARY KEY,
                employee_id INT NOT NULL,
                amount DECIMAL(10, 2) NOT NULL,
                payment_method VARCHAR(50) NOT NULL DEFAULT 'bank_transfer',
                payment_date DATE NOT NULL,
                period INT NOT NULL,
                year INT NOT NULL,
                month INT NOT NULL,
                notes TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                INDEX idx_employee (employee_id),
                INDEX idx_period (year, month, period)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
        ");
    }

    // Check for duplicate payment (same employee, period, year, month)
    $checkStmt = $db->prepare("
        SELECT id FROM employee_payments 
        WHERE employee_id = ? AND period = ? AND year = ? AND month = ?
    ");
    $checkStmt->execute([$employeeId, $period, $year, $month]);
    
    if ($checkStmt->rowCount() > 0) {
        Response::error('Payment already recorded for this employee and period');
    }

    $sql = "
        INSERT INTO employee_payments (
            employee_id,
            amount,
            payment_method,
            payment_date,
            period,
            year,
            month,
            notes,
            created_at
        ) VALUES (
            ?, ?, ?, $paymentDateExpr, ?, ?, ?, ?, NOW()
        )
    ";

    $params = [
        $employeeId,
        $amount,
        $paymentMethod,
    ];

    if ($usePaymentDateParam) {
        $params[] = $paymentDate;
    }

    $params[] = $period;
    $params[] = $year;
    $params[] = $month;
    $params[] = $notes;

    $stmt = $db->prepare($sql);
    $stmt->execute($params);

    $newId = (int)$db->lastInsertId();

    Response::success(
        [
            'employee_payment_id' => $newId,
            'employee_id' => $employeeId,
            'amount' => $amount,
            'payment_date' => $usePaymentDateParam ? $paymentDate : date('Y-m-d'),
        ],
        'Employee payment recorded successfully'
    );
} catch (Exception $e) {
    Response::error('Database error: ' . $e->getMessage());
}
?>

