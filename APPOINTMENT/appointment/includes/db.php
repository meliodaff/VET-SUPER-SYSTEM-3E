<?php
// Database connection settings
$host = "localhost";     // usually localhost
$user = "root";          // your MySQL username
$pass = "";              // your MySQL password
$db   = "appointment_sia"; // your database name

// Create connection
$conn = new mysqli($host, $user, $pass, $db);

// Check connection
if ($conn->connect_error) {
    die("❌ Connection failed: " . $conn->connect_error);
}

// Optional: set charset to avoid encoding issues
$conn->set_charset("utf8");

// ✅ Now $conn can be used everywhere you include this file
?>
