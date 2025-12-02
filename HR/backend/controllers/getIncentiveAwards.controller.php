<?php

     function getIncentiveAwards($pdo) {
    
        $query = "SELECT * FROM incentive_awards WHERE YEAR(award_date) = YEAR(CURDATE()) AND MONTH(award_date) = MONTH(CURDATE()) AND status = 'Pending Approval'";
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

    function getIncentiveAwardsForTheMonth($pdo) {
    
        $query = "SELECT 
ia.award_id,
i.incentive_id,
CONCAT(e.first_name, ' ', e.last_name) AS name,
i.incentive_name AS reward,
ia.award_date AS dateAwarded,
ia.bonus AS awardBonus,
ia.status
FROM incentive_awards ia 
JOIN employees e
ON ia.employee_id = e.employee_id
JOIN incentives i
ON ia.incentive_id = i.incentive_id
WHERE YEAR(award_date) = YEAR(CURDATE()) AND MONTH(award_date) = MONTH(CURDATE()) AND status = 'Pending Approval'";
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


    



    

?>