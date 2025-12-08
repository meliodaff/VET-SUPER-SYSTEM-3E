<?php
require_once '../includes/db.php';

// Get doctor ID and date
$doctor_id = $_GET['doctor_id'] ?? null;
$date = $_GET['date'] ?? null;

if (!$doctor_id || !$date) {
    echo json_encode([]);
    exit;
}

$sql = "SELECT time FROM book_appointment WHERE doctor_id = ? AND date = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("is", $doctor_id, $date);
$stmt->execute();
$result = $stmt->get_result();

$booked = [];

while ($row = $result->fetch_assoc()) {
    $booked[] = $row['time'];
}

echo json_encode($booked);
exit;
?>