<?php
include '../includes/db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['id'])) {
    $id = intval($_POST['id']); // Prevent SQL injection

    $query = "DELETE FROM type_of_service WHERE id = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {
        echo "<script>window.location.href='../admin_page/services.php?status=deleted';</script>";
    } else {
       echo "<script>window.location.href='../admin_page/services.php?status=error';</script>";
    }

    $stmt->close();
} else {
    echo "<script>window.location.href='../admin_page/services.php?status=error';</script>";
}

$conn->close();
?>
    