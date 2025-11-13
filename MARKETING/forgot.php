<?php
session_start();
require_once 'config.php';

$error = '';
$success = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = trim($_POST['email']);
    
    // Validate email
    if (empty($email)) {
        $error = 'Email address is required.';
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $error = 'Invalid email format.';
    } else {
        $conn = getDBConnection();
        
        // Check if email exists in database
        $stmt = $conn->prepare("SELECT id, full_name FROM users WHERE email = ?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows === 1) {
            $user = $result->fetch_assoc();
            
            // Generate 6-digit verification code
            $verification_code = sprintf("%06d", mt_rand(0, 999999));
            
            // Store in session for verification
            $_SESSION['reset_email'] = $email;
            $_SESSION['reset_code'] = $verification_code;
            $_SESSION['reset_user_id'] = $user['id'];
            $_SESSION['code_expiry'] = time() + 600; // 10 minutes expiry
            
            // In a real application, you would send this via email
            // For now, we'll just show it on screen for testing
            $success = "Verification code sent! For testing: <strong>$verification_code</strong>";
            
            // Redirect to verification page after 2 seconds
            header("refresh:2;url=verification.php");
            
            // TODO: Implement actual email sending
            // Example with PHPMailer:
            // require 'PHPMailer/PHPMailer.php';
            // $mail = new PHPMailer();
            // $mail->setFrom('noreply@furevercare.com', 'FUR-EVER CARE');
            // $mail->addAddress($email, $user['full_name']);
            // $mail->Subject = 'Password Reset Verification Code';
            // $mail->Body = "Your verification code is: $verification_code";
            // $mail->send();
            
        } else {
            // Don't reveal if email exists or not (security best practice)
            $error = 'If this email exists, a verification code has been sent.';
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
    <title>Forgot Password - FUR-EVER CARE</title>
    <link rel="stylesheet" href="css/forgot.css">
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
                <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            <span>Back to Home</span>
        </a>
        <div class="login-card">
            <div class="login-left">
                <img src="image/VETERINARY_LOGO_SYSTEM.png" alt="FUR-EVER CARE" class="logo">
            </div>
            <div class="login-right">
                <h1>Forgot Password?</h1>
                <h5>We'll help you get back into your account!</h5>
                
                <?php if ($success): ?>
                    <div class="alert alert-success"><?php echo $success; ?></div>
                <?php endif; ?>
                
                <?php if ($error): ?>
                    <div class="alert alert-error"><?php echo htmlspecialchars($error); ?></div>
                <?php endif; ?>
                
                <form class="login-form" method="POST" action="forgot_password.php">
                    <div class="form-group">
                        <label for="email">Email Address</label>
                        <input type="email" id="email" name="email" 
                               value="<?php echo isset($_POST['email']) ? htmlspecialchars($_POST['email']) : ''; ?>" 
                               required>
                    </div>
                    <button type="submit" class="verif-button">Send Verification Code</button>
                    <p class="sign-up-text"> <a href="signin.php">Back to Sign In</a></p>
                </form>
            </div>
        </div>
    </div>
</body>
</html>