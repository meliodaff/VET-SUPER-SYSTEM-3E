<?php

function patchLeaveRequest($requestId, $status, $employeeId, $pdo) {
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
        $checkQuery = "SELECT request_id FROM leave_requests WHERE request_id = :request_id";
        $checkStmt = $pdo->prepare($checkQuery);
        $checkStmt->execute([":request_id" => $requestId]);
        
        if ($checkStmt->rowCount() === 0) {
            return [
                "success" => false,
                "error" => "Leave request not found"
            ];
        }

        // Update the leave request status
        $updateQuery = "UPDATE leave_requests 
                        SET status = :status 
                        WHERE request_id = :request_id";
        
        $updateEmploymentTypeQuery = "UPDATE employees 
                        SET employment_type = 'On Leave' 
                        WHERE employee_id = :employee_id";
        
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
            "message" => "Leave request status updated successfully",
            "data" => [
                "request_id" => $requestId,
                "new_status" => $status
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