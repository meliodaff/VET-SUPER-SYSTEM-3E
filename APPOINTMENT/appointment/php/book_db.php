<?php
session_start();
include '../includes/db.php'; // ✅ Make sure this connects to your phpMyAdmin DB

// ✅ These should come from your session or payment success page
$user_id = $_SESSION['user_id'] ?? null;
$fname = $_SESSION['fname'] ?? 'N/A';
$phone = $_SESSION['phone'] ?? 'N/A';
$email = $_SESSION['email'] ?? 'N/A';
$vetdoc = $_SESSION['vetdoc'] ?? 'N/A';
$pet_name = $_SESSION['pet_name'] ?? 'N/A';
$date = $_SESSION['date'] ?? date('Y-m-d');
$time = $_SESSION['time'] ?? date('H:i');
$serviceData = isset($_SESSION['service']) ? explode("|", $_SESSION['service']) : ['Unknown', 0];
$service_name = $serviceData[0];
$payment_method = "PayMongo";
$status = "Booked";

// ✅ SQL for MySQLi (phpMyAdmin)
$sql = "INSERT INTO book_appointment 
(user_id, fname, phone, email, vetdoc, pet_name, date, time, service, payment_method, status, date_create)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())";

$stmt = $conn->prepare($sql);

if (!$stmt) {
    die("SQL error: " . $conn->error);
}

$stmt->bind_param(
    "issssssssss",
    $user_id,
    $fname,
    $phone,
    $email,
    $vetdoc,
    $pet_name,
    $date,
    $time,
    $service_name,
    $payment_method,
    $status
);

// ✅ Execute and redirect instead of showing success message
if ($stmt->execute()) {
    $stmt->close();
    header("Location: ../Book_appointment_book.php?status=added");
    exit;
} else {
    header("Location: ../Book_appointment_book.php?status=error");
    exit;
}

$stmt->close();
$conn->close();
?>
