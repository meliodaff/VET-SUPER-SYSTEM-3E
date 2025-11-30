<?php

// ADD SCHEDULE DAY
function postPerformanceReviews($performanceReviews, $pdo) {
    try {
        // Validate day of week
        // Check if schedule already exists
        $query = "INSERT INTO performance_reviews (employee_id, reviewer_id, review_date, review_score, comments)
        VALUES (:employee_id, :reviewer_id, :review_date, :review_score, :comments)";
        $stmt = $pdo->prepare($query);
        $stmt->execute([
            ":employee_id" => $performanceReviews["employee_id"],
            ":reviewer_id" => $performanceReviews["reviewer_id"],
            ":review_date" => $performanceReviews["review_date"],
            ":review_score" => $performanceReviews["review_score"],
            ":comments" => $performanceReviews["comments"],
        ]);

        return [
            "success" => true,
            "message" => "Performance reviews added successfully",
        ];

    } catch (PDOException $e) {
        return [
            "success" => false,
            "error" => $e->getMessage()
        ];
    }
}


?>