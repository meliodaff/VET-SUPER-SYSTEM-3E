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

    // List with basic fields, JOIN suppliers to get supplier name from database
    $listSql = "
        SELECT
            po.id,
            po.supplier_id,
            COALESCE(s.name, CONCAT('Supplier ', po.supplier_id)) as supplier_name,
            po.total_amount,
            po.preferred_delivery_date,
            po.status,
            po.notes,
            po.created_at,
            po.updated_at
        FROM purchase_orders po
        LEFT JOIN suppliers s ON po.supplier_id = s.id
        $whereSql
        ORDER BY po.created_at DESC, po.id DESC
        LIMIT $limit OFFSET $offset
    ";
    $stmt = $db->prepare($listSql);
    $stmt->execute($params);
    $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Ensure supplier_name is included in each order
    foreach ($orders as &$order) {
        if (!isset($order['supplier_name']) || empty($order['supplier_name'])) {
            $order['supplier_name'] = 'Supplier ' . $order['supplier_id'];
        }
    }
    unset($order);

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


