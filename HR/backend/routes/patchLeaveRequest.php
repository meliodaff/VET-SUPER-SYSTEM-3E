<?php
// require_once __DIR__ . '/../config/config.php';
include_once __DIR__ . "/../config/database.php";
require_once __DIR__ . "/../controllers/patchLeaveRequest.controller.php";
include_once __DIR__ . "/../config/cors.php";



$REQUEST_METHOD = $_SERVER["REQUEST_METHOD"];


if($REQUEST_METHOD === "GET"){
    $requestId = isset($_GET["requestId"]) ? $_GET["requestId"] : null;
    $idParams = isset($_GET["id"]) ? $_GET["id"] : null;
    $status = isset($_GET["status"]) ? $_GET["status"] : null;
    if(!$idParams || !$status || !$requestId) {
        http_response_code(400);
        $response = [
            "error" => "Missing ID or status params"
        ];
        echo json_encode($response);
        return;
    } else {
        $response = patchLeaveRequest($requestId, $status, $idParams, $pdo);
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
