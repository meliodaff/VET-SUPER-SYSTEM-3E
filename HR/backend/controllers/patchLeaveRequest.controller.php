<?php

function patchLeaveRequest($requestId, $status, $employeeId, $typeOfLeaveId, $pdo) {
    try {
        // Validate status
        $validStatuses = ['Pending', 'Approved', 'Rejected', 'Cancelled'];
        if (!in_array($status, $validStatuses)) {
            return [
                "success" => false,
                "error" => "Invalid status. Allowed values: " . implode(", ", $validStatuses)
            ];
        }

        // Check if leave request exists
        $checkQuery = "SELECT request_id, days_taken FROM leave_requests WHERE request_id = :request_id";
        $checkStmt = $pdo->prepare($checkQuery);
        $checkStmt->execute([":request_id" => $requestId]);
        
        $result = $checkStmt->fetch(PDO::FETCH_ASSOC);

        if ($checkStmt->rowCount() === 0) {
            return [
                "success" => false,
                "error" => "Leave request not found"
            ];
        }

        $leaveDaysTaken = $result['days_taken'] ?? 0;
        // Update the leave request status
        $updateQuery = "UPDATE leave_requests 
                        SET status = :status 
                        WHERE request_id = :request_id";
        
        $updateEmploymentTypeQuery = "UPDATE employees 
                        SET employment_type = 'On Leave' 
                        WHERE employee_id = :employee_id";
        
        $query2 = "UPDATE leave_balances SET days_remaining = days_remaining - {$leaveDaysTaken} WHERE employee_id = :employee_id AND leave_type_id = :leave_type_id";

        $stmt2 = $pdo->prepare($query2);

        $decrementLeaveBalancesResponse = $stmt2->execute([ 
            ":employee_id" => $employeeId,
            ":leave_type_id" => $typeOfLeaveId
            ]);

            $query3 = "UPDATE leave_balances SET days_taken = days_taken + {$leaveDaysTaken} WHERE employee_id = :employee_id AND leave_type_id = :leave_type_id"; 

            $stmt3 = $pdo->prepare($query3);

            if($stmt2->rowCount() <= 0){
            $response = [
                "success" => false,
                "message" => "The decremention of the leave balances failed but the leave request might went in"
            ];
            }
            
            $incrementDaysTaken = $stmt3->execute([
                ":employee_id" => $employeeId,
            ":leave_type_id" => $typeOfLeaveId
            ]);
            
            if($stmt3->rowCount() <= 0){
                $response = [
                    "success" => false,
                    "message" => "The incrementation of the days taken failed but the leave request might went in"
                ];
            }
        $updateStmt = $pdo->prepare($updateQuery);
        $updateStmt->execute([
            ":status" => $status,
            ":request_id" => $requestId
        ]);
        $updateStmt1 = $pdo->prepare($updateEmploymentTypeQuery);
        $updateStmt1->execute([
            ":employee_id" => $employeeId
        ]);

        return [
            "success" => true,
            "data" => [
                "request_id" => $requestId,
                "new_status" => $status,
                "leaveDaysTaken" => $leaveDaysTaken
            ]
        ];

    } catch (PDOException $e) {
        return [
            "success" => false,
            "error" => $e->getMessage()
        ];
    }
}

?>