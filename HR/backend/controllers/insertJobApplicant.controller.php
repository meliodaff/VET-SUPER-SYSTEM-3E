<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../utils/checkDuplicateEmailForApplicant.php';


function insertJobApplicant($pdo, $postData, $files) {
    // Absolute paths for saving
    $targetDirPhoto  = __DIR__ . "/../uploads/photos/";
    $targetDirResume = __DIR__ . "/../uploads/resumes/";

    // Ensure folders exist
    if (!is_dir($targetDirPhoto))  mkdir($targetDirPhoto, 0777, true);
    if (!is_dir($targetDirResume)) mkdir($targetDirResume, 0777, true);



    // Check duplicate email
    $isDuplicateEmail = checkDuplicateEmailForApplicant($postData["email"], $pdo);
    if ($isDuplicateEmail["isExist"]) {
        http_response_code(409);
        return [
            "success" => false,
            "message" => $isDuplicateEmail["message"]
        ];
    }

    // Unique filenames
    $photoName  = uniqid("photo_")  . "_" . basename($files["photo"]["name"]);
    $resumeName = uniqid("resume_") . "_" . basename($files["resume"]["name"]);

    // Absolute paths for moving
    $photoPathAbs  = $targetDirPhoto  . $photoName;
    $resumePathAbs = $targetDirResume . $resumeName;

    // Relative paths for DB
    $photoPathRel  = "uploads/photos/" . $photoName;
    $resumePathRel = "uploads/resumes/" . $resumeName;

    // Upload files
    if (!move_uploaded_file($files["photo"]["tmp_name"], $photoPathAbs)) {
        return ["success" => false, "message" => "Photo upload failed."];
    }

    if (!move_uploaded_file($files["resume"]["tmp_name"], $resumePathAbs)) {
        return ["success" => false, "message" => "Resume upload failed."];
    }

    // Insert into DB
    try {
        $stmt = $pdo->prepare("
            INSERT INTO applicants 
                (job_applied_for, first_name, middle_name, last_name, address, email, phone_number, id_picture_url, resume_url, status) 
            VALUES 
                (:job_applied_for, :firstName, :middleName, :lastName, :address, :email, :phoneNumber, :id_picture_url, :resume_url, :status)
        ");

        $stmt->execute([
            ':job_applied_for' => $postData['position'],
            ':firstName'       => $postData['firstName'],
            ':middleName'       => $postData['middleName'],
            ':lastName'        => $postData['lastName'],
            ':address'         => $postData['address'],
            ':email'           => $postData['email'],
            ':phoneNumber'     => $postData['phoneNumber'],
            ':id_picture_url'  => $photoPathRel,   // ✅ relative path
            ':resume_url'      => $resumePathRel,  // ✅ relative path
            ':status'          => "New"
        ]);

        return [
            "success" => true,
            "message" => "Applicant data uploaded successfully!"
        ];

    } catch (PDOException $e) {
        return [
            "success" => false,
            "message" => "Database error: " . $e->getMessage()
        ];
    }
}

