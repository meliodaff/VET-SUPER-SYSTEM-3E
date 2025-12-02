<?php
require_once '../../config/database.php';
require_once '../../utils/cors.php';
require_once '../../utils/response.php';

// Connect to appointment_sia database for sales data
$host = 'localhost';
$db_name = 'appointment_sia';
$username = 'root';
$password = '';

try {
    $db = new PDO(
        "mysql:host=$host;dbname=$db_name",
        $username,
        $password
    );
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $db->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch(PDOException $e) {
    Response::error('Database connection failed: ' . $e->getMessage());
}

if (!$db) {
    Response::error('Database connection failed');
}

try {
    // Today's sales from book_appointment table
    $stmt = $db->prepare("
        SELECT COALESCE(SUM(service_price), 0) as today_sales
        FROM book_appointment
        WHERE DATE(date) = CURDATE() AND payment_status = 'Paid'
    ");
    $stmt->execute();
    $today_sales = (float) ($stmt->fetch()['today_sales'] ?? 0);
    
    // Total revenue (all time) from paid appointments
    $stmt = $db->prepare("
        SELECT COALESCE(SUM(service_price), 0) as total_revenue
        FROM book_appointment
        WHERE payment_status = 'Paid'
    ");
    $stmt->execute();
    $total_revenue = (float) ($stmt->fetch()['total_revenue'] ?? 0);
    
    // Pending invoices (Pending status) - return amount
    $stmt = $db->prepare("
        SELECT 
            COUNT(*) as pending_count,
            COALESCE(SUM(service_price), 0) as pending_amount
        FROM book_appointment
        WHERE payment_status = 'Pending'
    ");
    $stmt->execute();
    $pending = $stmt->fetch();
    $pending_amount = (float) ($pending['pending_amount'] ?? 0);
    
    // Paid revenue from paid appointments
    $stmt = $db->prepare("
        SELECT COALESCE(SUM(service_price), 0) as paid_revenue
        FROM book_appointment
        WHERE payment_status = 'Paid'
    ");
    $stmt->execute();
    $paid_revenue = (float) ($stmt->fetch()['paid_revenue'] ?? 0);
    
    // Log for debugging
    error_log("Sales Metrics - Today Sales: " . $today_sales . ", Total Revenue: " . $total_revenue . ", Pending: " . $pending_amount . ", Paid: " . $paid_revenue);
    
    Response::success([
        'today_sales' => $today_sales,
        'total_revenue' => $total_revenue,
        'pending_invoices' => $pending_amount,
        'pending_amount' => $pending_amount,
        'paid_revenue' => $paid_revenue
    ]);
    
} catch (Exception $e) {
    error_log("Sales Metrics Error: " . $e->getMessage());
    Response::error('Database error: ' . $e->getMessage());
}
?>
