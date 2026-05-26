<?php
include '../includes/session_id.php'; // contains $user_id
include '../includes/db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    // Inputs
    $pet_name = trim($_POST['pet_name']);
    $species = trim($_POST['species']);
    $breed = trim($_POST['breed']);
    $month = intval($_POST['month']);
    $year = intval($_POST['year']);

    // Handle OTHER species/breed
    if ($species === "Other") {
        if (!empty($_POST['other_species'])) {
            $species = trim($_POST['other_species']);
        }
        if (!empty($_POST['other_breed'])) {
            $breed = trim($_POST['other_breed']);
        }
    }

    // Ensure BOTH age fields exist
    if ($month < 0) $month = 0;
    if ($year < 0) $year = 0;

    // ========== IMAGE UPLOAD ==========
    $target_dir = "../uploads/pets/";
    if (!is_dir($target_dir)) {
        mkdir($target_dir, 0777, true);
    }

    $file_name = time() . "_" . basename($_FILES["pet_image"]["name"]);
    $target_file = $target_dir . $file_name;

    if (move_uploaded_file($_FILES["pet_image"]["tmp_name"], $target_file)) {

        // ========== INSERT INTO DB ==========
        $sql = "INSERT INTO mypet (user_id, pet_name, pet_image, species, breed, month, year)
                VALUES (?, ?, ?, ?, ?, ?, ?)";

        $stmt = $conn->prepare($sql);

        if (!$stmt) {
            die("SQL error: " . $conn->error);
        }

        // bind_param types = i s s s s i i
        $stmt->bind_param("issssii",
            $user_id,
            $pet_name,
            $file_name,
            $species,
            $breed,
            $month,
            $year
        );

        if ($stmt->execute()) {
            $stmt->close();
            header("Location: ../client_page/Book_appointment_add_pet.php?status=added");
            exit;
        } else {
            $stmt->close();
            header("Location: ../client_page/Book_appointment_add_pet.php?status=error");
            exit;
        }

    } else {
        header("Location: ../client_page/Book_appointment_add_pet.php?status=error");
        exit;
    }

} else {
    header("Location: ../client_page/Book_appointment_add_pet.php?status=error");
    exit;
}
