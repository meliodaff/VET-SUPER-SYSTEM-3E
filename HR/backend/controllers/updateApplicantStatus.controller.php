<?php
require_once __DIR__ . "/../utils/sendMail.php";
     
    function updateApplicantStatus($id, $status, $applicantDetails, $pdo) {
        $query = "UPDATE applicants SET status = :status WHERE applicant_id = :applicant_id ";
        $queryForAddingApplicantForInterview = "INSERT INTO interviews (applicant_id, interview_date, interview_time, location, notes, mode)
        VALUES (:applicant_id, :interview_date, :interview_time, :location, :notes, :mode)";

        

        $queryForGettingTheApplicantDetails = "SELECT 
a.applicant_id,
a.first_name,
a.last_name,
a.job_applied_for,
a.email,
i.interview_date,
i.interview_time,
i.location,
a.status
FROM applicants a
JOIN interviews i
ON a.applicant_id = i.applicant_id
WHERE a.applicant_id = :applicant_id";
        try {
            $stmt = $pdo->prepare($query);
            $stmt->execute([
                ":applicant_id" => $id,
                ":status" => $status
            ]);

            $stmtForAddingApplicantForInterview = $pdo->prepare($queryForAddingApplicantForInterview);
            $stmtForAddingApplicantForInterview->execute([
                ":applicant_id" => $id,
                ":interview_date" => $applicantDetails['interviewDate'],
                ":interview_time" => $applicantDetails['interviewTime'],
                ":location" => $applicantDetails['interviewLocation'],
                ":notes" => $applicantDetails['notes'],
                ":mode" => $applicantDetails['mode'],
            ]);


             $stmtDetails = $pdo->prepare($queryForGettingTheApplicantDetails);
             $stmtDetails->execute([":applicant_id" => $id]);

        // Fetch data as associative array
        $applicantDetails = $stmtDetails->fetch(PDO::FETCH_ASSOC);


         $result = sendMail(
    $applicantDetails["email"],
    $applicantDetails["first_name"] . ' ' . $applicantDetails["last_name"],
    'For Interview',
    <<<HTML
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
            background-color: #f4f4f4;
            font-family: Arial, Helvetica, sans-serif;
            color: #333;
        }
        .email-container {
            max-width: 650px;
            margin: 30px auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .header {
            background: linear-gradient(135deg, #5865F2 0%, #8A2BE2 100%);
            padding: 35px 20px;
            text-align: center;
            color: #ffffff;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            letter-spacing: 1px;
        }
        .content {
            padding: 40px 35px;
            line-height: 1.7;
            font-size: 16px;
        }
        .info-box {
            background-color: #f9f9fb;
            border-left: 4px solid #5865F2;
            padding: 20px;
            margin: 25px 0;
            border-radius: 4px;
        }
        .info-box p {
            margin: 8px 0;
            font-size: 15px;
        }
        .footer {
            background-color: #f5f5f5;
            padding: 25px;
            text-align: center;
            font-size: 13px;
            color: #777;
        }
        .button {
            display: inline-block;
            padding: 12px 25px;
            margin-top: 15px;
            background-color: #5865F2;
            color: #ffffff !important;
            text-decoration: none;
            border-radius: 4px;
            font-weight: bold;
            font-size: 15px;
        }
        .button:hover {
            background-color: #4752c4;
        }
        @media only screen and (max-width: 600px) {
            .content { padding: 25px 20px; }
            .header h1 { font-size: 24px; }
        }
    </style>
</head>
<body>
    <div class='email-container'>
        
        <!-- Header -->
        <div class='header'>
            <h1>FUR-EVER CARE</h1>
            <p style='margin-top: 8px; font-size: 14px;'>Recruitment Department</p>
        </div>

        <!-- Content -->
        <div class='content'>
            <p>Dear <strong>{$applicantDetails["first_name"]} {$applicantDetails["last_name"]}</strong>,</p>

            <p>Thank you for your interest in joining <strong>FUR-EVER CARE</strong>. We are pleased to inform you that you have been shortlisted for the position of <strong>{$applicantDetails["job_applied_for"]}</strong>. We believe your qualifications and experience make you a strong candidate for the role.</p>

            <p>We are inviting you to attend an interview as per the details below:</p>

            <div class='info-box'>
                <p><strong>Date:</strong> {$applicantDetails["interview_date"]}</p>
                <p><strong>Time:</strong> {$applicantDetails["interview_time"]}</p>
                <p><strong>Location/Meeting Link:</strong> {$applicantDetails["location"]}</p>
            </div>

            <p>We look forward to speaking with you and learning more about how you can contribute to our team.</p>

            <p>Best regards,<br>
            <strong>FUR-EVER CARE Recruitment Team</strong></p>
        </div>

        <!-- Footer -->
        <div class='footer'>
            © 2024 FUR-EVER CARE. All rights reserved.<br>
            This email was sent by FUR-EVER CARE HR Department.
        </div>
    </div>
</body>
</html>
HTML
);


            $response = [
                "success" => true,
                "message" => "Updated successfully",
                
            ];
        } catch (PDOException $e) {
            $response = [
                "success" => false,
                "error" => $e->getMessage()
            ];
            }
            return $response;
    }

?>