<?php
    // include_once __DIR__ . "/../config/database.php";
    require_once __DIR__ . "/../utils/checkDuplicateEmailForEmployee.php";

    function insertEmployee($employee, $pdo, $files){

        $isDuplicateEmail = checkDuplicateEmailForEmployee($employee["email"], $pdo);

        if($isDuplicateEmail["isExist"]){
            return $response = [
                "success" => false,
                "message" => $isDuplicateEmail["message"]
            ];
        }

        $targetDirPhoto  = __DIR__ . "/../uploads/photos/";

        if (!is_dir($targetDirPhoto))  mkdir($targetDirPhoto, 0777, true);
        
        $photoName  = uniqid("photo_")  . "_" . basename($files["photo"]["name"]);
        $photoPathAbs  = $targetDirPhoto  . $photoName;
        $photoPathRel  = "uploads/photos/" . $photoName;
      
        if (!move_uploaded_file($files["photo"]["tmp_name"], $photoPathAbs)) {
                return ["success" => false, "message" => "Photo upload failed."];
            }

        

        $query = "INSERT INTO employees (first_name, middle_name, last_name, date_of_birth, gender, contact_email, phone_number, address, profile_image_url ,employment_type, Position, department, password_hash, is_admin) VALUES (:first_name, :middle_name, :last_name, :date_of_birth, :gender, :contact_email, :phone_number, :address, :profile_image_url, :employment_type, :Position, :department, :password_hash, :is_admin)";

        try {
            // i dont think if this is necessary
            $pdo->beginTransaction();
            $stmt = $pdo->prepare($query);
            $hashedPassword = password_hash($employee["password"], PASSWORD_BCRYPT);

            $isInserted = $stmt->execute([
            ":first_name"        => $employee["firstName"],
            ":last_name"         => $employee["lastName"],
            ":middle_name"       => $employee["middleName"] ?? "",
            ":date_of_birth"     => $employee["birthDate"],
            ":gender"            => $employee["gender"],
            ":contact_email"     => $employee["email"],
            ":phone_number"      => $employee["phoneNumber"],
            ":address"           => $employee["address"],
            ":profile_image_url" => $photoPathRel,
            ":employment_type"   => $employee["employmentStatus"],
            ":Position"          => $employee["jobTitle"],
            ":department"        => $employee["department"] ?? "Vet Clinic",
            ":password_hash"     => $hashedPassword,
            ":is_admin"          => 0
             ]);

            if(!$isInserted){
                $pdo->rollBack();
                $response = [
                "success" => false,
                "message" => "Failed to insert new Employee"
             ];
            }

            $lastInsertId = $pdo->lastInsertId();

            $queryToInsertUser = "INSERT INTO users (first_name, middle_name, last_name, email, password, role) VALUES (:first_name, :middle_name, :last_name, :email, :password, :role)";  
            
            $insertUserStms = $pdo->prepare($queryToInsertUser);

            $hasInsertedUser = $insertUserStms->execute([
                ":first_name"  => $employee["firstName"],
                ":middle_name" => $employee["middleName"] ?? "",
                ":last_name"   => $employee["lastName"],
                ":email"       => $employee["email"],
                ":password"    => $hashedPassword,
                ":role"        => $employee["jobTitle"]
            ]);

            $queryToInsertLeave = "INSERT INTO leave_balances (employee_id, leave_type_id, days_allocated, days_taken, days_remaining) VALUES (:employee_id, :leave_type_id, :days_allocated, 0, :days_remaining)";

            $stmtToInsertLeave = $pdo->prepare($queryToInsertLeave);

            $stmtToInsertLeave->execute([
                ":employee_id"   => $lastInsertId,
                ":leave_type_id" => 1,
                ":days_allocated"=> 10,
                ":days_remaining"=> 10
            ]);

            $stmtToInsertLeave->execute([
                ":employee_id"   => $lastInsertId,
                ":leave_type_id" => 2,
                ":days_allocated"=> 10,
                ":days_remaining"=> 10
            ]);

            if($employee["gender"] === "Female") {
                $stmtToInsertLeave->execute([
                    ":employee_id"   => $lastInsertId,
                    ":leave_type_id" => 3,
                    ":days_allocated"=> 105,
                    ":days_remaining"=> 105
                ]);
                
            }
            
            $stmtToInsertLeave->execute([
                ":employee_id"   => $lastInsertId,
                ":leave_type_id" => 4,
                ":days_allocated"=> 7,
                ":days_remaining"=> 7
            ]);
            $stmtToInsertLeave->execute([
                ":employee_id"   => $lastInsertId,
                ":leave_type_id" => 5,
                ":days_allocated"=> 3,
                ":days_remaining"=> 3
            ]);

             
            $pdo->commit(); 
             
            $response = [
                 "success" => true,
                 "message" => "Successfully inserted the employee ID: {$pdo->lastInsertId()}"
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