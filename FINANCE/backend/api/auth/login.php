<?php
require_once '../../config/database.php';
require_once '../../utils/cors.php';
require_once '../../utils/response.php';

session_start();

$database = new Database();
$db = $database->getConnection();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    Response::error('Method not allowed', 405);
}

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['email']) || !isset($data['password'])) {
    Response::error('Email and password are required');
}

$email = trim($data['email']);
$password = $data['password'];

if (empty($email) || empty($password)) {
    Response::error('Email and password are required');
}

try {
    // Find admin by email
    $stmt = $db->prepare("SELECT id, first_name, last_name, email, password FROM admins WHERE email = ?");
    $stmt->execute([$email]);
    $admin = $stmt->fetch();
    
    if (!$admin) {
        Response::error('Invalid email or password');
    }
    
    // Verify password
    if (!password_verify($password, $admin['password'])) {
        Response::error('Invalid email or password');
    }
    
    // Set session
    $_SESSION['admin_id'] = $admin['id'];
    $_SESSION['admin_name'] = $admin['first_name'] . ' ' . $admin['last_name'];
    $_SESSION['admin_email'] = $admin['email'];
    
    Response::success([
        'admin' => [
            'id' => $admin['id'],
            'name' => $admin['first_name'] . ' ' . $admin['last_name'],
            'email' => $admin['email']
        ]
    ], 'Login successful');
    
} catch (Exception $e) {
    Response::error('Database error: ' . $e->getMessage());
}
?>
