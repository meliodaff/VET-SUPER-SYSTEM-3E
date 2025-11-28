<?php
include 'db_connect.php';

// Check if data was sent via POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = isset($_POST['itemName']) ? $_POST['itemName'] : '';
    $qty = isset($_POST['quantity']) ? $_POST['quantity'] : 0;
    $unit = isset($_POST['unit']) ? $_POST['unit'] : '';
    $cost = isset($_POST['cost']) ? $_POST['cost'] : 0;
    $price = isset($_POST['sellingPrice']) ? $_POST['sellingPrice'] : 0;
    $desc = isset($_POST['description']) ? $_POST['description'] : '';
    $supp = isset($_POST['supplier']) ? $_POST['supplier'] : '';
    $expiry = isset($_POST['expiryDate']) ? $_POST['expiryDate'] : '';
    $img = isset($_POST['image']) ? $_POST['image'] : '';

    $sql = "INSERT INTO products (name, quantity, unit, cost, selling_price, description, supplier, expiry, image) 
            VALUES ('$name', '$qty', '$unit', '$cost', '$price', '$desc', '$supp', '$expiry', '$img')";

    if (mysqli_query($conn, $sql)) {
        echo '{"success": true, "message": "Item added"}';
    } else {
        echo '{"success": false, "error": "SQL Error: ' . clean(mysqli_error($conn)) . '"}';
    }
} else {
    echo '{"success": false, "error": "Invalid Request Method"}';
}
mysqli_close($conn);
