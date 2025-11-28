<?php
include_once '../../config/database.php';
include_once '../../models/Product.php';

$database = new Database();
$db = $database->getConnection();

$product = new Product($db);

// Get posted data
$data = json_decode(file_get_contents("php://input"), true);

if (!empty($data['id'])) {
    if ($product->delete($data['id'])) {
        http_response_code(200);
        echo json_encode(array("message" => "Product was deleted."));
    } else {
        http_response_code(503);
        echo json_encode(array("message" => "Unable to delete product."));
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Unable to delete product. ID is missing."));
}
