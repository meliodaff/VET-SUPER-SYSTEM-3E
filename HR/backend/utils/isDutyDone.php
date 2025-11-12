<?php

function isDutyDone($employeeId, $pdo){
        $query = "SELECT e.employee_id, DATE_FORMAT(taa.check_in_time, '%h:%i %p') AS check_in_time, DATE_FORMAT(taa.check_out_time, '%h:%i %p') AS check_out_time, COUNT(taa.check_out_time) AS total, e.profile_image_url FROM time_and_attendance taa
JOIN employees e
ON e.employee_id = taa.employee_id
WHERE e.employee_id = :employee_id AND DATE(taa.check_in_time) = CURDATE()
";
        try {
            $stmt = $pdo->prepare($query);
            $stmt->execute([":employee_id" => $employeeId]);
            $row = $stmt->fetch();

            if($row && $row["total"] > 0) {
                $response = [
                    "isDone" => true,
                    "message" => "You have already checked out for today's duty",
                    "employeeId" => $row["employee_id"],
                    "timeIn" => $row["check_in_time"], 
                    "timeOut" => $row["check_out_time"],
                    "profile_image_url" => $row["profile_image_url"]
                ];
            }else {
                $response = [
                    "isDone" => false,
                    "message" => "The employee ID {$employeeId} has not yet checked out for today's duty"
                ];
            }

        } catch (PDOException $e) {
            $response = [
                    "isDone" => false,
                    "message" => "Error: {$e->getMessage()}"
                ];
        }
        return $response;
    }

?>