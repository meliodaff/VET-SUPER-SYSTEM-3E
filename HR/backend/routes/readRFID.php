<?php
$serialPort = "\\\\.\\COM11"; 
$baudRate   = "9600";
require_once __DIR__ . "/../utils/isRFIDExists.php";
require_once __DIR__ . "/../config/database.php";
require_once __DIR__ . "/../controllers/timeIn.controller.php";
require_once __DIR__ . "/../controllers/timeOut.controller.php";
require_once __DIR__ . "/../utils/checkIfTimeIn.php";
require_once __DIR__ . "/../utils/availableToCheckOut.php";
require_once __DIR__ . "/../utils/checkIfEmployeeHasDuty.php";
require_once __DIR__ . "/../utils/isDutyDone.php";
require_once __DIR__ . "/../utils/getPhoto.php";
require_once __DIR__ . "/../utils/isForgotToTimeOut.php";

require __DIR__ . '/../vendor/autoload.php'; // WebSocket client

use WebSocket\Client;

// Function to broadcast to WebSocket server
function sendToWebSocket($data) {
    try {
        $client = new Client("ws://localhost:8080/rfid"); // Make sure ws-server.php is running
        $client->send(json_encode($data));
    } catch (\Exception $e) {
        echo "⚠️ WebSocket error: " . $e->getMessage() . "\n";
    }
}

function sendMessageToClient($client, $employeeId, $line, $fullName, $message, $type, $timeIn = null, $timeOut = null, $photo = null) {
     $client->send(json_encode([
                    // "employee_id" => $employeeId,
                    // "rfid" => $line,
                    "name" => $fullName,
                    "message" => $message,
                    "type" => $type,
                    "timeIn" => $timeIn,
                    "timeOut" => $timeOut,
                    "timestamp" => date("Y-m-d H:i:s"),
                    "photo" => $photo
                ]));
}


$fp = fopen($serialPort, "r");
if (!$fp) {
    die("Error: Unable to open $serialPort");
}

date_default_timezone_set("Asia/Manila");

$client = new Client("ws://localhost:8080/rfid"); // open once

while (true) {
    $line = trim(fgets($fp));
    
    if ($line && $line !== "READY") {
        $response = isRFIDExists($line, $pdo);
        echo $line . "\n";
        echo "tapped\n";

        //  $client->send(json_encode([
        //     "employee_id" => 1,
        //     "rfid" => "myRFID",
        //     "name" => "Jv Bialen",
        //     "message" => "This is my Message",
        //     "type" => "time in or time out",
        //     "timestamp" => date("Y-m-d H:i:s")
        // ]));
            
        // echo "sent\n";
        // continue;
        // echo "i shouldnt be displayed";
        
        
        if (!$response["isExist"]) {
            echo "RFID is not registered\n";
            sendMessageToClient($client, "No ID", " - ", $response["full_name"] ?? "No Name", $response["message"], "time_in");
            continue;
        }
        
        $employeeId = $response["employeeId"];

        $photo = getPhoto($employeeId, $pdo);
        $photo = $photo["profile_image_url"];
        echo "------------------------------------------------";
        echo $photo;
        echo "------------------------------------------------";

        $hasDuty = isEmployeeHasDuty($employeeId, $pdo);
        if (!$hasDuty["hasDuty"]) {
            // echo $hasDuty["message"] . "\n";

            sendMessageToClient($client, $employeeId, $line, $response["full_name"], $hasDuty["message"], "time_in", null, null, $photo);

            continue;
        }

        $isDutyDone = isDutyDone($employeeId, $pdo);
        if ($isDutyDone["isDone"]) {
            echo $isDutyDone["message"] . "\n";

                sendMessageToClient($client, $employeeId, $line, $response["full_name"], $isDutyDone["message"], "time_out", $isDutyDone["timeIn"], $isDutyDone["timeOut"], $photo);
            continue;
        }

        $isTimeIn = checkIfTimeIn($employeeId, $pdo);

        if ($isTimeIn["isTimeIn"]) {
            $isAvailableToCheckOut = isAvailableToCheckOut($employeeId, $pdo);
            if (!$isAvailableToCheckOut["isAvailable"]) {
                echo "{$isAvailableToCheckOut["message"]}\n";
                sendMessageToClient($client, $employeeId, $line, $response["full_name"], $isAvailableToCheckOut["message"], "time_out", $isAvailableToCheckOut["timeIn"], null,   $photo);
                continue;
            } else {
                $responseFromTimeOutController = timeOut($employeeId, $line, $pdo);
                echo "{$responseFromTimeOutController["message"]}\n";

                sendMessageToClient($client, $employeeId, $line, $response["full_name"], $responseFromTimeOutController["message"], "time_out", $responseFromTimeOutController["timeIn"], date("h:i:s A"), $photo);

                continue;
            }
        }

       

        $responseFromIsForgotToTimeOut = isForgotToTimeOut($employeeId, $pdo);

        if($responseFromIsForgotToTimeOut["isForgotToTimeOut"]){
            // sendMessageToClient($client, $employeeId, $line, $response["full_name"], $responseFromIsForgotToTimeOut["message"], "time_in", $responseFromIsForgotToTimeOut["timeIn"], null, $photo);
            // continue;
            $messageFromIsForgotToTimeOut = $responseFromIsForgotToTimeOut["message"];
        }


        //  if (date("H:i:s") >= '13:00:00') {
        //     echo "Time in not available past 1 PM \n";
        //     sendMessageToClient($client, $employeeId, $line, $response["full_name"], "Time in not available past 1 PM", "time_in", null, null, $photo);
        //     continue;
        // }
        
        if (date("H:i:s") <= '07:00:00') {
            sendMessageToClient($client, $employeeId, $line, $response["full_name"], "Time in not available until 7 AM", "time_in", null, null, $photo);
            echo "Time in not available until 7 AM \n";
            continue;
        }

        $attendanceStatus = "Present";
        if(strtotime(date("H:i")) > strtotime("09:15")){
            $attendanceStatus = "Late";
        }
            

        $responseFromTimeInController = timeIn($employeeId, $attendanceStatus, $line, $pdo);
        echo "{$responseFromTimeInController["message"]}\n";
        
        sendMessageToClient($client, $employeeId, $line, $response["full_name"], ($messageFromIsForgotToTimeOut ?? " ") . " <br/>" . $responseFromTimeInController["message"], "time_in", date("h:i:s A"), null, $photo);

        // Broadcast time-in info to React via WebSocket
        // sendToWebSocket([
        //     "employee_id" => $employeeId,
        //     "rfid" => $line,
        //     "name" => $response["full_name"],
        //     "message" => $responseFromTimeInController["message"],
        //     "type" => "time_in",
        //     "timestamp" => date("Y-m-d H:i:s")
        // ]);
   
        // $client->send(json_encode([
        //     "employee_id" => 1,
        //     "rfid" => "myRFID",
        //     "name" => "Jv Bialen",
        //     "message" => "This is my Message",
        //     "type" => "time in or time out",
        //     "timestamp" => date("Y-m-d H:i:s")
        // ]));
    }

    flush();
}

fclose($fp);
