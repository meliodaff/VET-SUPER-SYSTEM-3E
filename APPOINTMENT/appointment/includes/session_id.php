<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}


if (!isset($_SESSION['user_id'])) {
    // If no user logged in, redirect to login
    header("Location: admin_page/index.html");
    exit;
}

// Get the user ID
$user_id = $_SESSION['user_id'];
$username = $_SESSION['username'];
?>