<?php
include '../includes/session_id.php'; // ensure user is logged in
include '../includes/db.php'; // database connection

function addAppointment($conn, $user_id, $fname, $phone, $email, $vetdoc, $pet_name, $date, $time, $service, $service_price) {
    $status = "Pending";

    // ✅ Prepare SQL with 12 fields (excluding id & date_update)
    $sql = "INSERT INTO book_appointment 
            (user_id, fname, phone, email, vetdoc, pet_name, date, time, service, service_price, status, date_create)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())";

    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        die("Prepare failed: " . $conn->error);
    }

    // ✅ Bind 11 variables (11 ? placeholders)
    $stmt->bind_param(
        "issssssssis",
        $user_id,
        $fname,
        $phone,
        $email,
        $vetdoc,
        $pet_name,
        $date,
        $time,
        $service,
        $service_price,
        $status
    );

    if ($stmt->execute()) {
        // ✅ Redirect with success popup
        header("Location: ../Book_appointment_dashboard.php?popup=success");
        exit();
    } else {
        die("Error: " . $stmt->error);
    }

    $stmt->close();
}

// ✅ Handle form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $user_id = $_SESSION['user_id'];

    // Split service name and price
    $serviceData = explode('|', $_POST['service']);
    $service_name = $serviceData[0];
    $service_price = $serviceData[1];

    addAppointment(
        $conn,
        $user_id,
        $_POST['fname'],
        $_POST['phone'],
        $_POST['email'],
        $_POST['vetdoc'],
        $_POST['pet_name'],
        $_POST['date'],
        $_POST['time'],
        $service_name,
        $service_price
    );
}
?>
