<?php
require_once 'config.php';

echo "<h2>Session Test</h2>";
echo "<pre>";
echo "Session ID: " . session_id() . "\n\n";
echo "Session Status: " . (session_status() === PHP_SESSION_ACTIVE ? "ACTIVE" : "NOT ACTIVE") . "\n\n";

echo "Session Variables:\n";
echo "==================\n";
if (empty($_SESSION)) {
    echo "SESSION IS EMPTY!\n";
} else {
    foreach ($_SESSION as $key => $value) {
        echo "$key = ";
        if (is_array($value)) {
            print_r($value);
        } else {
            var_export($value);
        }
        echo "\n";
    }
}

echo "\n\nChecking Login Status:\n";
echo "=====================\n";
echo "logged_in exists: " . (isset($_SESSION['logged_in']) ? "YES" : "NO") . "\n";
echo "logged_in value: " . (isset($_SESSION['logged_in']) ? var_export($_SESSION['logged_in'], true) : "NOT SET") . "\n";
echo "user_id exists: " . (isset($_SESSION['user_id']) ? "YES" : "NO") . "\n";
echo "user_id value: " . (isset($_SESSION['user_id']) ? $_SESSION['user_id'] : "NOT SET") . "\n";

echo "\n\nCookies:\n";
echo "========\n";
foreach ($_COOKIE as $key => $value) {
    if (strpos($key, 'PHPSESSID') !== false || strpos($key, 'session') !== false) {
        echo "$key = $value\n";
    }
}
echo "</pre>";

echo "<hr>";
echo "<h3>Actions:</h3>";
echo "<a href='signin.php'>Go to Sign In</a><br>";
echo "<a href='landing.php'>Go to Landing</a><br>";
echo "<a href='profile.php'>Go to Profile</a><br>";
?>

