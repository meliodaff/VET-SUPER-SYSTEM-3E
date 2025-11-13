<?php
require_once 'config.php';

echo "<h2>Login Status Check</h2>";
echo "<pre>";
echo "Session ID: " . session_id() . "\n\n";

echo "All Session Variables:\n";
print_r($_SESSION);

echo "\n\nSpecific Checks:\n";
echo "logged_in: " . (isset($_SESSION['logged_in']) ? var_export($_SESSION['logged_in'], true) : "NOT SET") . "\n";
echo "user_id: " . (isset($_SESSION['user_id']) ? $_SESSION['user_id'] : "NOT SET") . "\n";
echo "user_name: " . (isset($_SESSION['user_name']) ? $_SESSION['user_name'] : "NOT SET") . "\n";
echo "user_email: " . (isset($_SESSION['user_email']) ? $_SESSION['user_email'] : "NOT SET") . "\n";

echo "\n\nProfile Access Test:\n";
if (!isset($_SESSION['logged_in']) || $_SESSION['logged_in'] !== true || !isset($_SESSION['user_id'])) {
    echo "❌ Would be redirected to signin.php\n";
    echo "Reason: ";
    if (!isset($_SESSION['logged_in'])) {
        echo "logged_in not set";
    } elseif ($_SESSION['logged_in'] !== true) {
        echo "logged_in is not true (value: " . var_export($_SESSION['logged_in'], true) . ")";
    } elseif (!isset($_SESSION['user_id'])) {
        echo "user_id not set";
    }
} else {
    echo "✅ Would allow access to profile.php\n";
}
echo "</pre>";
?>

