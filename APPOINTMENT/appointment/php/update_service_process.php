<?php
include '../includes/db.php';

if (isset($_POST['id'])) {
    $id = intval($_POST['id']);
    $name = trim($_POST['service_name']);
    $price = trim($_POST['price']);
    $description = trim($_POST['description']);

    // ✅ Validate input
    if ($name == "" || $price == "" || $description == "") {
        echo "<script>alert('All fields are required.'); window.history.back();</script>";
        exit;
    }

    // ✅ Use prepared statement for security
    $query = "UPDATE type_of_service SET service_name = ?, price = ?, description = ? WHERE id = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("sdsi", $name, $price, $description, $id);

    if ($stmt->execute()) {
        echo "<script>window.location.href='../admin_page/services.php?status=updated';</script>";
    } else {
        echo "<script>window.location.href='../admin_page/services.php?status=error';</script>";
    }

    $stmt->close();
    $conn->close();
} else {
    echo "<script>window.location.href='../admin_page/services.php?status=error';</script>";
}
?>
