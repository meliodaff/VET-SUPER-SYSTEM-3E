<?php
    include_once __DIR__ . "/../config/database.php";
    // require_once __DIR__ . "/../utils/checkDuplicateEmailForEmployee.php";
    require_once __DIR__ . "/../utils/checkLeaveRequestBalance.php";
    function insertLeaveRequest($pdo, $leaveDetails, $files){

        
        if(!$files){
            return [
                "success" => false,
                "message" => "Documenting support missing"
            ];
        }

        $hasRequestBalance = checkLeaveRequestBalance($leaveDetails["employeeId"], $pdo);

        if(!$hasRequestBalance["canRequest"]){
            http_response_code(403);
            return [
                "success" => false,
                "message" => $hasRequestBalance["message"]
            ];
        }

        $hasRequestPending = checkLeaveRequestPending($leaveDetails["employeeId"], $pdo);

        if($hasRequestPending["hasPending"]){
            http_response_code(403);
            return [
                "success" => false,
                "message" => $hasRequestPending["message"]
            ];
        }

        $targetDirDocument = __DIR__ . "/../uploads/supportingDocuments/";

    // Ensure folders exist
    if (!is_dir($targetDirDocument))  mkdir($targetDirDocument, 0777, true);

        $documentName  = uniqid("photo_")  . "_" . basename($files["attachmentUrl"]["name"]);
        $documentPathAbs  = $targetDirDocument  . $documentName;

        $documentPathRel  = "uploads/supportingDocuments/" . $documentName;

        if (!move_uploaded_file($files["attachmentUrl"]["tmp_name"], $documentPathAbs)) {
        return ["success" => false, "message" => "Document upload failed."];
    }

        $query = "INSERT INTO leave_requests (employee_id, leave_type_id, start_date, end_date, status, reason_detail, submission_date, attachment_url)
VALUES (:employee_id, :leave_type_id, :start_date, :end_date, 'Pending', :reason_detail, NOW(), :attachment_url)
";

        try {
            $pdo->beginTransaction();
            $stmt = $pdo->prepare($query);

            $isInserted = $stmt->execute([
            ":employee_id"        => $leaveDetails["employeeId"],
            ":leave_type_id"      => $leaveDetails["leaveTypeId"],
            ":start_date"         => $leaveDetails["startDate"],
            ":end_date"           => $leaveDetails["endDate"],
            ":reason_detail"      => $leaveDetails["reasonDetail"],
            ":attachment_url"     => $documentPathRel,
          
             ]);

             if(!$isInserted){
                $pdo->rollBack();
                $response = [
                "success" => false,
                "message" => "Failed to insert new Request Leave"
             ];
             }

             $query2 = "UPDATE leave_balances SET days_remaining = days_remaining - 1 WHERE employee_id = :employee_id AND leave_type_id = :leave_type_id";

             $stmt2 = $pdo->prepare($query2);


             // this should decrement on how many days the user has intended to take the leave
             // and this shouldnt decrement immediately, it should be decremented once the request was approved
             $decrementLeaveBalancesResponse = $stmt2->execute([ 
                ":employee_id" => $leaveDetails["employeeId"],
                ":leave_type_id" => $leaveDetails["leaveTypeId"]
             ]);

             $query3 = "UPDATE leave_balances SET days_taken = days_taken + 1 WHERE employee_id = :employee_id AND leave_type_id = :leave_type_id"; 

             $stmt3 = $pdo->prepare($query3);

             if($stmt2->rowCount() <= 0){
                $response = [
                    "success" => false,
                    "message" => "The decremention of the leave balances failed but the leave request might went in"
                ];
             }
             
             $incrementDaysTaken = $stmt3->execute([
                 ":employee_id" => $leaveDetails["employeeId"],
                ":leave_type_id" => $leaveDetails["leaveTypeId"]
                ]);
                
                if($stmt3->rowCount() <= 0){
                   $response = [
                       "success" => false,
                       "message" => "The incrementation of the days taken failed but the leave request might went in"
                   ];
                }

                // i think this architecture is not good

             
            $response = [
                 "success" => true,
                 "message" => "Successfully inserted the leave request ID for employee ID: {$leaveDetails["employeeId"]}"
                ];

            $pdo->commit(); 
        } catch (PDOException $e) {
            $response = [
                "success" => false,
                "message" => $e->getMessage()
            ];
        }

        return $response;

    }

?>