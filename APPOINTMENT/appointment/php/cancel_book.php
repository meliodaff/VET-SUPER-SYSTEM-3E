<?php
include '../includes/session_id.php';
include '../includes/db.php';

if (isset($_GET['id'])) {
    $id = intval($_GET['id']);
    $user_id = $_SESSION['user_id'];

    $stmt = $conn->prepare("DELETE FROM book_appointment WHERE id = ? AND user_id = ?");
    $stmt->bind_param("ii", $id, $user_id);

    if ($stmt->execute()) {
        header("Location: ../Book_appointment_dashboard.php?status=canceled");
        exit;
    } else {
         header("Location: ../Book_appointment_dashboard.php?status=error");
    }

    $stmt->close();
    $conn->close();
} else {
    header("Location: ../Book_appointment_dashboard.php?status=error");
    exit;
}
?>
