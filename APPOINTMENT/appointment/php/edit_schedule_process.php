<?php
include '../includes/session_id.php';
include '../includes/db.php';

// Check POST data
if (!isset($_POST['id'], $_POST['day_of_week'], $_POST['start_time'], $_POST['end_time'])) {
    echo "<script>alert('Missing data!'); window.location.href='schedule.php';</script>";
    exit;
}

$id = intval($_POST['id']);
$day_of_week = trim($_POST['day_of_week']);
$start_time = $_POST['start_time'];
$end_time = $_POST['end_time'];

// Optional: Prevent end_time before start_time
if (strtotime($end_time) <= strtotime($start_time)) {
    echo "<script>window.location.href='../admin_page/schedule.php';</script>";
    exit;
}

// Update schedule
$query = "UPDATE schedule SET day_of_week = ?, start_time = ?, end_time = ? WHERE id = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("sssi", $day_of_week, $start_time, $end_time, $id);

if ($stmt->execute()) {
    echo "<script>window.location.href='../admin_page/schedule.php';</script>";
} else {
    echo "<script>window.location.href='../admin_page/schedule.php';</script>";
}

$stmt->close();
$conn->close();
?>
