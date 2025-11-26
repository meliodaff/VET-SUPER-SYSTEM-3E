<?php

     function getJobApplicants($pdo) {
    
        $query = "SELECT * FROM applicants WHERE NOT status = 'For Interview'";
        try {
            $stmt = $pdo->prepare($query);
            $stmt->execute();

            $datas = $stmt->fetchAll();
            $response = [
                "success" => true,
                "data" => $datas 
            ];
        } catch (PDOException $e) {
            $response = [
                "success" => false,
                "error" => $e->getMessage()
            ];
            }
            return $response;
    }

     function getJobApplicantsForInterview($pdo) {
    
        $query = "SELECT 
a.applicant_id,
a.first_name,
a.last_name,
a.job_applied_for,
a.email,
i.interview_date,
i.interview_time,
i.location,
a.status
FROM applicants a
JOIN interviews i
ON a.applicant_id = i.applicant_id";
        try {
            $stmt = $pdo->prepare($query);
            $stmt->execute();

            $datas = $stmt->fetchAll();
            $response = [
                "success" => true,
                "data" => $datas 
            ];
        } catch (PDOException $e) {
            $response = [
                "success" => false,
                "error" => $e->getMessage()
            ];
            }
            return $response;
    }

    function getJobApplicant($id, $pdo) {
        $query = "SELECT * FROM applicants WHERE applicant_id = :applicant_id";

        try {
            $stmt = $pdo->prepare($query);
            $stmt->execute([
                ":applicant_id" => $id
            ]);

            $datas = $stmt->fetch();
            $response = [
                "success" => true,
                "data" => $datas 
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