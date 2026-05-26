<?php
include '../includes/session_id.php';
include '../includes/db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    // Pet ID
    $id = intval($_POST['pet_id']);

    // Inputs
    $pet_name = trim($_POST['pet_name']);
    $species = trim($_POST['species']);
    $breed = trim($_POST['breed']);

    // AGE is SPLIT into month + year
    $month = intval($_POST['month'] ?? 0);
    $year  = intval($_POST['year'] ?? 0);

    // Handle Other selection
    if ($species === "Other") {
        if (!empty($_POST['other_species'])) {
            $species = trim($_POST['other_species']);
        }
        if (!empty($_POST['other_breed'])) {
            $breed = trim($_POST['other_breed']);
        }
    }

    $update_image = false;
    $file_name = null;

    // New Image Upload
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
            header("Location: ../client_page/Book_appointment_edit_pet.php?status=error");
            exit;
        }
    }

    // With image
    if ($update_image) {
        $sql = "UPDATE mypet 
                SET pet_name = ?, pet_image = ?, species = ?, breed = ?, 
                    month = ?, year = ?, date_update = NOW()
                WHERE id = ? AND user_id = ?";

        $stmt = $conn->prepare($sql);
        $stmt->bind_param(
            "ssssiiii",
            $pet_name,
            $file_name,
            $species,
            $breed,
            $month,
            $year,
            $id,
            $user_id
        );

    } else {
        // Without image
        $sql = "UPDATE mypet 
                SET pet_name = ?, species = ?, breed = ?, 
                    month = ?, year = ?, date_update = NOW()
                WHERE id = ? AND user_id = ?";

        $stmt = $conn->prepare($sql);
        $stmt->bind_param(
            "sssiiii",
            $pet_name,
            $species,
            $breed,
            $month,
            $year,
            $id,
            $user_id
        );
    }

    // EXECUTE
    if ($stmt->execute()) {
        $stmt->close();
        header("Location: ../client_page/Book_appointment_my_pet.php?status=updated");
        exit;
    } else {
        $stmt->close();
        header("Location: ../client_page/Book_appointment_my_pet.php?status=error");
        exit;
    }

} else {
    header("Location: ../client_page/Book_appointment_my_pet.php?status=error");
    exit;
}
?>