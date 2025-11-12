<?php
require_once __DIR__ . '/../config/config.php';
include_once __DIR__ . "/../config/database.php";
require_once __DIR__ . "/../auth/login.controller.php";
include_once __DIR__ . "/../config/cors.php";
require_once __DIR__ . "/../utils/validateForm.php";

$REQUEST_METHOD = $_SERVER["REQUEST_METHOD"];

if($REQUEST_METHOD === "POST"){

    $formDetails = ["employeeId", "password"];

   validateForm($formDetails);

    $response = login($_POST, $pdo);

    if(!$response["success"]){
        http_response_code(500);
        echo json_encode([
                "error" => $response["message"]
            ]);
        return;
    }
    http_response_code(200);
    echo json_encode([
        "message" => $response["message"]
    ]);
    
}

?>
