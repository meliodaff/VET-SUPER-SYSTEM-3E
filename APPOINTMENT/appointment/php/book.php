<?php
include '../includes/session_id.php'; // ensure user is logged in
include '../includes/db.php'; // database connection

function addAppointment($conn, $user_id, $fname, $phone, $email, $vetdoc, $pet_name, $date, $time, $service, $service_price) {
    $status = "Pending";
    $payment_method = "Pending"; // default payment method
    $payment_status = "Pending";  // default payment status

    // Prepare SQL with 14 fields including payment_method and payment_status
    $sql = "INSERT INTO book_appointment 
            (user_id, fname, phone, email, vetdoc, pet_name, date, time, service, service_price, payment_method, payment_status, status, date_create)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())";

    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        die("Prepare failed: " . $conn->error);
    }

    // Bind variables
    $stmt->bind_param(
        "issssssssisss",
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
        $payment_method,
        $payment_status,
        $status
    );

    if ($stmt->execute()) {
        // Redirect with success popup
        header("Location: ../client_page/Book_appointment_dashboard.php?popup=success");
        exit();
    } else {
        die("Error: " . $stmt->error);
    }

    $stmt->close();
}

// Handle form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $user_id = $_SESSION['user_id'];

    // Split service name and price if sent like "ServiceName|Price"
    $serviceData = explode('|', $_POST['service']);
    $service_name = $serviceData[0];
    $service_price = $serviceData[1] ?? 0; // default to 0 if price not provided

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
