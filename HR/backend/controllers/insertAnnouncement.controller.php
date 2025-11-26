<?php
    // include_once __DIR__ . "/../config/database.php";

    function insertAnnouncement($announcementDetails, $pdo){


        $query = "INSERT INTO announcements (title, content, type, start_date, end_date, meeting_date, meeting_time_start, meeting_time_end, location, status) VALUES (:title, :content, :type, :start_date, :end_date, :meeting_date, :meeting_time_start, :meeting_time_end, :location, 'Active') ";

        try {
            $stmt = $pdo->prepare($query);

            $isInserted = $stmt->execute([
                ":title" => $announcementDetails['title'],
                ":content" => $announcementDetails['content'],
                ":type" => $announcementDetails['type'],
                ":start_date" => $announcementDetails['startDate'],
                ":end_date" => $announcementDetails['endDate'],
                ":meeting_date" => $announcementDetails['meetingDate'] ?? null,
                ":meeting_time_start" => $announcementDetails['meetingTimeStart'] ?? null,
                ":meeting_time_end" => $announcementDetails['meetingTimeEnd'] ?? null,
                ":location" => $announcementDetails['location'] ?? null
            ]);

            if(!$isInserted){
                $response = [
                     "success" => false,
                     "message" => "Failed to created announcement."
                    ];

            }

            $response = [
                 "success" => true,
                 "message" => "Successfully created announcement."
                ];

        } catch (PDOException $e) {
            $response = [
                "success" => false,
                "message" => $e->getMessage()
            ];
        }

        return $response;

    }

?>