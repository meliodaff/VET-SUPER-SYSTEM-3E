<?php

     function getAppointments($pdo) {
    
        $query = "SELECT * FROM book_appointment";
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

   

function getAppointment($employeeId, $pdoAppointment, $pdoUsers) {
    // 1) Fetch appointments for this doctor (today onwards)
    $qAppt = "
        SELECT 
            id, user_id, doctor_id, fname, phone, email, vetdoc, pet_name,
            date, time, service, service_price, status, date_create, date_update
        FROM book_appointment
        WHERE doctor_id = :employee_id
          AND date >= CURDATE()
        ORDER BY date ASC, time ASC
    ";

    try {
        $stmtAppt = $pdoAppointment->prepare($qAppt);
        $stmtAppt->execute([":employee_id" => $employeeId]);
        $appointments = $stmtAppt->fetchAll(PDO::FETCH_ASSOC);

        // Early return if no appointments
        if (empty($appointments)) {
            return [
                "success" => true,
                "data"    => []
            ];
        }

        // 2) Collect distinct user_ids from appointments
        $userIds = array_unique(array_column($appointments, 'user_id'));

        // 3) Build placeholders for IN (...)
        $placeholders = [];
        $params = [];
        foreach ($userIds as $i => $uid) {
            $ph = ":u{$i}";
            $placeholders[] = $ph;
            $params[$ph] = $uid;
        }

        // 4) Fetch users in one query from the users DB
        // Note: If $userIds is empty, skip this block
        $usersById = [];
        if (!empty($placeholders)) {
            $qUsers = "
                SELECT 
                    user_id, first_name, middle_name, last_name, 
                    email AS user_email, phone_number AS user_phone, role, status
                FROM users
                WHERE user_id IN (" . implode(',', $placeholders) . ")
            ";
            $stmtUsers = $pdoUsers->prepare($qUsers);
            $stmtUsers->execute($params);
            $users = $stmtUsers->fetchAll(PDO::FETCH_ASSOC);

            // Index users by user_id
            foreach ($users as $u) {
                $usersById[$u['user_id']] = $u;
            }
        }

        // 5) Merge user info into each appointment row
        $result = [];
        foreach ($appointments as $appt) {
            $u = $usersById[$appt['user_id']] ?? null;

            $result[] = array_merge(
                $appt,
                [
                    // Safely mapped user fields; null if not found
                    "user_first_name" => $u['first_name'] ?? null,
                    "user_middle_name"=> $u['middle_name'] ?? null,
                    "user_last_name"  => $u['last_name'] ?? null,
                    "user_email"      => $u['user_email'] ?? null,
                    "user_phone"      => $u['user_phone'] ?? null,
                    "user_role"       => $u['role'] ?? null,
                    "user_status"     => $u['status'] ?? null,
                ]
            );
        }

        return [
            "success" => true,
            "data"    => $result
        ];
    } catch (PDOException $e) {
        return [
            "success" => false,
            "error"   => $e->getMessage()
        ];
    }
}



    

?>