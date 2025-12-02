<?php
session_start();
include '../includes/db.php'; // Connect to main booking database

$user_id = $_SESSION['user_id'] ?? null;
$fname = $_POST['name'] ?? 'N/A';
$phone = $_POST['phone'] ?? 'N/A';
$email = $_POST['email'] ?? 'N/A';

// Get both doctor ID and name
$vetdoc_id = $_POST['vetdoc_id'] ?? 0;
$vetdoc_name = $_POST['vetdoc_name'] ?? 'N/A';

$pet_name = $_POST['pet_name'] ?? 'N/A';
$date = $_POST['date'] ?? date('Y-m-d');
$time = $_POST['time'] ?? date('H:i');
$payment_method = "pending";
$status = "pending";
$payment_status = "Pending";

// Split service name and price from select value
$serviceData = isset($_POST['service']) ? explode("|", $_POST['service']) : ['Unknown', 0];
$service_name = $serviceData[0];
$service_price = (int) $serviceData[1]; // Convert to integer

// ----------------------
// Check if the same doctor already has a booking at this date and time
// ----------------------
$check_sql = "SELECT * FROM book_appointment WHERE doctor_id = ? AND date = ? AND time = ?";
$check_stmt = $conn->prepare($check_sql);
$check_stmt->bind_param("iss", $vetdoc_id, $date, $time);
$check_stmt->execute();
$check_result = $check_stmt->get_result();

if ($check_result->num_rows > 0) {
    // Already booked → alert and go back
    $check_stmt->close();
    echo "<script>
        alert('This schedule is already taken. Please choose another time.');
        window.history.back();
    </script>";
    exit;
}

$check_stmt->close();

// ----------------------
// Insert the appointment
// ----------------------
$sql = "INSERT INTO book_appointment 
(user_id, fname, phone, email, doctor_id, vetdoc, pet_name, date, time, service, service_price, payment_method, status, payment_status, date_create)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())";

$stmt = $conn->prepare($sql);
if (!$stmt) {
    die("SQL error: " . $conn->error);
}

// Bind parameters
$stmt->bind_param(
    "isssissssssiss",
    $user_id,
    $fname,
    $phone,
    $email,
    $vetdoc_id,
    $vetdoc_name,
    $pet_name,
    $date,
    $time,
    $service_name,
    $service_price,
    $payment_method,
    $status,
    $payment_status
);

if ($stmt->execute()) {
    // Success → alert and redirect
    $stmt->close();
    echo "<script>
        alert('Appointment booked successfully!');
        window.location.href='../client_page/Book_appointment_book.php';
    </script>";
    exit;
} else {
    // Error → alert and go back
    echo "<script>
        alert('Error booking appointment. Please try again.');
        window.history.back();
    </script>";
    exit;
}

$conn->close();
?>
