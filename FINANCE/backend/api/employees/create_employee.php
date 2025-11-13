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

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    Response::error('Method not allowed', 405);
}

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['employee_id']) || !isset($data['first_name']) || !isset($data['last_name']) || !isset($data['position']) || !isset($data['department'])) {
    Response::error('Missing required fields');
}

$employee_id = trim($data['employee_id']);
$first_name = trim($data['first_name']);
$middle_name = isset($data['middle_name']) ? trim($data['middle_name']) : null;
$last_name = trim($data['last_name']);
$position = trim($data['position']);
$department = trim($data['department']);
$rate = isset($data['rate']) ? (float)$data['rate'] : (isset($data['monthly_salary']) ? (float)$data['monthly_salary'] : 0);
$employment_type = isset($data['employment_type']) ? trim($data['employment_type']) : 'Active Full-Time';
$contact_email = isset($data['contact_email']) ? trim($data['contact_email']) : null;
$phone_number = isset($data['phone_number']) ? trim($data['phone_number']) : null;
$address = isset($data['address']) ? trim($data['address']) : null;
$system_role = isset($data['system_role']) ? trim($data['system_role']) : 'Employee';

try {
    // Check if employee ID already exists
    $stmt = $db->prepare("SELECT id FROM employees WHERE employee_id = ?");
    $stmt->execute([$employee_id]);
    
    if ($stmt->rowCount() > 0) {
        Response::error('Employee ID already exists');
    }
    
    // Insert new employee with actual database columns
    $stmt = $db->prepare("
        INSERT INTO employees (
            employee_id, first_name, middle_name, last_name, 
            Position, department, rate, employment_type,
            contact_email, phone_number, address, system_role, hire_date
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURDATE())
    ");
    $result = $stmt->execute([
        $employee_id, 
        $first_name, 
        $middle_name, 
        $last_name, 
        $position, 
        $department, 
        $rate, 
        $employment_type,
        $contact_email,
        $phone_number,
        $address,
        $system_role
    ]);
    
    if ($result) {
        Response::success(null, 'Employee created successfully');
    } else {
        Response::error('Failed to create employee');
    }
    
} catch (Exception $e) {
    Response::error('Database error: ' . $e->getMessage());
}
?>
