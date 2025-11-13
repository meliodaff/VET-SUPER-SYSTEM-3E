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

// Map frontend status to database status
$statusMap = [
    'Outstanding' => 'pending',
    'Paid' => 'paid',
    'Overdue' => 'overdue',
    'pending' => 'pending',
    'draft' => 'draft',
    'paid' => 'paid',
    'overdue' => 'overdue'
];

try {
    // Check if invoice exists
    $stmt = $db->prepare("SELECT id, patient_id FROM invoices WHERE id = ?");
    $stmt->execute([$id]);
    $invoice = $stmt->fetch();
    
    if (!$invoice) {
        Response::error('Invoice not found');
    }
    
    // Build update query dynamically
    $update_fields = [];
    $update_values = [];
    
    if ($invoice_number !== null) {
        // Check if new invoice number already exists
        $stmt = $db->prepare("SELECT id FROM invoices WHERE invoice_number = ? AND id != ?");
        $stmt->execute([$invoice_number, $id]);
        if ($stmt->rowCount() > 0) {
            Response::error('Invoice number already exists');
        }
        $update_fields[] = "invoice_number = ?";
        $update_values[] = $invoice_number;
    }
    
    // Handle client_name by finding or creating patient
    if ($client_name !== null && $client_name !== '') {
        if (strtolower(trim($client_name)) === 'walk-in client' || trim($client_name) === 'Walk-in Client') {
            // Set patient_id to NULL for walk-in clients
            $update_fields[] = "patient_id = ?";
            $update_values[] = null; // PDO will handle NULL correctly
        } else {
            // Find existing patient by owner_name
            $stmt = $db->prepare("SELECT id FROM patients WHERE owner_name = ? LIMIT 1");
            $stmt->execute([$client_name]);
            $patient = $stmt->fetch();
            
            if ($patient) {
                $update_fields[] = "patient_id = ?";
                $update_values[] = $patient['id'];
            } else {
                // Create new patient if not found
                $stmt = $db->prepare("INSERT INTO patients (owner_name, name, breed, age, created_at) VALUES (?, ?, 'Unknown', 0, NOW())");
                $stmt->execute([$client_name, $client_name]);
                $patient_id = $db->lastInsertId();
                $update_fields[] = "patient_id = ?";
                $update_values[] = $patient_id;
            }
        }
    }
    
    if ($invoice_date !== null) {
        $update_fields[] = "invoice_date = ?";
        $update_values[] = $invoice_date;
    }
    
    if ($due_date !== null) {
        $update_fields[] = "due_date = ?";
        $update_values[] = $due_date;
    }
    
    if ($total_amount !== null) {
        $update_fields[] = "total_amount = ?";
        $update_values[] = $total_amount;
    }
    
    if ($status !== null) {
        // Map status to database format
        $db_status = isset($statusMap[$status]) ? $statusMap[$status] : strtolower($status);
        $update_fields[] = "status = ?";
        $update_values[] = $db_status;
    }
    
    if (empty($update_fields)) {
        Response::error('No fields to update');
    }
    
    // Build the SQL query
    // Separate fields with placeholders from fields without (like NULL)
    $sql = "UPDATE invoices SET " . implode(", ", $update_fields) . " WHERE id = ?";
    
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
