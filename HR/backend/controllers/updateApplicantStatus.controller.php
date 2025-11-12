<?php

     
    function updateApplicantStatus($id, $status, $pdo) {
        $query = "UPDATE applicants SET status = :status WHERE applicant_id = :applicant_id ";

        try {
            $stmt = $pdo->prepare($query);
            $stmt->execute([
                ":applicant_id" => $id,
                ":status" => $status
            ]);

            $response = [
                "success" => true,
                "message" => "Updated successfully" 
            ];
        } catch (PDOException $e) {
            $response = [
                "success" => false,
                "error" => $e->getMessage()
            ];
            }
            return $response;
    }

?>