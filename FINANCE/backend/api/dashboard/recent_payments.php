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

$limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 5;

try {
    $limit = max(1, min($limit, 20));
    
    $stmt = $db->prepare("
        SELECT 
            p.id,
            p.payment_method,
            p.amount,
            p.payment_date,
            inv.invoice_number,
            inv.status AS invoice_status,
            COALESCE(pt.owner_name, 'Walk-in Client') AS client_name
        FROM payments p
        JOIN invoices inv ON p.invoice_id = inv.id
        LEFT JOIN patients pt ON inv.patient_id = pt.id
        ORDER BY p.payment_date DESC, p.id DESC
        LIMIT $limit
    ");
    $stmt->execute();
    $rows = $stmt->fetchAll();
    
    $statusLabelMap = [
        'pending' => 'Pending',
        'draft' => 'Pending',
        'paid' => 'Paid',
        'overdue' => 'Overdue'
    ];
    
    $recent_payments = array_map(function ($payment) use ($statusLabelMap) {
        $status = strtolower($payment['invoice_status']);
        return [
            'id' => (int) $payment['id'],
            'invoice_number' => $payment['invoice_number'],
            'client_name' => $payment['client_name'],
            'amount' => (float) $payment['amount'],
            'payment_method' => ucwords(str_replace('_', ' ', $payment['payment_method'])),
            'payment_date' => $payment['payment_date'],
            'status' => $statusLabelMap[$status] ?? ucfirst($status)
        ];
    }, $rows);
    
    Response::success($recent_payments);
    
} catch (Exception $e) {
    Response::error('Database error: ' . $e->getMessage());
}
?>
