<?php

// ADD SCHEDULE DAY
function postIncentiveAward($incentiveDetails, $pdo) {
    try {
        // Validate day of week
        // Check if schedule already exists
        $query = "INSERT INTO incentive_awards (employee_id, incentive_id, performance_review_id, award_date, bonus, notes, is_claimed, claimed_date, status)
        VALUES (:employee_id, :incentive_id, :performance_review_id, :award_date, :bonus, :notes, :is_claimed, :claimed_date, :status)";
        $stmt = $pdo->prepare($query);
        $stmt->execute([
            ":employee_id" => $incentiveDetails["employee_id"],
            ":incentive_id" => $incentiveDetails["incentive_id"],
            ":performance_review_id" => $incentiveDetails["performance_review_id"],
            ":award_date" => $incentiveDetails["award_date"],
            ":bonus" => $incentiveDetails["bonus"],
            ":notes" => $incentiveDetails["notes"],
            ":is_claimed" => $incentiveDetails["is_claimed"],
            ":claimed_date" => $incentiveDetails["claimed_date"] ?? null,
            ":status" => $incentiveDetails["status"],
        ]);

        return [
            "success" => true,
            "message" => "Incentive awards added successfully",
        ];

    } catch (PDOException $e) {
        return [
            "success" => false,
            "error" => $e->getMessage()
        ];
    }
}


?>