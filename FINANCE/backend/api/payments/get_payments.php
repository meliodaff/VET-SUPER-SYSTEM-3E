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

$status = isset($_GET['status']) ? trim($_GET['status']) : 'all';
$search = isset($_GET['search']) ? trim($_GET['search']) : '';
$page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
$limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;

$statusFilterMap = [
    'outstanding' => ['pending', 'draft'],
    'paid' => ['paid'],
    'overdue' => ['overdue']
];

$statusLabelMap = [
    'pending' => 'Pending',
    'draft' => 'Pending',
    'paid' => 'Paid',
    'overdue' => 'Overdue'
];

try {
    // Build WHERE clause
    $where_conditions = [];
    $params = [];
    $statusKey = strtolower($status);
    
    if ($statusKey !== 'all' && $statusKey !== '') {
        if (isset($statusFilterMap[$statusKey])) {
            $statuses = $statusFilterMap[$statusKey];
            $placeholders = implode(',', array_fill(0, count($statuses), '?'));
            $where_conditions[] = "COALESCE(inv.status, 'pending') IN ($placeholders)";
            $params = array_merge($params, $statuses);
        } else {
            $where_conditions[] = "COALESCE(inv.status, 'pending') = ?";
            $params[] = $statusKey;
        }
    }
    
    if (!empty($search)) {
        $where_conditions[] = "(COALESCE(inv.invoice_number, CONCAT('INV-', p.invoice_id)) LIKE ? OR p.payment_method LIKE ? OR COALESCE(pt.owner_name, 'Walk-in Client') LIKE ? OR p.reference_number LIKE ?)";
        $search_param = "%$search%";
        $params[] = $search_param;
        $params[] = $search_param;
        $params[] = $search_param;
        $params[] = $search_param;
    }
    
    $where_clause = !empty($where_conditions) ? "WHERE " . implode(" AND ", $where_conditions) : "";
    // Use LEFT JOIN for invoices to show all payments even if invoice is missing
    $join_clause = "
        FROM payments p
        LEFT JOIN invoices inv ON p.invoice_id = inv.id
        LEFT JOIN patients pt ON inv.patient_id = pt.id
    ";
    
    // Get total count
    $count_sql = "SELECT COUNT(*) as total $join_clause $where_clause";
    $stmt = $db->prepare($count_sql);
    $stmt->execute($params);
    $total_count = (int) $stmt->fetch()['total'];
    
    // Get payments with pagination
$limit = max(1, min($limit, 100));
$page = max(1, $page);
$offset = ($page - 1) * $limit;
    // Handle sorting
    $sort_by = isset($_GET['sort_by']) ? trim($_GET['sort_by']) : 'date';
    $sort_order = isset($_GET['sort_order']) ? strtoupper(trim($_GET['sort_order'])) : 'DESC';
    $sort_order = in_array($sort_order, ['ASC', 'DESC']) ? $sort_order : 'DESC';
    
    $order_by = "p.payment_date DESC, p.id DESC";
    if ($sort_by === 'date') {
        $order_by = "p.payment_date $sort_order, p.id $sort_order";
    } elseif ($sort_by === 'amount') {
        $order_by = "p.amount $sort_order, p.id $sort_order";
    } elseif ($sort_by === 'client') {
        $order_by = "pt.owner_name $sort_order, p.id $sort_order";
    }
    
    $sql = "
        SELECT 
            p.id,
            p.invoice_id,
            p.payment_method,
            p.amount,
            p.payment_date,
            p.reference_number,
            p.created_at,
            COALESCE(inv.invoice_number, CONCAT('INV-', p.invoice_id)) AS invoice_number,
            inv.invoice_date,
            inv.due_date,
            COALESCE(inv.status, 'pending') AS invoice_status,
            COALESCE(pt.owner_name, 'Walk-in Client') AS client_name
        $join_clause
        $where_clause
        ORDER BY $order_by
        LIMIT $limit OFFSET $offset
    ";
    
    $stmt = $db->prepare($sql);
$stmt->execute($params);
    $rawPayments = $stmt->fetchAll();
    
    $payments = array_map(function ($payment) use ($statusLabelMap) {
        $status = strtolower($payment['invoice_status']);
        return [
            'id' => (int) $payment['id'],
            'invoice_id' => (int) $payment['invoice_id'],
            'invoice_number' => $payment['invoice_number'],
            'client_name' => $payment['client_name'],
            'amount' => (float) $payment['amount'],
            'status' => $statusLabelMap[$status] ?? ucfirst($status),
            'raw_status' => $status,
            'payment_method' => ucwords(str_replace('_', ' ', $payment['payment_method'])),
            'payment_date' => $payment['payment_date'],
            'invoice_date' => $payment['invoice_date'],
            'due_date' => $payment['due_date'],
            'reference_number' => $payment['reference_number'],
            'created_at' => $payment['created_at']
        ];
    }, $rawPayments);
    
    // Get payment statistics
    $stats_sql = "
        SELECT 
            COUNT(*) as total_payments,
            COALESCE(SUM(p.amount), 0) as total_amount,
            SUM(CASE WHEN COALESCE(inv.status, 'pending') = 'paid' THEN 1 ELSE 0 END) as paid_count,
            SUM(CASE WHEN COALESCE(inv.status, 'pending') IN ('pending','draft') THEN 1 ELSE 0 END) as pending_count,
            SUM(CASE WHEN COALESCE(inv.status, 'pending') = 'overdue' THEN 1 ELSE 0 END) as overdue_count,
            COALESCE(SUM(CASE WHEN COALESCE(inv.status, 'pending') = 'paid' THEN p.amount ELSE 0 END), 0) as paid_amount,
            COALESCE(SUM(CASE WHEN COALESCE(inv.status, 'pending') IN ('pending','draft') THEN p.amount ELSE 0 END), 0) as pending_amount,
            COALESCE(SUM(CASE WHEN COALESCE(inv.status, 'pending') = 'overdue' THEN p.amount ELSE 0 END), 0) as overdue_amount
        $join_clause
        $where_clause
    ";
    $stmt = $db->prepare($stats_sql);
    $stmt->execute($params);
    $statisticsRow = $stmt->fetch();
    
    $statistics = [
        'total_payments' => (int) ($statisticsRow['total_payments'] ?? 0),
        'total_amount' => (float) ($statisticsRow['total_amount'] ?? 0),
        'paid_count' => (int) ($statisticsRow['paid_count'] ?? 0),
        'pending_count' => (int) ($statisticsRow['pending_count'] ?? 0),
        'overdue_count' => (int) ($statisticsRow['overdue_count'] ?? 0),
        'paid_amount' => (float) ($statisticsRow['paid_amount'] ?? 0),
        'pending_amount' => (float) ($statisticsRow['pending_amount'] ?? 0),
        'overdue_amount' => (float) ($statisticsRow['overdue_amount'] ?? 0)
    ];
    
    Response::success([
        'payments' => $payments,
        'pagination' => [
            'current_page' => $page,
            'total_pages' => ceil($total_count / $limit),
            'total_count' => $total_count,
            'limit' => $limit
        ],
        'statistics' => $statistics
    ]);
    
} catch (Exception $e) {
    Response::error('Database error: ' . $e->getMessage());
}
?>
