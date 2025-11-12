

    <?php
    session_start();
    include $_SERVER['DOCUMENT_ROOT'] . '/appointment/includes/db.php';

    // Make sure user is logged in
    if (!isset($_SESSION['user_id'])) {
        header("Location: /appointment/login.php");
        exit;
    }

    $user_id = $_SESSION['user_id'];

    if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['register'])) {
        // Get form values
        $fname = trim($_POST['fname']);
        $lname = trim($_POST['lname']);
        $phone = trim($_POST['phone']);
        $email = trim($_POST['email']);
        $emergency_contact = trim($_POST['emergency_contact']);
        $street_address = trim($_POST['street_address']);
        $city = trim($_POST['city']);
        $state = trim($_POST['state']);
        $zip_code = trim($_POST['zip_code']);

        // Prepare insert query
        $stmt = $conn->prepare("INSERT INTO registered (user_id, fname, lname, phone, email, emergency_contact, street_address, city, state, zip_code) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("isssssssss", $user_id, $fname, $lname, $phone, $email, $emergency_contact, $street_address, $city, $state, $zip_code);

        if ($stmt->execute()) {
            
            $update = $conn->prepare("UPDATE users_examples SET isRegister = 'true' WHERE id = ?");
            $update->bind_param("i", $user_id);
            $update->execute();
            $update->close();

            header("Location: ../Book_appointment_dashboard.php?status=registered");
        } else {
            header("Location: ../Book_appointment_dashboard.php?status=error");
        }

        $stmt->close();
        $conn->close();
    }
    ?>
