<?php

function isEmployeeHasDuty($employeeId, $pdo){
        $query = "SELECT
COUNT(*) as total, employee_id, day_of_week
FROM employee_schedules WHERE employee_id = :employee_id AND day_of_week = DAYNAME(NOW())

";
        try {
            $stmt = $pdo->prepare($query);
            $stmt->execute([":employee_id" => $employeeId]);
            $row = $stmt->fetch();

            if($row && $row["total"] > 0) {
                $response = [
                    "hasDuty" => true,
                    "message" => "The employee ID: {$row["employee_id"]} has duty today: {$row["day_of_week"]}",
                    "employeeId" => $row["employee_id"]
                ];
            }else {
                $response = [
                    "hasDuty" => false,
                    "message" => "You have no duty today: " . date("l"),
                ];
            }

        } catch (PDOException $e) {
            $response = [
                    "hasDuty" => false,
                    "message" => "Error: {$e->getMessage()}"
                ];
        }
        return $response;
    }

?>