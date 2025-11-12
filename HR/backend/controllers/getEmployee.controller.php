<?php
    // include_once __DIR__ . "/../config/database.php";
    require_once __DIR__ . "/../utils/checkDuplicateEmailForEmployee.php";


    function getEmployees($pdo) {
    
        $query = "SELECT * FROM employees";
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

    function getEmployee($id, $pdo) {
        $query = "SELECT * FROM employees WHERE employee_id = :employee_id";
        $queryForEmployeeSchedule = "SELECT 
        e.employee_id,
        e.first_name,
        e.middle_name,
        e.last_name,
        e.position,
        e.department,
        GROUP_CONCAT(
            DISTINCT es.day_of_week 
            ORDER BY 
                FIELD(es.day_of_week, 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday')
            SEPARATOR ', '
        ) AS schedule_days,
        GROUP_CONCAT(
            DISTINCT 
            CASE es.day_of_week
                WHEN 'Monday' THEN 'M'
                WHEN 'Tuesday' THEN 'T'
                WHEN 'Wednesday' THEN 'W'
                WHEN 'Thursday' THEN 'Th'
                WHEN 'Friday' THEN 'F'
                WHEN 'Saturday' THEN 'Sat'
                WHEN 'Sunday' THEN 'Sun'
            END
            ORDER BY 
                FIELD(es.day_of_week, 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday')
            SEPARATOR ', '
        ) AS schedule_pattern,
        CASE 
            -- Weekdays only patterns
            WHEN GROUP_CONCAT(DISTINCT es.day_of_week ORDER BY es.day_of_week) = 'Friday,Monday,Wednesday' 
                THEN 'M/W/F Schedule'
            WHEN GROUP_CONCAT(DISTINCT es.day_of_week ORDER BY es.day_of_week) = 'Saturday,Sunday,Thursday,Tuesday' 
                THEN 'T/Th/Sat/Sun Schedule'
            WHEN GROUP_CONCAT(DISTINCT es.day_of_week ORDER BY es.day_of_week) = 'Friday,Monday,Tuesday,Wednesday,Thursday' 
                THEN 'Weekdays (M-F)'
            WHEN GROUP_CONCAT(DISTINCT es.day_of_week ORDER BY es.day_of_week) = 'Saturday,Sunday' 
                THEN 'Weekend Only'
            WHEN GROUP_CONCAT(DISTINCT es.day_of_week ORDER BY es.day_of_week) = 'Friday,Monday' 
                THEN 'M/F Schedule'
            WHEN GROUP_CONCAT(DISTINCT es.day_of_week ORDER BY es.day_of_week) = 'Thursday,Tuesday' 
                THEN 'T/Th Schedule'
            WHEN GROUP_CONCAT(DISTINCT es.day_of_week ORDER BY es.day_of_week) = 'Friday,Wednesday' 
                THEN 'W/F Schedule'
            WHEN GROUP_CONCAT(DISTINCT es.day_of_week ORDER BY es.day_of_week) = 'Friday,Saturday,Sunday,Thursday,Tuesday,Wednesday' 
                THEN 'Tuesday to Sunday'
            WHEN GROUP_CONCAT(DISTINCT es.day_of_week ORDER BY es.day_of_week) = 'Friday,Monday,Saturday,Sunday,Thursday,Tuesday,Wednesday' 
                THEN 'Full Week (7 days)'
            ELSE 'Custom Schedule'
        END AS schedule_type,
        MIN(es.start_time) AS earliest_start,
        MAX(es.end_time) AS latest_end,
        COUNT(DISTINCT es.day_of_week) AS days_per_week
    FROM employees e
    LEFT JOIN employee_schedules es ON e.employee_id = es.employee_id
    WHERE e.employee_id = :employee_id
    GROUP BY e.employee_id, e.first_name, e.middle_name, e.last_name, e.position, e.department;
    ";
        try {
            $stmt = $pdo->prepare($query);
            $stmt1 = $pdo->prepare($queryForEmployeeSchedule);
            $stmt->execute([
                ":employee_id" => $id
            ]);
            $stmt1->execute([
                ":employee_id" => $id
            ]);

            $datas = $stmt->fetch();
            $datas1 = $stmt1->fetch();
            $response = [
                "success" => true,
                "data" => [$datas, $datas1] 
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