<?php

     function getPerformanceReviews($pdo) {
    
        $query = "SELECT
pr.review_id,
e.employee_id,
e1.employee_id AS reviewer_id,
e.first_name AS employee_first_name,
e.last_name AS employee_last_name,
CONCAT(e.first_name, ' ', e.last_name) AS employee_full_name,
CONCAT(e1.first_name, ' ', e1.last_name) AS reviewer_full_name,
e1.first_name AS reviewer_first_name,
e1.last_name AS reviewer_last_name,
e.hire_date,
e.department AS employee_department,
e.Position as employee_position,
e1.Position as reviewer_position,
e1.Position as reviewer_position,
pr.review_date,
pr.review_score,
pr.comments
FROM performance_reviews pr
JOIN employees e
ON pr.employee_id = e.employee_id
JOIN employees e1
ON pr.reviewer_id = e1.employee_id
WHERE YEAR(review_date) = YEAR(CURDATE()) AND MONTH(review_date) = MONTH(CURDATE())";

        try {
            $stmt = $pdo->prepare($query);
            $stmt->execute();

            $datas = $stmt->fetchAll();
            $response = [
                "success" => true,
                "message" => "Incentive awards successfully fetched",
                "data" => $datas 
            ];
        } catch (PDOException $e) {
            $response = [
                "success" => false,
                "message" => "Incentive awards failed to fetch",
                "error" => $e->getMessage()
            ];
            }
            return $response;
    }

    

?>