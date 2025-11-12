<?php
include '../includes/session_id.php'; // has $user_id
include '../includes/db.php'; // your database connection (mysqli)

if (isset($_GET['pet_id'])) {
    $pet_id = (int)$_GET['pet_id'];

    // First, fetch the pet to make sure it belongs to the logged-in user
    $check = $conn->prepare("SELECT pet_image FROM mypet WHERE id = ? AND user_id = ?");
    $check->bind_param("ii", $pet_id, $user_id);
    $check->execute();
    $result = $check->get_result();

    if ($result->num_rows > 0) {
        $pet = $result->fetch_assoc();

        // Optional: delete image file too
        $imagePath = __DIR__ . "/uploads/pets/" . $pet['pet_image'];
        if (file_exists($imagePath)) {
            unlink($imagePath);
        }

        // Delete pet
        $stmt = $conn->prepare("DELETE FROM mypet WHERE id = ? AND user_id = ?");
        $stmt->bind_param("ii", $pet_id, $user_id);

        if ($stmt->execute()) {
            header("Location: ../Book_appointment_my_pet.php?status=deleted");;
            exit;
        } else {
            header("Location: ../Book_appointment_my_pet.php?status=error");;
        }

        $stmt->close();
    } else {
        header("Location: ../Book_appointment_my_pet.php?status=error");;
    }

    $check->close();
    $conn->close();
} else {
    header("Location: ../Book_appointment_my_pet.php?status=error");;
}
?>
