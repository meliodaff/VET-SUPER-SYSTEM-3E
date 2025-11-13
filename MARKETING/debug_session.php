<?php
// Debug session script
require_once 'config.php';

echo "<h2>Session Debug Information</h2>";
echo "<pre>";
echo "Session ID: " . session_id() . "\n";
echo "Session Status: " . (session_status() === PHP_SESSION_ACTIVE ? "Active" : "Not Active") . "\n\n";

echo "Session Data:\n";
echo "=============\n";
if (isset($_SESSION)) {
    foreach ($_SESSION as $key => $value) {
        echo "$key: ";
        if (is_array($value)) {
            print_r($value);
        } else {
            echo htmlspecialchars($value);
        }
        echo "\n";
    }
} else {
    echo "No session data found\n";
}

echo "\n\nCookies:\n";
echo "========\n";
if (isset($_COOKIE)) {
    foreach ($_COOKIE as $key => $value) {
        echo "$key: " . htmlspecialchars($value) . "\n";
    }
} else {
    echo "No cookies found\n";
}

echo "\n\nSession Configuration:\n";
echo "=====================\n";
echo "session.save_path: " . ini_get('session.save_path') . "\n";
echo "session.name: " . ini_get('session.name') . "\n";
echo "session.cookie_lifetime: " . ini_get('session.cookie_lifetime') . "\n";
echo "session.cookie_path: " . ini_get('session.cookie_path') . "\n";
echo "session.cookie_domain: " . ini_get('session.cookie_domain') . "\n";
echo "session.cookie_secure: " . (ini_get('session.cookie_secure') ? 'true' : 'false') . "\n";
echo "session.cookie_httponly: " . (ini_get('session.cookie_httponly') ? 'true' : 'false') . "\n";

echo "</pre>";

echo "<hr>";
echo "<h3>Test Links:</h3>";
echo "<a href='signin.php'>Go to Sign In</a><br>";
echo "<a href='profile.php'>Go to Profile</a><br>";
echo "<a href='landing.php'>Go to Landing</a><br>";
?>

