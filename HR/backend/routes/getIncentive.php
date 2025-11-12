<?php
// require_once __DIR__ . '/../config/config.php';
include_once __DIR__ . "/../config/database.php";
require_once __DIR__ . "/../controllers/getIncentive.controller.php";
include_once __DIR__ . "/../config/cors.php";



$REQUEST_METHOD = $_SERVER["REQUEST_METHOD"];


if($REQUEST_METHOD === "GET"){
    $idParams = isset($_GET["id"]) ? $_GET["id"] : null;
    $isClaim = isset($_GET["isClaim"]) ? $_GET["isClaim"] : null;
    $topPerformer = isset($_GET["topPerformer"]) ? $_GET["topPerformer"] : null;
     

    if($idParams) {
        $response = getIncentive($idParams, $pdo);
    } 
    else if ($isClaim === "0" || $isClaim === "1") {
        $response = getIncentives((int)$isClaim, $pdo);
    } else if ($topPerformer === "true"){
        $response = getTopPerformer($pdo);
    }
    else {
        $response = getAllIncentivesForTheMonth($pdo);
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
