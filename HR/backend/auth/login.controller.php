<?php
    
    require_once __DIR__ . "/../utils/checkIfEmailExists.php";
    require_once __DIR__ . "/../utils/checkIfStatusActive.php";
    session_start();
    function login($user, $pdo){

        $iEmployeeEmailExists = checkIfEmailExists($user["email"], $pdo);

        if(!$iEmployeeEmailExists["isExist"]){
            return $response = [
                "success" => false,
                "message" => $iEmployeeEmailExists["message"]
            ];
        }
        // if (password_verify($employee["password"], $employeeInformation["password_hash"])) {
      
        // $isUserStatusActive = checkIfStatusActive($user["email"], $pdo);

        // if(!$isUserStatusActive["isStatusActive"]){
        //     return $response = [
        //         "success" => false,
        //         "message" => $isUserStatusActive["message"]
        //     ];
        // }
        
        $query = "SELECT * FROM users WHERE email = :email";

        try{
            $stmt = $pdo->prepare($query);
            $stmt->execute([
                ":email" => $user["email"]
            ]);
            
            $userInformation = $stmt->fetch();


            if (password_verify($user["password"], $userInformation["password"])) {
        $response = [
        "success" => true,
        "message" => "credentials are true"
    ];
    } else {
        $response = [
        "success" => false,
        "message" => "wrong password",
    ];
        }

            if($userInformation["role"] === "Patient"){
                $userInformationForCookie = [
                    "user_id" => $userInformation["user_id"],
                    "email" => $userInformation["email"],
                    "role" => $userInformation["role"],
                    "firstName" => $userInformation["first_name"],
                    "lastName" => $userInformation["last_name"],
                ];
                $_SESSION["user_id"] = $userInformation["user_id"];
                $_SESSION["email"] = $userInformation["email"];
                $_SESSION["role"] = $userInformation["role"];
                $_SESSION["firstName"] = $userInformation["first_name"];
                $_SESSION["lastName"] = $userInformation["last_name"];
            } else {
                $queryToFetchEmployeeInformation = "SELECT * FROM employees WHERE contact_email = :contact_email";
                $stmtForEmployeeInformation = $pdo->prepare($queryToFetchEmployeeInformation);
                $stmtForEmployeeInformation->execute([
                    ":contact_email" => $user["email"]
                ]);
                $employeeInformation = $stmtForEmployeeInformation->fetch();

                $employeeInformationForCookie = [
                    "employee_id" => $employeeInformation["employee_id"],
                    "email" => $employeeInformation["contact_email"],
                    "role" => $employeeInformation["Position"],
                    "department" => $employeeInformation["department"],
                    "firstName" => $employeeInformation["first_name"],
                    "lastName" => $employeeInformation["last_name"],
                    "photo" => $employeeInformation["profile_image_url"],
                ];
                $_SESSION["user_id"] = $employeeInformation["employee_id"];
                $_SESSION["email"] = $employeeInformation["contact_email"];
                $_SESSION["role"] = $employeeInformation["Position"];
                $_SESSION["department"] = $employeeInformation["department"];
                $_SESSION["firstName"] = $employeeInformation["first_name"];
                $_SESSION["lastName"] = $employeeInformation["last_name"];
                $_SESSION["photo"] = $employeeInformation["profile_image_url"];
            }



            setcookie(
                "user",
                json_encode($userInformationForCookie ?? $employeeInformationForCookie),
                [
                    "expires" => time() + 86400,   // 1 hour from now
                    "path" => "/",                // Available across the whole site
                    "domain" => "",               // Default = current domain
                    "secure" => true,             // Send only over HTTPS
                    "httponly" => false,           // JavaScript cannot access it
                    "samesite" => "Strict"        // Prevent CSRF (Lax/Strict/None)
                ]
            );
            
        } catch (PDOException $e) {
            $response = [
                "success" => false,
                "message" => $e->getMessage()
            ];
        }

        return $response;

    }

?>