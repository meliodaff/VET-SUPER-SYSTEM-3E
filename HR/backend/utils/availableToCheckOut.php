<?php

function isAvailableToCheckOut($employeeId, $pdo){
//         $query = "SELECT COUNT(*) as total, attendance_id, employee_id, check_in_time, 
//        TIMESTAMPDIFF(HOUR, check_in_time, NOW()) AS hours_worked
// FROM time_and_attendance
// WHERE employee_id = :employee_id
//   AND check_out_time IS NULL
//   AND TIMESTAMPDIFF(HOUR, check_in_time, NOW()) >= 4;
        $query = "SELECT 
  COUNT(*) as total,
  attendance_id, 
  employee_id, 
 DATE_FORMAT(check_in_time, '%h:%i:%s %p') AS check_in_time,
  TIMESTAMPDIFF(HOUR, check_in_time, NOW()) AS hours_worked,
  CASE 
    WHEN TIMESTAMPDIFF(HOUR, check_in_time, NOW()) >= 4 THEN 1
    ELSE 0
  END AS can_time_out
FROM time_and_attendance
WHERE employee_id = :employee_id
  AND check_out_time IS NULL
  AND DATE(check_in_time) = CURDATE()
";
        try {
            $stmt = $pdo->prepare($query);
            $stmt->execute([":employee_id" => $employeeId]);
            $row = $stmt->fetch();

            if($row && $row["can_time_out"] > 0) {
                $response = [
                    "isAvailable" => true,
                    "message" => "The employee ID is available to check out as the employee has already rendered 4 hours",
                    "employeeId" => $row["employee_id"]
                ];
            }else {
                $response = [
                    "isAvailable" => false,
                    "message" => "You are not available to check out yet as you have not rendered 4 hours",
                    "timeIn" => $row["check_in_time"]
                ];
            }

        } catch (PDOException $e) {
            $response = [
                    "isAvailable" => false,
                    "message" => "Error: {$e->getMessage()}"
                ];
        }
        return $response;
    }

?>