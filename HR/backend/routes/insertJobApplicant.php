<?php
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../controllers/insertJobApplicant.controller.php';
include_once __DIR__ . "/../config/cors.php";
require_once __DIR__ . "/../utils/validateForm.php";


if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    
    $requiredFields = ["position", "firstName", "middleName", "lastName", "address", "email", "phoneNumber"];


    validateForm($requiredFields);


    $response = insertJobApplicant($pdo, $_POST, $_FILES);
    echo json_encode($response);
} else {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Internal server error"]);
}
