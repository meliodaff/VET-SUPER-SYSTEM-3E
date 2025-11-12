<?php

function checkDuplicateEmailForEmployee($email, $pdo){
        $query = "SELECT COUNT(*) AS total FROM employees WHERE contact_email = :contact_email";
        try {
            $stmt = $pdo->prepare($query);
            $stmt->execute([":contact_email" => $email]);
            $isExist = $stmt->fetch();

            if($isExist && $isExist["total"] > 0) {
                $response = [
                    "isExist" => true,
                    "message" => "$email: Email already existing"

                ];
            }else {
                $response = [
                    "isExist" => false,
                ];

            }

        } catch (PDOException $e) {
            $response = [
                    "isExist" => false,
                    "message" => "Error: {$e->getMessage()}"
                ];
        }
        return $response;
    }

?>