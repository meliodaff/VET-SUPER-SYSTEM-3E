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

try {
    // Get months parameter (default 6 months)
    $months = isset($_GET['months']) ? (int)$_GET['months'] : 6;
    $months = max(1, min($months, 24)); // Limit between 1 and 24 months
    
    // Calculate date range
    $from_date = date('Y-m-d', strtotime("-$months months"));
    
    // 1. Get monthly expenses trend (based on inventory created_at/updated_at)
    $stmt = $db->prepare("
        SELECT
            DATE_FORMAT(created_at, '%Y-%m') as month,
            COALESCE(SUM(totalCost), 0) as total_expenses,
            COUNT(*) as items_count
        FROM inventory
        WHERE created_at >= :from_date
        GROUP BY DATE_FORMAT(created_at, '%Y-%m')
        ORDER BY month ASC
    ");
    $stmt->execute([':from_date' => $from_date]);
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
    
    // 2. Get category breakdown
    $stmt = $db->prepare("
        SELECT
            category,
            COUNT(*) as items_count,
            COALESCE(SUM(totalCost), 0) as total_expenses,
            COALESCE(SUM(qty), 0) as total_quantity,
            COALESCE(AVG(unitCost), 0) as avg_unit_cost
        FROM inventory
        GROUP BY category
        ORDER BY total_expenses DESC
    ");
    $stmt->execute();
    $category_data = $stmt->fetchAll();
    
    $category_breakdown = array_map(function ($row) {
        return [
            'category' => $row['category'] ?? 'General',
            'items_count' => (int) ($row['items_count'] ?? 0),
            'total_expenses' => (float) ($row['total_expenses'] ?? 0),
            'total_quantity' => (int) ($row['total_quantity'] ?? 0),
            'avg_unit_cost' => (float) ($row['avg_unit_cost'] ?? 0)
        ];
    }, $category_data);
    
    // 3. Get total expenses summary
    $stmt = $db->prepare("
        SELECT
            COUNT(*) as total_items,
            COALESCE(SUM(totalCost), 0) as total_expenses,
            COALESCE(SUM(qty), 0) as total_quantity,
            COALESCE(AVG(unitCost), 0) as avg_unit_cost,
            COALESCE(SUM(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH) THEN totalCost ELSE 0 END), 0) as monthly_expenses,
            COALESCE(SUM(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 1 WEEK) THEN totalCost ELSE 0 END), 0) as weekly_expenses
        FROM inventory
    ");
    $stmt->execute();
    $summary = $stmt->fetch();
    
    // 4. Get recent expenses (last 10 items added/updated)
    $stmt = $db->prepare("
        SELECT
            id,
            item,
            category,
            qty,
            unitCost,
            totalCost,
            created_at,
            updated_at
        FROM inventory
        ORDER BY GREATEST(created_at, updated_at) DESC
        LIMIT 10
    ");
    $stmt->execute();
    $recent_items = $stmt->fetchAll();
    
    $recent_expenses = array_map(function ($item) {
        return [
            'id' => (int) $item['id'],
            'item' => $item['item'],
            'category' => $item['category'] ?? 'General',
            'quantity' => (int) ($item['qty'] ?? 0),
            'unit_cost' => (float) ($item['unitCost'] ?? 0),
            'total_cost' => (float) ($item['totalCost'] ?? 0),
            'created_at' => $item['created_at'],
            'updated_at' => $item['updated_at']
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
    Response::error('Database error: ' . $e->getMessage());
}
?>

