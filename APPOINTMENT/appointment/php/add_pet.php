<?php
include '../includes/session_id.php'; // has $user_id
include '../includes/db.php'; // your database connection (mysqli)

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $pet_name = trim($_POST['pet_name']);
    $species = trim($_POST['species']);
    $breed = trim($_POST['breed']);
    $age = intval($_POST['age']);

    // Handle image upload
    $target_dir = "../uploads/pets/";
    if (!is_dir($target_dir)) {
        mkdir($target_dir, 0777, true);
    }

    $file_name = time() . "_" . basename($_FILES["pet_image"]["name"]);
    $target_file = $target_dir . $file_name;

    if (move_uploaded_file($_FILES["pet_image"]["tmp_name"], $target_file)) {
        // Insert into database with mysqli
        $sql = "INSERT INTO mypet (user_id, pet_name, pet_image, species, breed, age)
                VALUES (?, ?, ?, ?, ?, ?)";

        // Prepare statement
        $stmt = $conn->prepare($sql);

        if ($stmt === false) {
            die("Prepare failed: " . htmlspecialchars($conn->error));
        }

        // Bind parameters: i = integer, s = string
        $stmt->bind_param("issssi", $user_id, $pet_name, $file_name, $species, $breed, $age);

        // Execute
        if ($stmt->execute()) {
            $stmt->close();
            header("Location: ../Book_appointment_add_pet.php?status=added");
            exit;
        }else {
            header("Location: ../Book_appointment_add_pet.php?status=error");
        }

        $stmt->close();
    } else {
        header("Location: ../Book_appointment_add_pet.php?status=error");
    }
} else {
    header("Location: ../Book_appointment_add_pet.php?status=error");
    exit;
}
