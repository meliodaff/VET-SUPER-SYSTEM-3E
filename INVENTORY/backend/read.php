<?php
include 'db_connect.php';

$sql = "SELECT * FROM products ORDER BY id DESC";
$result = mysqli_query($conn, $sql);

echo '{"success": true, "data": [';

$firstItem = true;
while ($row = mysqli_fetch_assoc($result)) {
    if (!$firstItem) {
        echo ',';
    }
    $firstItem = false;

    echo '{';
    echo '"id": "' . $row['id'] . '",';
    echo '"name": "' . clean($row['name']) . '",';
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
mysqli_close($conn);
