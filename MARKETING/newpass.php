<?php
session_start();
require_once 'config.php';

// Check if user came from verification page
if (!isset($_SESSION['reset_email']) || !isset($_SESSION['reset_user_id'])) {
    header("Location: forgot_password.php");
    exit();
}

$error = '';
$success = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $new_password = $_POST['new_password'];
    $confirm_password = $_POST['confirm_password'];
    
    // Validate passwords
    if (empty($new_password) || empty($confirm_password)) {
        $error = 'All fields are required.';
    } elseif (strlen($new_password) < 6) {
        $error = 'Password must be at least 6 characters long.';
    } elseif ($new_password !== $confirm_password) {
        $error = 'Passwords do not match.';
    } else {
        $conn = getDBConnection();
        
        // Hash the new password
        $hashed_password = password_hash($new_password, PASSWORD_DEFAULT);
        $user_id = $_SESSION['reset_user_id'];
        
        // Update password in database
        $stmt = $conn->prepare("UPDATE users SET password = ? WHERE id = ?");
        $stmt->bind_param("si", $hashed_password, $user_id);
        
        if ($stmt->execute()) {
            // Clear reset session data
            unset($_SESSION['reset_email']);
            unset($_SESSION['reset_code']);
            unset($_SESSION['reset_user_id']);
            unset($_SESSION['code_expiry']);
            
            $success = 'Password reset successful! Redirecting to login...';
            header("refresh:2;url=signin.php");
        } else {
            $error = 'Failed to reset password. Please try again.';
        }
        
        $stmt->close();
        $conn->close();
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Password - FUR-EVER CARE</title>
    <link rel="stylesheet" href="css/newpass.css">
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
        .password-requirements {
            font-size: 12px;
            color: #666;
            margin-top: 5px;
        }
        .requirement {
            margin: 3px 0;
        }
        .requirement.valid {
            color: #28a745;
        }
        .requirement.invalid {
            color: #dc3545;
        }
    </style>
</head>
<body>
    <div class="login-container">
        <a href="index.php" class="back-button">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            <span>Back to Home</span>
        </a>
        <div class="login-card">
            <div class="login-left">
                <img src="image/VETERINARY_LOGO_SYSTEM.png" alt="FUR-EVER CARE" class="logo">
            </div>
            <div class="login-right">
                <h1>Enter new password</h1>
                <h5>Password must contain capital letter and number. Minimum of 8 characters.</h5>
                
                <?php if ($success): ?>
                    <div class="alert alert-success"><?php echo $success; ?></div>
                <?php endif; ?>
                
                <?php if ($error): ?>
                    <div class="alert alert-error"><?php echo htmlspecialchars($error); ?></div>
                <?php endif; ?>
                
                <form class="login-form" method="POST" action="reset_password.php">
                    <div class="form-group">
                        <label for="new_password">New Password</label>
                        <input type="password" id="new_password" name="new_password" 
                               minlength="8" required>
                    </div>
                    <div class="form-group">
                        <label for="confirm_password">Confirm New Password</label>
                        <input type="password" id="confirm_password" name="confirm_password" 
                               minlength="8" required>
                    </div>
                    <button type="submit" class="confirm-button">Confirm</button>
                    <p class="sign-up-text"> <a href="signin.php">Return</a></p>
                </form>
            </div>
        </div>
    </div>
</body>
</html>