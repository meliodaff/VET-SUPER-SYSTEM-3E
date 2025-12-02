<?php
require_once '../../config/database.php';
require_once '../../utils/cors.php';
require_once '../../utils/response.php';

// Connect to appointment_sia database for payments data
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

$limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 5;

try {
    $limit = max(1, min($limit, 20));
    
    $stmt = $db->prepare("
        SELECT 
            id,
            payment_method,
            service_price as amount,
            date as payment_date,
            CONCAT('APP-', LPAD(id, 6, '0')) as invoice_number,
            payment_status,
            fname as client_name
        FROM book_appointment
        ORDER BY date DESC, id DESC
        LIMIT $limit
    ");
    $stmt->execute();
    $rows = $stmt->fetchAll();
    
    $statusLabelMap = [
        'pending' => 'Pending',
        'Pending' => 'Pending',
        'paid' => 'Paid',
        'Paid' => 'Paid',
        'overdue' => 'Overdue'
    ];
    
    $recent_payments = array_map(function ($payment) use ($statusLabelMap) {
        $status = strtolower($payment['payment_status'] ?? 'pending');
        $paymentMethod = $payment['payment_method'] ?? '0';
        // Map payment_method: 0 = Cash, 1 = Card, etc.
        $methodMap = [
            '0' => 'Cash',
            '1' => 'Card',
            '2' => 'Online',
            '3' => 'Check'
        ];
        $methodLabel = $methodMap[$paymentMethod] ?? 'Cash';
        
        return [
            'id' => (int) $payment['id'],
            'invoice_number' => $payment['invoice_number'],
            'client_name' => $payment['client_name'] ?? 'Unknown Client',
            'amount' => (float) ($payment['amount'] ?? 0),
            'payment_method' => $methodLabel,
            'payment_date' => $payment['payment_date'],
            'status' => $statusLabelMap[$status] ?? ucfirst($status)
        ];
    }, $rows);
    
    Response::success($recent_payments);
    
} catch (Exception $e) {
    Response::error('Database error: ' . $e->getMessage());
}
?>
