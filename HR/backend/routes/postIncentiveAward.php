<?php
include_once __DIR__ . "/../config/database.php";
require_once __DIR__ . "/../controllers/postIncentiveAward.controller.php";
include_once __DIR__ . "/../config/cors.php";

$REQUEST_METHOD = $_SERVER["REQUEST_METHOD"];

    if ($REQUEST_METHOD === "POST") {

    $response = postIncentiveAward($_POST, $pdo);

    if (!$response["success"]) {
        http_response_code(400);
    } else {
        http_response_code(201);
    }
    
    echo json_encode($response);
}

else {
    http_response_code(405);
    echo json_encode([
        "success" => false,
        "error" => "Method not allowed"
    ]);
}
?>