<?php
/**
 * Password Change Handler
 * Handles password change requests with proper security
 */
header('Content-Type: application/json');
session_start();
require_once 'config.php';

// $response = [];
ini_set('display_errors', 1);
error_reporting(E_ALL);


// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    echo json_encode([
        'success' => false,
        'message' => 'Please log in to change your password'
    ]);
    exit;
}


$conn = getDBConnection();
// Check connection
if ($conn->connect_error) {
    echo json_encode([
        'success' => false,
        'message' => 'Database connection failed: ' . $conn->connect_error
    ]);
    exit;
}

// Handle POST request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $user_id = $_SESSION['user_id'];
    $current_password = $_POST['current_password'] ?? '';
    $new_password = $_POST['new_password'] ?? '';

    // Validate inputs
    if (empty($current_password) || empty($new_password)) {
        echo json_encode([
            'success' => false,
            'message' => 'All fields are required'
        ]);
        $conn->close();
        exit;
    }

    // Validate new password strength
    if (strlen($new_password) < 8) {
        echo json_encode([
            'success' => false,
            'message' => 'Password must be at least 8 characters long'
        ]);
        $conn->close();
        exit;
    }

    // Additional password strength validation (optional but recommended)
    if (!preg_match('/[A-Z]/', $new_password)) {
        echo json_encode([
            'success' => false,
            'message' => 'Password must contain at least one uppercase letter'
        ]);
        $conn->close();
        exit;
    }

    if (!preg_match('/[a-z]/', $new_password)) {
        echo json_encode([
            'success' => false,
            'message' => 'Password must contain at least one lowercase letter'
        ]);
        $conn->close();
        exit;
    }

    if (!preg_match('/[0-9]/', $new_password)) {
        echo json_encode([
            'success' => false,
            'message' => 'Password must contain at least one number'
        ]);
        $conn->close();
        exit;
    }

    // Get current password hash from database
    $stmt = $conn->prepare("SELECT password, email FROM users WHERE id = ?");

    if (!$stmt) {
        echo json_encode([
            'success' => false,
            'message' => 'Database error: ' . $conn->error
        ]);
        $conn->close();
        exit;
    }

    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        echo json_encode([
            'success' => false,
            'message' => 'User not found'
        ]);
        $stmt->close();
        $conn->close();
        exit;
    }

    $user = $result->fetch_assoc();
    $stmt->close();

    // Verify current password
    if (!password_verify($current_password, $user['password'])) {
        echo json_encode([
            'success' => false,
            'message' => 'Current password is incorrect'
        ]);
        $conn->close();
        exit;
    }

    // Check if new password is same as current password
    if (password_verify($new_password, $user['password'])) {
        echo json_encode([
            'success' => false,
            'message' => 'New password must be different from current password'
        ]);
        $conn->close();
        exit;
    }

    // Hash new password using bcrypt (PASSWORD_DEFAULT)
    $new_password_hash = password_hash($new_password, PASSWORD_DEFAULT);

    // Update password in database
    $stmt = $conn->prepare("UPDATE users SET password = ? WHERE id = ?");
    // $stmt = $conn->prepare("UPDATE users SET password = ?, updated_at = NOW() WHERE id = ?");

    if (!$stmt) {
        echo json_encode([
            'success' => false,
            'message' => 'Database error: ' . $conn->error
        ]);
        $conn->close();
        exit;
    }

    $stmt->bind_param("si", $new_password_hash, $user_id);

    if ($stmt->execute()) {
        // Optional: Log password change event


        // Optional: Send email notification
        // mail($user['email'], "Password Changed", "Your password has been successfully changed.");

        echo json_encode([
            'success' => true,
            'message' => 'Password updated successfully!'
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Failed to update password: ' . $stmt->error
        ]);
    }

    $stmt->close();
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Invalid request method'
    ]);
}



$conn->close();
// echo json_encode($response);
// exit;
?>