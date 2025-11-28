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
if (!empty($data->name)) {

    // Set category property values
    $category->name = $data->name;
    $category->description = isset($data->description) ? $data->description : null;

    // Create the category
    if ($category->create()) {

        // Set response code - 201 created
        http_response_code(201);

        // Tell the user
        echo json_encode(array(
            "success" => true,
            "message" => "Category was created successfully."
        ));
    }

    // If unable to create category, tell the user
    else {

        // Set response code - 503 service unavailable
        http_response_code(503);

        // Tell the user
        echo json_encode(array(
            "success" => false,
            "message" => "Unable to create category."
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
        "message" => "Unable to create category. Data is incomplete."
    ));
}
