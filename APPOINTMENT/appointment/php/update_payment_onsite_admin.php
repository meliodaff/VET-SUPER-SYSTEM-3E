<?php
require_once '../includes/session_id.php';
require_once '../includes/db.php';

$appointment_id = $_GET['id'] ?? null;

if (!$appointment_id) {
    die("No appointment ID provided.");
}

// Update payment method and status in the database
$stmt = $conn->prepare("UPDATE book_appointment SET `payment_method`=?, `payment_status`=? WHERE id=?");

$payment_method = 'Onsite Payment'; // now it’s Onsite Payment
$payment_status = 'paid';           // mark as paid
$stmt->bind_param("ssi", $payment_method, $payment_status, $appointment_id);

if ($stmt->execute()) {
    $stmt->close();
    // Redirect to receipt page
    header("Location: ../admin_page/details.php?id={$appointment_id}");
    exit;
} else {
    die("Failed to update payment: " . $stmt->error);
}
?>
