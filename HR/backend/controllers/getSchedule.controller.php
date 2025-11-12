<?php
    // include_once __DIR__ . "/../config/database.php";
    require_once __DIR__ . "/../utils/checkDuplicateEmailForEmployee.php";


    function getEmployeeSchedules($pdo) {
    
        $query = "SELECT
e.employee_id,
e.department,
e.hire_date,
e.employment_type,
es.day_of_week
FROM employees e
JOIN employee_schedules es
ON	e.employee_id = es.employee_id";

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

    function getEmployeeSchedule($id, $pdo) {
        $query = "SELECT
e.employee_id,
e.department,
e.hire_date,
e.employment_type,
es.day_of_week
FROM employees e
JOIN employee_schedules es
ON	e.employee_id = es.employee_id
WHERE e.employee_id = :employee_id";

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