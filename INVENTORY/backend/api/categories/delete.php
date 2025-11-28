<?php
// Include database and model
include_once '../../config/database.php';
include_once '../../models/Category.php';

// Instantiate database and category object
$database = new Database();
$db = $database->getConnection();

$category = new Category($db);

// Get posted data
$data = json_decode(file_get_contents("php://input"));

// Make sure data is not empty
if (!empty($data->id)) {

    // Set category id to be deleted
    $category->id = $data->id;

    // Delete the category
    if ($category->delete()) {

        // Set response code - 200 ok
        http_response_code(200);

        // Tell the user
        echo json_encode(array(
            "success" => true,
            "message" => "Category was deleted successfully."
        ));
    }

    // If unable to delete category
    else {

        // Set response code - 503 service unavailable
        http_response_code(503);

        // Tell the user
        echo json_encode(array(
            "success" => false,
            "message" => "Unable to delete category."
        ));
    }
}

// Tell the user data is incomplete
else {

    // Set response code - 400 bad request
    http_response_code(400);

    // Tell the user
    echo json_encode(array(
        "success" => false,
        "message" => "Unable to delete category. Data is incomplete."
    ));
}
