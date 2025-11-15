<?php
include_once __DIR__ . "/../config/database.php";
require_once __DIR__ . "/../controllers/postScheduleDay.controller.php";
include_once __DIR__ . "/../config/cors.php";

$REQUEST_METHOD = $_SERVER["REQUEST_METHOD"];

    if ($REQUEST_METHOD === "POST") {

    $employeeId = $_POST["employeeId"] ?? null;
    $dayOfWeek = $_POST["scheduleDay"] ?? null;

    if (!$employeeId || !$dayOfWeek) {
        http_response_code(400);
        $response = [
            "success" => false,
            "error" => "Missing employee_id or day_of_week"
        ];
        echo json_encode($response);
        return;
    }

    $response = removeScheduleDay($employeeId, $dayOfWeek, $pdo);

    if (!$response["success"]) {
        http_response_code(400);
    } else {
        http_response_code(201);
    }
    
    echo json_encode($response);
}

else {
    http_response_code(405);
    echo json_encode([
        "success" => false,
        "error" => "Method not allowed"
    ]);
}
?>