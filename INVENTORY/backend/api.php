<?php
// ==========================================
// VET INVENTORY SYSTEM - FULL BACKEND API
// ==========================================

// 1. CORS & Headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit();
}

// 2. Database Connection
$host = "localhost";
$user = "root";
$pass = "";
$dbname = "vet-inventory";

$conn = mysqli_connect($host, $user, $pass, $dbname);

if (!$conn) {
    // Manual Error JSON
    die('{"success": false, "error": "Database connection failed"}');
}

// 3. Helper Function to Clean Inputs
function clean($data)
{
    global $conn;
    if ($data === null) return "";
    $data = mysqli_real_escape_string($conn, $data);
    // Escape characters that break manual JSON
    return str_replace(array("\n", "\r", '"', "\t"), array("\\n", "", '\"', "\\t"), $data);
}

// 4. Get Action
$action = isset($_GET['action']) ? $_GET['action'] : '';

// ===================================================================================
//                               DASHBOARD LOGIC
// ===================================================================================
if ($action == 'dashboard') {
    // 1. Aggregate Statistics
    $sql_stats = "SELECT 
                    COALESCE(SUM(quantity), 0) as total_stock,
                    (SELECT COUNT(*) FROM products WHERE quantity = 0) as low_stock,
                    (SELECT COUNT(*) FROM categories) as total_categories,
                    (SELECT COUNT(*) FROM suppliers) as total_suppliers,
                    COALESCE(SUM(cost * quantity), 0) as total_value
                  FROM products";

    $result_stats = mysqli_query($conn, $sql_stats);
    $stats = mysqli_fetch_assoc($result_stats);

    // 2. Chart Data
    $sql_chart = "SELECT c.name, COALESCE(SUM(p.quantity), 0) as value 
                  FROM categories c 
                  LEFT JOIN products p ON p.category_id = c.id 
                  GROUP BY c.id";
    $result_chart = mysqli_query($conn, $sql_chart);

    // --- MANUAL JSON CONSTRUCTION START ---
    echo '{"success": true, ';

    // Construct Stats Object
    echo '"stats": {';
    echo '"total_stock": "' . $stats['total_stock'] . '",';
    echo '"low_stock": "' . $stats['low_stock'] . '",';
    echo '"total_categories": "' . $stats['total_categories'] . '",';
    echo '"total_suppliers": "' . $stats['total_suppliers'] . '",';
    echo '"total_value": "' . $stats['total_value'] . '"';
    echo '}, ';

    // Construct Chart Data Array
    echo '"chartData": [';

    $colors = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4'];
    $i = 0;
    $first = true;

    while ($row = mysqli_fetch_assoc($result_chart)) {
        if (!$first) {
            echo ',';
        }
        $first = false;

        echo '{';
        echo '"name": "' . clean($row['name']) . '",';
        echo '"value": ' . $row['value'] . ',';
        echo '"color": "' . $colors[$i % 6] . '"';
        echo '}';
        $i++;
    }

    echo ']'; // End Array
    echo '}'; // End Main Object
    // --- MANUAL JSON CONSTRUCTION END ---

    // ===================================================================================
    //                               PRODUCT LOGIC
    // ===================================================================================
} elseif ($action == 'all') {
    $sql = "SELECT p.*, c.name as category_name 
            FROM products p 
            LEFT JOIN categories c ON p.category_id = c.id 
            ORDER BY p.id DESC";
    $result = mysqli_query($conn, $sql);

    echo '{"success": true, "data": [';
    $first = true;
    while ($row = mysqli_fetch_assoc($result)) {
        if (!$first) echo ',';
        $first = false;

        echo '{';
        echo '"id": "' . $row['id'] . '",';
        echo '"name": "' . clean($row['name']) . '",';
        echo '"category_name": "' . clean($row['category_name']) . '",';
        echo '"category_id": "' . $row['category_id'] . '",';
        echo '"description": "' . clean($row['description']) . '",';
        echo '"quantity": "' . $row['quantity'] . '",';
        echo '"unit": "' . clean($row['unit']) . '",';
        echo '"cost": "' . $row['cost'] . '",';
        echo '"selling_price": "' . $row['selling_price'] . '",';
        echo '"supplier": "' . clean($row['supplier']) . '",';
        echo '"expiry": "' . clean($row['expiry']) . '",';
        echo '"image": "' . clean($row['image']) . '"';
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

    $sql = "INSERT INTO products (name, category_id, quantity, unit, cost, selling_price, description, supplier, expiry, image) 
            VALUES ('$name', '$catId', '$qty', '$unit', '$cost', '$price', '$desc', '$supp', '$expiry', '$img')";

    if (mysqli_query($conn, $sql)) {
        echo '{"success": true, "message": "Product Added"}';
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

    $sql = "UPDATE products SET 
            name='$name', category_id='$catId', quantity='$qty', unit='$unit', cost='$cost', 
            selling_price='$price', description='$desc', supplier='$supp', 
            expiry='$expiry', image='$img' 
            WHERE id='$id'";

    if (mysqli_query($conn, $sql)) {
        echo '{"success": true, "message": "Product Updated"}';
    } else {
        echo '{"success": false, "error": "' . clean(mysqli_error($conn)) . '"}';
    }
} elseif ($action == 'delete') {
    $id = $_GET['id'];
    if (mysqli_query($conn, "DELETE FROM products WHERE id='$id'")) {
        echo '{"success": true}';
    } else {
        echo '{"success": false, "error": "' . clean(mysqli_error($conn)) . '"}';
    }

    // ===================================================================================
    //                               CATEGORY LOGIC
    // ===================================================================================
} elseif ($action == 'categories') {
    $sql = "SELECT c.id, c.name, c.description, c.created_at, COUNT(p.id) as live_count 
            FROM categories c 
            LEFT JOIN products p ON p.category_id = c.id 
            GROUP BY c.id 
            ORDER BY c.name ASC";

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
        echo '"description": "' . clean($row['description']) . '",';
        echo '"productCount": "' . $row['live_count'] . '",';
        echo '"createdDate": "' . $date . '"';
        echo '}';
    }
    echo ']}';
} elseif ($action == 'add_category') {
    $name = $_POST['name'];
    $desc = $_POST['description'];

    $sql = "INSERT INTO categories (name, description) VALUES ('$name', '$desc')";

    if (mysqli_query($conn, $sql)) {
        echo '{"success": true}';
    } else {
        echo '{"success": false, "error": "' . clean(mysqli_error($conn)) . '"}';
    }
} elseif ($action == 'update_category') {
    $id = $_POST['id'];
    $name = $_POST['name'];
    $desc = $_POST['description'];

    $sql = "UPDATE categories SET name='$name', description='$desc' WHERE id='$id'";

    if (mysqli_query($conn, $sql)) {
        echo '{"success": true}';
    } else {
        echo '{"success": false, "error": "' . clean(mysqli_error($conn)) . '"}';
    }
} elseif ($action == 'delete_category') {
    $id = $_GET['id'];
    if (mysqli_query($conn, "DELETE FROM categories WHERE id='$id'")) {
        echo '{"success": true}';
    } else {
        echo '{"success": false, "error": "' . clean(mysqli_error($conn)) . '"}';
    }

    // ===================================================================================
    //                               SUPPLIER LOGIC
    // ===================================================================================
} elseif ($action == 'suppliers') {
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
        echo '"contactPerson": "' . clean($row['contact_person']) . '",';
        echo '"email": "' . clean($row['email']) . '",';
        echo '"phone": "' . clean($row['phone']) . '",';
        echo '"address": "' . clean($row['address']) . '",';
        echo '"createdDate": "' . $date . '"';
        echo '}';
    }
    echo ']}';
} elseif ($action == 'add_supplier') {
    $name = $_POST['name'];
    $cont = $_POST['contactPerson'];
    $em = $_POST['email'];
    $ph = $_POST['phone'];
    $addr = $_POST['address'];

    $sql = "INSERT INTO suppliers (name, contact_person, email, phone, address) 
            VALUES ('$name', '$cont', '$em', '$ph', '$addr')";

    if (mysqli_query($conn, $sql)) {
        echo '{"success": true}';
    } else {
        echo '{"success": false, "error": "' . clean(mysqli_error($conn)) . '"}';
    }
} elseif ($action == 'update_supplier') {
    $id = $_POST['id'];
    $name = $_POST['name'];
    $cont = $_POST['contactPerson'];
    $em = $_POST['email'];
    $ph = $_POST['phone'];
    $addr = $_POST['address'];

    $sql = "UPDATE suppliers SET 
            name='$name', contact_person='$cont', email='$em', phone='$ph', address='$addr' 
            WHERE id='$id'";

    if (mysqli_query($conn, $sql)) {
        echo '{"success": true}';
    } else {
        echo '{"success": false, "error": "' . clean(mysqli_error($conn)) . '"}';
    }
} elseif ($action == 'delete_supplier') {
    $id = $_GET['id'];
    if (mysqli_query($conn, "DELETE FROM suppliers WHERE id='$id'")) {
        echo '{"success": true}';
    } else {
        echo '{"success": false, "error": "' . clean(mysqli_error($conn)) . '"}';
    }
} else {
    echo '{"success": false, "error": "Invalid action"}';
}

mysqli_close($conn);
