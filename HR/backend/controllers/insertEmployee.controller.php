<?php
    // include_once __DIR__ . "/../config/database.php";
    require_once __DIR__ . "/../utils/checkDuplicateEmailForEmployee.php";

    function insertEmployee($employee, $pdo){

        $isDuplicateEmail = checkDuplicateEmailForEmployee($employee["email"], $pdo);

        if($isDuplicateEmail["isExist"]){
            return $response = [
                "success" => false,
                "message" => $isDuplicateEmail["message"]
            ];
        }

        $query = "INSERT INTO employees (first_name, middle_name, last_name, date_of_birth, gender, contact_email, phone_number, address, employment_status, job_title, password_hash, is_admin) VALUES (:first_name, :middle_name, :last_name, :date_of_birth, :gender, :contact_email, :phone_number, :address, :employment_status, :job_title, :password_hash, :is_admin)";

        try {
            // i dont think if this is necessary
            $pdo->beginTransaction();
            $stmt = $pdo->prepare($query);
            $hashedPassword = password_hash($employee["password"], PASSWORD_BCRYPT);

            $isInserted = $stmt->execute([
            ":first_name"        => $employee["firstName"],
            ":last_name"         => $employee["lastName"],
            ":middle_name"         => $employee["middleName"],
            ":date_of_birth"     => $employee["birthDate"],
            ":gender"            => $employee["gender"],
            ":contact_email"     => $employee["email"],
            ":phone_number"      => $employee["phoneNumber"],
            ":address"           => $employee["address"],
            ":employment_status" => $employee["employmentStatus"],
            ":job_title"         => $employee["jobTitle"],
            ":password_hash"     => $hashedPassword,
            ":is_admin"           => $employee["isAdmin"]
             ]);

             if(!$isInserted){
                $pdo->rollBack();
                $response = [
                "success" => false,
                "message" => "Failed to insert new Employee"
             ];
             }

             
            $response = [
                 "success" => true,
                 "message" => "Successfully inserted the employee ID: {$pdo->lastInsertId()}"
                ];

            $pdo->commit(); 
        } catch (PDOException $e) {
            $response = [
                "success" => false,
                "message" => $e->getMessage()
            ];
        }

        return $response;

    }

?>