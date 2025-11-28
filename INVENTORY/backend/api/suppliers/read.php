<?php
// Include database and model
include_once '../../config/database.php';
include_once '../../models/Category.php';

// Instantiate database and category object
$database = new Database();
$db = $database->getConnection();

$category = new Category($db);

// Query categories
$stmt = $category->read();
$num = $stmt->rowCount();

// Check if more than 0 record found
if ($num > 0) {

    $categories_arr = array();
    $categories_arr["records"] = array();

    // Retrieve table contents
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        extract($row);

        $category_item = array(
            "id" => $id,
            "name" => $name,
            "description" => $description,
            "product_count" => $product_count,
            "created_date" => $created_date
        );

        array_push($categories_arr["records"], $category_item);
    }

    // Set response code - 200 OK
    http_response_code(200);

    // Show categories data in json format
    echo json_encode($categories_arr);
} else {
    // Set response code - 200 OK (empty is still success)
    http_response_code(200);

    // Tell the user no categories found
    echo json_encode(array("records" => array()));
}
