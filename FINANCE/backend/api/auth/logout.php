<?php
require_once '../../utils/cors.php';
require_once '../../utils/response.php';

session_start();

// Destroy session
session_destroy();

Response::success(null, 'Logged out successfully');
?>
