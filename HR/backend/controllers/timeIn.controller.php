<?php
    // include_once __DIR__ . "/../config/database.php";

    function timeIn($employeeId, $attendanceStatus, $rfid, $pdo){

        $query = "INSERT INTO time_and_attendance (employee_id, check_in_time, schedule_day, attendance_status)
VALUES (:employee_id, CURTIME(), NOW(), :attendanceStatus)"; // the 'Present' needs to be dynamic

        try {
            $stmt = $pdo->prepare($query);
            $isTimeIn = $stmt->execute([
                ":employee_id" => $employeeId,
                ":attendanceStatus" => $attendanceStatus
            ]);


            if($isTimeIn){
            $response = [
                 "success" => false,
                 "message" => "Failed time in for the employee ID: {$employeeId}"
                ];
    
            }
             
            $response = [
                 "success" => true,
                 "message" => "Successfully time in"
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