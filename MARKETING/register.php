<?php
require_once 'config.php';

// Function to generate OTP
function generateOTP($length = 6) {
    return str_pad(rand(0, pow(10, $length) - 1), $length, '0', STR_PAD_LEFT);
}

// Helper function to read SMTP response (handles multi-line responses)
function readSMTPResponse($socket) {
    $response = '';
    while ($line = fgets($socket, 515)) {
        $response .= $line;
        if (substr($line, 3, 1) == ' ') {
            break; // Last line of multi-line response
        }
    }
    return $response;
}

// Function to send OTP email using direct SMTP with Gmail
function sendOTPEmail($email, $otp, $first_name) {
    // Gmail SMTP Configuration
    $smtp_host = 'smtp.gmail.com';
    $smtp_port = 587;
    $smtp_user = 'furevercare8@gmail.com';
    $smtp_pass = 'ykvsjopxjppczxwp'; // App Password
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
        // Create socket connection
        $socket = @stream_socket_client("tcp://$smtp_host:$smtp_port", $errno, $errstr, 30);
        if (!$socket) {
            error_log("SMTP Connection failed: $errstr ($errno)");
            return false;
        }
        
        // Set timeout
        stream_set_timeout($socket, 30);
        
        // Read server greeting
        $response = readSMTPResponse($socket);
        if (substr($response, 0, 3) != '220') {
            fclose($socket);
            error_log("SMTP Error: $response");
            return false;
        }
        
        // Send EHLO
        fputs($socket, "EHLO " . gethostname() . "\r\n");
        $response = readSMTPResponse($socket);
        
        // Start TLS
        fputs($socket, "STARTTLS\r\n");
        $response = readSMTPResponse($socket);
        if (substr($response, 0, 3) != '220') {
            fclose($socket);
            error_log("STARTTLS failed: $response");
            return false;
        }
        
        // Enable crypto
        if (!stream_socket_enable_crypto($socket, true, STREAM_CRYPTO_METHOD_TLS_CLIENT)) {
            fclose($socket);
            error_log("TLS encryption failed");
            return false;
        }
        
        // Send EHLO again after TLS
        fputs($socket, "EHLO " . gethostname() . "\r\n");
        $response = readSMTPResponse($socket);
        
        // Authenticate
        fputs($socket, "AUTH LOGIN\r\n");
        $response = readSMTPResponse($socket);
        
        fputs($socket, base64_encode($smtp_user) . "\r\n");
        $response = readSMTPResponse($socket);
        
        fputs($socket, base64_encode($smtp_pass) . "\r\n");
        $response = readSMTPResponse($socket);
        if (substr($response, 0, 3) != '235') {
            fclose($socket);
            error_log("SMTP Authentication failed: $response");
            return false;
        }
        
        // Send MAIL FROM
        fputs($socket, "MAIL FROM: <$from_email>\r\n");
        $response = readSMTPResponse($socket);
        if (substr($response, 0, 3) != '250') {
            fclose($socket);
            error_log("MAIL FROM failed: $response");
            return false;
        }
        
        // Send RCPT TO
        fputs($socket, "RCPT TO: <$email>\r\n");
        $response = readSMTPResponse($socket);
        if (substr($response, 0, 3) != '250') {
            fclose($socket);
            error_log("RCPT TO failed: $response");
            return false;
        }
        
        // Send DATA
        fputs($socket, "DATA\r\n");
        $response = readSMTPResponse($socket);
        if (substr($response, 0, 3) != '354') {
            fclose($socket);
            error_log("DATA command failed: $response");
            return false;
        }
        
        // Send email headers and body
        $headers = "From: $from_name <$from_email>\r\n";
        $headers .= "To: <$email>\r\n";
        $headers .= "Subject: $subject\r\n";
        $headers .= "MIME-Version: 1.0\r\n";
        $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
        $headers .= "\r\n";
        
        fputs($socket, $headers . $html_message . "\r\n.\r\n");
        $response = readSMTPResponse($socket);
        
        if (substr($response, 0, 3) != '250') {
            fclose($socket);
            error_log("SMTP Send failed: $response");
            return false;
        }
        
        // Quit
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

$error = '';
$success = '';
$show_otp_form = false;
$otp_sent = false;

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
        
        // Generate new OTP
        $otp = generateOTP(6);
        $_SESSION['registration_otp'] = $otp;
        $_SESSION['otp_expiry'] = time() + (10 * 60); // 10 minutes
        
        // Send new OTP email
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
        // OTP verified, complete registration
        $registration_data = $_SESSION['registration_data'];
        $first_name = $registration_data['first_name'];
        $last_name = $registration_data['last_name'];
        $email = $registration_data['email'];
        $password = $registration_data['password'];
        
        $conn = getDBConnection();
        
        // Double-check email doesn't exist
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
                // Clear session data
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
// Handle initial registration form submission
elseif ($_SERVER['REQUEST_METHOD'] === 'POST' && !isset($_POST['verify_otp'])) {
    $first_name = trim($_POST['first-name']);
    $last_name = trim($_POST['last-name']);
    $email = trim($_POST['email']);
    $password = $_POST['password'];
    $confirm_password = $_POST['confirm-password'];

    // Validate first name
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
            // Generate OTP
            $otp = generateOTP(6);
            
            // Store registration data and OTP in session
            $_SESSION['registration_data'] = [
                'first_name' => $first_name,
                'last_name' => $last_name,
                'email' => $email,
                'password' => $password
            ];
            $_SESSION['registration_otp'] = $otp;
            $_SESSION['otp_expiry'] = time() + (10 * 60); // 10 minutes
            
            // Send OTP email
            if (sendOTPEmail($email, $otp, $first_name)) {
                $success = 'OTP has been sent to your email. Please check your inbox and enter the code below.';
                $show_otp_form = true;
                $otp_sent = true;
            } else {
                // For development: show OTP on screen if email fails
                $error = 'Failed to send OTP email. Email server not configured.<br><br>' .
                         '<strong>Quick Setup:</strong><br>' .
                         '1. Edit <code>C:\\xampp\\sendmail\\sendmail.ini</code><br>' .
                         '2. Add your Gmail credentials (see EMAIL_SETUP.md for details)<br>' .
                         '3. Restart Apache in XAMPP Control Panel<br><br>' .
                         '<strong>For testing, use this OTP:</strong> <span style="font-size: 24px; font-weight: bold; color: #4CAF50;">' . $otp . '</span>';
                $show_otp_form = true; // Still show OTP form so user can test
            }
        }

        $stmt->close();
        $conn->close();
    }
}

