<?php
session_start();
require_once '../includes/hr_db.php'; // Database connection

// Make sure user is logged in
if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit();
}

$user_id = $_SESSION['user_id'];

// Get input values safely and trim whitespace
$first_name   = trim($_POST['first_name'] ?? '');
$middle_name  = trim($_POST['middle_name'] ?? '');
$last_name    = trim($_POST['last_name'] ?? '');
$email        = trim($_POST['email'] ?? '');
$phone_number = trim($_POST['phone_number'] ?? '');

// Prepare SQL update statement
$sql = "UPDATE users 
        SET first_name = ?, middle_name = ?, last_name = ?, email = ?, phone_number = ?
        WHERE user_id = ?";

$stmt = $conn->prepare($sql);

if (!$stmt) {
    die("Prepare failed: " . $conn->error);
}

// Bind parameters (all strings except user_id)
$stmt->bind_param(
    "sssssi",
    $first_name,
    $middle_name,
    $last_name,
    $email,
    $phone_number,
    $user_id
);

// Execute statement
if ($stmt->execute()) {
    // Redirect back with success message
    header("Location: ../client_page/Book_appointment_profile.php?status=updated");
    exit();
} else {
    // Show error if something goes wrong
    die("Update failed: " . $stmt->error);
}

$stmt->close();
$conn->close();
?>