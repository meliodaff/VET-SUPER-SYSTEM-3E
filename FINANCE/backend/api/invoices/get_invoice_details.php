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

$invoice_id = isset($_GET['id']) ? (int)$_GET['id'] : 0;

if ($invoice_id <= 0) {
    Response::error('Invoice ID is required');
}

try {
    // Get invoice details
    $stmt = $db->prepare("
        SELECT 
            inv.id,
            inv.invoice_number,
            inv.invoice_date,
            inv.due_date,
            inv.total_amount,
            inv.status,
            inv.created_at,
            COALESCE(p.owner_name, 'Walk-in Client') AS client_name,
            p.contact_phone AS client_phone
        FROM invoices inv
        LEFT JOIN patients p ON inv.patient_id = p.id
        WHERE inv.id = ?
    ");
    $stmt->execute([$invoice_id]);
    $invoice = $stmt->fetch();
    
    if (!$invoice) {
        Response::error('Invoice not found');
    }
    
    // Get invoice items (services/products)
    $stmt = $db->prepare("
        SELECT 
            ii.id,
            ii.service_id,
            ii.quantity,
            ii.unit_price,
            ii.line_total,
            s.name AS service_name,
            s.category AS service_category,
            s.description AS service_description
        FROM invoice_items ii
        LEFT JOIN services s ON ii.service_id = s.id
        WHERE ii.invoice_id = ?
        ORDER BY ii.id ASC
    ");
    $stmt->execute([$invoice_id]);
    $invoice_items = $stmt->fetchAll();
    
    // Get payments/transactions for this invoice
    $stmt = $db->prepare("
        SELECT 
            p.id,
            p.amount,
            p.payment_date,
            p.payment_method,
            p.reference_number,
            p.created_at
        FROM payments p
        WHERE p.invoice_id = ?
        ORDER BY p.payment_date DESC, p.id DESC
    ");
    $stmt->execute([$invoice_id]);
    $payments = $stmt->fetchAll();
    
    // Calculate totals
    $total_paid = 0;
    foreach ($payments as $payment) {
        $total_paid += (float)$payment['amount'];
    }
    $balance = (float)$invoice['total_amount'] - $total_paid;
    
    // Map status
    $statusMap = [
        'pending' => 'Outstanding',
        'draft' => 'Outstanding',
        'paid' => 'Paid',
        'overdue' => 'Overdue'
    ];
    $status = strtolower($invoice['status']);
    $invoice['status_label'] = $statusMap[$status] ?? ucfirst($status);
    
    Response::success([
        'invoice' => [
            'id' => (int) $invoice['id'],
            'invoice_number' => $invoice['invoice_number'],
            'invoice_date' => $invoice['invoice_date'],
            'due_date' => $invoice['due_date'],
            'total_amount' => (float) $invoice['total_amount'],
            'status' => $invoice['status_label'],
            'raw_status' => $invoice['status'],
            'created_at' => $invoice['created_at'],
            'client_name' => $invoice['client_name'],
            'client_phone' => $invoice['client_phone'] ?? null
        ],
        'items' => array_map(function ($item) {
            return [
                'id' => (int) $item['id'],
                'service_name' => $item['service_name'] ?? 'Service',
                'service_category' => $item['service_category'] ?? 'General',
                'quantity' => (int) $item['quantity'],
                'unit_price' => (float) $item['unit_price'],
                'line_total' => (float) $item['line_total'],
                'description' => $item['service_description'] ?? ''
            ];
        }, $invoice_items),
        'payments' => array_map(function ($payment) {
            return [
                'id' => (int) $payment['id'],
                'amount' => (float) $payment['amount'],
                'payment_date' => $payment['payment_date'],
                'payment_method' => ucwords(str_replace('_', ' ', $payment['payment_method'])),
                'reference_number' => $payment['reference_number'],
                'created_at' => $payment['created_at']
            ];
        }, $payments),
        'summary' => [
            'total_amount' => (float) $invoice['total_amount'],
            'total_paid' => $total_paid,
            'balance' => $balance
        ]
    ]);
    
} catch (Exception $e) {
    Response::error('Database error: ' . $e->getMessage());
}
?>

