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

// Accept either numeric invoice id or an invoice number string in the 'id' param
$rawId = isset($_GET['id']) ? trim($_GET['id']) : '';
if ($rawId === '') {
    Response::error('Invoice identifier is required');
}

try {
    // Determine whether identifier is numeric id
    if (ctype_digit($rawId)) {
        $invoice_id = (int)$rawId;
        $sql = "SELECT 
                app.id,
                app.user_id,
                app.fname,
                app.phone,
                app.email,
                app.doctor_id,
                app.vetdoc,
                app.pet_name,
                app.date,
                app.time,
                app.service,
                app.service_price,
                app.payment_method,
                app.status,
                app.payment_status,
                app.date_create,
                app.date_update
            FROM book_appointment app
            WHERE app.id = ?";
        $stmt = $db->prepare($sql);
        $stmt->execute([$invoice_id]);
        $invoice = $stmt->fetch();
    } else {
        Response::error('Invalid invoice ID');
    }
    
    if (!$invoice) {
        Response::error('Invoice not found');
    }
    
    // Format invoice data for response
    $invoice_id = (int)$invoice['id'];
    $formattedInvoice = [
        'id' => $invoice_id,
        'invoice_number' => 'APP-' . str_pad($invoice_id, 6, '0', STR_PAD_LEFT),
        'user_id' => (int)$invoice['user_id'],
        'client_name' => $invoice['fname'] ?? 'N/A',
        'client_phone' => $invoice['phone'] ?? '',
        'client_email' => $invoice['email'] ?? '',
        'doctor_id' => (int)$invoice['doctor_id'],
        'vetdoc' => $invoice['vetdoc'] ?? '',
        'pet_name' => $invoice['pet_name'] ?? '',
        'date' => $invoice['date'] ?? '',
        'time' => $invoice['time'] ?? '',
        'service' => $invoice['service'] ?? '',
        'service_price' => (float)($invoice['service_price'] ?? 0),
        'payment_method' => $invoice['payment_method'] ?? '0',
        'status' => $invoice['status'] ?? 'pending',
        'payment_status' => $invoice['payment_status'] ?? 'Pending',
        'date_create' => $invoice['date_create'] ?? '',
        'date_update' => $invoice['date_update'] ?? '',
        'total_amount' => (float)($invoice['service_price'] ?? 0),
        'invoice_date' => $invoice['date'] ?? '',
        'due_date' => $invoice['date'] ?? '',
        'created_at' => $invoice['date_create'] ?? '',
    ];
    
    // Invoice items (services) - for appointment_sia, the service is in the main record
    $invoiceItems = [
        [
            'id' => 1,
            'service_name' => $invoice['service'] ?? 'Service',
            'service_category' => 'General',
            'quantity' => 1,
            'unit_price' => (float)($invoice['service_price'] ?? 0),
            'line_total' => (float)($invoice['service_price'] ?? 0),
            'description' => $invoice['service'] ?? ''
        ]
    ];
    
    // Map payment status
    $statusMap = [
        'pending' => 'Outstanding',
        'Pending' => 'Outstanding',
        'Paid' => 'Paid',
        'overdue' => 'Overdue'
    ];
    $paymentStatus = $invoice['payment_status'] ?? 'Pending';
    $statusLabel = $statusMap[$paymentStatus] ?? ucfirst($paymentStatus);
    
    // Calculate totals - for appointment_sia, payment is based on payment_status
    $totalAmount = (float)($invoice['service_price'] ?? 0);
    $totalPaid = ($paymentStatus === 'Paid') ? $totalAmount : 0;
    $balance = $totalAmount - $totalPaid;
    
    Response::success([
        'invoice' => $formattedInvoice,
        'items' => $invoiceItems,
        'payments' => [], // No separate payments table in appointment_sia
        'summary' => [
            'total_amount' => $totalAmount,
            'total_paid' => $totalPaid,
            'balance' => $balance
        ]
    ]);
    
} catch (Exception $e) {
    Response::error('Database error: ' . $e->getMessage());
}
?>

