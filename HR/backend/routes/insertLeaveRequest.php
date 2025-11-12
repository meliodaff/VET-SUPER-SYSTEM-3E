<?php
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../controllers/insertLeaveRequest.controller.php';
include_once __DIR__ . "/../config/cors.php";
require_once __DIR__ . "/../utils/validateForm.php";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

     $leaveDetails = ["employeeId", "leaveTypeId", "startDate", "endDate", "reasonDetail"];

    validateForm($leaveDetails);

    $response = insertLeaveRequest($pdo, $_POST, $_FILES);

    echo json_encode($response);
} else {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed"]);
}
