<?php
// require_once __DIR__ . '/../config/config.php';
include_once __DIR__ . "/../config/database.php";
require_once __DIR__ . "/../controllers/updateApplicantStatus.controller.php";
include_once __DIR__ . "/../config/cors.php";
require_once __DIR__ . "/../utils/validateForm.php";



$REQUEST_METHOD = $_SERVER["REQUEST_METHOD"];


if($REQUEST_METHOD === "POST"){


    validateForm(["id", "newStatus"]);

    $response = updateApplicantStatus($_POST["id"], $_POST["newStatus"], $pdo);


    if (!$response["success"]){
        http_response_code(500);
        $response = [
            "success" => false,
            "error" => $response["error"]
        ];
    } else {
        http_response_code(200);
        $response = [
            "success" => true,
            "message" => $response["message"]
        ];
    }
    echo json_encode($response);
}

?>
