<?php
// FILE: db_connect.php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit();
}

$conn = mysqli_connect("localhost", "root", "", "vet-inventory");

if (!$conn) {
    echo '{"success": false, "error": "Connection failed"}';
    exit();
}

function clean($data)
{
    global $conn;
    if ($data === null) return "";
    $data = mysqli_real_escape_string($conn, $data);
    return str_replace('"', '\"', $data);
}
