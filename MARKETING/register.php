<?php
require_once 'config.php';

// Initialize variables FIRST
$error = '';
$success = '';
$show_otp_form = false;
$otp_sent = false;

// Function to generate OTP
function generateOTP($length = 6) {
    return str_pad(rand(0, pow(10, $length) - 1), $length, '0', STR_PAD_LEFT);
}

// Helper function to read SMTP response
function readSMTPResponse($socket) {
    $response = '';
    while ($line = fgets($socket, 515)) {
        $response .= $line;
        if (substr($line, 3, 1) == ' ') {
            break;
        }
    }
    return $response;
}

// Function to send OTP email
function sendOTPEmail($email, $otp, $first_name) {
    $smtp_host = 'smtp.gmail.com';
    $smtp_port = 587;
    $smtp_user = 'furevercare8@gmail.com';
    $smtp_pass = 'ykvsjopxjppczxwp';
    $from_email = 'furevercare8@gmail.com';
    $from_name = 'FUR-EVER CARE';
    
    $subject = "FUR-EVER CARE - Email Verification Code";
    $html_message = "
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background-color: #f9f9f9; }
            .otp-code { font-size: 32px; font-weight: bold; color: #4CAF50; text-align: center; padding: 20px; background-color: white; border: 2px dashed #4CAF50; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h2>FUR-EVER CARE</h2>
            </div>
            <div class='content'>
                <p>Hello " . htmlspecialchars($first_name) . ",</p>
                <p>Thank you for registering with FUR-EVER CARE! Please use the following verification code to complete your registration:</p>
                <div class='otp-code'>" . $otp . "</div>
                <p>This code will expire in 10 minutes.</p>
                <p>If you didn't request this code, please ignore this email.</p>
            </div>
            <div class='footer'>
                <p>&copy; " . date('Y') . " FUR-EVER CARE. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    ";
    
    try {
        $socket = @stream_socket_client("tcp://$smtp_host:$smtp_port", $errno, $errstr, 30);
        if (!$socket) {
            error_log("SMTP Connection failed: $errstr ($errno)");
            return false;
        }
        
        stream_set_timeout($socket, 30);
        $response = readSMTPResponse($socket);
        if (substr($response, 0, 3) != '220') {
            fclose($socket);
            return false;
        }
        
        fputs($socket, "EHLO " . gethostname() . "\r\n");
        $response = readSMTPResponse($socket);
        
        fputs($socket, "STARTTLS\r\n");
        $response = readSMTPResponse($socket);
        if (substr($response, 0, 3) != '220') {
            fclose($socket);
            return false;
        }
        
        if (!stream_socket_enable_crypto($socket, true, STREAM_CRYPTO_METHOD_TLS_CLIENT)) {
            fclose($socket);
            return false;
        }
        
        fputs($socket, "EHLO " . gethostname() . "\r\n");
        $response = readSMTPResponse($socket);
        
        fputs($socket, "AUTH LOGIN\r\n");
        $response = readSMTPResponse($socket);
        
        fputs($socket, base64_encode($smtp_user) . "\r\n");
        $response = readSMTPResponse($socket);
        
        fputs($socket, base64_encode($smtp_pass) . "\r\n");
        $response = readSMTPResponse($socket);
        if (substr($response, 0, 3) != '235') {
            fclose($socket);
            return false;
        }
        
        fputs($socket, "MAIL FROM: <$from_email>\r\n");
        $response = readSMTPResponse($socket);
        
        fputs($socket, "RCPT TO: <$email>\r\n");
        $response = readSMTPResponse($socket);
        
        fputs($socket, "DATA\r\n");
        $response = readSMTPResponse($socket);
        
        $headers = "From: $from_name <$from_email>\r\n";
        $headers .= "To: <$email>\r\n";
        $headers .= "Subject: $subject\r\n";
        $headers .= "MIME-Version: 1.0\r\n";
        $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
        $headers .= "\r\n";
        
        fputs($socket, $headers . $html_message . "\r\n.\r\n");
        $response = readSMTPResponse($socket);
        
        fputs($socket, "QUIT\r\n");
        fclose($socket);
        
        return true;
    } catch (Exception $e) {
        error_log("SMTP Exception: " . $e->getMessage());
        if (isset($socket) && $socket) {
            fclose($socket);
        }
        return false;
    }
}

// Handle cancel registration
if (isset($_GET['cancel'])) {
    unset($_SESSION['registration_otp']);
    unset($_SESSION['registration_data']);
    unset($_SESSION['otp_expiry']);
    header('Location: register.php');
    exit;
}

// Handle OTP resend
if (isset($_POST['resend_otp'])) {
    if (isset($_SESSION['registration_data'])) {
        $registration_data = $_SESSION['registration_data'];
        $email = $registration_data['email'];
        $first_name = $registration_data['first_name'];
        
        $otp = generateOTP(6);
        $_SESSION['registration_otp'] = $otp;
        $_SESSION['otp_expiry'] = time() + (10 * 60);
        
        if (sendOTPEmail($email, $otp, $first_name)) {
            $success = 'A new OTP has been sent to your email.';
            $show_otp_form = true;
        } else {
            $error = 'Failed to resend OTP email. Please try again.';
            $show_otp_form = true;
        }
    } else {
        $error = 'Session expired. Please register again.';
    }
}
// Handle OTP verification
elseif (isset($_POST['verify_otp'])) {
    $entered_otp = trim($_POST['otp']);
    
    if (empty($entered_otp)) {
        $error = 'Please enter the OTP code.';
        $show_otp_form = true;
    } elseif (!isset($_SESSION['registration_otp']) || !isset($_SESSION['registration_data'])) {
        $error = 'OTP session expired. Please register again.';
        unset($_SESSION['registration_otp']);
        unset($_SESSION['registration_data']);
        unset($_SESSION['otp_expiry']);
    } elseif (time() > $_SESSION['otp_expiry']) {
        $error = 'OTP has expired. Please register again.';
        unset($_SESSION['registration_otp']);
        unset($_SESSION['registration_data']);
        unset($_SESSION['otp_expiry']);
    } elseif ($entered_otp !== $_SESSION['registration_otp']) {
        $error = 'Invalid OTP code. Please try again.';
        $show_otp_form = true;
    } else {
        $registration_data = $_SESSION['registration_data'];
        $first_name = $registration_data['first_name'];
        $last_name = $registration_data['last_name'];
        $email = $registration_data['email'];
        $password = $registration_data['password'];
        
        $conn = getDBConnection();
        
        $stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows > 0) {
            $error = 'Email already registered.';
            $show_otp_form = true;
        } else {
            $hashed_password = password_hash($password, PASSWORD_DEFAULT);
            
            $stmt = $conn->prepare("INSERT INTO users (first_name, last_name, email, password) VALUES (?, ?, ?, ?)");
            $stmt->bind_param("ssss", $first_name, $last_name, $email, $hashed_password);
            
            if ($stmt->execute()) {
                unset($_SESSION['registration_otp']);
                unset($_SESSION['registration_data']);
                unset($_SESSION['otp_expiry']);
                
                $success = 'Registration successful! Redirecting to login...';
                header("refresh:2;url=signin.php");
                exit;
            } else {
                $error = 'Registration failed. Please try again.';
                $show_otp_form = true;
            }
        }
        
        $stmt->close();
        $conn->close();
    }
}
// Handle initial registration
elseif ($_SERVER['REQUEST_METHOD'] === 'POST' && !isset($_POST['verify_otp']) && !isset($_POST['resend_otp'])) {
    $first_name = trim($_POST['first-name']);
    $last_name = trim($_POST['last-name']);
    $email = trim($_POST['email']);
    $password = $_POST['password'];
    $confirm_password = $_POST['confirm-password'];

    if (empty($first_name) || empty($last_name) || empty($email) || empty($password) || empty($confirm_password)) {
        $error = 'All fields are required.';
    } 
    elseif (strlen($first_name) < 2) {
        $error = "First name must contain at least 2 letters.";
    } elseif (!ctype_upper($first_name[0])) {
        $error = "First name must start with an uppercase letter.";
    } elseif (strlen($last_name) < 2) {
        $error = "Last name must contain at least 2 letters.";
    } elseif (!ctype_upper($last_name[0])) {
        $error = "Last name must start with an uppercase letter.";
    }
    elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $error = 'Invalid email format.';
    } elseif (strlen($password) < 8) {
        $error = 'Password must be at least 8 characters long.';
    } elseif ($password !== $confirm_password) {
        $error = 'Passwords do not match.';
    } else {
        $conn = getDBConnection();

        $stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            $error = 'Email already registered.';
        } else {
            $otp = generateOTP(6);
            
            $_SESSION['registration_data'] = [
                'first_name' => $first_name,
                'last_name' => $last_name,
                'email' => $email,
                'password' => $password
            ];
            $_SESSION['registration_otp'] = $otp;
            $_SESSION['otp_expiry'] = time() + (10 * 60);
            
            if (sendOTPEmail($email, $otp, $first_name)) {
                $success = 'OTP has been sent to your email. Please check your inbox.';
                $show_otp_form = true;
                $otp_sent = true;
            } else {
                $error = 'Failed to send OTP. For testing, use this OTP: <strong style="font-size: 20px; color: #4CAF50;">' . $otp . '</strong>';
                $show_otp_form = true;
            }
        }

        $stmt->close();
        $conn->close();
    }
}

