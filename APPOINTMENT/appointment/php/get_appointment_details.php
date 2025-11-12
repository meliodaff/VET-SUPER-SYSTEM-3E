<?php
include $_SERVER['DOCUMENT_ROOT'] . '/appointment/includes/db.php';

if (isset($_GET['id'])) {
    $id = intval($_GET['id']); // Appointment ID

    // 1️⃣ Fetch appointment details
    $stmt = $conn->prepare("SELECT * FROM book_appointment WHERE id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($appointment = $result->fetch_assoc()) {

        // 2️⃣ Fetch client details using user_id from appointment
        $user_id = $appointment['user_id'];
        $stmt2 = $conn->prepare("SELECT * FROM registered WHERE user_id = ?");
        $stmt2->bind_param("i", $user_id);
        $stmt2->execute();
        $result2 = $stmt2->get_result();
        $client = $result2->fetch_assoc();

        echo json_encode([
            "success" => true,
            "appointment" => $appointment,
            "client" => $client
        ]);

        $stmt2->close();
    } else {
        echo json_encode([
            "success" => false,
            "message" => "Appointment not found."
        ]);
    }

    $stmt->close();
    $conn->close();
}
?>
