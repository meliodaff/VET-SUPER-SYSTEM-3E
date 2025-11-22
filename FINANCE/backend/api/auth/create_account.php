<?php
require_once '../../config/database.php';
require_once '../../utils/cors.php';
require_once '../../utils/response.php';

$database = new Database();
$db = $database->getConnection();

if (!$db) {
    Response::error('Database connection failed. Please check your database configuration.', 500);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    Response::error('Method not allowed', 405);
}

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['first_name']) || !isset($data['last_name']) || !isset($data['email']) || !isset($data['password']) || !isset($data['confirm_password'])) {
    Response::error('Missing required fields');
}

$first_name = trim($data['first_name']);
$last_name = trim($data['last_name']);
$email = trim($data['email']);
$password = $data['password'];
$confirm_password = $data['confirm_password'];

// Validation
if (empty($first_name) || empty($last_name) || empty($email) || empty($password)) {
    Response::error('All fields are required');
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    Response::error('Invalid email format');
}

if (strlen($password) < 6) {
    Response::error('Password must be at least 6 characters');
}

if ($password !== $confirm_password) {
    Response::error('Passwords do not match');
}

try {
    // Check if email already exists
    $stmt = $db->prepare("SELECT id FROM admins WHERE email = ?");
    $stmt->execute([$email]);
    
    if ($stmt->rowCount() > 0) {
        Response::error('Email already exists');
    }
    
    // Hash password
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);
    
    // Insert new admin
    $stmt = $db->prepare("INSERT INTO admins (first_name, last_name, email, password) VALUES (?, ?, ?, ?)");
    $result = $stmt->execute([$first_name, $last_name, $email, $hashed_password]);
    
    if ($result) {
        Response::success(null, 'Account created successfully');
    } else {
        Response::error('Failed to create account');
    }
    
} catch (PDOException $e) {
    error_log('Database error: ' . $e->getMessage());
    $errorMsg = 'Database connection error. ';
    if (strpos($e->getMessage(), 'Unknown database') !== false) {
        $errorMsg .= 'Database "fur_ever_care_db" does not exist. Please create it in phpMyAdmin.';
    } elseif (strpos($e->getMessage(), 'Access denied') !== false) {
        $errorMsg .= 'Invalid database credentials. Please check your database configuration.';
    } elseif (strpos($e->getMessage(), 'Connection refused') !== false) {
        $errorMsg .= 'Cannot connect to MySQL server. Please ensure MySQL is running in XAMPP/WAMP.';
    } else {
        $errorMsg .= 'Please check if the database is set up correctly. Error: ' . $e->getMessage();
    }
    Response::error($errorMsg);
} catch (Exception $e) {
    error_log('Error: ' . $e->getMessage());
    Response::error('An error occurred: ' . $e->getMessage());
}
?>
