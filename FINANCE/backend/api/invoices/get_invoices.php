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
$date_range = isset($_GET['date_range']) ? (int)$_GET['date_range'] : 365;
$search = isset($_GET['search']) ? trim($_GET['search']) : '';
$page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
$limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;

$statusFilterMap = [
    'outstanding' => ['pending', 'draft'],
    'paid' => ['paid'],
    'overdue' => ['overdue']
];

$statusLabelMap = [
    'pending' => 'Outstanding',
    'draft' => 'Outstanding',
    'paid' => 'Paid',
    'overdue' => 'Overdue'
];

try {
    // Build WHERE clause
    $where_conditions = [];
    $params = [];
    $statusKey = strtolower($status);
    
    if ($statusKey !== 'all') {
        if (isset($statusFilterMap[$statusKey])) {
            $statuses = $statusFilterMap[$statusKey];
            $placeholders = implode(',', array_fill(0, count($statuses), '?'));
            $where_conditions[] = "inv.status IN ($placeholders)";
            $params = array_merge($params, $statuses);
        } else {
            $where_conditions[] = "inv.status = ?";
            $params[] = $statusKey;
        }
    }
    
    if ($date_range > 0) {
        // Compute date boundary in PHP to avoid binding inside INTERVAL
        $from_date = date('Y-m-d', strtotime("-$date_range days"));
        $where_conditions[] = "inv.invoice_date >= ?";
        $params[] = $from_date;
    }
    
    if (!empty($search)) {
        $where_conditions[] = "(inv.invoice_number LIKE ? OR p.owner_name LIKE ? OR p.name LIKE ?)";
        $search_param = "%$search%";
        $params[] = $search_param;
        $params[] = $search_param;
        $params[] = $search_param;
    }
    
    $where_clause = !empty($where_conditions) ? "WHERE " . implode(" AND ", $where_conditions) : "";
    $join_clause = "FROM invoices inv LEFT JOIN patients p ON inv.patient_id = p.id";
    
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
    $sql = "
        SELECT 
            inv.id,
            inv.invoice_number,
            inv.invoice_date,
            inv.due_date,
            inv.total_amount,
            inv.status,
            COALESCE(p.owner_name, 'Walk-in Client') AS client_name
        $join_clause
        $where_clause
        ORDER BY inv.invoice_date DESC, inv.id DESC
        LIMIT $limit OFFSET $offset
    ";
    
    $stmt = $db->prepare($sql);
    $stmt->execute($params);
    $rawInvoices = $stmt->fetchAll();
    
    $invoices = array_map(function ($invoice) use ($statusLabelMap) {
        $status = strtolower($invoice['status']);
        return [
            'id' => (int) $invoice['id'],
            'invoice_number' => $invoice['invoice_number'],
            'client_name' => $invoice['client_name'],
            'date' => $invoice['invoice_date'],
            'due_date' => $invoice['due_date'],
            'amount' => (float) $invoice['total_amount'],
            'status' => $statusLabelMap[$status] ?? ucfirst($status),
            'raw_status' => $status
        ];
    }, $rawInvoices);
    
    // Get summary
    $summary_sql = "
        SELECT 
            COUNT(*) as total_invoices,
            SUM(CASE WHEN inv.status IN ('pending','draft') THEN 1 ELSE 0 END) as outstanding_count,
            SUM(CASE WHEN inv.status = 'overdue' THEN 1 ELSE 0 END) as overdue_count,
            SUM(CASE WHEN inv.status = 'paid' THEN 1 ELSE 0 END) as paid_count,
            COALESCE(SUM(CASE WHEN inv.status IN ('pending','draft') THEN inv.total_amount ELSE 0 END), 0) as outstanding_amount,
            COALESCE(SUM(CASE WHEN inv.status = 'overdue' THEN inv.total_amount ELSE 0 END), 0) as overdue_amount,
            COALESCE(SUM(CASE WHEN inv.status = 'paid' THEN inv.total_amount ELSE 0 END), 0) as paid_amount
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
