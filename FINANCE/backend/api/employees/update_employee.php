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

if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
    Response::error('Method not allowed', 405);
}

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['id'])) {
    Response::error('Employee ID is required');
}

$id = (int)$data['id'];
$employee_id = isset($data['employee_id']) ? trim($data['employee_id']) : null;
$first_name = isset($data['first_name']) ? trim($data['first_name']) : null;
$middle_name = isset($data['middle_name']) ? trim($data['middle_name']) : null;
$last_name = isset($data['last_name']) ? trim($data['last_name']) : null;
$position = isset($data['position']) ? trim($data['position']) : null;
$department = isset($data['department']) ? trim($data['department']) : null;
$rate = isset($data['rate']) ? (float)$data['rate'] : (isset($data['monthly_salary']) ? (float)$data['monthly_salary'] : null);
$employment_type = isset($data['employment_type']) ? trim($data['employment_type']) : null;
$contact_email = isset($data['contact_email']) ? trim($data['contact_email']) : null;
$phone_number = isset($data['phone_number']) ? trim($data['phone_number']) : null;
$address = isset($data['address']) ? trim($data['address']) : null;
$status = isset($data['status']) ? $data['status'] : null;

try {
    // Check what primary key column exists
    $columnsStmt = $db->query("SHOW COLUMNS FROM employees");
    $columns = $columnsStmt->fetchAll(PDO::FETCH_COLUMN);
    $hasId = in_array('id', $columns);
    $hasEmployeeId = in_array('employee_id', $columns);
    
    // Determine primary key column
    $primaryKey = $hasId ? 'id' : ($hasEmployeeId ? 'employee_id' : 'id');
    
    // Check if employee exists using the appropriate primary key
    $checkSql = "SELECT $primaryKey FROM employees WHERE $primaryKey = ?";
    $stmt = $db->prepare($checkSql);
    $stmt->execute([$id]);
    
    if ($stmt->rowCount() === 0) {
        Response::error('Employee not found');
    }
    
    // Build update query dynamically
    $update_fields = [];
    $update_values = [];
    
    if ($employee_id !== null) {
        // Check if new employee ID already exists (excluding current employee)
        $checkEmployeeIdSql = "SELECT $primaryKey FROM employees WHERE employee_id = ? AND $primaryKey != ?";
        $checkStmt = $db->prepare($checkEmployeeIdSql);
        $checkStmt->execute([$employee_id, $id]);
        if ($checkStmt->rowCount() > 0) {
            Response::error('Employee ID already exists');
        }
        $update_fields[] = "employee_id = ?";
        $update_values[] = $employee_id;
    }
    
    if ($first_name !== null) {
        $update_fields[] = "first_name = ?";
        $update_values[] = $first_name;
    }
    
    if ($middle_name !== null) {
        $update_fields[] = "middle_name = ?";
        $update_values[] = $middle_name;
    }
    
    if ($last_name !== null) {
        $update_fields[] = "last_name = ?";
        $update_values[] = $last_name;
    }
    
    if ($position !== null) {
        $update_fields[] = "Position = ?";
        $update_values[] = $position;
    }
    
    if ($department !== null) {
        $update_fields[] = "department = ?";
        $update_values[] = $department;
    }
    
    if ($rate !== null) {
        $update_fields[] = "rate = ?";
        $update_values[] = $rate;
    }
    
    if ($employment_type !== null) {
        $update_fields[] = "employment_type = ?";
        $update_values[] = $employment_type;
    }
    
    if ($contact_email !== null) {
        $update_fields[] = "contact_email = ?";
        $update_values[] = $contact_email;
    }
    
    if ($phone_number !== null) {
        $update_fields[] = "phone_number = ?";
        $update_values[] = $phone_number;
    }
    
    if ($address !== null) {
        $update_fields[] = "address = ?";
        $update_values[] = $address;
    }
    
    // Map status to employment_type if status is provided
    if ($status !== null) {
        $employment_type_mapping = [
            'Active' => 'Active Full-Time',
            'On Leave' => 'On Leave',
            'Contractor' => 'Contractor',
            'Part-Time' => 'Active Part-Time'
        ];
        $mapped_employment_type = $employment_type_mapping[$status] ?? $status;
        $update_fields[] = "employment_type = ?";
        $update_values[] = $mapped_employment_type;
    }
    
    if (empty($update_fields)) {
        Response::error('No fields to update');
    }
    
    $update_values[] = $id;
    $sql = "UPDATE employees SET " . implode(", ", $update_fields) . " WHERE $primaryKey = ?";
    
    $stmt = $db->prepare($sql);
    $result = $stmt->execute($update_values);
    
    if ($result) {
        Response::success(null, 'Employee updated successfully');
    } else {
        Response::error('Failed to update employee');
    }
    
} catch (Exception $e) {
    Response::error('Database error: ' . $e->getMessage());
}
?>
