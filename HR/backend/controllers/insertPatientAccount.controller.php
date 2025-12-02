<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../utils/checkIfEmailExists.php';
require_once __DIR__ . '/../utils/checkIfStatusActive.php';


function insertPatientAccount($pdo, $postData) {
    // Absolute paths for saving
    
        //  $isUserStatusActive = checkIfStatusActive($postData["email"], $pdo);
    
        //     if(!$isUserStatusActive["isStatusActive"]){
        //         return $response = [
        //             "success" => false,
        //             "message" => "Your email is already registered yet inactive. Kindly verify it through your email."
        //         ];
        //     }
            
    $isDuplicateEmail = checkIfEmailExists($postData["email"], $pdo);

    if ($isDuplicateEmail["isExist"]) {
        http_response_code(409);
        return [
            "success" => false,
            "message" => $isDuplicateEmail["message"]
        ];
    }


    try {
        $stmt = $pdo->prepare("
            INSERT INTO users 
                (first_name, middle_name, last_name, email, password, role, status, phone_number) 
            VALUES 
                (:firstName, :middleName, :lastName, :email, :password, 'Patient', 'Active', :phone_number)
        ");

        $hashedPassword = password_hash($postData["password"], PASSWORD_BCRYPT);

        $stmt->execute([
            ':firstName'       => $postData['firstName'],
            ':middleName'       => $postData['middleName'] ?? "",
            ':lastName'        => $postData['lastName'],
            ':email'           => $postData['email'],
            ':password'      => $hashedPassword,  // ✅ relative path
            ':phone_number'      => $postData["phoneNumber"],  // ✅ relative path
        ]);

        return [
            "success" => true,
            "message" => "Patient Account successfully created!"
        ];

    } catch (PDOException $e) {
        return [
            "success" => false,
            "message" => "Database error: " . $e->getMessage()
        ];
    }
}

