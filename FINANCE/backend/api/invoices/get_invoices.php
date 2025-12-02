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

if (!$db) {
    Response::error('Database connection failed');
}

$status = isset($_GET['status']) ? trim($_GET['status']) : 'all';
$date_range = isset($_GET['date_range']) ? (int)$_GET['date_range'] : 365;
$search = isset($_GET['search']) ? trim($_GET['search']) : '';
$page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
$limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;

$statusFilterMap = [
    'outstanding' => ['pending'],
    'paid' => ['Paid'],
    'overdue' => ['overdue']
];

$statusLabelMap = [
    'pending' => 'Pending',
    'Paid' => 'Paid',
    'Pending' => 'Pending',
    'overdue' => 'Overdue'
];

try {
    // Build WHERE clause for appointment_sia database
    $where_conditions = [];
    $params = [];
    $statusKey = strtolower($status);
    
    if ($statusKey !== 'all') {
        if (isset($statusFilterMap[$statusKey])) {
            $statuses = $statusFilterMap[$statusKey];
            $placeholders = implode(',', array_fill(0, count($statuses), '?'));
            $where_conditions[] = "app.payment_status IN ($placeholders)";
            $params = array_merge($params, $statuses);
        } else {
            $where_conditions[] = "app.payment_status = ?";
            $params[] = ucfirst($statusKey);
        }
    }
    
    if ($date_range > 0) {
        // Compute date boundary in PHP to avoid binding inside INTERVAL
        $from_date = date('Y-m-d', strtotime("-$date_range days"));
        $where_conditions[] = "app.date >= ?";
        $params[] = $from_date;
    }
    
    if (!empty($search)) {
        $where_conditions[] = "(app.fname LIKE ? OR app.phone LIKE ? OR app.email LIKE ? OR app.pet_name LIKE ?)";
        $search_param = "%$search%";
        $params[] = $search_param;
        $params[] = $search_param;
        $params[] = $search_param;
        $params[] = $search_param;
    }
    
    $where_clause = !empty($where_conditions) ? "WHERE " . implode(" AND ", $where_conditions) : "";
    $join_clause = "FROM book_appointment app";
    
    // Get total count
    $count_sql = "SELECT COUNT(*) as total $join_clause $where_clause";
    $stmt = $db->prepare($count_sql);
    $stmt->execute($params);
    $total_count = (int) $stmt->fetch()['total'];
    
    // Get invoices with pagination
    // Sanitize pagination values
    $limit = max(1, min($limit, 100));
    $page = max(1, $page);
    $offset = ($page - 1) * $limit;
    
    // Main query for appointment_sia database
    $sql = "
        SELECT 
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
        $join_clause
        $where_clause
        ORDER BY app.date_create DESC, app.id DESC
        LIMIT $limit OFFSET $offset
    ";
    
    $stmt = $db->prepare($sql);
    $stmt->execute($params);
    $rawInvoices = $stmt->fetchAll();
    
    $invoices = array_map(function ($invoice) use ($statusLabelMap) {
        $paymentStatus = $invoice['payment_status'] ?? 'Pending';
        $statusKey = strtolower($paymentStatus);
        return [
            'id' => (int) $invoice['id'],
            'invoice_number' => 'APP-' . str_pad($invoice['id'], 6, '0', STR_PAD_LEFT),
            'user_id' => (int) $invoice['user_id'],
            'client_name' => $invoice['fname'] ?? 'N/A',
            'phone' => $invoice['phone'] ?? '',
            'email' => $invoice['email'] ?? '',
            'doctor_id' => (int) $invoice['doctor_id'],
            'vetdoc' => $invoice['vetdoc'] ?? '',
            'pet_name' => $invoice['pet_name'] ?? '',
            'date' => $invoice['date'] ?? '',
            'time' => $invoice['time'] ?? '',
            'service' => $invoice['service'] ?? '',
            'service_price' => (float) ($invoice['service_price'] ?? 0),
            'payment_method' => $invoice['payment_method'] ?? '0',
            'status' => $invoice['status'] ?? 'pending',
            'payment_status' => $paymentStatus,
            'date_create' => $invoice['date_create'] ?? '',
            'date_update' => $invoice['date_update'] ?? '',
            'amount' => (float) ($invoice['service_price'] ?? 0),
            'raw_status' => $statusKey
        ];
    }, $rawInvoices);
    
    // Get summary for appointment_sia
    $summary_sql = "
        SELECT 
            COUNT(*) as total_invoices,
            SUM(CASE WHEN app.payment_status = 'Pending' THEN 1 ELSE 0 END) as outstanding_count,
            SUM(CASE WHEN app.payment_status = 'overdue' THEN 1 ELSE 0 END) as overdue_count,
            SUM(CASE WHEN app.payment_status = 'Paid' THEN 1 ELSE 0 END) as paid_count,
            COALESCE(SUM(CASE WHEN app.payment_status = 'Pending' THEN app.service_price ELSE 0 END), 0) as outstanding_amount,
            COALESCE(SUM(CASE WHEN app.payment_status = 'overdue' THEN app.service_price ELSE 0 END), 0) as overdue_amount,
            COALESCE(SUM(CASE WHEN app.payment_status = 'Paid' THEN app.service_price ELSE 0 END), 0) as paid_amount
        $join_clause
        $where_clause
    ";
    $stmt = $db->prepare($summary_sql);
    $stmt->execute($params);
    $summaryData = $stmt->fetch();
    
    $summary = [
        'total_invoices' => (int) ($summaryData['total_invoices'] ?? 0),
        'outstanding_count' => (int) ($summaryData['outstanding_count'] ?? 0),
        'overdue_count' => (int) ($summaryData['overdue_count'] ?? 0),
        'paid_count' => (int) ($summaryData['paid_count'] ?? 0),
        'outstanding_amount' => (float) ($summaryData['outstanding_amount'] ?? 0),
        'overdue_amount' => (float) ($summaryData['overdue_amount'] ?? 0),
        'paid_amount' => (float) ($summaryData['paid_amount'] ?? 0)
    ];
    
    Response::success([
        'invoices' => $invoices,
        'pagination' => [
            'current_page' => $page,
            'total_pages' => ceil($total_count / $limit),
            'total_count' => $total_count,
            'limit' => $limit
        ],
        'summary' => $summary
    ]);
    
} catch (Exception $e) {
    Response::error('Database error: ' . $e->getMessage());
}
?>
