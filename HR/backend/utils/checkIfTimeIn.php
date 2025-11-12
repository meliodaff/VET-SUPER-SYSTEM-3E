<?php

function checkIfTimeIn($employeeId, $pdo){
        $query = "SELECT employee_id, COUNT(*) AS total FROM time_and_attendance WHERE employee_id = :employee_id AND DATE(check_in_time) = CURDATE() AND check_out_time IS NULL";
        try {
            $stmt = $pdo->prepare($query);
            $stmt->execute([":employee_id" => $employeeId]);
            $row = $stmt->fetch();

            if($row && $row["total"] > 0) {
                $response = [
                    "isTimeIn" => true,
                    "message" => "The employee ID already timed in",
                    "employeeId" => $row["employee_id"]
                ];
            }else {
                $response = [
                    "isTimeIn" => false,
                    "message" => "The employee ID havent timed"
                ];
            }

        } catch (PDOException $e) {
            $response = [
                    "isTimeIn" => false,
                    "message" => "Error: {$e->getMessage()}"
                ];
        }
        return $response;
    }

?>