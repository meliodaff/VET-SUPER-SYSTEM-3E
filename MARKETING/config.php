<?php
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'furevercare_db');
define('DB_PORT', 3306); // Changed from 3309 to 3306 (default XAMPP MySQL port)

function getDBConnection()
{
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME, DB_PORT);

    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error . 
            "<br><br><strong>Troubleshooting steps:</strong><br>" .
            "1. Open XAMPP Control Panel and make sure MySQL/MariaDB is running<br>" .
            "2. Check if the database 'furevercare_db' exists in phpMyAdmin<br>" .
            "3. Verify the port number (default is 3306, but your config may use 3309)<br>" .
            "4. If using port 3309, ensure MySQL is configured to listen on that port");
    }

    return $conn;
}

// Email Configuration
define('SMTP_HOST', 'smtp.gmail.com');
define('SMTP_PORT', 587);
define('SMTP_USER', 'your-email@gmail.com'); // Change this to your Gmail address
define('SMTP_PASS', 'your-app-password'); // Change this to your Gmail App Password
define('SMTP_FROM_EMAIL', 'noreply@furevercare.com');
define('SMTP_FROM_NAME', 'FUR-EVER CARE');

if (session_status() === PHP_SESSION_NONE) {
    // Configure session cookie settings for better persistence
    ini_set('session.cookie_lifetime', 0); // Session cookie expires when browser closes
    ini_set('session.cookie_httponly', 1); // Prevent JavaScript access
    ini_set('session.use_only_cookies', 1); // Only use cookies for session
    ini_set('session.cookie_samesite', 'Lax'); // CSRF protection
    
    session_start();
    
    // Only regenerate session ID if user is logged in and it's been a while
    // Don't regenerate on every page load as it can cause issues
    if (isset($_SESSION['logged_in']) && $_SESSION['logged_in'] === true) {
        if (!isset($_SESSION['created'])) {
            $_SESSION['created'] = time();
        } else if (time() - $_SESSION['created'] > 1800) {
            // Regenerate session ID every 30 minutes (only for logged in users)
            $old_session_data = $_SESSION; // Save session data
            session_regenerate_id(true);
            $_SESSION = $old_session_data; // Restore session data
            $_SESSION['created'] = time();
        }
    }
}
?>