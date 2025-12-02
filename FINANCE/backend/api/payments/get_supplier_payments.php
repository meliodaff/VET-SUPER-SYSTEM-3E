<?php
require_once '../../config/database.php';
require_once '../../utils/cors.php';
require_once '../../utils/response.php';

$database = new Database();
$db = $database->getConnection();

if (!$db) {
    Response::error('Database connection failed');
}

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    Response::error('Method not allowed', 405);
}

// Filters & pagination
$status = isset($_GET['status']) ? trim($_GET['status']) : ''; // Scheduled | In Transit | Delivered | ''
$page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
$limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;

$limit = max(1, min($limit, 100));
$page = max(1, $page);
$offset = ($page - 1) * $limit;

$where = [];
$params = [];

if ($status !== '') {
    $where[] = "sp.status = ?";
    $params[] = $status;
}

$whereSql = !empty($where) ? "WHERE " . implode(' AND ', $where) : "";

try {
    // Count
    $countSql = "
        SELECT COUNT(*) AS total
        FROM supplier_payments sp
        $whereSql
    ";
    $stmt = $db->prepare($countSql);
    $stmt->execute($params);
    $totalCount = (int)$stmt->fetch()['total'];

    // List
    $listSql = "
        SELECT
            sp.id,
            sp.supplier_id,
            sp.purchase_order_id,
            sp.amount,
            sp.payment_method,
            sp.payment_date,
            sp.expected_delivery,
            sp.status,
            sp.delivered_at,
            sp.notes,
            sp.created_at
        FROM supplier_payments sp
        $whereSql
        ORDER BY sp.created_at DESC, sp.id DESC
        LIMIT $limit OFFSET $offset
    ";
    $stmt = $db->prepare($listSql);
    $stmt->execute($params);
    $rows = $stmt->fetchAll();

    $payments = array_map(function ($row) {
        $expected = $row['expected_delivery'];
        $actual = $row['delivered_at'];
        $onTime = null;

        if ($row['status'] === 'Delivered' && $expected && $actual) {
            $onTime = (substr($expected, 0, 10) === substr($actual, 0, 10));
        }

        return [
            'id' => (int)$row['id'],
            'supplier_id' => (int)$row['supplier_id'],
            'purchase_order_id' => $row['purchase_order_id'] !== null ? (int)$row['purchase_order_id'] : null,
            'amount' => (float)$row['amount'],
            'payment_method' => $row['payment_method'],
            'payment_date' => $row['payment_date'],
            'expected_delivery' => $expected,
            'status' => $row['status'],
            'delivered_at' => $actual,
            'on_time' => $onTime,
            'notes' => $row['notes'],
            'created_at' => $row['created_at'],
        ];
    }, $rows);

    Response::success(
        [
            'supplier_payments' => $payments,
            'pagination' => [
                'current_page' => $page,
                'total_pages' => ceil($totalCount / $limit),
                'total_count' => $totalCount,
                'limit' => $limit,
            ],
        ],
        'Supplier payments loaded'
    );
} catch (Exception $e) {
    Response::error('Database error: ' . $e->getMessage());
}
?>


