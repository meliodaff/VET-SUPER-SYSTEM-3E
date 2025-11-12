<?php
// require_once __DIR__ . '/../config/config.php';
include_once __DIR__ . "/../config/database.php";
require_once __DIR__ . "/../controllers/getPaidHours.controller.php";
include_once __DIR__ . "/../config/cors.php";



$REQUEST_METHOD = $_SERVER["REQUEST_METHOD"];


if($REQUEST_METHOD === "GET"){

    $idParams = isset($_GET["id"]) ? $_GET["id"] : null;
    $period = isset($_GET["period"]) ? (int)$_GET["period"] : null;
    $year = isset($_GET["year"]) ? $_GET["year"] : null;
    $month = isset($_GET["month"]) ? $_GET["month"] : null;
    
    // if(!$idParams) {
    //     // WALA PA HERE YUNG OTHER QUERY KEY LIKE THE PERIOD OR THE YEAR OR THE MONTH
    // } else {
        // $response = getPaidHoursOfTheFirstCutOff($idParams, $pdo);
        // }

        // WALA RIN PAPALA YUNG BY MONTH

        if ($idParams && $period === 1 && $year && $month){
            $response = getAllPaidHoursOfTheFirstCutOffByYearMonthId($idParams, $year, $month, $pdo);   
        }
        else if ($idParams && $period === 2 && $year && $month){
            $response = getAllPaidHoursOfTheSecondCutOffByYearMonthId($idParams, $year, $month, $pdo);   
            
        }
        else if ($idParams && $period === 1 && $month){
            // CURRENT YEAR
            $response = getAllPaidHoursOfTheFirstCutOffByMonthId($idParams, $month, $pdo);
        }
        else if ($idParams && $period === 2 && $month){
            // CURRENT YEAR
            $response = getAllPaidHoursOfTheSecondCutOffByMonthId($idParams, $month, $pdo);
            
        }
        else if($idParams && $period === 1 && $year){
            // CURRENT MONTH
            $response = getAllPaidHoursOfTheFirstCutOffByYearAndId($idParams, $year, $pdo);
        }
        else if ($idParams && $period === 2 && $year){
            
            // CURRENT MONTH
            $response = getAllPaidHoursOfTheSecondCutOffByYearAndId($idParams, $year, $pdo);
        }
        else if ($period === 1 && $year && $month){
            // all records
            $response = getAllPaidHoursByFirstPeriodYearMonth($year, $month, $pdo);
            
        }
        else if ($period === 2 && $year && $month){
            // all records
            $response = getAllPaidHoursBySecondPeriodYearMonth($year, $month, $pdo);
            
        }
        else if ($idParams && $period === 1) {
            // CURRENT YEAR AND MONTH
            $response = getPaidHoursOfTheFirstCutOff($idParams, $pdo);
        }
        else if ($idParams && $period === 2) {
            
            // CURRENT YEAR AND MONTH
            $response = getPaidHoursOfTheSecondCutOff($idParams, $pdo);
        }
        else if ($year && $period === 1) {
            // CURRENT MONTH
            $response = getAllPaidHoursOfTheFirstCutOffByYear($year, $pdo);
        }
        else if ($year && $period === 2) {
            // CURRENT MONTH
            $response = getAllPaidHoursOfTheSecondCutOffByYear($year, $pdo);
        }
        else if ($year && $month) {
            $response = getAllPaidHoursByYearMonth($year, $month, $pdo);
        }
        else if ($month && $period === 1) {
            // CURRENT YEAR
            $response = getAllPaidHoursOfTheFirstCutOffByMonth($month, $pdo);
        }
        else if ($month && $period === 2) {
            // CURRENT YEAR
            $response = getAllPaidHoursOfTheSecondCutOffByMonth($month, $pdo);
        }   
        else if ($idParams && $month) {
            // CURRENT YEAR
            $response = getAllPaidHoursByIdMonth($idParams, $month, $pdo);
        }
        else if ($idParams && $year) {
            // CURRENT YEAR
            $response = getPaidHoursByIdYear($idParams, $year, $pdo);
        }
        else if ($period === 1) {
            //CURRENT MONTH AND YEAR
            $response = getAllPaidHoursOfTheFirstCutOff($pdo);
        }
        else if ($period === 2) {
            //MONTH AND YEAR
            $response = getAllPaidHoursOfTheSecondCutOff($pdo);
        }

        else if ($month) {
            $response = getAllPaidHoursByMonth($month, $pdo);
        } 
        else if ($year) {
            $response = getAllPaidHoursByYear($year, $pdo);
        } 
        else if ($idParams) {
            $response = getAllPaidHoursById($idParams, $pdo);
        } 
        else {
            // doesnt work yet
            $response = [
                "success" => true,
                "data" => "The parameters are wrong"
            ];
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
