<?php
include '../includes/session_id.php'; // has $user_id
include '../includes/db.php'; // your database connection (mysqli)

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    // Get pet ID from form field 'pet_id'
    $id = intval($_POST['pet_id']); 

    $pet_name = trim($_POST['pet_name']);
    $species = trim($_POST['species']);
    $breed = trim($_POST['breed']);
    $age = intval($_POST['age']);

    $update_image = false;
    $file_name = null;

    // Check if new image uploaded without errors
    if (isset($_FILES["pet_image"]) && $_FILES["pet_image"]["error"] === UPLOAD_ERR_OK) {
        $target_dir = "../uploads/pets/";
        if (!is_dir($target_dir)) {
            mkdir($target_dir, 0777, true);
        }

        $file_name = time() . "_" . basename($_FILES["pet_image"]["name"]);
        $target_file = $target_dir . $file_name;

        if (move_uploaded_file($_FILES["pet_image"]["tmp_name"], $target_file)) {
            $update_image = true;
        } else {
            header("Location: ../Book_appointment_edit_pet.php?status=error");
            exit;
        }
    }

    if ($update_image) {
    // Update including new image
    $sql = "UPDATE mypet 
            SET pet_name = ?, pet_image = ?, species = ?, breed = ?, age = ?, date_update = NOW() 
            WHERE id = ? AND user_id = ?";
    } else {
        // Update without image change
        $sql = "UPDATE mypet 
                SET pet_name = ?, species = ?, breed = ?, age = ?, date_update = NOW() 
                WHERE id = ? AND user_id = ?";
    }


    $stmt = $conn->prepare($sql);

    if ($stmt === false) {
        die("Prepare failed: " . htmlspecialchars($conn->error));
    }

    if ($update_image) {
        // Bind params: pet_name, pet_image, species, breed, age, id, user_id
        $stmt->bind_param("ssssiii", $pet_name, $file_name, $species, $breed, $age, $id, $user_id);
    } else {
        // Bind params: pet_name, species, breed, age, id, user_id
        $stmt->bind_param("sssiii", $pet_name, $species, $breed, $age, $id, $user_id);
    }

    if ($stmt->execute()) {
        $stmt->close();
        header("Location: /appointment/Book_appointment_my_pet.php?status=updated");
        exit;
    } else {
        $stmt->close();
        header("Location: /appointment/Book_appointment_my_pet.php?status=error");
        exit;
    }

} else {
        header("Location: /appointment/Book_appointment_my_pet.php?status=error");
    exit;
}
?>
