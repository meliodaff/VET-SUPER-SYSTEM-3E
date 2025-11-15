<?php

// ADD SCHEDULE DAY
function addScheduleDay($employeeId, $dayOfWeek, $pdo) {
    try {
        // Validate day of week
        $validDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        if (!in_array($dayOfWeek, $validDays)) {
            return [
                "success" => false,
                "error" => "Invalid day. Allowed values: " . implode(", ", $validDays)
            ];
        }

        // Check if schedule already exists
        $checkQuery = "SELECT COUNT(*) as count 
                       FROM employee_schedules 
                       WHERE employee_id = :employee_id AND day_of_week = :day_of_week";
        $checkStmt = $pdo->prepare($checkQuery);
        $checkStmt->execute([
            ":employee_id" => $employeeId,
            ":day_of_week" => $dayOfWeek
        ]);
        
        $result = $checkStmt->fetch(PDO::FETCH_ASSOC);
        if ($result['count'] > 0) {
            return [
                "success" => false,
                "error" => "Schedule already exists for this day"
            ];
        }

        // Check if employee exists
        $employeeQuery = "SELECT employee_id FROM employees WHERE employee_id = :employee_id";
        $employeeStmt = $pdo->prepare($employeeQuery);
        $employeeStmt->execute([":employee_id" => $employeeId]);
        
        if ($employeeStmt->rowCount() === 0) {
            return [
                "success" => false,
                "error" => "Employee not found"
            ];
        }

        // Insert new schedule (start_time and end_time can be NULL or default values)
        $insertQuery = "INSERT INTO employee_schedules 
                        (employee_id, day_of_week, start_time, end_time) 
                        VALUES (:employee_id, :day_of_week, '09:00', '17:00')";
        
        $insertStmt = $pdo->prepare($insertQuery);
        $insertStmt->execute([
            ":employee_id" => $employeeId,
            ":day_of_week" => $dayOfWeek
        ]);

        return [
            "success" => true,
            "message" => "Schedule added successfully",
            "data" => [
                "employee_id" => $employeeId,
                "day_of_week" => $dayOfWeek
            ]
        ];

    } catch (PDOException $e) {
        return [
            "success" => false,
            "error" => $e->getMessage()
        ];
    }
}

// REMOVE SCHEDULE DAY
function removeScheduleDay($employeeId, $dayOfWeek, $pdo) {
    try {
        // Check if schedule exists
        $checkQuery = "SELECT schedule_id 
                       FROM employee_schedules 
                       WHERE employee_id = :employee_id AND day_of_week = :day_of_week";
        $checkStmt = $pdo->prepare($checkQuery);
        $checkStmt->execute([
            ":employee_id" => $employeeId,
            ":day_of_week" => $dayOfWeek
        ]);
        
        if ($checkStmt->rowCount() === 0) {
            return [
                "success" => false,
                "error" => "Schedule not found"
            ];
        }

        // Delete the schedule
        $deleteQuery = "DELETE FROM employee_schedules 
                        WHERE employee_id = :employee_id AND day_of_week = :day_of_week";
        
        $deleteStmt = $pdo->prepare($deleteQuery);
        $deleteStmt->execute([
            ":employee_id" => $employeeId,
            ":day_of_week" => $dayOfWeek
        ]);

        return [
            "success" => true,
            "message" => "Schedule day removed successfully",
            "data" => [
                "employee_id" => $employeeId,
                "day_of_week" => $dayOfWeek,
                "deleted" => true
            ]
        ];

    } catch (PDOException $e) {
        return [
            "success" => false,
            "error" => $e->getMessage()
        ];
    }
}

// GET ALL SCHEDULES
// function getSchedules($pdo) {
//     try {
//         $query = "SELECT 
//                     es.schedule_id,
//                     es.employee_id,
//                     es.day_of_week,
//                     es.start_time,
//                     es.end_time,
//                     e.first_name,
//                     e.last_name,
//                     e.position,
//                     e.department,
//                     e.hire_date,
//                     e.employment_type
//                   FROM employee_schedules es
//                   INNER JOIN employees e ON es.employee_id = e.employee_id
//                   ORDER BY es.employee_id, 
//                     CASE es.day_of_week
//                       WHEN 'Monday' THEN 1
//                       WHEN 'Tuesday' THEN 2
//                       WHEN 'Wednesday' THEN 3
//                       WHEN 'Thursday' THEN 4
//                       WHEN 'Friday' THEN 5
//                       WHEN 'Saturday' THEN 6
//                       WHEN 'Sunday' THEN 7
//                     END";
        
//         $stmt = $pdo->prepare($query);
//         $stmt->execute();
        
//         $schedules = $stmt->fetchAll(PDO::FETCH_ASSOC);

//         return [
//             "success" => true,
//             "data" => $schedules
//         ];

//     } catch (PDOException $e) {
//         return [
//             "success" => false,
//             "error" => $e->getMessage()
//         ];
//     }
// }

// DELETE ALL SCHEDULES FOR AN EMPLOYEE
function deleteAllEmployeeSchedules($employeeId, $pdo) {
    try {
        // Check if employee has any schedules
        $checkQuery = "SELECT COUNT(*) as count 
                       FROM employee_schedules 
                       WHERE employee_id = :employee_id";
        $checkStmt = $pdo->prepare($checkQuery);
        $checkStmt->execute([":employee_id" => $employeeId]);
        
        $result = $checkStmt->fetch(PDO::FETCH_ASSOC);
        if ($result['count'] == 0) {
            return [
                "success" => false,
                "error" => "No schedules found for this employee"
            ];
        }

        // Delete all schedules
        $deleteQuery = "DELETE FROM employee_schedules WHERE employee_id = :employee_id";
        $deleteStmt = $pdo->prepare($deleteQuery);
        $deleteStmt->execute([":employee_id" => $employeeId]);

        return [
            "success" => true,
            "message" => "All schedules deleted successfully",
            "data" => [
                "employee_id" => $employeeId,
                "records_deleted" => $result['count']
            ]
        ];

    } catch (PDOException $e) {
        return [
            "success" => false,
            "error" => $e->getMessage()
        ];
    }
}

?>