// Check if OTP form should be shown (from previous submission)
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
                <h1><?php echo $show_otp_form ? 'Verify Your Email' : 'Join Our Pet Family!'; ?></h1>

                <?php if ($error): ?>
                    <div class="alert alert-error"><?php echo htmlspecialchars($error); ?></div>
                <?php endif; ?>

                <?php if ($success): ?>
                    <div class="alert alert-success"><?php echo htmlspecialchars($success); ?></div>
                <?php endif; ?>

                <?php if ($show_otp_form): ?>
                    <!-- OTP Verification Form -->
                    <p style="text-align: center; color: #666; margin-bottom: 20px;">
                        We've sent a 6-digit verification code to <strong><?php echo isset($_SESSION['registration_data']['email']) ? htmlspecialchars($_SESSION['registration_data']['email']) : ''; ?></strong>
                    </p>
                    <form class="login-form" method="POST" action="register.php" id="otpForm">
                        <div class="form-group">
                            <label for="otp">Enter Verification Code</label>
                            <input type="text" id="otp" name="otp" maxlength="6" pattern="[0-9]{6}" 
                                placeholder="000000" style="text-align: center; font-size: 24px; letter-spacing: 8px;" 
                                required autofocus>
                            <small style="display: block; text-align: center; margin-top: 10px; color: #666;">
                                Code expires in 10 minutes
                            </small>
                        </div>
                        <button type="submit" name="verify_otp" class="register-button">Verify & Complete Registration</button>
                        <p class="sign-up-text" style="text-align: center;">
                            <a href="register.php?cancel=1" onclick="if(confirm('Are you sure? This will cancel your registration.')) { return true; } return false;">Cancel Registration</a> | 
                            <a href="#" onclick="document.getElementById('resendForm').submit(); return false;" style="color: #4CAF50; text-decoration: underline;">Resend OTP</a>
                        </p>
                    </form>
                    <form method="POST" action="register.php" id="resendForm" style="display: none;">
                        <input type="hidden" name="resend_otp" value="1">
                    </form>
                <?php else: ?>
                    <!-- Registration Form -->
                    <form class="login-form" method="POST" action="register.php">
                        <div class="form-group">
                            <label for="first-name">First Name</label>
                            <input type="text" id="first-name" name="first-name"
                                value="<?php echo isset($_POST['first-name']) ? htmlspecialchars($_POST['first-name']) : ''; ?>"
                                required>
                        </div>
                        <div class="form-group">
                            <label for="last-name">Last Name</label>
                            <input type="text" id="last-name" name="last-name"
                                value="<?php echo isset($_POST['last-name']) ? htmlspecialchars($_POST['last-name']) : ''; ?>"
                                required>
                        </div>
                        <div class="form-group">
                            <label for="email">Email Address</label>
                            <input type="email" id="email" name="email"
                                value="<?php echo isset($_POST['email']) ? htmlspecialchars($_POST['email']) : ''; ?>"
                                required>
                        </div>
                        <div class="form-group">
                            <label for="password">Password</label>
                            <input type="password" id="password" name="password" required>
                            <!-- <small>Minimum 8 characters</small> -->
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
    <script>
        // OTP input handling - only allow numbers
        const otpInput = document.getElementById('otp');
        if (otpInput) {
            otpInput.addEventListener('input', function(e) {
                // Only allow numbers
                this.value = this.value.replace(/[^0-9]/g, '');
            });
            
            otpInput.addEventListener('keypress', function(e) {
                // Only allow numbers
                if (!/[0-9]/.test(e.key) && !['Backspace', 'Delete', 'Tab', 'Enter'].includes(e.key)) {
                    e.preventDefault();
                }
            });
        }
        
        // Auto-focus OTP input when page loads
        if (otpInput) {
            otpInput.focus();
        }
    </script>
</body>

</html>