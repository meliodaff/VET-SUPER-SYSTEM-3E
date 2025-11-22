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
    // Get summary statistics
    $stmt = $db->prepare("
        SELECT
            COUNT(DISTINCT inv.id) as total_items,
            COALESCE(SUM(inv.totalCost), 0) as total_value,
            COUNT(CASE WHEN inv.qty < 10 THEN 1 END) as low_stock,
            MAX(GREATEST(inv.created_at, inv.updated_at)) as last_updated
        FROM inventory inv
    ");
    $stmt->execute();
    $summary = $stmt->fetch();
    
    // Get recent transactions (last 20)
    $stmt = $db->prepare("
        SELECT
            id,
            transaction_number,
            product_name,
            transaction_type,
            quantity,
            unit_price,
            total_amount,
            performed_by,
            created_at
        FROM inventory_transactions
        ORDER BY created_at DESC
        LIMIT 20
    ");
    $stmt->execute();
    $transactions = $stmt->fetchAll();
    
    $recent_transactions = array_map(function ($txn) {
        return [
            'id' => (int) $txn['id'],
            'transaction_number' => $txn['transaction_number'],
            'product_name' => $txn['product_name'],
            'transaction_type' => $txn['transaction_type'],
            'quantity' => (int) $txn['quantity'],
            'unit_price' => (float) $txn['unit_price'],
            'total_amount' => (float) $txn['total_amount'],
            'performed_by' => $txn['performed_by'] ?? 'System',
            'created_at' => $txn['created_at']
        ];
    }, $transactions);
    
    // Get current inventory levels
    $stmt = $db->prepare("
        SELECT
            id,
            item,
            category,
            qty,
            unitCost,
            totalCost,
            CASE 
                WHEN qty < 10 THEN 'Low Stock'
                WHEN qty = 0 THEN 'Out of Stock'
                ELSE 'In Stock'
            END as status
        FROM inventory
        ORDER BY totalCost DESC
    ");
    $stmt->execute();
    $inventory = $stmt->fetchAll();
    
    $current_inventory = array_map(function ($item) {
        return [
            'id' => (int) $item['id'],
            'product' => $item['item'],
            'category' => $item['category'] ?? 'General',
            'qty' => (int) $item['qty'],
            'status' => $item['status'],
            'unit_cost' => (float) $item['unitCost'],
            'total_cost' => (float) $item['totalCost']
        ];
    }, $inventory);
    
    Response::success([
        'summary' => [
            'total_items' => (int) ($summary['total_items'] ?? 0),
            'total_value' => (float) ($summary['total_value'] ?? 0),
            'low_stock' => (int) ($summary['low_stock'] ?? 0),
            'last_updated' => $summary['last_updated'] ?? date('Y-m-d H:i:s')
        ],
        'recent_transactions' => $recent_transactions,
        'current_inventory' => $current_inventory
    ]);
    
} catch (Exception $e) {
    Response::error('Database error: ' . $e->getMessage());
}
?>

