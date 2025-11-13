<?php
// Simple test to verify endpoints are accessible
header('Content-Type: application/json');

$basePath = __DIR__;
$files = [
    'doctor_statistics.php',
    'doctor_surgery_fees.php',
    'doctor_detail.php'
];

$results = [];

foreach ($files as $file) {
    $filePath = $basePath . '/' . $file;
    $results[$file] = [
        'exists' => file_exists($filePath),
        'path' => $filePath,
        'readable' => is_readable($filePath)
    ];
}

echo json_encode([
    'success' => true,
    'message' => 'Endpoint test',
    'base_path' => $basePath,
    'files' => $results,
    'server_info' => [
        'php_version' => phpversion(),
        'document_root' => $_SERVER['DOCUMENT_ROOT'] ?? 'Not set',
        'script_name' => $_SERVER['SCRIPT_NAME'] ?? 'Not set',
        'request_uri' => $_SERVER['REQUEST_URI'] ?? 'Not set'
    ]
], JSON_PRETTY_PRINT);
?>

