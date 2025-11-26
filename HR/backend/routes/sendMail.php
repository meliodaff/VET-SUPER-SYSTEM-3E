<?php
require_once __DIR__ . '/../config/config.php';
include_once __DIR__ . "/../config/database.php";
require_once __DIR__ . "/../auth/login.controller.php";
include_once __DIR__ . "/../config/cors.php";
require_once __DIR__ . "/../utils/validateForm.php";
require_once __DIR__ . "/../utils/sendMail.php";

// qjatetdplchhlyds

    $result = sendMail(
    'bialen.jv.distor@gmail.com',
    'Jv Bialen',
    'For Interview',
    "
    <!DOCTYPE html>
<html lang='en'>
<head>
    <meta charset='UTF-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    <title>Interview Invitation</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: Arial, Helvetica, sans-serif;
            background-color: #f4f4f4;
        }
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 40px 20px;
            text-align: center;
        }
        .header h1 {
            color: #ffffff;
            margin: 0;
            font-size: 28px;
        }
        .content {
            padding: 40px 30px;
            color: #333333;
            line-height: 1.6;
        }
        .content h2 {
            color: #667eea;
            font-size: 24px;
            margin-bottom: 15px;
        }
        .content p {
            margin: 15px 0;
            font-size: 16px;
        }
        .button {
            display: inline-block;
            padding: 15px 30px;
            margin: 20px 0;
            background-color: #667eea;
            color: #ffffff;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
        }
        .button:hover {
            background-color: #5568d3;
        }
        .info-box {
            background-color: #f8f9fa;
            border-left: 4px solid #667eea;
            padding: 20px;
            margin: 20px 0;
        }
        .footer {
            background-color: #f8f9fa;
            padding: 30px;
            text-align: center;
            color: #666666;
            font-size: 14px;
        }
        .footer a {
            color: #667eea;
            text-decoration: none;
        }
        .social-links {
            margin: 20px 0;
        }
        .social-links a {
            display: inline-block;
            margin: 0 10px;
            color: #667eea;
            text-decoration: none;
        }
        @media only screen and (max-width: 600px) {
            .content {
                padding: 20px 15px;
            }
            .header h1 {
                font-size: 24px;
            }
        }
    </style>
</head>
<body>
    <div class='email-container'>
        <!-- Header -->
        <div class='header'>
            <h1>FUR-EVER CARE</h1>
        </div>

        <!-- Content -->
        <div class='content'>
            <h2>Interview Invitation</h2>
            
            <p>Dear [Applicant Name],</p>
            
            <p>Thank you for your interest in joining <strong>FUR-EVER CARE</strong>. We are pleased to inform you that you have been shortlisted for the position of <strong>[Position Name]</strong>.</p>

            <p>We would like to invite you for an interview to further discuss your qualifications and get to know you better.</p>

            <!-- Info Box -->
            <div class='info-box'>
                <strong>Interview Details:</strong>
                <p><strong>Date:</strong> [Interview Date]</p>
                <p><strong>Time:</strong> [Interview Time]</p>
                <p><strong>Mode:</strong> [Online / On-site]</p>
                <p><strong>Location / Meeting Link:</strong> [Office Address or Link]</p>
            </div>

            <p>Please confirm your attendance by clicking the button below or replying to this email.</p>

            <!-- Call to Action Button -->
            <center>
                <a href='[Confirmation Link]' class='button'>Confirm My Interview</a>
            </center>

            <p>Should you have any questions or need further assistance, feel free to contact us at <a href='mailto:[HR Email]'>[HR Email]</a>.</p>

            <p>We look forward to meeting you!</p>

            <p>Best regards,<br>
            <strong>FUR-EVER CARE Recruitment Team</strong></p>
        </div>

        <!-- Footer -->
        <div class='footer'>
            <div class='social-links'>
                <a href='#'>Facebook</a> |
                <a href='#'>Twitter</a> |
                <a href='#'>LinkedIn</a>
            </div>
            
            <p>© 2024 FUR-EVER CARE. All rights reserved.</p>
            
            <p>
                <a href='#'>Unsubscribe</a> | 
                <a href='#'>Privacy Policy</a> | 
                <a href='#'>Contact Us</a>
            </p>
            
            <p style='color: #999999; font-size: 12px; margin-top: 15px;'>
                This email was sent to you because you applied for a position at FUR-EVER CARE.<br>
                FUR-EVER CARE, Your Address Here
            </p>
        </div>
    </div>
</body>
</html>

    "
);

print_r($result);


?>
