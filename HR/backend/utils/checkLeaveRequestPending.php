<?php
require_once __DIR__ . "/../config/database.php";

function checkLeaveRequestPending($employeeId, $pdo){
    $query = "SELECT
	e.employee_id,
	e.first_name,
    e.last_name,
    lq.status,
    COUNT(*) AS total
    FROM leave_requests lq
    JOIN employees e
    ON lq.employee_id = e.employee_id
    WHERE e.employee_id = :employee_id
    AND lq.status = 'Pending'
    ";

    try {
            $stmt = $pdo->prepare($query);
            $stmt->execute([":employee_id" => $employeeId]);
            $response = $stmt->fetch();

            if($response && $response["total"] > 0) {
                $response = [
                    "hasPending" => true,
                    "message" => "User has still pending request leave",
                ];
            }else {
                $response = [
                    "hasPending" => false,
                    "message" => "{$response["first_name"]} {$response["last_name"]}: Can request for leave",

                ];
                // exit();
            }

        } catch (PDOException $e) {
            $response = [
                    "hasPending" => false,
                    "message" => "Error: {$e->getMessage()}"
                ];
        }
        return $response;

}

// checkLeaveRequest(3, $pdo);

?>