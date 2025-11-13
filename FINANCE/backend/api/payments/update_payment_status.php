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

if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
    Response::error('Method not allowed', 405);
}

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['id']) || !isset($data['status'])) {
    Response::error('Payment ID and status are required');
}

$id = (int)$data['id'];
$status = $data['status'];
$payment_method = isset($data['payment_method']) ? $data['payment_method'] : null;

if (!in_array($status, ['Pending', 'Paid', 'Overdue'])) {
    Response::error('Invalid status. Must be Pending, Paid, or Overdue');
}

try {
    // Check if payment exists and get invoice_id
    $stmt = $db->prepare("SELECT id, invoice_id FROM payments WHERE id = ?");
    $stmt->execute([$id]);
    $payment = $stmt->fetch();
    
    if (!$payment) {
        Response::error('Payment not found');
    }
    
    $invoice_id = $payment['invoice_id'];
    
    if (!$invoice_id) {
        Response::error('Payment is not linked to an invoice');
    }
    
    // Update payment fields if needed
    $payment_update_fields = [];
    $payment_update_values = [];
    
    if ($payment_method !== null) {
        $payment_update_fields[] = "payment_method = ?";
        $payment_update_values[] = $payment_method;
    }
    
    if ($status === 'Paid') {
        $payment_update_fields[] = "payment_date = CURDATE()";
    }
    
    // Update payment if there are fields to update
    if (!empty($payment_update_fields)) {
        $payment_update_values[] = $id;
        $payment_sql = "UPDATE payments SET " . implode(", ", $payment_update_fields) . " WHERE id = ?";
        $payment_stmt = $db->prepare($payment_sql);
        $payment_stmt->execute($payment_update_values);
    }
    
    // Update corresponding invoice status (convert to lowercase to match enum)
    $invoiceStatus = strtolower($status);
    // Map status values to match invoice enum ('draft', 'pending', 'paid', 'overdue')
    $statusMap = [
        'paid' => 'paid',
        'pending' => 'pending',
        'overdue' => 'overdue'
    ];
    $mappedStatus = $statusMap[$invoiceStatus] ?? $invoiceStatus;
    
    // Update invoice status
    $stmt = $db->prepare("UPDATE invoices SET status = ? WHERE id = ?");
    $result = $stmt->execute([$mappedStatus, $invoice_id]);
    
    if ($result) {
        Response::success(null, 'Payment status updated successfully');
    } else {
        Response::error('Failed to update invoice status');
    }
    
} catch (Exception $e) {
    Response::error('Database error: ' . $e->getMessage());
}
?>
