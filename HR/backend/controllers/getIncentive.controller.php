<?php

     function getIncentives($isClaim, $pdo) {
    
        $query = "SELECT
e.employee_id,
i.incentive_id,
CONCAT(e.first_name, ' ', e.last_name) AS name,
i.incentive_name,
i.description,
ia.notes,
ia.bonus,
ia.award_date,
ia.claimed_date,
ia.status,
ia.is_claimed
FROM incentive_awards ia
JOIN employees e
ON ia.employee_id = e.employee_id
JOIN incentives i
ON ia.incentive_id = i.incentive_id
WHERE is_claimed = :is_claim";
        try {
            $stmt = $pdo->prepare($query);
            $stmt->execute([
                "is_claim" => $isClaim
            ]);

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
    
    function getIncentive($id, $pdo) {
        $query = "SELECT
e.employee_id,
i.incentive_id,
CONCAT(e.first_name, ' ', e.last_name) AS name,
i.incentive_name,
i.description,
ia.notes,
ia.bonus,
ia.award_date,
ia.status,
ia.is_claimed
FROM incentive_awards ia
JOIN employees e
ON ia.employee_id = e.employee_id
JOIN incentives i
ON ia.incentive_id = i.incentive_id
WHERE e.employee_id = :employee_id
";

try {
    $stmt = $pdo->prepare($query);
    $stmt->execute([
        ":employee_id" => $id
    ]);
    
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
    function getAllIncentivesForTheMonth($pdo) {
        $query = "SELECT
e.employee_id,
e.profile_image_url,
i.incentive_id,
CONCAT(e.first_name, ' ', e.last_name) AS name,
i.incentive_name,
i.description,
ia.notes,
ia.bonus,
ia.award_date,
ia.status,
ia.is_claimed
FROM incentive_awards ia
JOIN employees e
ON ia.employee_id = e.employee_id
JOIN incentives i
ON ia.incentive_id = i.incentive_id
WHERE YEAR(ia.award_date) = YEAR(CURDATE())
AND MONTH(ia.award_date) = MONTH(CURDATE())
";

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

    function getTotalIncentivesGivenPerMonth($pdo) {
        $query = "SELECT 
    SUM(
        CAST(
            REPLACE(REPLACE(bonus, '₱', ''), ',', '') 
            AS DECIMAL(10,2)
        )
    ) AS total_incentives_value
FROM incentive_awards
WHERE status = 'Claimed' AND YEAR(award_date) = YEAR(CURDATE()) AND MONTH(award_date) = MONTH(CURDATE())
  AND bonus REGEXP '^₱[0-9,]+';
";

try {
    $stmt = $pdo->prepare($query);
    $stmt->execute();
    
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



 function getTopPerformer($pdo) {
        $query = "SELECT 
    e.employee_id,
    e.first_name,
    e.last_name,
    e.department,
    e.position,
    pr_avg.avg_review_score,
    taa_hours.total_hours,
    -- Combined score
    ROUND((COALESCE(pr_avg.avg_review_score, 0) * 0.6) + 
    (COALESCE(taa_hours.total_hours, 0) * 0.4), 2) as performance_score
FROM employees e
LEFT JOIN (
    SELECT 
        employee_id,
        ROUND(AVG(review_score), 2) as avg_review_score
    FROM performance_reviews
    WHERE MONTH(review_date) = MONTH(CURDATE())
      AND YEAR(review_date) = YEAR(CURDATE())
    GROUP BY employee_id
) pr_avg ON e.employee_id = pr_avg.employee_id
LEFT JOIN (
    SELECT 
        employee_id,
        SUM(
            CASE 
                WHEN attendance_status IN ('Present', 'Late') THEN
                    -- Cap end time at 17:00 (5 PM)
                    LEAST(17, HOUR(check_out_time))
                    -
                    -- Start time calculation based on 9 AM base
                    CASE
                        -- If check-in hour is before 9 AM, start at 9 AM
                        WHEN HOUR(check_in_time) < 9 THEN 9
                        -- If check-in is at 9:00-9:14, start at 9 AM
                        WHEN HOUR(check_in_time) = 9 AND MINUTE(check_in_time) < 15 THEN 9
                        -- If check-in is 9:15 or later in the 9 o'clock hour, start at 10 AM
                        WHEN HOUR(check_in_time) = 9 AND MINUTE(check_in_time) >= 15 THEN 10
                        -- For any hour after 9, if seconds/minutes > 0, round up to next hour
                        WHEN HOUR(check_in_time) > 9 AND (MINUTE(check_in_time) > 0 OR SECOND(check_in_time) > 0) 
                            THEN HOUR(check_in_time) + 1
                        -- Exactly on the hour (10:00:00, 11:00:00, etc.)
                        ELSE HOUR(check_in_time)
                    END
                ELSE 0
            END
        ) as total_hours
    FROM time_and_attendance
    WHERE MONTH(schedule_day) = MONTH(CURDATE())
      AND YEAR(schedule_day) = YEAR(CURDATE())
    GROUP BY employee_id
) taa_hours ON e.employee_id = taa_hours.employee_id
ORDER BY performance_score DESC

";

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