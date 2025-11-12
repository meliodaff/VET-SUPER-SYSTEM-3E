<?php

function isForgotToTimeOut($employeeId, $pdo){
//         
        $query = "SELECT 
    ta.attendance_id,
    ta.employee_id,
    e.first_name,
    ta.check_in_time,
    DATE(ta.check_in_time) AS work_date,
    DAYNAME(ta.check_in_time) AS day_of_week,
    ta.schedule_day,
    ta.attendance_status,
    es.start_time AS scheduled_start,
    es.end_time AS scheduled_end,
    DATEDIFF(CURDATE(), DATE(ta.check_in_time)) AS days_ago,
    COUNT(*) AS total
FROM 
    time_and_attendance ta
INNER JOIN 
    employees e ON ta.employee_id = e.employee_id
LEFT JOIN 
    employee_schedules es ON ta.employee_id = es.employee_id 
    AND es.day_of_week = DAYNAME(ta.check_in_time)
WHERE 
    ta.check_out_time IS NULL
    AND DATE(ta.check_in_time) < CURDATE()
    AND DATE(ta.check_in_time) >= DATE_SUB(CURDATE(), INTERVAL 14 DAY)
    AND ta.leave_request_id IS NULL
    AND ta.employee_id = :employee_id
ORDER BY 
    ta.check_in_time DESC;
";
        try {
            $stmt = $pdo->prepare($query);
            $stmt->execute([":employee_id" => $employeeId]);
            $row = $stmt->fetch();

            
            if($row && $row["total"] > 0) {
                $dateTime = new DateTime($row["schedule_day"]);
                $formattedDate = $dateTime->format('F j, Y');
                $response = [
                    "isForgotToTimeOut" => true,
                    "message" => "You forgot to time out last " . $row["day_of_week"] . ", " . $formattedDate,
                    "timeIn" => date('h:i A', strtotime($row["check_in_time"]))
                ];
            }else {
                $response = [
                    "isForgotToTimeOut" => false,
                    "message" => "",
                ];
            }

        } catch (PDOException $e) {
            $response = [
                    "isForgotToTimeOut" => false,
                    "message" => "Error: {$e->getMessage()}"
                ];
        }
        return $response;
    }


?>