if (isset($_SESSION['registration_otp']) && isset($_SESSION['registration_data'])) {
    $show_otp_form = true;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Register - FUR-EVER CARE</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        html, body {
            height: 100%;
            width: 100%;
        }

        body {
            background-image: url('image/loginbg.png');
            background-size: cover;
            background-position: center;
            background-attachment: fixed;
            font-family: Arial, sans-serif;
            background-color: #f5f5f5;
            overflow-y: scroll;
            padding: 20px;
        }

        .back-button {
            position: fixed;
            top: 2rem;
            left: 2rem;
            color: white;
            text-decoration: none;
            display: flex;
            align-items: center;
            gap: 0.75rem;
            padding: 0.75rem 1.25rem;
            background-color: #00205B;
            border-radius: 8px;
            transition: all 0.3s ease;
            font-size: 1rem;
            font-weight: 500;
            box-shadow: 0 2px 8px rgba(5, 5, 5, 0.2);
            z-index: 1000;
        }

        .back-button svg {
            width: 22px;
            height: 22px;
        }

        .back-button:hover {
            transform: translateX(-5px);
            background-color: #001845;
        }

        .page-container {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 100px 20px 50px;
        }

        .login-container {
            width: 100%;
            max-width: 900px;
            margin: 0 auto;
        }

        .login-card {
            background: white;
            border-radius: 20px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            display: flex;
            overflow: hidden;
        }

        .login-left {
            background-color: #00205B;
            padding: 3rem;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 40%;
        }

        .logo {
            width: 200px;
            height: auto;
        }

        .login-right {
            padding: 3rem;
            width: 60%;
        }

        h1 {
            color: #00205B;
            font-size: 2rem;
            margin-bottom: 2rem;
            font-weight: 600;
        }

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

        .form-group {
            margin-bottom: 1.5rem;
        }

        label {
            display: block;
            color: #555;
            margin-bottom: 0.5rem;
            font-size: 0.9rem;
        }

        input {
            width: 100%;
            padding: 0.75rem;
            border: 1px solid #ddd;
            border-radius: 6px;
            font-size: 1rem;
            transition: border-color 0.2s ease;
        }

        input:focus {
            outline: none;
            border-color: #00205B;
        }

        .register-button {
            display: block;
            margin: 1.5rem auto 0;
            width: 50%;
            padding: 1rem;
            background-color: #00205B;
            color: white;
            border: none;
            border-radius: 20px;
            font-size: 1rem;
            font-weight: 500;
            cursor: pointer;
            transition: background-color 0.2s ease;
        }

        .register-button:hover {
            background-color: #001845;
        }

        .sign-up-text {
            text-align: center;
            margin-top: 1.5rem;
            color: #555;
            font-size: 0.9rem;
        }

        .sign-up-text a {
            color: #00205B;
            text-decoration: none;
            font-weight: 500;
        }

        .sign-up-text a:hover {
            text-decoration: underline;
        }

        @media (max-width: 768px) {
            .page-container {
                padding: 80px 10px 30px;
            }

            .login-card {
                flex-direction: column;
            }

            .login-left, .login-right {
                width: 100%;
                padding: 2rem;
            }

            .logo {
                width: 150px;
            }

            .back-button {
                top: 1rem;
                left: 1rem;
                padding: 0.5rem 1rem;
                font-size: 0.9rem;
            }

            h1 {
                font-size: 1.5rem;
            }

            .register-button {
                width: 100%;
            }
        }
    </style>
</head>
<body>
    <a href="index.php" class="back-button">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        <span>Back to Home</span>
    </a>

    <div class="page-container">
        <div class="login-container">
            <div class="login-card">
                <div class="login-left">
                    <img src="image/VETERINARY_LOGO_SYSTEM.png" alt="FUR-EVER CARE" class="logo">
                </div>
                <div class="login-right">
                    <h1><?php echo $show_otp_form ? 'Verify Your Email' : 'Join Our Pet Family!'; ?></h1>

                    <?php if ($error): ?>
                        <div class="alert alert-error"><?php echo $error; ?></div>
                    <?php endif; ?>

                    <?php if ($success): ?>
                        <div class="alert alert-success"><?php echo $success; ?></div>
                    <?php endif; ?>

                    <?php if ($show_otp_form): ?>
                        <p style="text-align: center; color: #666; margin-bottom: 20px;">
                            We've sent a 6-digit code to <strong><?php echo isset($_SESSION['registration_data']['email']) ? htmlspecialchars($_SESSION['registration_data']['email']) : ''; ?></strong>
                        </p>
                        <form class="login-form" method="POST" action="register.php">
                            <div class="form-group">
                                <label for="otp">Enter Verification Code</label>
                                <input type="text" id="otp" name="otp" maxlength="6" pattern="[0-9]{6}" 
                                    placeholder="000000" style="text-align: center; font-size: 24px; letter-spacing: 8px;" 
                                    required autofocus>
                                <small style="display: block; text-align: center; margin-top: 10px; color: #666;">
                                    Code expires in 10 minutes
                                </small>
                            </div>
                            <button type="submit" name="verify_otp" class="register-button">Verify & Register</button>
                            <p class="sign-up-text">
                                <a href="register.php?cancel=1">Cancel</a> | 
                                <a href="#" onclick="document.getElementById('resendForm').submit(); return false;">Resend OTP</a>
                            </p>
                        </form>
                        <form method="POST" id="resendForm" style="display: none;">
                            <input type="hidden" name="resend_otp" value="1">
                        </form>
                    <?php else: ?>
                        <form class="login-form" method="POST" action="register.php">
                            <div class="form-group">
                                <label for="first-name">First Name</label>
                                <input type="text" id="first-name" name="first-name"
                                    value="<?php echo isset($_POST['first-name']) ? htmlspecialchars($_POST['first-name']) : ''; ?>" required>
                            </div>
                            <div class="form-group">
                                <label for="last-name">Last Name</label>
                                <input type="text" id="last-name" name="last-name"
                                    value="<?php echo isset($_POST['last-name']) ? htmlspecialchars($_POST['last-name']) : ''; ?>" required>
                            </div>
                            <div class="form-group">
                                <label for="email">Email Address</label>
                                <input type="email" id="email" name="email"
                                    value="<?php echo isset($_POST['email']) ? htmlspecialchars($_POST['email']) : ''; ?>" required>
                            </div>
                            <div class="form-group">
                                <label for="password">Password</label>
                                <input type="password" id="password" name="password" required>
                            </div>
                            <div class="form-group">
                                <label for="confirm-password">Confirm Password</label>
                                <input type="password" id="confirm-password" name="confirm-password" required>
                            </div>
                            <button type="submit" class="register-button">Register</button>
                            <p class="sign-up-text">Already have an account? <a href="signin.php">Sign In</a></p>
                        </form>
                    <?php endif; ?>
                </div>
            </div>
        </div>
    </div>

    <script>
        const otpInput = document.getElementById('otp');
        if (otpInput) {
            otpInput.addEventListener('input', function(e) {
                this.value = this.value.replace(/[^0-9]/g, '');
            });
            otpInput.focus();
        }
    </script>
</body>
</html>