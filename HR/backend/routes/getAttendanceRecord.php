<?php
// require_once __DIR__ . '/../config/config.php';
include_once __DIR__ . "/../config/database.php";
require_once __DIR__ . "/../controllers/getAttendanceRecordForToday.controller.php";
require_once __DIR__ . "/../controllers/getAttendanceRecord.controller.php";
include_once __DIR__ . "/../config/cors.php";



$REQUEST_METHOD = $_SERVER["REQUEST_METHOD"];


if($REQUEST_METHOD === "GET"){

    $idParams = isset($_GET["id"]) ? (int)$_GET["id"] : null;
    $date = isset($_GET["date"]) ? $_GET["date"] : null;
    $month = isset($_GET["month"]) ? $_GET["month"] : null;
    $attendanceSummary = isset($_GET["attendanceSummary"]) ? $_GET["attendanceSummary"] : null;
    $overAllAttendance = isset($_GET["overAllAttendance"]) ? $_GET["overAllAttendance"] : null;
    $all = isset($_GET["all"]) ? $_GET["all"] : null; // what a variable name xD

    if($idParams && $date) {
        $response = getAttendanceRecord($idParams, $date, $pdo);
    }
    else if ($idParams && $month){
        $response = getAttendanceRecordForTheMonth($idParams, $month, $pdo);
    } 
    else if ($attendanceSummary && $idParams) {
        $response = getAttendanceSummary($idParams, $pdo);
    } 
    else if ($idParams && $all === "true") {
        $response = getAllAttendanceRecordById($idParams, $pdo);
    }
    else if($idParams) {
        // employeee id attendance record for today
        $response = getAttendanceRecordForToday($idParams, $pdo);
    } else if($date) {
        $response = getAttendanceRecords($date, $pdo);
    } 
    else if ($overAllAttendance === "true") {
        $response = getOverAllAttendancePerMonth($pdo);
    }
    else {
        // employees attendance record for today
        $response = getAttendanceRecordsForToday($pdo);
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
