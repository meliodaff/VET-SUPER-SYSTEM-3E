<?php
require_once '../../config/database.php';
require_once '../../utils/cors.php';
require_once '../../utils/response.php';

$database = new Database();
$db = $database->getConnection();

if (!$db) {
    Response::error('Database connection failed');
}

try {
    // Get months parameter (default 6 months)
    $months = isset($_GET['months']) ? (int)$_GET['months'] : 6;
    $months = max(1, min($months, 24)); // Limit between 1 and 24 months
    
    // Calculate date range
    $from_date = date('Y-m-d', strtotime("-$months months"));
    
    // Check if purchase_orders and purchase_order_items tables exist
    $tablesStmt = $db->query("SHOW TABLES LIKE 'purchase_orders'");
    $hasPurchaseOrders = $tablesStmt->rowCount() > 0;
    
    $tablesStmt = $db->query("SHOW TABLES LIKE 'purchase_order_items'");
    $hasPurchaseOrderItems = $tablesStmt->rowCount() > 0;
    
    if (!$hasPurchaseOrders || !$hasPurchaseOrderItems) {
        Response::error('Purchase orders tables not found. Please ensure purchase_orders and purchase_order_items tables exist.');
    }
    
    // Check columns in purchase_orders and purchase_order_items
    $poColumnsStmt = $db->query("SHOW COLUMNS FROM purchase_orders");
    $poColumns = $poColumnsStmt->fetchAll(PDO::FETCH_COLUMN);
    
    $poiColumnsStmt = $db->query("SHOW COLUMNS FROM purchase_order_items");
    $poiColumns = $poiColumnsStmt->fetchAll(PDO::FETCH_COLUMN);
    
    // Check inventory_items for category information
    $invColumnsStmt = $db->query("SHOW COLUMNS FROM inventory_items");
    $invColumns = $invColumnsStmt->fetchAll(PDO::FETCH_COLUMN);
    
    $hasCategoryId = in_array('category_id', $invColumns);
    $hasCategory = in_array('category', $invColumns);
    $hasCreatedAt = in_array('created_at', $poColumns);
    
    // Build category field from inventory_items
    if ($hasCategoryId) {
        $categoryField = "COALESCE(c.name, c.category_name, 'Uncategorized')";
        $categoryJoin = "LEFT JOIN categories c ON inv.category_id = c.id";
    } else if ($hasCategory) {
        $categoryField = "COALESCE(inv.category, 'Uncategorized')";
        $categoryJoin = "";
    } else {
        $categoryField = "'Uncategorized'";
        $categoryJoin = "";
    }
    
    // 1. Get monthly expenses trend from purchase_orders
    if ($hasCreatedAt) {
        $trendSql = "
            SELECT
                DATE_FORMAT(po.created_at, '%Y-%m') as month,
                COALESCE(SUM(po.total_amount), 0) as total_expenses,
                COUNT(DISTINCT po.id) as items_count
            FROM purchase_orders po
            WHERE po.created_at >= :from_date
            GROUP BY DATE_FORMAT(po.created_at, '%Y-%m')
            ORDER BY month ASC
        ";
    } else {
        // If no created_at, use current date
        $trendSql = "
            SELECT
                DATE_FORMAT(NOW(), '%Y-%m') as month,
                COALESCE(SUM(po.total_amount), 0) as total_expenses,
                COUNT(DISTINCT po.id) as items_count
            FROM purchase_orders po
        ";
    }
    
    $stmt = $db->prepare($trendSql);
    if ($hasCreatedAt) {
        $stmt->execute([':from_date' => $from_date]);
    } else {
        $stmt->execute();
    }
    $trend_data = $stmt->fetchAll();
    
    // Fill in missing months with zero expenses
    $all_months = [];
    $current = strtotime($from_date);
    $end = strtotime('now');
    
    while ($current <= $end) {
        $month_key = date('Y-m', $current);
        $all_months[$month_key] = [
            'month' => $month_key,
            'total_expenses' => 0,
            'items_count' => 0
        ];
        $current = strtotime('+1 month', $current);
    }
    
    foreach ($trend_data as $row) {
        $all_months[$row['month']] = [
            'month' => $row['month'],
            'total_expenses' => (float) $row['total_expenses'],
            'items_count' => (int) $row['items_count']
        ];
    }
    
    $monthly_trend = array_values($all_months);
    
    // 2. Get category breakdown from purchase_order_items joined with inventory_items
    $categorySql = "
        SELECT
            $categoryField AS category,
            COUNT(DISTINCT poi.id) as items_count,
            COALESCE(SUM(poi.line_total), 0) as total_expenses,
            COALESCE(SUM(poi.quantity), 0) as total_quantity,
            COALESCE(AVG(poi.unit_cost), 0) as avg_unit_cost
        FROM purchase_order_items poi
        JOIN purchase_orders po ON poi.purchase_order_id = po.id
        LEFT JOIN inventory_items inv ON poi.item_id = inv.id
        $categoryJoin
        GROUP BY category
        ORDER BY total_expenses DESC
    ";
    
    $stmt = $db->prepare($categorySql);
    $stmt->execute();
    $category_data = $stmt->fetchAll();
    
    $category_breakdown = array_map(function ($row) {
        return [
            'category' => $row['category'] ?? 'Uncategorized',
            'items_count' => (int) ($row['items_count'] ?? 0),
            'total_expenses' => (float) ($row['total_expenses'] ?? 0),
            'total_quantity' => (int) ($row['total_quantity'] ?? 0),
            'avg_unit_cost' => (float) ($row['avg_unit_cost'] ?? 0)
        ];
    }, $category_data);
    
    // 3. Get total expenses summary from purchase_orders
    $summarySql = "
        SELECT
            COUNT(DISTINCT po.id) as total_items,
            COALESCE(SUM(po.total_amount), 0) as total_expenses,
            COALESCE(SUM(poi.quantity), 0) as total_quantity,
            COALESCE(AVG(poi.unit_cost), 0) as avg_unit_cost
        FROM purchase_orders po
        LEFT JOIN purchase_order_items poi ON po.id = poi.purchase_order_id
    ";
    
    if ($hasCreatedAt) {
        $summarySql .= ",
            COALESCE(SUM(CASE WHEN po.created_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH) THEN po.total_amount ELSE 0 END), 0) as monthly_expenses,
            COALESCE(SUM(CASE WHEN po.created_at >= DATE_SUB(NOW(), INTERVAL 1 WEEK) THEN po.total_amount ELSE 0 END), 0) as weekly_expenses";
    } else {
        $summarySql .= ",
            0 as monthly_expenses,
            0 as weekly_expenses";
    }
    
    $stmt = $db->prepare($summarySql);
    $stmt->execute();
    $summary = $stmt->fetch();
    
    // 4. Get recent expenses (last 10 purchase order items)
    $nameField = in_array('name', $invColumns) ? 'inv.name' : (in_array('product_name', $invColumns) ? 'inv.product_name' : 'inv.id');
    
    if ($hasCreatedAt) {
        $recentSql = "
            SELECT
                poi.id,
                $nameField AS item,
                $categoryField AS category,
                poi.quantity AS qty,
                poi.unit_cost AS unitCost,
                poi.line_total AS totalCost,
                po.created_at,
                po.updated_at
            FROM purchase_order_items poi
            JOIN purchase_orders po ON poi.purchase_order_id = po.id
            LEFT JOIN inventory_items inv ON poi.item_id = inv.id
            $categoryJoin
            ORDER BY po.created_at DESC
            LIMIT 10
        ";
    } else {
        $recentSql = "
            SELECT
                poi.id,
                $nameField AS item,
                $categoryField AS category,
                poi.quantity AS qty,
                poi.unit_cost AS unitCost,
                poi.line_total AS totalCost,
                NULL AS created_at,
                NULL AS updated_at
            FROM purchase_order_items poi
            JOIN purchase_orders po ON poi.purchase_order_id = po.id
            LEFT JOIN inventory_items inv ON poi.item_id = inv.id
            $categoryJoin
            LIMIT 10
        ";
    }
    
    $stmt = $db->prepare($recentSql);
    $stmt->execute();
    $recent_items = $stmt->fetchAll();
    
    $recent_expenses = array_map(function ($item) {
        return [
            'id' => (int) ($item['id'] ?? 0),
            'item' => $item['item'] ?? 'Unknown Product',
            'category' => $item['category'] ?? 'Uncategorized',
            'quantity' => (int) ($item['qty'] ?? 0),
            'unit_cost' => (float) ($item['unitCost'] ?? 0),
            'total_cost' => (float) ($item['totalCost'] ?? 0),
            'created_at' => $item['created_at'] ?? null,
            'updated_at' => $item['updated_at'] ?? null
        ];
    }, $recent_items);
    
    Response::success([
        'monthly_trend' => $monthly_trend,
        'category_breakdown' => $category_breakdown,
        'summary' => [
            'total_items' => (int) ($summary['total_items'] ?? 0),
            'total_expenses' => (float) ($summary['total_expenses'] ?? 0),
            'total_quantity' => (int) ($summary['total_quantity'] ?? 0),
            'avg_unit_cost' => (float) ($summary['avg_unit_cost'] ?? 0),
            'monthly_expenses' => (float) ($summary['monthly_expenses'] ?? 0),
            'weekly_expenses' => (float) ($summary['weekly_expenses'] ?? 0)
        ],
        'recent_expenses' => $recent_expenses
    ]);
    
} catch (Exception $e) {
    error_log("Supplies Expenses Error: " . $e->getMessage());
    Response::error('Database error: ' . $e->getMessage());
}
?>

