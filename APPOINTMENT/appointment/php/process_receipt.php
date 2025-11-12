<?php
include '../includes/db.php';
session_start();

if (!isset($_POST['id'])) {
    die("No appointment ID provided.");
}

$appointment_id = intval($_POST['id']);
$items = $_SESSION['items'] ?? [];

// Insert all items (if any)
if (!empty($items)) {
    $stmt = $conn->prepare("INSERT INTO recipt_items (appointment_id, item_name, item_price) VALUES (?, ?, ?)");
    foreach ($items as $item) {
        $stmt->bind_param("isd", $appointment_id, $item['name'], $item['price']);
        $stmt->execute();
    }
    $stmt->close();
}

// Clear items after processing
unset($_SESSION['items']);
unset($_SESSION['appointment_id']);

// ✅ Redirect using GET with both parameters
$redirect_url = "update_status.php?id=" . urlencode($appointment_id) . "&action=approve";
header("Location: $redirect_url");
exit;
?>
