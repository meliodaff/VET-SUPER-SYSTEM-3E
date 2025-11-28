<?php
include_once '../../config/database.php';
include_once '../../models/Product.php';

$database = new Database();
$db = $database->getConnection();

$product = new Product($db);
$stmt = $product->read();
$num = $stmt->rowCount();

if ($num > 0) {
    $products_arr = array();
    $products_arr["records"] = array();

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        extract($row);
        $product_item = array(
            "id" => $id,
            "item_name" => $item_name,
            "description" => $description,
            "category" => $category,
            "quantity" => $quantity,
            "unit" => $unit,
            "cost" => $cost,
            "selling_price" => $selling_price,
            "supplier_manufacturer" => $supplier_manufacturer,
            "expiration" => $expiration_date,
            "image" => $image
        );
        array_push($products_arr["records"], $product_item);
    }

    http_response_code(200);
    echo json_encode($products_arr);
} else {
    http_response_code(200);
    echo json_encode(array("records" => array()));
}
