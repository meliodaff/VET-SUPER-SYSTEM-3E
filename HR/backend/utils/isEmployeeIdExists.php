<?php

function isEmployeeIdExists($id, $pdo){
        $query = "SELECT employee_id, COUNT(*) AS total FROM employees WHERE employee_id = :employee_id";
        try {
            $stmt = $pdo->prepare($query);
            $stmt->execute([":employee_id" => $id]);
            $row = $stmt->fetch();

            if($row && $row["total"] > 0) {
                $response = [
                    "isExist" => true,
                    "message" => "The employee ID exists",
                    "employeeId" => $row["total"] 
                    
                ];
            }else {
                $response = [
                    "isExist" => false,
                    "message" => "The employee ID doesnt exist"
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