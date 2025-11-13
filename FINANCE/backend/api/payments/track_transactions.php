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

$limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 20;

try {
    $stmt = $db->prepare("
        SELECT 
            p.id,
            p.payment_method,
            p.amount,
            p.status,
            p.payment_date,
            p.created_at,
            i.invoice_number,
            i.client_name
        FROM payments p
        JOIN invoices i ON p.invoice_id = i.id
        ORDER BY p.created_at DESC
        LIMIT ?
    ");
    $stmt->execute([$limit]);
    $transactions = $stmt->fetchAll();
    
    Response::success($transactions);
    
} catch (Exception $e) {
    Response::error('Database error: ' . $e->getMessage());
}
?>
