<?php
// require_once __DIR__ . '/../config/config.php';
include_once __DIR__ . "/../config/database.php";
require_once __DIR__ . "/../controllers/getIncentiveAwards.controller.php";
include_once __DIR__ . "/../config/cors.php";



$REQUEST_METHOD = $_SERVER["REQUEST_METHOD"];


if($REQUEST_METHOD === "GET"){
    $forTheMonth = isset($_GET["forTheMonth"]) ? $_GET["forTheMonth"] : null;
  
    if($forTheMonth === "true"){
        $response = getIncentiveAwardsForTheMonth($pdo);
    }else {
        $response = getIncentiveAwards($pdo);
    }

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
            "data" => $response["data"]
        ];
    }
    echo json_encode($response);
}

?>
