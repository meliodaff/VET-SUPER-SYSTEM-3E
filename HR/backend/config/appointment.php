<?php
$HOST = "localhost";
$DB_NAME = "appointment_sia";
$DB_USERNAME = "root";
$DB_PASSWORD = "";
try {
    $pdoAppointment = new PDO("mysql:host=$HOST;dbname=$DB_NAME;charset=utf8", $DB_USERNAME, $DB_PASSWORD);
    $pdoAppointment->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    $pdoAppointment->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo "Connecting databaser failed: " . $e->getMessage();
}

?>