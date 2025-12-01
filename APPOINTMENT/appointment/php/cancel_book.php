<?php
include '../includes/session_id.php'; // Ensure user is logged in
include '../includes/db.php'; // Database connection

if (isset($_GET['id'])) {
    $id = intval($_GET['id']);
    $user_id = $_SESSION['user_id'];

    // ✅ Update the appointment status to "Cancelled"
    $stmt = $conn->prepare("UPDATE book_appointment SET status = 'Cancelled', date_update = NOW() WHERE id = ? AND user_id = ?");
    $stmt->bind_param("ii", $id, $user_id);

    if ($stmt->execute()) {
        header("Location: ../client_page/Book_appointment_dashboard.php?status=cancelled");
        exit;
    } else {
        header("Location: ../client_page/Book_appointment_dashboard.php?status=error");
        exit;
    }

    $stmt->close();
    $conn->close();
} else {
    header("Location: ../client_page/Book_appointment_dashboard.php?status=error");
    exit;
}
?>
