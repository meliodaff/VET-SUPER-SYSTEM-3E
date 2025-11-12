<?php

function isRFIDExists($rfid, $pdo){
        $query = "SELECT CONCAT(first_name, ' ', last_name) AS full_name, COUNT(rfid) AS total, employee_id FROM employees WHERE rfid = :rfid";
        try {
            $stmt = $pdo->prepare($query);
            $stmt->execute([":rfid" => $rfid]);
            $row = $stmt->fetch();

            if($row && $row["total"] > 0) {
                $response = [
                    "isExist" => true,
                    "message" => "The employee ID exists",
                    "full_name" => $row["full_name"],
                    "employeeId" => $row["employee_id"]
                    
                ];
            }else {
                $response = [
                    "isExist" => false,
                    "message" => "The RFID is not registered"
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