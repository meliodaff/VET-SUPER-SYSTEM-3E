<?php
// Test if sessions are working at all
session_start();

echo "<h2>Session Write Test</h2>";
echo "<pre>";

echo "Session ID: " . session_id() . "\n";
echo "Session Save Path: " . session_save_path() . "\n";
echo "Session Status: " . (session_status() === PHP_SESSION_ACTIVE ? "ACTIVE" : "NOT ACTIVE") . "\n\n";

// Set a test variable
$_SESSION['test_var'] = 'This is a test value';
$_SESSION['test_time'] = time();

echo "Set test variables:\n";
echo "test_var = " . $_SESSION['test_var'] . "\n";
echo "test_time = " . $_SESSION['test_time'] . "\n\n";

// Write and close
session_write_close();
echo "Session written and closed.\n\n";

// Reopen
session_start();
echo "Session reopened.\n";
echo "Session ID: " . session_id() . "\n\n";

echo "Reading back variables:\n";
if (isset($_SESSION['test_var'])) {
    echo "✓ test_var = " . $_SESSION['test_var'] . "\n";
} else {
    echo "✗ test_var NOT FOUND\n";
}

if (isset($_SESSION['test_time'])) {
    echo "✓ test_time = " . $_SESSION['test_time'] . "\n";
} else {
    echo "✗ test_time NOT FOUND\n";
}

echo "\nAll session variables:\n";
print_r($_SESSION);

echo "</pre>";
?>

