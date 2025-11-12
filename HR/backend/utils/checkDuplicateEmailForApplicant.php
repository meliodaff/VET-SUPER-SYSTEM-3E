<?php

function checkDuplicateEmailForApplicant($email, $pdo){
        $query = "SELECT COUNT(*) AS total FROM applicants WHERE email = :email";
        try {
            $stmt = $pdo->prepare($query);
            $stmt->execute([":email" => $email]);
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