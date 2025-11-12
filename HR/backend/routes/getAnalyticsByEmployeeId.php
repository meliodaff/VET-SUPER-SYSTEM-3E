<?php
// require_once __DIR__ . '/../config/config.php';
include_once __DIR__ . "/../config/database.php";
require_once __DIR__ . "/../controllers/getAnalytics.controller.php";
include_once __DIR__ . "/../config/cors.php";
include_once __DIR__ . "/../utils/validateForm.php";



$REQUEST_METHOD = $_SERVER["REQUEST_METHOD"];


if($REQUEST_METHOD === "GET"){
    $idParams = isset($_GET["id"]) ? $_GET["id"] : null;


    if(!$idParams) {
        $response = [
            "success" => false,
            "error" => "Id params is missing"   
        ];
    } else {
        
        $response = getAttendanceAnalyticsByEmployeeId($idParams, $pdo);
        $response1 = getAttendanceTrendsByEmployeeId($idParams, $pdo);
        $response2 = getTotalRewardsThisYear($idParams, $pdo);
    }


    if (!$response["success"] ||!$response1["success"]){
        http_response_code(500);
        $response = [
            "success" => false,
            "error" => $response["error"] || $response1["error"]
        ];
    } else {
        http_response_code(200);
        $response = [
            "success" => true,
            "data" => [$response["data"], $response1["data"], $response2["data"]]
        ];
    }
    echo json_encode($response);
}

?>
