<?php
// Include your database configuration (it handles session_start)
require_once 'config.php';

$error = ''; // Initialize error variable

// Check if the user is already logged in, redirect to landing page if true
if (isset($_SESSION['logged_in']) && $_SESSION['logged_in'] === true) {
    header("Location: landing.php");
    exit();
}

// Handle form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Sanitize and retrieve form data
    $email = trim($_POST['email']);
    $password = $_POST['password'];

    // Validate inputs
    if (empty($email) || empty($password)) {
        $error = 'Email and password are required.';
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $error = 'Invalid email format.';
    } else {
        // Establish database connection
        $conn = getDBConnection();

        // Prepare SQL statement to fetch user by email
        $stmt = $conn->prepare("SELECT id, first_name, last_name, email, password FROM users WHERE email = ?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();

        // Check if user exists
        if ($result->num_rows === 1) {
            $user = $result->fetch_assoc();

            // Verify the user's password
            if (password_verify($password, $user['password'])) {
                // FIXED: Don't cast to int until we verify it's a valid number
                $user_id = $user['id'];
                
                // Debug: Check what we got from database
                error_log("=== LOGIN DEBUG ===");
                error_log("Raw user ID from DB: " . var_export($user['id'], true));
                error_log("User ID type: " . gettype($user['id']));
                error_log("User ID value: " . $user_id);
                
                // Validate user_id is a positive integer
                if (!is_numeric($user_id) || intval($user_id) <= 0) {
                    error_log("ERROR: Invalid user ID: " . var_export($user_id, true));
                    $error = 'System error. Please contact support.';
                    $stmt->close();
                    $conn->close();
                } else {
                    // Set session variables - store as integer
                    $_SESSION['user_id'] = intval($user_id);
                    $_SESSION['user_name'] = trim(($user['first_name'] ?? '') . ' ' . ($user['last_name'] ?? ''));
                    $_SESSION['user_email'] = $user['email'];
                    $_SESSION['logged_in'] = true;
                    $_SESSION['created'] = time();
                    
                    // Debug: Verify what we stored
                    error_log("Stored user_id in session: " . $_SESSION['user_id']);
                    error_log("Session data: " . print_r($_SESSION, true));

                    // Close database before redirect
                    $stmt->close();
                    $conn->close();
                    
                    // Redirect to the landing page
                    header("Location: landing.php");
                    exit();
                }
            } else {
                $error = 'Invalid email or password.';
                $stmt->close();
                $conn->close();
            }
        } else {
            $error = 'Invalid email or password.';
            $stmt->close();
            $conn->close();
        }
    }
}
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sign In - FUR-EVER CARE</title>
    <link rel="stylesheet" href="css/register.css">
    <style>
        .alert {
            padding: 12px 20px;
            margin-bottom: 20px;
            border-radius: 8px;
            font-size: 14px;
        }

        .alert-success {
            background-color: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }

        .alert-error {
            background-color: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }
    </style>
</head>

<body>
    <div class="login-container">
        <a href="index.php" class="back-button">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            <span>Back to Home</span>
        </a>
        <div class="login-card">
            <div class="login-left">
                <img src="image/VETERINARY_LOGO_SYSTEM.png" alt="FUR-EVER CARE" class="logo">
            </div>
            <div class="login-right">
                <h1>Welcome Back!</h1>

                <!-- Display any errors -->
                <?php if ($error): ?>
                    <div class="alert alert-error"><?php echo htmlspecialchars($error); ?></div>
                <?php endif; ?>

                <!-- Sign In Form -->
                <form class="login-form" method="POST" action="signin.php">
                    <div class="form-group">
                        <label for="email">Email Address</label>
                        <input type="email" id="email" name="email"
                            value="<?php echo isset($_POST['email']) ? htmlspecialchars($_POST['email']) : ''; ?>"
                            required>
                    </div>
                    <div class="form-group">
                        <label for="password">Password</label>
                        <input type="password" id="password" name="password" required>
                    </div>

                    <button type="submit" class="register-button">Log In</button>
                    <p class="sign-up-text">Don't have an account? <a href="register.php">Register</a></p>
                </form>
            </div>
        </div>
    </div>
</body>

</html>