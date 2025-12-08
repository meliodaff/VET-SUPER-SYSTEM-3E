<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

error_reporting(0);
ini_set('display_errors', 0);

$apiKey = 'AIzaSyChYap9dcHbsEHZw9LRNhZDNHmCPPx4CMg';
$input = json_decode(file_get_contents('php://input'), true);

$message = $input['message'] ?? '';
$systemPrompt = $input['systemPrompt'] ?? '';
$history = $input['history'] ?? [];

$context = '';
foreach ($history as $msg) {
    $role = $msg['role'] === 'user' ? 'User' : 'Assistant';
    $context .= "$role: {$msg['content']}\n";
}

$fullPrompt = $systemPrompt . "\n\n" . $context . "User: " . $message;

$payload = [
    'contents' => [
        [
            'parts' => [
                ['text' => $fullPrompt]
            ]
        ]
    ],
    'generationConfig' => [
        'temperature' => 0.7,
        'maxOutputTokens' => 500
    ]
];

$ch = curl_init("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-001:generateContent?key=" . $apiKey);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);

$result = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode === 200) {
    $data = json_decode($result, true);
    if (isset($data['candidates'][0]['content']['parts'][0]['text'])) {
        echo json_encode([
            'success' => true,
            'reply' => $data['candidates'][0]['content']['parts'][0]['text']
        ]);
        exit;
    }
}

echo json_encode(['success' => false, 'error' => "API Error: $httpCode"]);
exit;