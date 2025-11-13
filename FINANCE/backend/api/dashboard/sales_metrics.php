<?php
require_once '../../config/database.php';
require_once '../../utils/cors.php';
require_once '../../utils/response.php';

session_start();

if (!isset($_SESSION['admin_id'])) {
    Response::unauthorized('Please login first');
}

$database = new Database();
$db = $database->getConnection();

try {
    // Today's sales - try from payments first, fallback to invoices with status='paid' and today's date
    $stmt = $db->prepare("
        SELECT COALESCE(SUM(p.amount), 0) as today_sales
        FROM payments p
        WHERE DATE(p.payment_date) = CURDATE()
    ");
    $stmt->execute();
    $today_sales_payments = (float) ($stmt->fetch()['today_sales'] ?? 0);
    
    // Fallback: Today's sales from paid invoices
    $stmt = $db->prepare("
        SELECT COALESCE(SUM(inv.total_amount), 0) as today_sales
        FROM invoices inv
        WHERE inv.status = 'paid' AND DATE(inv.invoice_date) = CURDATE()
    ");
    $stmt->execute();
    $today_sales_invoices = (float) ($stmt->fetch()['today_sales'] ?? 0);
    
    // Use the larger value or sum if both exist
    $today_sales = max($today_sales_payments, $today_sales_invoices);
    
    // Total revenue (all time) - from payments
    $stmt = $db->prepare("
        SELECT COALESCE(SUM(p.amount), 0) as total_revenue
        FROM payments p
    ");
    $stmt->execute();
    $total_revenue_payments = (float) ($stmt->fetch()['total_revenue'] ?? 0);
    
    // Fallback: Total revenue from paid invoices
    $stmt = $db->prepare("
        SELECT COALESCE(SUM(inv.total_amount), 0) as total_revenue
        FROM invoices inv
        WHERE inv.status = 'paid'
    ");
    $stmt->execute();
    $total_revenue_invoices = (float) ($stmt->fetch()['total_revenue'] ?? 0);
    
    // Use payments if available, otherwise use invoices
    $total_revenue = $total_revenue_payments > 0 ? $total_revenue_payments : $total_revenue_invoices;
    
    // Pending invoices (pending/draft) - return amount, not count
    $stmt = $db->prepare("
        SELECT 
            COUNT(*) as pending_count,
            COALESCE(SUM(inv.total_amount), 0) as pending_amount
        FROM invoices inv
        WHERE inv.status IN ('pending', 'draft')
    ");
    $stmt->execute();
    $pending = $stmt->fetch();
    $pending_amount = (float) ($pending['pending_amount'] ?? 0);
    
    // Paid revenue - from payments linked to paid invoices, or directly from paid invoices
    $stmt = $db->prepare("
        SELECT COALESCE(SUM(p.amount), 0) as paid_revenue
        FROM payments p
        INNER JOIN invoices inv ON p.invoice_id = inv.id
        WHERE inv.status = 'paid'
    ");
    $stmt->execute();
    $paid_revenue_payments = (float) ($stmt->fetch()['paid_revenue'] ?? 0);
    
    // Fallback: Paid revenue from paid invoices directly
    $stmt = $db->prepare("
        SELECT COALESCE(SUM(inv.total_amount), 0) as paid_revenue
        FROM invoices inv
        WHERE inv.status = 'paid'
    ");
    $stmt->execute();
    $paid_revenue_invoices = (float) ($stmt->fetch()['paid_revenue'] ?? 0);
    
    // Use payments if available, otherwise use invoices
    $paid_revenue = $paid_revenue_payments > 0 ? $paid_revenue_payments : $paid_revenue_invoices;
    
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
