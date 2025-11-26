<?php
require_once __DIR__ . '/../config/config.php';
include_once __DIR__ . "/../config/database.php";
require_once __DIR__ . "/../controllers/insertAnnouncement.controller.php";
include_once __DIR__ . "/../config/cors.php";
require_once __DIR__ . "/../utils/checkDuplicateEmailForEmployee.php";
require_once __DIR__ . "/../utils/validateForm.php";



$REQUEST_METHOD = $_SERVER["REQUEST_METHOD"];

if($REQUEST_METHOD === "POST"){

//     $formDetails = ["firstName", "lastName", "birthDate", "gender", "email", "phoneNumber", "address", "employmentStatus", "jobTitle", "password"];

//    validateForm($formDetails);

    $response = insertAnnouncement($_POST, $pdo);

    if(!$response["success"]){
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "error" => $response["message"]
            ]);
        return;
    }
    http_response_code(200);
    echo json_encode([
        "success" => true,
        "message" => $response["message"]
    ]);
    
}

?>
