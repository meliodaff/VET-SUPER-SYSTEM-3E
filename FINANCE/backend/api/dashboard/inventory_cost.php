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
    // Get inventory data with normalized field names
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
        ORDER BY totalCost DESC
    ");
    $stmt->execute();
    $rows = $stmt->fetchAll();
    
    $inventory_data = array_map(function ($item) {
        return [
            'id' => (int) $item['id'],
            'item_name' => $item['item'],
            'category' => $item['category'],
            'quantity' => (int) ($item['qty'] ?? 0),
            'unit_cost' => isset($item['unitCost']) ? (float) $item['unitCost'] : 0,
            'total_cost' => isset($item['totalCost']) ? (float) $item['totalCost'] : 0,
            'created_at' => $item['created_at'],
            'updated_at' => $item['updated_at']
        ];
    }, $rows);
    
    // Get category breakdown
    $stmt = $db->prepare("
        SELECT 
            category,
            SUM(totalCost) as category_total,
            COUNT(*) as item_count
        FROM inventory 
        GROUP BY category 
        ORDER BY category_total DESC
    ");
    $stmt->execute();
    $category_rows = $stmt->fetchAll();
    
    $category_breakdown = array_map(function ($row) {
        return [
            'category' => $row['category'],
            'category_total' => isset($row['category_total']) ? (float) $row['category_total'] : 0,
            'item_count' => (int) ($row['item_count'] ?? 0)
        ];
    }, $category_rows);
    
    Response::success([
        'inventory_data' => $inventory_data,
        'category_breakdown' => $category_breakdown
    ]);
    
} catch (Exception $e) {
    Response::error('Database error: ' . $e->getMessage());
}
?>
