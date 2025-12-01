<?php
require_once '../includes/session_id.php';
require_once '../includes/db.php';

$appointment_id = $_GET['id'] ?? null;

if (!$appointment_id) {
    die("No appointment ID provided.");
}

// Update only the payment method in the database
$stmt = $conn->prepare("UPDATE book_appointment SET `payment_method`=? WHERE id=?");
$payment_method = 'Online Payment'; // You can replace this dynamically if needed
$stmt->bind_param("si", $payment_method, $appointment_id);

if ($stmt->execute()) {
    $stmt->close();
    // Redirect to receipt page
    header("Location: ../client_page/Book_appointment_dashboard_receipt.php?id={$appointment_id}");
    exit;
} else {
    die("Failed to update payment method: " . $stmt->error);
}
?>