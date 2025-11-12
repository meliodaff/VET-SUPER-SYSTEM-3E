<?php
require_once __DIR__ . '/../config/config.php';
include_once __DIR__ . "/../config/database.php";
require_once __DIR__ . "/../controllers/getSchedule.controller.php";
include_once __DIR__ . "/../config/cors.php";


$REQUEST_METHOD = $_SERVER["REQUEST_METHOD"];


if($REQUEST_METHOD === "GET"){
    $idParams = isset($_GET["id"]) ? $_GET["id"] : null;
    if(!$idParams) {

        $response = getEmployeeSchedules($pdo);
    } else {
        
        $response = getEmployeeSchedule($idParams, $pdo);
    }


    if (!$response["success"]){
        http_response_code(500);
        $response = [
            "error" => $response["error"]
        ];
    } else {
        http_response_code(200);
        $response = [
            "data" => $response["data"]
        ];
    }
    echo json_encode($response);
}

?>
