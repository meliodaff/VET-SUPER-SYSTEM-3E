<?php
// FILE: C:\xampp\htdocs\inventory-system\backend\api.php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit();
}

$conn = mysqli_connect("localhost", "root", "", "vet-inventory");
if (!$conn) {
    echo '{"success": false, "error": "Connection failed"}';
    exit();
}

function clean($data)
{
    global $conn;
    if ($data === null) return "";
    $data = mysqli_real_escape_string($conn, $data);
    return str_replace('"', '\"', $data);
}

$action = isset($_GET['action']) ? $_GET['action'] : '';

// ==========================================================
// SUPPLIER ACTIONS (NEW)
// ==========================================================

if ($action == 'suppliers') {
    $sql = "SELECT * FROM suppliers ORDER BY id DESC";
    $result = mysqli_query($conn, $sql);

    echo '{"success": true, "data": [';
    $first = true;
    while ($row = mysqli_fetch_assoc($result)) {
        if (!$first) echo ',';
        $first = false;
        $date = date("M j, Y", strtotime($row['created_at']));

        echo '{';
        echo '"id": "' . $row['id'] . '",';
        echo '"name": "' . clean($row['name']) . '",';
        echo '"contactPerson": "' . clean($row['contact_person']) . '",'; // Map snake_case to camelCase
        echo '"email": "' . clean($row['email']) . '",';
        echo '"phone": "' . clean($row['phone']) . '",';
        echo '"address": "' . clean($row['address']) . '",';
        echo '"createdDate": "' . $date . '"';
        echo '}';
    }
    echo ']}';
} elseif ($action == 'add_supplier') {
    $name    = isset($_POST['name']) ? $_POST['name'] : '';
    $contact = isset($_POST['contactPerson']) ? $_POST['contactPerson'] : '';
    $email   = isset($_POST['email']) ? $_POST['email'] : '';
    $phone   = isset($_POST['phone']) ? $_POST['phone'] : '';
    $address = isset($_POST['address']) ? $_POST['address'] : '';

    $sql = "INSERT INTO suppliers (name, contact_person, email, phone, address) 
            VALUES ('$name', '$contact', '$email', '$phone', '$address')";

    if (mysqli_query($conn, $sql)) {
        echo '{"success": true, "message": "Supplier Added"}';
    } else {
        echo '{"success": false, "error": "SQL Error: ' . clean(mysqli_error($conn)) . '"}';
    }
} elseif ($action == 'update_supplier') {
    $id      = isset($_POST['id']) ? $_POST['id'] : '';
    $name    = isset($_POST['name']) ? $_POST['name'] : '';
    $contact = isset($_POST['contactPerson']) ? $_POST['contactPerson'] : '';
    $email   = isset($_POST['email']) ? $_POST['email'] : '';
    $phone   = isset($_POST['phone']) ? $_POST['phone'] : '';
    $address = isset($_POST['address']) ? $_POST['address'] : '';

    $sql = "UPDATE suppliers SET 
            name='$name', contact_person='$contact', email='$email', phone='$phone', address='$address' 
            WHERE id='$id'";

    if (mysqli_query($conn, $sql)) {
        echo '{"success": true, "message": "Supplier Updated"}';
    } else {
        echo '{"success": false, "error": "SQL Error: ' . clean(mysqli_error($conn)) . '"}';
    }
} elseif ($action == 'delete_supplier') {
    $id = isset($_GET['id']) ? $_GET['id'] : '';
    $sql = "DELETE FROM suppliers WHERE id='$id'";
    if (mysqli_query($conn, $sql)) {
        echo '{"success": true, "message": "Supplier Deleted"}';
    } else {
        echo '{"success": false, "error": "SQL Error: ' . clean(mysqli_error($conn)) . '"}';
    }

    // ==========================================================
    // CATEGORY ACTIONS
    // ==========================================================

} elseif ($action == 'categories') {
    $sql = "SELECT c.id, c.name, c.description, c.created_at, COUNT(p.id) as live_count 
            FROM categories c LEFT JOIN products p ON p.category_id = c.id 
            GROUP BY c.id ORDER BY c.name ASC";
    $result = mysqli_query($conn, $sql);
    echo '{"success": true, "data": [';
    $first = true;
    while ($row = mysqli_fetch_assoc($result)) {
        if (!$first) echo ',';
        $first = false;
        $date = date("M j, Y", strtotime($row['created_at']));
        echo '{"id": "' . $row['id'] . '", "name": "' . clean($row['name']) . '", "description": "' . clean($row['description']) . '", "productCount": "' . $row['live_count'] . '", "createdDate": "' . $date . '"}';
    }
    echo ']}';
} elseif ($action == 'add_category') {
    $name = $_POST['name'];
    $desc = $_POST['description'];
    if (mysqli_query($conn, "INSERT INTO categories (name, description) VALUES ('$name', '$desc')")) {
        echo '{"success": true}';
    } else {
        echo '{"success": false}';
    }
} elseif ($action == 'update_category') {
    $id = $_POST['id'];
    $name = $_POST['name'];
    $desc = $_POST['description'];
    if (mysqli_query($conn, "UPDATE categories SET name='$name', description='$desc' WHERE id='$id'")) {
        echo '{"success": true}';
    } else {
        echo '{"success": false}';
    }
} elseif ($action == 'delete_category') {
    $id = $_GET['id'];
    if (mysqli_query($conn, "DELETE FROM categories WHERE id='$id'")) {
        echo '{"success": true}';
    } else {
        echo '{"success": false}';
    }

    // ==========================================================
    // PRODUCT ACTIONS
    // ==========================================================

} elseif ($action == 'all') {
    $sql = "SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id ORDER BY p.id DESC";
    $result = mysqli_query($conn, $sql);
    echo '{"success": true, "data": [';
    $first = true;
    while ($row = mysqli_fetch_assoc($result)) {
        if (!$first) echo ',';
        $first = false;
        echo '{';
        echo '"id": "' . $row['id'] . '", "name": "' . clean($row['name']) . '", "category_name": "' . clean($row['category_name']) . '", "category_id": "' . $row['category_id'] . '", "description": "' . clean($row['description']) . '", "quantity": "' . $row['quantity'] . '", "unit": "' . clean($row['unit']) . '", "cost": "' . $row['cost'] . '", "selling_price": "' . $row['selling_price'] . '", "supplier": "' . clean($row['supplier']) . '", "expiry": "' . clean($row['expiry']) . '", "image": "' . clean($row['image']) . '"';
        echo '}';
    }
    echo ']}';
} elseif ($action == 'add') {
    $name = $_POST['itemName'];
    $catId = $_POST['categoryId'];
    $qty = $_POST['quantity'];
    $unit = $_POST['unit'];
    $cost = $_POST['cost'];
    $price = $_POST['sellingPrice'];
    $desc = $_POST['description'];
    $supp = $_POST['supplier'];
    $expiry = $_POST['expiryDate'];
    $img = $_POST['image'];
    $sql = "INSERT INTO products (name, category_id, quantity, unit, cost, selling_price, description, supplier, expiry, image) VALUES ('$name', '$catId', '$qty', '$unit', '$cost', '$price', '$desc', '$supp', '$expiry', '$img')";
    if (mysqli_query($conn, $sql)) {
        echo '{"success": true}';
    } else {
        echo '{"success": false, "error": "' . clean(mysqli_error($conn)) . '"}';
    }
} elseif ($action == 'update') {
    $id = $_POST['id'];
    $name = $_POST['itemName'];
    $catId = $_POST['categoryId'];
    $qty = $_POST['quantity'];
    $unit = $_POST['unit'];
    $cost = $_POST['cost'];
    $price = $_POST['sellingPrice'];
    $desc = $_POST['description'];
    $supp = $_POST['supplier'];
    $expiry = $_POST['expiryDate'];
    $img = $_POST['image'];
    $sql = "UPDATE products SET name='$name', category_id='$catId', quantity='$qty', unit='$unit', cost='$cost', selling_price='$price', description='$desc', supplier='$supp', expiry='$expiry', image='$img' WHERE id='$id'";
    if (mysqli_query($conn, $sql)) {
        echo '{"success": true}';
    } else {
        echo '{"success": false, "error": "' . clean(mysqli_error($conn)) . '"}';
    }
} elseif ($action == 'delete') {
    $id = $_GET['id'];
    if (mysqli_query($conn, "DELETE FROM products WHERE id='$id'")) {
        echo '{"success": true}';
    } else {
        echo '{"success": false}';
    }
} else {
    echo '{"success": false, "error": "Invalid action"}';
}
mysqli_close($conn);
