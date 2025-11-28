<?php

function patchAnnouncement($announcementDetails, $pdo) {
    try {

        $query = "UPDATE announcements SET title = :title, content = :content, type = :type, start_date = :start_date, end_date = :end_date, meeting_date = :meeting_date, meeting_time_start = :meeting_time_start, meeting_time_end = :meeting_time_end, location = :location WHERE announcement_id = :announcement_id";

        $checkStmt = $pdo->prepare($query);
        $checkStmt->execute([
            ":announcement_id" => $announcementDetails['id'],
            ":title" => $announcementDetails['title'],
            ":content" => $announcementDetails['content'],
            ":type" => $announcementDetails['type'],
            ":start_date" => $announcementDetails['startDate'],
            ":end_date" => $announcementDetails['endDate'],
            ":meeting_date" => $announcementDetails['meetingDate'] ?? null,
            ":meeting_time_start" => $announcementDetails['meetingTimeStart'] ?? null,
            ":meeting_time_end" => $announcementDetails['meetingTimeEnd'] ?? null,
            ":location" => $announcementDetails['location'] ?? null,
        ]);
        
        if ($checkStmt->rowCount() === 0) {
            return [
                "success" => false,
                "error" => "Announcement not found"
            ];
        }

        return [
            "success" => true,
            "message" => "Announcement updated successfully",
        ];

    } catch (PDOException $e) {
        return [
            "success" => false,
            "error" => $e->getMessage()
        ];
    }
}

?>