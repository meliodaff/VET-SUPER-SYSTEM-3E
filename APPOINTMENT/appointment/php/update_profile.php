<?php
session_start();
include '../includes/db.php'; // Database connection

// Make sure user is logged in
if (!isset($_SESSION['user_id'])) {
  header("Location: login.php");
  exit();
}

$user_id = $_SESSION['user_id'];

// Get input values safely
$fname = $_POST['fname'] ?? '';
$lname = $_POST['lname'] ?? '';
$phone = $_POST['phone'] ?? '';
$email = $_POST['email'] ?? '';
$emergency_contact = $_POST['emergency_contact'] ?? '';
$street_address = $_POST['street_address'] ?? '';
$city = $_POST['city'] ?? '';
$state = $_POST['state'] ?? '';
$zip_code = $_POST['zip_code'] ?? '';

// Prepare SQL update statement
$sql = "UPDATE registered 
        SET fname = ?, lname = ?, phone = ?, email = ?, emergency_contact = ?, 
            street_address = ?, city = ?, state = ?, zip_code = ?
        WHERE user_id = ?";

$stmt = $conn->prepare($sql);
$stmt->bind_param(
  "ssisssssii",
  $fname,
  $lname,
  $phone,
  $email,
  $emergency_contact,
  $street_address,
  $city,
  $state,
  $zip_code,
  $user_id
);

if ($stmt->execute()) {
  // Redirect back with success message
  header("Location: ../Book_appointment_profile.php?status=updated");
  exit();
} else {
  header("Location: ../Book_appointment_profile.php?status=error");
}

$stmt->close();
$conn->close();
?>
