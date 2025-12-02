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

// Optional filters & pagination
$status = isset($_GET['status']) ? trim($_GET['status']) : '';
$page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
$limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;

$limit = max(1, min($limit, 100));
$page = max(1, $page);
$offset = ($page - 1) * $limit;

$whereConditions = [];
$params = [];

if ($status !== '') {
    $whereConditions[] = "status = ?";
    $params[] = $status;
}

$whereSql = !empty($whereConditions) ? "WHERE " . implode(" AND ", $whereConditions) : "";

try {
    // Total count
    $countSql = "SELECT COUNT(*) AS total FROM purchase_orders $whereSql";
    $stmt = $db->prepare($countSql);
    $stmt->execute($params);
    $totalCount = (int)$stmt->fetch()['total'];

    // List with basic fields
    $listSql = "
        SELECT
            id,
            supplier_id,
            total_amount,
            preferred_delivery_date,
            status,
            notes,
            created_at,
            updated_at
        FROM purchase_orders
        $whereSql
        ORDER BY created_at DESC, id DESC
        LIMIT $limit OFFSET $offset
    ";
    $stmt = $db->prepare($listSql);
    $stmt->execute($params);
    $orders = $stmt->fetchAll();

    Response::success(
        [
            'orders' => $orders,
            'pagination' => [
                'current_page' => $page,
                'total_pages' => ceil($totalCount / $limit),
                'total_count' => $totalCount,
                'limit' => $limit,
            ],
        ],
        'Purchase orders loaded'
    );
} catch (Exception $e) {
    Response::error('Database error: ' . $e->getMessage());
}
?>


