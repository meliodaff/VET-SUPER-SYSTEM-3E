<?php
    
    require_once __DIR__ . "/../utils/isEmployeeIdExists.php";

    function login($employee, $pdo){

        $iEmployeeIdExists = isEmployeeIdExists($employee["employeeId"], $pdo);

        if(!$iEmployeeIdExists["isExist"]){
            return $response = [
                "success" => false,
                "message" => $iEmployeeIdExists["message"]
            ];
        }

        $query = "SELECT employee_id, password_hash, department, system_role, Position
FROM employees WHERE employee_id = :employee_id";

        try{
            $stmt = $pdo->prepare($query);
            $stmt->execute([
                ":employee_id" => $employee["employeeId"]
            ]);
            
            $employeeInformation = $stmt->fetch();

            // if (password_verify($employee["password"], $employeeInformation["password_hash"])) {
            if ($employee["password"] === $employeeInformation["password_hash"]) {
                $response = [
                "success" => true,
                "message" => "credentials are true"
            ];

            // had to convert it since the employeeInformation has the password
            $employeesInformationForCookie = [
                "employee_id" => $employeeInformation["employee_id"],
                "department" => $employeeInformation["department"],
                "system_role" => $employeeInformation["system_role"],
                "position" => $employeeInformation["Position"],
            ];

            setcookie(
                "user",
                json_encode($employeesInformationForCookie),
                [
                    "expires" => time() + 86400,   // 1 hour from now
                    "path" => "/",                // Available across the whole site
                    "domain" => "",               // Default = current domain
                    "secure" => true,             // Send only over HTTPS
                    "httponly" => true,           // JavaScript cannot access it
                    "samesite" => "Strict"        // Prevent CSRF (Lax/Strict/None)
                ]
            );
            } else {
                $response = [
                "success" => false,
                "message" => "wrong password",
            ];
            }
            
        } catch (PDOException $e) {
            $response = [
                "success" => false,
                "message" => $e->getMessage()
            ];
        }

        return $response;

    }

?>