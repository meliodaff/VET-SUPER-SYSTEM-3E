<?php
require_once __DIR__ . '/../config/config.php';
include_once __DIR__ . "/../config/database.php";
require_once __DIR__ . "/../controllers/insertEmployee.controller.php";
include_once __DIR__ . "/../config/cors.php";
require_once __DIR__ . "/../utils/checkDuplicateEmailForEmployee.php";
require_once __DIR__ . "/../utils/validateForm.php";



$REQUEST_METHOD = $_SERVER["REQUEST_METHOD"];

if($REQUEST_METHOD === "GET"){

    if (isset($_COOKIE["user"])) {
        http_response_code(200);
        echo json_encode(json_decode($_COOKIE["user"]));
    } else {
        http_response_code(401);
        echo json_encode([
            "message" => "No cookies"
        ]);
}

    
}

?>
