<?php

function patchIncentiveAward($incentiveAward, $pdo) {
    try {

        $query = "UPDATE incentive_awards SET status = :status WHERE award_id = :award_id";

        $checkStmt = $pdo->prepare($query);
        $checkStmt->execute([
            ":status" => $incentiveAward['status'],
            ":award_id" => $incentiveAward['award_id'],
        ]);
        
        if ($checkStmt->rowCount() === 0) {
            return [
                "success" => false,
                "error" => "Incentive Award not found"
            ];
        }

        return [
            "success" => true,
            "message" => "Incentive Award updated successfully",
        ];

    } catch (PDOException $e) {
        return [
            "success" => false,
            "error" => $e->getMessage()
        ];
    }
}

?>