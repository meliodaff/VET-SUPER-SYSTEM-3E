<?php
include '../includes/session_id.php'; // Ensure user is logged in
include '../includes/db.php'; // Database connection

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // ✅ Get the posted data
    $id = intval($_POST['id']);
    $user_id = $_SESSION['user_id'];
    $pet_name = trim($_POST['pet_name']);
    $vetdoc = trim($_POST['vetdoc']);
    $service = trim($_POST['service']);
    $new_date = $_POST['new_date'];
    $new_time = $_POST['new_time'];

    // ✅ Validation
    if (empty($id) || empty($pet_name) || empty($vetdoc) || empty($service) || empty($new_date) || empty($new_time)) {
       header("Location: ../Book_appointment_dashboard_edit.php?status=error");
       exit;
    }

    // ✅ Ensure time has seconds (convert from HH:MM to HH:MM:SS)
    if (strlen($new_time) === 5) { 
        $new_time .= ":00";
    }

 // ✅ Fetch current appointment (to get old date/time and status)
    $fetch_sql = "SELECT date, time, status FROM book_appointment WHERE id = ? AND user_id = ?";
    $fetch_stmt = $conn->prepare($fetch_sql);
    $fetch_stmt->bind_param("ii", $id, $user_id);
    $fetch_stmt->execute();
    $result = $fetch_stmt->get_result();

    if ($result->num_rows === 0) {
        header("Location: ../Book_appointment_dashboard_edit.php?status=error");
        die;
    }

    $row = $result->fetch_assoc();
    $old_date = $row['date'];
    $old_time = $row['time'];
    $current_status = $row['status'];
    $fetch_stmt->close();

    // ✅ Check if only the date/time changed
 if ($new_date !== $old_date || $new_time !== $old_time) {
        $status = "Rescheduled";
    } else {
        $status = $current_status; // Keep original status if no date/time change
    }

    // ✅ Prepare the update query (including date_update and status)
    $sql = "UPDATE book_appointment 
            SET pet_name = ?, vetdoc = ?, service = ?, date = ?, time = ?, status = ?, date_update = NOW()
            WHERE id = ? AND user_id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssssssii", $pet_name, $vetdoc, $service, $new_date, $new_time, $status, $id, $user_id);

    // ✅ Execute the update
    if ($stmt->execute()) {
        if ($status === "Rescheduled") {
            header("Location: ../Book_appointment_dashboard.php?status=reschedule");
        } else {
            header("Location: ../Book_appointment_dashboard.php?status=updated");
        }
        exit;
    } else {
         header("Location: ../Book_appointment_dashboard.php?status=error");
    }

    $stmt->close();
    $conn->close();
} else {
     header("Location: ../Book_appointment_dashboard.php?status=error");
    exit;
}
?>
