<?php

     function getAttendanceRecords($date, $pdo) {
    
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
    AND es.day_of_week = DAYNAME(:date)  -- get day name from parameter
LEFT JOIN time_and_attendance taa
    ON e.employee_id = taa.employee_id
    AND DATE(taa.check_in_time) = :date  -- match the parameter date
ORDER BY e.employee_id;
";
        try {
            $stmt = $pdo->prepare($query);
            $stmt->execute([
                ":date" => $date
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

    function getAttendanceRecord($id, $date, $pdo) {
        $query = "SELECT
e.employee_id,
e.first_name,
e.last_name,
e.department,
e.position,
taa.schedule_day,
taa.check_in_time,
taa.check_out_time,
taa.attendance_status,
taa.notes
FROM employees e
JOIN time_and_attendance taa
ON e.employee_id = taa.employee_id
WHERE e.employee_id = :employee_id AND DATE(taa.check_in_time) = :date
";

        try {
            $stmt = $pdo->prepare($query);
            $stmt->execute([
                ":employee_id" => $id,
                ":date" => $date
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


    function getAttendanceRecordForTheMonth($id, $month, $pdo) {
        $query = "SELECT
e.employee_id,
e.first_name,
e.last_name,
e.department,
e.position,
taa.schedule_day,
TIME(taa.check_in_time) AS check_in_time,
TIME(taa.check_out_time) AS check_out_time,
taa.attendance_status,
taa.notes
FROM employees e
JOIN time_and_attendance taa
ON e.employee_id = taa.employee_id
WHERE e.employee_id = :employee_id AND MONTH(taa.check_in_time) = :month AND YEAR(taa.check_in_time) = YEAR(CURDATE())
";

        try {
            $stmt = $pdo->prepare($query);
            $stmt->execute([
                ":employee_id" => $id,
                ":month" => $month
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


    function getAttendanceSummary($id, $pdo) {
        $queryForPresent = "SELECT
e.employee_id,
COUNT(taa.attendance_status) AS present_count
FROM employees e
JOIN time_and_attendance taa
ON e.employee_id = taa.employee_id
WHERE e.employee_id = :employee_id AND MONTH(taa.check_in_time) = MONTH(CURDATE()) AND YEAR(taa.check_in_time) = YEAR(CURDATE()) 
AND taa.attendance_status = 'Present'
";
        $queryForLate = "SELECT
e.employee_id,
COUNT(taa.attendance_status) AS late_count
FROM employees e
JOIN time_and_attendance taa
ON e.employee_id = taa.employee_id
WHERE e.employee_id = :employee_id AND MONTH(taa.check_in_time) = MONTH(CURDATE()) AND YEAR(taa.check_in_time) = YEAR(CURDATE()) 
AND taa.attendance_status = 'Late'
";
//         $queryForAbsent = "SELECT
// e.employee_id,
// COUNT(taa.attendance_status) AS absent_count
// FROM employees e
// JOIN time_and_attendance taa
// ON e.employee_id = taa.employee_id
// WHERE e.employee_id = :employee_id AND MONTH(taa.schedule_day) = MONTH(CURDATE()) AND YEAR(taa.schedule_day) = YEAR(CURDATE()) 
// AND taa.attendance_status = 'Absent'
// ";

    $currentDate = date('Y-m-01');
    $currentYear = date('Y');
    $currentMonth = date('m');

// -- Generate all days the employee SHOULD work in the current month
        $queryForAbsent = "WITH ScheduledDays AS ( SELECT 
s.employee_id,
DATE_ADD('$currentDate', INTERVAL seq DAY) AS expectedworkdate,
s.day_of_week
FROM employee_schedules s
CROSS JOIN (
SELECT 0 AS seq UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL 
SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL 
SELECT 8 UNION ALL SELECT 9 UNION ALL SELECT 10 UNION ALL SELECT 11 UNION ALL 
SELECT 12 UNION ALL SELECT 13 UNION ALL SELECT 14 UNION ALL SELECT 15 UNION ALL 
SELECT 16 UNION ALL SELECT 17 UNION ALL SELECT 18 UNION ALL SELECT 19 UNION ALL 
SELECT 20 UNION ALL SELECT 21 UNION ALL SELECT 22 UNION ALL SELECT 23 UNION ALL 
SELECT 24 UNION ALL SELECT 25 UNION ALL SELECT 26 UNION ALL SELECT 27 UNION ALL 
SELECT 28 UNION ALL SELECT 29 UNION ALL SELECT 30
) days
WHERE DATE_ADD('$currentDate', INTERVAL seq DAY) <= LAST_DAY('$currentDate')
AND DAYNAME(DATE_ADD('$currentDate', INTERVAL seq DAY)) = s.day_of_week
AND s.employee_id = :employee_id
)
SELECT 
sd.employee_id,
CONCAT(e.first_name, ' ', e.last_name) AS name,
COALESCE(SUM(CASE WHEN ta.schedule_day IS NULL THEN 1 ELSE 0 END), 0) AS misseddays,
COALESCE(SUM(CASE WHEN ta.attendance_status = 'Absent' THEN 1 ELSE 0 END), 0) AS absentdays,
COALESCE(SUM(CASE WHEN ta.schedule_day IS NULL THEN 1 ELSE 0 END), 0) + 
COALESCE(SUM(CASE WHEN ta.attendance_status = 'Absent' THEN 1 ELSE 0 END), 0) AS absent_count
FROM ScheduledDays sd
LEFT JOIN time_and_attendance ta 
ON sd.employee_id = ta.employee_id 
AND sd.expectedworkdate = ta.schedule_day
AND YEAR(ta.schedule_day) = $currentYear 
AND MONTH(ta.schedule_day) = $currentMonth
JOIN employees e 
ON sd.employee_id = e.employee_id
GROUP BY sd.employee_id, e.first_name, e.last_name";

        $queryForApprovedLeave = "SELECT COUNT(*) AS leave_count
FROM leave_requests lr
JOIN employees e
ON lr.employee_id = e.employee_id
WHERE e.employee_id = :employee_id AND lr.status = 'Approved'
";

//         $queryForBalanceLeave = "SELECT
// e.employee_id,
// lb.days_remaining AS leave_remaining
// FROM leave_balances lb
// JOIN employees e
// ON lb.employee_id = e.employee_id
// WHERE e.employee_id  = :employee_id
// ";
        $queryForBalanceLeave = "SELECT
e.employee_id,
lt.type_name,
lb.days_remaining AS leave_remaining
FROM leave_balances lb
JOIN employees e
ON lb.employee_id = e.employee_id
JOIN leave_types lt
ON	lb.leave_type_id = lt.leave_type_id
WHERE e.employee_id  = :employee_id
ORDER BY lt.leave_type_id ASC
";

        try {
            $stmt = $pdo->prepare($queryForPresent);
            $stmt->execute([
                ":employee_id" => $id,
            ]);
            $stmt1 = $pdo->prepare($queryForLate);
            $stmt1->execute([
                ":employee_id" => $id,
            ]);
            $stmt2 = $pdo->prepare($queryForAbsent);
            $stmt2->execute([
                ":employee_id" => $id,
            ]);
            $stmt3 = $pdo->prepare($queryForApprovedLeave);
            $stmt3->execute([
                ":employee_id" => $id,
            ]);
            $stmt4 = $pdo->prepare($queryForBalanceLeave);
            $stmt4->execute([
                ":employee_id" => $id,
            ]);

            $datas = $stmt->fetch();
            $datas1 = $stmt1->fetch();
            $datas2 = $stmt2->fetch();
            $datas3 = $stmt3->fetch();
            $datas4 = $stmt4->fetchAll();
            $response = [
                "success" => true,
                "data" => [
                    "present_count" => $datas['present_count'],
                    "late_count" => $datas1["late_count"],
                    "absent_count" => $datas2["absent_count"],
                    "leave_count" => $datas3["leave_count"],
                    "leave" =>  array_map(function($row) {
                        return [
                            "leave_type" => $row["type_name"],
                            "leave_remaining" => $row["leave_remaining"]
                        ];
                    }, $datas4)
                ]
                ];
                
        } catch (PDOException $e) {
            $response = [
                "success" => false,
                "error" => $e->getMessage()
            ];
            }
            return $response;
    }



    function getAllAttendanceRecord($pdo) {
    
        $query = "SELECT * FROM time_and_attendance";   
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

    function getOverAllAttendancePerMonth($pdo) {
    
//         $query = "SELECT 
//     ROUND(
//         (SUM(CASE 
//             WHEN attendance_status IN ('Present', 'Late', 'On Leave') THEN 1 
//             ELSE 0 
//         END) / COUNT(*)) * 100, 
//     2) AS overall_attendance_percentage
// FROM time_and_attendance
// WHERE MONTH(schedule_day) = MONTH(CURDATE())
// AND YEAR(schedule_day) = YEAR(CURDATE());
// ";

        $query = "SELECT 
    DATE_FORMAT(schedule_day, '%Y-%m') AS month,
    COUNT(*) AS total_records,
    SUM(CASE WHEN attendance_status = 'Absent' THEN 1 ELSE 0 END) AS absent_count,
    SUM(CASE WHEN attendance_status = 'Late' THEN 1 ELSE 0 END) AS late_count,
    COUNT(*) - SUM(CASE WHEN attendance_status = 'Absent' THEN 1 ELSE 0 END) - SUM(CASE WHEN attendance_status = 'Late' THEN 1 ELSE 0 END) AS present_count,
    ROUND(
        ((COUNT(*) - SUM(CASE WHEN attendance_status = 'Absent' THEN 1 ELSE 0 END)) / COUNT(*)) * 100, 
        2
    ) AS overall_attendance_percentage
FROM 
    time_and_attendance
WHERE 
    DATE_FORMAT(schedule_day, '%Y-%m') = DATE_FORMAT(CURDATE(), '%Y-%m')
GROUP BY 
    DATE_FORMAT(schedule_day, '%Y-%m');
";
        try {
            $stmt = $pdo->prepare($query);
            $stmt->execute();

            $datas = $stmt->fetch();
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


   function getAllAttendanceRecordById($id, $pdo) {
    
        $query = "SELECT * FROM time_and_attendance WHERE employee_id = :employee_id";   
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
