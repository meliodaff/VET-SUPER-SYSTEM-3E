<?php
include '../includes/db.php'; // database connection

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST' || $method === 'GET') {
    $id = $_POST['id'] ?? $_GET['id'] ?? null;
    $action = $_POST['action'] ?? $_GET['action'] ?? null;

    if ($id && $action) {
        // Determine new status and base message
        switch ($action) {
            case 'approve':
                $new_status = 'approved';
                $base_message = 'has been approved.';
                break;
            case 'reject':
                $new_status = 'rejected';
                $base_message = 'has been rejected.';
                break;
            case 'done':
                $new_status = 'done';
                $base_message = 'has been marked as done.';
                break;
            default:
                $new_status = null;
        }

        if ($new_status) {
            // ✅ Update appointment status
            $stmt = $conn->prepare("UPDATE book_appointment SET status = ?, date_update = NOW() WHERE id = ?");
            $stmt->bind_param("si", $new_status, $id);

            if ($stmt->execute()) {

                // ✅ Fetch appointment details for notification
                $getUser = $conn->prepare("
                    SELECT user_id, pet_name, service, date, time 
                    FROM book_appointment 
                    WHERE id = ?
                ");
                $getUser->bind_param("i", $id);
                $getUser->execute();
                $result = $getUser->get_result();
                $appt = $result->fetch_assoc();

                if ($appt) {
                    $user_id = $appt['user_id'];
                    $pet_name = $appt['pet_name'];
                    $service = $appt['service'];
                    $appt_date = date('M d, Y', strtotime($appt['date']));
                    $appt_time = date('h:i A', strtotime($appt['time']));
                    $date_time = date('Y-m-d H:i:s'); // current datetime

                    // 📨 Notification message with date and time
                    $notif_message = "Your appointment for {$pet_name} ({$service}) on {$appt_date} at {$appt_time} {$base_message}";

                    // ✅ Insert into notifications
                    $notif_query = $conn->prepare("
                        INSERT INTO notifications (user_id, pet_name, date_time, service, message, is_read)
                        VALUES (?, ?, ?, ?, ?, 0)
                    ");
                    $notif_query->bind_param("issss", $user_id, $pet_name, $date_time, $service, $notif_message);
                    $notif_query->execute();
                }

                header("Location: ../admin_page/pending.php?status=$new_status");
                exit;
            } else {
                header("Location: ../admin_page/pending.php?status=error");
            }

            $stmt->close();
        } else {
            header("Location: ../admin_page/pending.php?status=error");
        }
    } else {
        header("Location: ../admin_page/pending.php?status=error");
    }

} else {
    header("Location: ../admin_page/pending.php?status=error");
}

$conn->close();
?>
