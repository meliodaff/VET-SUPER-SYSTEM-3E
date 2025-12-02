<?php
include '../includes/db.php';

if(isset($_POST['day_of_week'], $_POST['start_time'], $_POST['end_time'])){
    $day = $_POST['day_of_week'];
    $start = $_POST['start_time'];
    $end = $_POST['end_time'];

    $stmt = $conn->prepare("INSERT INTO schedule (day_of_week, start_time, end_time) VALUES (?, ?, ?)");
    $stmt->bind_param("sss", $day, $start, $end);
    $stmt->execute();

    header("Location: ../admin_page/schedule.php"); // redirect to list of schedules
}
?>
