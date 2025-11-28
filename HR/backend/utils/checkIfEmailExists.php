<?php

function checkIfEmailExists($email, $pdo){
        $query = "SELECT COUNT(*) AS total FROM users WHERE email = :email";
        try {
            $stmt = $pdo->prepare($query);
            $stmt->execute([":email" => $email]);
            $isExist = $stmt->fetch();

            if($isExist && $isExist["total"] > 0) {
                $response = [
                    "isExist" => true,
                    "message" => "$email: Email existing"

                ];
            }else {
                $response = [
                    "isExist" => false,
                    "message" => "$email: Email not existing"
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