<?php
require_once '../../config/database.php';
require_once '../../utils/cors.php';
require_once '../../utils/response.php';

$database = new Database();
$db = $database->getConnection();

// Accept either numeric invoice id or an invoice number string in the 'id' param
$rawId = isset($_GET['id']) ? trim($_GET['id']) : '';
if ($rawId === '') {
    Response::error('Invoice identifier is required');
}

try {
    // Determine which primary key column the invoices table uses (id or invoice_id)
    $colStmt = $db->prepare("SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'invoices'");
    $colStmt->execute();
    $columns = $colStmt->fetchAll(PDO::FETCH_COLUMN);
    // default to 'id' if unknown
    if (in_array('id', $columns)) {
        $idCol = 'id';
    } elseif (in_array('invoice_id', $columns)) {
        $idCol = 'invoice_id';
    } else {
        $idCol = 'id';
    }

    // Determine whether identifier is numeric id or an invoice_number
    if (ctype_digit($rawId)) {
        $invoice_id = (int)$rawId;
        $sql = "SELECT 
                inv." . $idCol . " AS id,
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
            WHERE inv." . $idCol . " = ?";
        $stmt = $db->prepare($sql);
        $stmt->execute([$invoice_id]);
        $invoice = $stmt->fetch();
    } else {
        // treat as invoice_number
        $invoice_number = $rawId;
        $sql = "SELECT 
                inv." . $idCol . " AS id,
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
            WHERE inv.invoice_number = ? LIMIT 1";
        $stmt = $db->prepare($sql);
        $stmt->execute([$invoice_number]);
        $invoice = $stmt->fetch();
    }
    
    if (!$invoice) {
        Response::error('Invoice not found');
    }
    
    // Get invoice items (services/products) using the found invoice id
    $invoice_id = (int)$invoice['id'];
    $stmt = $db->prepare(
        "SELECT 
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
        ORDER BY ii.id ASC"
    );
    $stmt->execute([$invoice_id]);
    $invoice_items = $stmt->fetchAll();
    
    // Get payments/transactions for this invoice
    $stmt = $db->prepare(
        "SELECT 
            p.id,
            p.amount,
            p.payment_date,
            p.payment_method,
            p.reference_number,
            p.created_at
        FROM payments p
        WHERE p.invoice_id = ?
        ORDER BY p.payment_date DESC, p.id DESC"
    );
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

