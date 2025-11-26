<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

require_once __DIR__ . '/../vendor/autoload.php';

function sendMail(
    $toEmail,
    $toName,
    $subject,
    $htmlMessage,
    $plainMessage = '',
    $attachments = []
) {
    $mail = new PHPMailer(true);

    try {

          // ============ ENABLE DEBUG MODE ============
        // $mail->SMTPDebug = SMTP::DEBUG_SERVER;  // Shows detailed server messages
        // $mail->Debugoutput = 'html';            // Format as HTML
        // ===========================================
        // Server settings
        $mail->isSMTP();
        $mail->Host       = 'smtp.gmail.com';   // your SMTP server
        $mail->SMTPAuth   = true;
        $mail->Username   = 'furevercareservices@gmail.com';    // your SMTP username
        $mail->Password   = 'vaooksmssjmmvhaj';      // your SMTP password
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port       = 587;

        // Recipients
        $mail->setFrom('furevercareservices@gmail.com', 'Fur-Ever Care');
        $mail->addAddress($toEmail, $toName);

        // Add attachments (if any)
        if (!empty($attachments)) {
            foreach ($attachments as $filePath) {
                if (file_exists($filePath)) {
                    $mail->addAttachment($filePath);
                }
            }
        }

        // Content
        $mail->isHTML(true);
        $mail->Subject = $subject;
        $mail->Body    = $htmlMessage;
        $mail->AltBody = $plainMessage ?: strip_tags($htmlMessage);

        // Send
        $mail->send();
        return ['success' => true, 'message' => 'Email sent successfully!'];

    } catch (Exception $e) {
        return ['success' => false, 'message' => "Mailer Error: {$mail->ErrorInfo}"];
    }
}
