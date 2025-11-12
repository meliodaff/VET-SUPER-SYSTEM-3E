<?php
include '../includes/db.php'; // Database connection

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Collect form data
    $service_name = trim($_POST['service_name'] ?? '');
    $price = $_POST['price'] ?? 0;
    $description = trim($_POST['description'] ?? '');

    // Validate inputs
    if (empty($service_name) || empty($description) || $price <= 0) {
        echo "<script>alert('Please fill in all fields correctly.'); history.back();</script>";
        exit;
    }

    // Prepare SQL query
    $stmt = $conn->prepare("INSERT INTO type_of_service (service_name, price, description) VALUES (?, ?, ?)");
    $stmt->bind_param("sds", $service_name, $price, $description);

    // Execute and check success
    if ($stmt->execute()) {
        header("Location: ../admin_page/services.php?status=added");;
    } else {
        echo "<script>alert('Error adding service: " . addslashes($conn->error) . "'); history.back();</script>";
    }

    $stmt->close();
} else {
    echo "<script>alert('Invalid request method.'); history.back();</script>";
}

$conn->close();
?>