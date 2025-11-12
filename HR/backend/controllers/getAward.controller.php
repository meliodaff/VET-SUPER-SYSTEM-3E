<?php

    function getAwards($id, $pdo) {
        $query = "SELECT COUNT(*) as awards_count_for_the_whole_year FROM incentive_awards WHERE YEAR(award_date) = YEAR(CURDATE()) AND employee_id = :employee_id";

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

?>