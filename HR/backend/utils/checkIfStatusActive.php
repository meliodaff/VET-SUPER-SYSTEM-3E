<?php

function checkIfStatusActive($userEmail, $pdo){
        $query = "SELECT
COUNT(*) as total
FROM users WHERE email = :email AND status = 'Active'";
        try {
            $stmt = $pdo->prepare($query);
            $stmt->execute([":email" => $userEmail]);
            $row = $stmt->fetch();

            if($row && $row["total"] > 0) {
                $response = [
                    "isStatusActive" => true,
                    "message" => "Email status is active",
                ];
            }else {
                $response = [
                    "isStatusActive" => false,
                    "message" => "Email status is inactive, kindly verify it through your email",
                ];
            }

        } catch (PDOException $e) {
            $response = [
                    "isStatusActive" => false,
                    "message" => "Error: {$e->getMessage()}"
                ];
        }
        return $response;
    }

?>