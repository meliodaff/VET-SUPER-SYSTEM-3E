<?php
session_start();
include $_SERVER['DOCUMENT_ROOT'] . '/appointment/includes/db.php';

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $username = trim($_POST['username']);
    $password = trim($_POST['password']);

    // Prepare query without role check
    $stmt = $conn->prepare("SELECT id, username, password FROM users_examples WHERE username = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 1) {
        $row = $result->fetch_assoc();

        // Plain-text password comparison (can upgrade to hashing later)
        if ($password === $row['password']) {
            // Set session
            $_SESSION['user_id'] = $row['id'];
            $_SESSION['username'] = $row['username'];

            // Redirect to admin dashboard
            header("Location: /appointment/admin_page/overview.php");
            exit;
        } else {
            echo "<script>alert('❌ Invalid password!'); window.history.back();</script>";
        }
    } else {
        echo "<script>alert('❌ Admin not found!'); window.history.back();</script>";
    }

    $stmt->close();
    $conn->close();
}
?>
