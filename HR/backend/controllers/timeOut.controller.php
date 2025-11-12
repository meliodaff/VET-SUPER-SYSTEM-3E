<?php
    // include_once __DIR__ . "/../config/database.php";

    function timeOut($employeeId, $rfid, $pdo){

        $query = "UPDATE time_and_attendance SET check_out_time = CURTIME() WHERE employee_id = :employee_id AND schedule_day = DATE(CURDATE());";
        $queryToGetTheTimeIn = "SELECT 
attendance_id,
employee_id,
DATE_FORMAT(check_in_time, '%h:%i:%s %p') AS check_in_time
FROM time_and_attendance
WHERE employee_id = :employee_id
AND check_out_time IS NULL
ORDER BY check_in_time DESC
LIMIT 1";
        try {
            $stmt = $pdo->prepare($query);
            $stmt1 = $pdo->prepare($queryToGetTheTimeIn);

            $stmt1->execute([
                ":employee_id" => $employeeId
            ]);

            
            $timeIn = $stmt1->fetch();

            
            $isTimeOut = $stmt->execute([
                ":employee_id" => $employeeId
            ]);

            

            if($isTimeOut){
            $response = [
                 "success" => false,
                 "message" => "Failed time out for the employee ID: {$employeeId}",
                ];
    
            }
             
            $response = [
                 "success" => true,
                //  "message" => "Successfully time out for the employee ID: {$employeeId}"
                 "message" => "Successfully time out",
                 "timeIn" => $timeIn["check_in_time"]
                ];

        } catch (PDOException $e) {
            $response = [
                "success" => false,
                "message" => $e->getMessage()
            ];
        }

        return $response;

    }

?>