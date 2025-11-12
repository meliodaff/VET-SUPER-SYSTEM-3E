<?php
$HOST = "localhost";
$DB_NAME = "hrms_db";
$DB_USERNAME = "root";
$DB_PASSWORD = "";
try {
    $pdo = new PDO("mysql:host=$HOST;dbname=$DB_NAME;charset=utf8", $DB_USERNAME, $DB_PASSWORD);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo "Connecting databaser failed: " . $e->getMessage();
}

?>