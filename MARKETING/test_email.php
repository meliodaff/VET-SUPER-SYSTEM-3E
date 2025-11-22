<?php
// Test email sending function
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Gmail SMTP Configuration
$smtp_host = 'smtp.gmail.com';
$smtp_port = 587;
$smtp_user = 'furevercare8@gmail.com';
$smtp_pass = 'ykvsjopxjppczxwp';
$test_email = 'furevercare8@gmail.com'; // Send to yourself for testing

echo "<h2>Testing Gmail SMTP Connection</h2>";

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

try {
    echo "<p>Step 1: Connecting to $smtp_host:$smtp_port...</p>";
    $socket = @stream_socket_client("tcp://$smtp_host:$smtp_port", $errno, $errstr, 30);
    if (!$socket) {
        die("<p style='color:red;'>Connection failed: $errstr ($errno)</p>");
    }
    echo "<p style='color:green;'>✓ Connected successfully</p>";
    
    stream_set_timeout($socket, 30);
    
    echo "<p>Step 2: Reading server greeting...</p>";
    $response = readSMTPResponse($socket);
    echo "<pre>$response</pre>";
    if (substr($response, 0, 3) != '220') {
        fclose($socket);
        die("<p style='color:red;'>Server greeting failed</p>");
    }
    echo "<p style='color:green;'>✓ Server greeting OK</p>";
    
    echo "<p>Step 3: Sending EHLO...</p>";
    fputs($socket, "EHLO " . gethostname() . "\r\n");
    $response = readSMTPResponse($socket);
    echo "<pre>$response</pre>";
    echo "<p style='color:green;'>✓ EHLO OK</p>";
    
    echo "<p>Step 4: Starting TLS...</p>";
    fputs($socket, "STARTTLS\r\n");
    $response = readSMTPResponse($socket);
    echo "<pre>$response</pre>";
    if (substr($response, 0, 3) != '220') {
        fclose($socket);
        die("<p style='color:red;'>STARTTLS failed</p>");
    }
    echo "<p style='color:green;'>✓ STARTTLS OK</p>";
    
    echo "<p>Step 5: Enabling TLS encryption...</p>";
    if (!stream_socket_enable_crypto($socket, true, STREAM_CRYPTO_METHOD_TLS_CLIENT)) {
        fclose($socket);
        die("<p style='color:red;'>TLS encryption failed</p>");
    }
    echo "<p style='color:green;'>✓ TLS encryption enabled</p>";
    
    echo "<p>Step 6: Sending EHLO after TLS...</p>";
    fputs($socket, "EHLO " . gethostname() . "\r\n");
    $response = readSMTPResponse($socket);
    echo "<pre>$response</pre>";
    echo "<p style='color:green;'>✓ EHLO after TLS OK</p>";
    
    echo "<p>Step 7: Authenticating...</p>";
    fputs($socket, "AUTH LOGIN\r\n");
    $response = readSMTPResponse($socket);
    echo "<pre>$response</pre>";
    
    fputs($socket, base64_encode($smtp_user) . "\r\n");
    $response = readSMTPResponse($socket);
    echo "<pre>$response</pre>";
    
    fputs($socket, base64_encode($smtp_pass) . "\r\n");
    $response = readSMTPResponse($socket);
    echo "<pre>$response</pre>";
    if (substr($response, 0, 3) != '235') {
        fclose($socket);
        die("<p style='color:red;'>Authentication failed: $response</p>");
    }
    echo "<p style='color:green;'>✓ Authentication successful</p>";
    
    echo "<p>Step 8: Sending test email...</p>";
    fputs($socket, "MAIL FROM: <$smtp_user>\r\n");
    $response = readSMTPResponse($socket);
    echo "<pre>$response</pre>";
    
    fputs($socket, "RCPT TO: <$test_email>\r\n");
    $response = readSMTPResponse($socket);
    echo "<pre>$response</pre>";
    
    fputs($socket, "DATA\r\n");
    $response = readSMTPResponse($socket);
    echo "<pre>$response</pre>";
    
    $subject = "Test Email from FUR-EVER CARE";
    $message = "This is a test email to verify SMTP configuration.";
    $headers = "From: FUR-EVER CARE <$smtp_user>\r\n";
    $headers .= "To: <$test_email>\r\n";
    $headers .= "Subject: $subject\r\n";
    $headers .= "\r\n";
    
    fputs($socket, $headers . $message . "\r\n.\r\n");
    $response = readSMTPResponse($socket);
    echo "<pre>$response</pre>";
    
    if (substr($response, 0, 3) == '250') {
        echo "<p style='color:green;'><strong>✓ Email sent successfully!</strong></p>";
        echo "<p>Check your inbox at $test_email</p>";
    } else {
        echo "<p style='color:red;'>Email sending failed: $response</p>";
    }
    
    fputs($socket, "QUIT\r\n");
    fclose($socket);
    
} catch (Exception $e) {
    echo "<p style='color:red;'>Exception: " . $e->getMessage() . "</p>";
    if (isset($socket) && $socket) {
        fclose($socket);
    }
}
?>

