<?php

function getPhoto($employeeId, $pdo){
        $query = "SELECT profile_image_url, COUNT(*) AS total FROM employees WHERE employee_id = :employee_id
";
        try {
            $stmt = $pdo->prepare($query);
            $stmt->execute([":employee_id" => $employeeId]);
            $row = $stmt->fetch();

            if($row && $row["total"] > 0) {
                $response = [
                    "isDone" => true,
                    "message" => "Heres the photo",
                    "profile_image_url" => $row["profile_image_url"]
                ];
            }else {
                $response = [
                    "isDone" => false,
                    "message" => "Theres no photo"
                ];
            }

        } catch (PDOException $e) {
            $response = [
                    "isDone" => false,
                    "message" => "Error: {$e->getMessage()}"
                ];
        }
        return $response;
    }

?>