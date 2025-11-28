<?php
include 'db_connect.php';

$id = isset($_GET['id']) ? $_GET['id'] : '';

if ($id) {
    $sql = "DELETE FROM products WHERE id='$id'";

    if (mysqli_query($conn, $sql)) {
        echo '{"success": true, "message": "Item deleted"}';
    } else {
        echo '{"success": false, "error": "SQL Error: ' . clean(mysqli_error($conn)) . '"}';
    }
} else {
    echo '{"success": false, "error": "ID missing"}';
}
mysqli_close($conn);
