<?php
include 'db_connect.php';

// 1. Force the script to only accept POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo '{"success": false, "error": "Invalid Method. Use POST."}';
    exit();
}

// 2. Check if ID exists
$id = isset($_POST['id']) ? $_POST['id'] : '';

if (empty($id)) {
    echo '{"success": false, "error": "Product ID is missing in the request."}';
    exit();
}

// 3. Get other data
$name = isset($_POST['itemName']) ? $_POST['itemName'] : '';
$qty = isset($_POST['quantity']) ? $_POST['quantity'] : 0;
$unit = isset($_POST['unit']) ? $_POST['unit'] : '';
$cost = isset($_POST['cost']) ? $_POST['cost'] : 0;
$price = isset($_POST['sellingPrice']) ? $_POST['sellingPrice'] : 0;
$desc = isset($_POST['description']) ? $_POST['description'] : '';
$supp = isset($_POST['supplier']) ? $_POST['supplier'] : '';
$expiry = isset($_POST['expiryDate']) ? $_POST['expiryDate'] : '';
$img = isset($_POST['image']) ? $_POST['image'] : '';

// 4. Run Update
$sql = "UPDATE products SET 
        name='$name', quantity='$qty', unit='$unit', cost='$cost', 
        selling_price='$price', description='$desc', supplier='$supp', 
        expiry='$expiry', image='$img' 
        WHERE id='$id'";

if (mysqli_query($conn, $sql)) {
    echo '{"success": true, "message": "Item updated"}';
} else {
    // This will print the exact SQL error
    echo '{"success": false, "error": "SQL Error: ' . clean(mysqli_error($conn)) . '"}';
}

mysqli_close($conn);
