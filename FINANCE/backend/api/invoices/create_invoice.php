<?php
require_once '../../config/database.php';
require_once '../../utils/cors.php';
require_once '../../utils/response.php';

$database = new Database();
$db = $database->getConnection();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    Response::error('Method not allowed', 405);
}

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['invoice_number']) || !isset($data['client_name']) || !isset($data['date']) || !isset($data['due_date']) || !isset($data['amount'])) {
    Response::error('Missing required fields');
}

$invoice_number = trim($data['invoice_number']);
$client_name = trim($data['client_name']);
$date = $data['date'];
$due_date = $data['due_date'];
$amount = (float)$data['amount'];
$status = isset($data['status']) ? $data['status'] : 'Outstanding';

// Data validation
if (empty($invoice_number)) {
    Response::error('Invoice number is required');
}

if (empty($client_name)) {
    Response::error('Client name is required');
}

if (empty($date)) {
    Response::error('Invoice date is required');
}

if (empty($due_date)) {
    Response::error('Due date is required');
}

if ($amount <= 0) {
    Response::error('Amount must be greater than zero');
}

// Validate date format
if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $date)) {
    Response::error('Invalid date format. Use YYYY-MM-DD');
}

if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $due_date)) {
    Response::error('Invalid due date format. Use YYYY-MM-DD');
}

// Validate that due date is not before invoice date
if (strtotime($due_date) < strtotime($date)) {
    Response::error('Due date cannot be before invoice date');
}

try {
    // Check if invoice number already exists
    $stmt = $db->prepare("SELECT id FROM invoices WHERE invoice_number = ?");
    $stmt->execute([$invoice_number]);
    
    if ($stmt->rowCount() > 0) {
        Response::error('Invoice number already exists');
    }
    
    // Insert new invoice
    $stmt = $db->prepare("INSERT INTO invoices (invoice_number, client_name, date, due_date, amount, status) VALUES (?, ?, ?, ?, ?, ?)");
    $result = $stmt->execute([$invoice_number, $client_name, $date, $due_date, $amount, $status]);
    
    if ($result) {
        $invoice_id = $db->lastInsertId();
        
        // Create corresponding payment record
        $stmt = $db->prepare("INSERT INTO payments (invoice_id, payment_method, amount, status) VALUES (?, 'Pending', ?, 'Pending')");
        $stmt->execute([$invoice_id, $amount]);
        
        Response::success(['invoice_id' => $invoice_id], 'Invoice created successfully');
    } else {
        Response::error('Failed to create invoice');
    }
    
} catch (Exception $e) {
    Response::error('Database error: ' . $e->getMessage());
}
?>
