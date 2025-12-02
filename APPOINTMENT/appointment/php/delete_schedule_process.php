<?php
include '../includes/session_id.php';
include '../includes/db.php';

if (!isset($_POST['id'])) {
    echo "window.location.href='../admin_page/schedule.php';</script>";
    exit;
}

$id = intval($_POST['id']); // Safe

$query = "DELETE FROM schedule WHERE id = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("i", $id);

if ($stmt->execute()) {
    echo "<script>window.location.href='../admin_page/schedule.php';</script>";
} else {
    echo "<script>window.location.href='../admin_page/schedule.php';</script>";
}

$stmt->close();
$conn->close();
?>
