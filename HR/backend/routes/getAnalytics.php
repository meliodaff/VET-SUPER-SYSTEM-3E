<?php
// require_once __DIR__ . '/../config/config.php';
include_once __DIR__ . "/../config/database.php";
require_once __DIR__ . "/../controllers/getAnalytics.controller.php";
require_once __DIR__ . "/../controllers/getAttendanceRecord.controller.php";
require_once __DIR__ . "/../controllers/getIncentive.controller.php";
include_once __DIR__ . "/../config/cors.php";
include_once __DIR__ . "/../utils/validateForm.php";

$REQUEST_METHOD = $_SERVER["REQUEST_METHOD"];

if($REQUEST_METHOD === "GET"){
   
        $response = getAveragePerformance($pdo);
        $response1 = getOverAllAttendancePerMonth($pdo);
        $response2 = getTotalIncentivesGivenPerMonth($pdo);
        $response3 = getEmployeePerformanceComparison($pdo);
        $response4 = getAttendanceTrends($pdo);
        $response5 = getAverageWorkedHours($pdo);

        // Check if both responses are successful
        if (!$response["success"] || !$response1["success"] || !$response2["success"] || !$response3["success"] || !$response4["success"] || !$response5["success"]) {
            http_response_code(500);
            $response = [
                "success" => false,
                "error" => $response["success"] ? $response1["error"] : $response["error"]
            ];
        } else {
            http_response_code(200);
            $response = [
                "success" => true,
                "data" => [
                    "performance" => $response["data"],
                    "attendance" => $response1["data"],
                    "totalIncentivesGivenByMonth" => $response2["data"],
                    "employeePerformanceComparison" => $response3["data"],
                    "attendanceTrends" => $response4["data"],
                    "highestHoursWorked" => $response5["data"]
                ]
            ];
        }
    
    echo json_encode($response);
}
?>