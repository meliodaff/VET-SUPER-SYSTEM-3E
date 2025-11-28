<?php
function getLeaveRequests($pdo){
    try {
            $query = "SELECT
    lr.request_id,
    e.employee_id,
    e.first_name,
    e.last_name,
    e.Position,
    lr.submission_date as date_applied,
    lr.reason_detail,
    lt.type_name,
    lr.start_date,
    lr.end_date,
    lr.status,
    DATEDIFF(lr.end_date, lr.start_date) + 1 as leave_days,
    lr.attachment_url
    FROM leave_requests lr
    JOIN employees e
    ON lr.employee_id = e.employee_id
    JOIN leave_types lt
    ON lr.leave_type_id = lt.leave_type_id";

    $stmt = $pdo->prepare($query);

    $stmt->execute();

    $datas = $stmt->fetchAll();

    $response = [
        "success" => true,
        "data" => $datas
    ];

    }catch (PDOException $e){
        $response = [
                "success" => false,
                "error" => $e->getMessage()
            ];
            }
        return $response;
    }


function getLeaveRequest($employeeId, $pdo){
    try {
            $query = "SELECT
    e.employee_id,
    e.first_name,
    e.last_name,
    e.Position,
    lr.submission_date as date_applied,
    lr.reason_detail,
    lt.type_name,
    lr.start_date,
    lr.end_date,
    lr.status,
    DATEDIFF(lr.end_date, lr.start_date) + 1 as leave_days,
    lr.attachment_url
    FROM leave_requests lr
    JOIN employees e
    ON lr.employee_id = e.employee_id
    JOIN leave_types lt
    ON lr.leave_type_id = lt.leave_type_id
    WHERE lr.status = 'Pending' 
    AND e.employee_id = :employee_id";

    $stmt = $pdo->prepare($query);

    $stmt->execute([
        ":employee_id" => $employeeId
    ]);

    $datas = $stmt->fetchAll();

    $response = [
        "success" => true,
        "data" => $datas
    ];

    }catch (PDOException $e){
        $response = [
                "success" => false,
                "error" => $e->getMessage()
            ];
            }
        return $response;
    }

?>