<?php
/**
 * API Proxy Bridge
 * This file routes all frontend API requests to the correct backend endpoints
 * Place this file at: /VET-SUPER-SYSTEM-3E/FINANCE/backend/api/index.php
 */

require_once '../config/database.php';
require_once '../utils/cors.php';
require_once '../utils/response.php';

// Get the request path
$request_path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Remove the base path and get the endpoint
$base_path = '/VET-SUPER-SYSTEM-3E/FINANCE/backend/api';
$endpoint = str_replace($base_path, '', $request_path);

// Remove leading slash
if (substr($endpoint, 0, 1) === '/') {
    $endpoint = substr($endpoint, 1);
}

// Build the full path to the endpoint file
$endpoint_file = __DIR__ . '/' . $endpoint;

// Log for debugging
error_log("API Request: Method={$_SERVER['REQUEST_METHOD']}, Endpoint={$endpoint}, File={$endpoint_file}");

// Check if the endpoint file exists
if (!file_exists($endpoint_file)) {
    // Try without .php if not found
    if (!file_exists($endpoint_file) && substr($endpoint_file, -4) !== '.php') {
        $endpoint_file .= '.php';
    }
}

// Verify the file exists and is in the api directory
if (file_exists($endpoint_file) && strpos(realpath($endpoint_file), realpath(__DIR__)) === 0) {
    // Include and execute the endpoint file
    include $endpoint_file;
} else {
    error_log("Endpoint not found: {$endpoint_file}");
    Response::error("Endpoint not found: {$endpoint}", 404);
}
?>
