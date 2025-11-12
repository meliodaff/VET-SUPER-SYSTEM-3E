<?php

     function getAttendanceRecordsForToday($pdo) {
    
        $query = "SELECT 
    e.employee_id,
    e.first_name,
    e.last_name,
    e.department,
    e.position,
    es.day_of_week,
    es.start_time AS scheduled_start,
    es.end_time AS scheduled_end,
    TIME(taa.check_in_time) AS check_in_time,
    TIME(taa.check_out_time) as check_out_time,
    taa.attendance_status,
    taa.notes
FROM employees e
JOIN employee_schedules es
    ON e.employee_id = es.employee_id
    AND es.day_of_week = DAYNAME(CURDATE())  -- today's schedule
LEFT JOIN time_and_attendance taa
    ON e.employee_id = taa.employee_id
    AND DATE(taa.check_in_time) = CURDATE()  -- today's attendance
ORDER BY e.employee_id;


";
        try {
            $stmt = $pdo->prepare($query);
            $stmt->execute();

            $datas = $stmt->fetchAll();
            $response = [
                "success" => true,
                "data" => $datas 
            ];
        } catch (PDOException $e) {
            $response = [
                "success" => false,
                "error" => $e->getMessage()
            ];
            }
            return $response;
    }

    function getAttendanceRecordForToday($id, $pdo) {
        $query = "SELECT 
    e.employee_id,
    e.first_name,
    e.last_name,
    e.department,
    e.position,
    es.day_of_week,
    es.start_time AS scheduled_start,
    es.end_time AS scheduled_end,
    TIME(taa.check_in_time) AS check_in_time,
    TIME(taa.check_out_time) AS check_out_time,
    taa.attendance_status,
    taa.notes
FROM employees e
JOIN employee_schedules es
    ON e.employee_id = es.employee_id
    AND es.day_of_week = DAYNAME(CURDATE())  -- today's schedule
LEFT JOIN time_and_attendance taa
    ON e.employee_id = taa.employee_id
    AND DATE(taa.check_in_time) = CURDATE()  -- today's attendance
WHERE e.employee_id = :employee_id
ORDER BY e.employee_id;

";

        try {
            $stmt = $pdo->prepare($query);
            $stmt->execute([
                ":employee_id" => $id
            ]);

            $datas = $stmt->fetchAll();
            $response = [
                "success" => true,
                "data" => $datas 
            ];
        } catch (PDOException $e) {
            $response = [
                "success" => false,
                "error" => $e->getMessage()
            ];
            }
            return $response;
    }

?>