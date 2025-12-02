<?php
require_once '../../config/database.php';
require_once '../../utils/cors.php';
require_once '../../utils/response.php';

// Connect to appointment_sia database
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

if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
    Response::error('Method not allowed', 405);
}

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['id'])) {
    Response::error('Invoice ID is required');
}

$id = (int)$data['id'];
$invoice_number = isset($data['invoice_number']) ? trim($data['invoice_number']) : null;
$client_name = isset($data['client_name']) ? trim($data['client_name']) : null;
$invoice_date = isset($data['date']) ? $data['date'] : (isset($data['invoice_date']) ? $data['invoice_date'] : null);
$due_date = isset($data['due_date']) ? $data['due_date'] : null;
$total_amount = isset($data['amount']) ? (float)$data['amount'] : (isset($data['total_amount']) ? (float)$data['total_amount'] : null);
$status = isset($data['status']) ? $data['status'] : null;

// Map frontend status to database payment_status
$statusMap = [
    'Outstanding' => 'Pending',
    'Paid' => 'Paid',
    'Overdue' => 'overdue',
    'pending' => 'Pending',
    'Pending' => 'Pending',
    'paid' => 'Paid',
    'Paid' => 'Paid',
    'overdue' => 'overdue'
];

try {
    // Check if invoice exists in book_appointment table
    $stmt = $db->prepare("SELECT id FROM book_appointment WHERE id = ?");
    $stmt->execute([$id]);
    $invoice = $stmt->fetch();
    
    if (!$invoice) {
        Response::error('Invoice not found');
    }
    
    // Build update query dynamically for book_appointment table
    $update_fields = [];
    $update_values = [];
    
    // Map client_name to fname
    if ($client_name !== null && $client_name !== '') {
        $update_fields[] = "fname = ?";
        $update_values[] = $client_name;
    }
    
    // Map invoice_date to date
    if ($invoice_date !== null) {
        $update_fields[] = "date = ?";
        $update_values[] = $invoice_date;
    }
    
    // Map total_amount to service_price
    if ($total_amount !== null) {
        $update_fields[] = "service_price = ?";
        $update_values[] = $total_amount;
    }
    
    // Map status to payment_status
    if ($status !== null) {
        // Map status to database format
        $db_status = isset($statusMap[$status]) ? $statusMap[$status] : 'Pending';
        $update_fields[] = "payment_status = ?";
        $update_values[] = $db_status;
        // Also update status field
        $update_fields[] = "status = ?";
        $update_values[] = strtolower($db_status);
    }
    
    // Always update date_update
    $update_fields[] = "date_update = NOW()";
    
    if (empty($update_fields)) {
        Response::error('No fields to update');
    }
    
    // Build the SQL query for book_appointment table
    $sql = "UPDATE book_appointment SET " . implode(", ", $update_fields) . " WHERE id = ?";
    
    // Add the invoice ID to the values array
    $update_values[] = $id;
    
    $stmt = $db->prepare($sql);
    $result = $stmt->execute($update_values);
    
    if ($result) {
        Response::success(null, 'Invoice updated successfully');
    } else {
        Response::error('Failed to update invoice');
    }
    
} catch (Exception $e) {
    Response::error('Database error: ' . $e->getMessage());
}
?>
