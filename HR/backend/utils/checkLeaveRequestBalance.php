<?php
require_once __DIR__ . "/../config/database.php";

function checkLeaveRequestBalance($employeeId, $pdo){
    $query = "SELECT
	e.employee_id,
	e.first_name,
    e.last_name,
    lb.days_remaining
    FROM leave_balances lb
    JOIN employees e
    ON lb.employee_id = e.employee_id
    WHERE e.employee_id = :employee_id";

    try {
            $stmt = $pdo->prepare($query);
            $stmt->execute([":employee_id" => $employeeId]);
            $response = $stmt->fetch();

            if($response && $response["days_remaining"] > 0) {
                $response = [
                    "remainingCount" => $response["days_remaining"],
                    "message" => "{$response["first_name"]} {$response["last_name"]}: Can request for leave",
                    "canRequest" => true

                ];
            }else {
                $response = [
                    "remainingCount" => $response["days_remaining"],
                    "message" => "User has no leave request remaining: Leave Balance: {$response["days_remaining"]}",
                    "canRequest" => false,
                ];
                // exit();
            }

        } catch (PDOException $e) {
            $response = [
                    "canRequest" => false,
                    "message" => "Error: {$e->getMessage()}"
                ];
        }
        return $response;

}

// checkLeaveRequest(3, $pdo);

?>