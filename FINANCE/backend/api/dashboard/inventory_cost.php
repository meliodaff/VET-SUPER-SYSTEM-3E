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
    // First, check what columns exist in the inventory_items table
    $columnsStmt = $db->query("SHOW COLUMNS FROM inventory_items");
    $columns = $columnsStmt->fetchAll(PDO::FETCH_COLUMN);
    
    // Determine field names based on what exists
    $hasQuantity = in_array('quantity', $columns) || in_array('qty', $columns) || in_array('stock', $columns);
    $hasUnitCost = in_array('unit_cost', $columns) || in_array('unitCost', $columns) || in_array('price', $columns) || in_array('cost', $columns);
    $hasCategoryId = in_array('category_id', $columns);
    $hasName = in_array('name', $columns) || in_array('product_name', $columns);
    $hasCategory = in_array('category', $columns);
    
    // Build field selections
    $quantityField = in_array('quantity', $columns) ? 'ii.quantity' : (in_array('qty', $columns) ? 'ii.qty' : (in_array('stock', $columns) ? 'ii.stock' : '0'));
    $unitCostField = in_array('unit_cost', $columns) ? 'ii.unit_cost' : (in_array('unitCost', $columns) ? 'ii.unitCost' : (in_array('price', $columns) ? 'ii.price' : (in_array('cost', $columns) ? 'ii.cost' : '0')));
    $nameField = in_array('name', $columns) ? 'ii.name' : (in_array('product_name', $columns) ? 'ii.product_name' : 'ii.id');
    
    // Get inventory data from inventory_items table, joining with categories
    $sql = "
        SELECT 
            ii.id,
            $nameField AS product_name,
            COALESCE(c.name, c.category_name, 'Uncategorized') AS category,
            $quantityField AS quantity,
            $unitCostField AS unit_cost,
            ($quantityField * $unitCostField) AS total_cost
        FROM inventory_items ii
        LEFT JOIN categories c ON ii.category_id = c.id
        ORDER BY ($quantityField * $unitCostField) DESC
    ";
    
    // If category_id doesn't exist, try alternative approach
    if (!$hasCategoryId) {
        // Check if category is stored directly in inventory_items table
        if ($hasCategory) {
            $sql = "
                SELECT 
                    ii.id,
                    $nameField AS product_name,
                    COALESCE(ii.category, 'Uncategorized') AS category,
                    $quantityField AS quantity,
                    $unitCostField AS unit_cost,
                    ($quantityField * $unitCostField) AS total_cost
                FROM inventory_items ii
                ORDER BY ($quantityField * $unitCostField) DESC
            ";
        } else {
            $sql = "
                SELECT 
                    ii.id,
                    $nameField AS product_name,
                    'Uncategorized' AS category,
                    $quantityField AS quantity,
                    $unitCostField AS unit_cost,
                    ($quantityField * $unitCostField) AS total_cost
                FROM inventory_items ii
                ORDER BY ($quantityField * $unitCostField) DESC
            ";
        }
    }
    
    $stmt = $db->prepare($sql);
    $stmt->execute();
    $rows = $stmt->fetchAll();
    
    $inventory_data = array_map(function ($item) {
        return [
            'id' => (int) ($item['id'] ?? 0),
            'item_name' => $item['product_name'] ?? 'Unknown Product',
            'product_name' => $item['product_name'] ?? 'Unknown Product',
            'category' => $item['category'] ?? 'Uncategorized',
            'quantity' => (int) ($item['quantity'] ?? 0),
            'qty' => (int) ($item['quantity'] ?? 0),
            'unit_cost' => (float) ($item['unit_cost'] ?? 0),
            'total_cost' => (float) ($item['total_cost'] ?? 0),
        ];
    }, $rows);
    
    // Get category breakdown
    if ($hasCategoryId) {
        $categorySql = "
            SELECT 
                COALESCE(c.name, c.category_name, 'Uncategorized') AS category,
                SUM($quantityField * $unitCostField) as category_total,
                COUNT(*) as item_count
            FROM inventory_items ii
            LEFT JOIN categories c ON ii.category_id = c.id
            GROUP BY category
            ORDER BY category_total DESC
        ";
    } else if ($hasCategory) {
        $categorySql = "
            SELECT 
                COALESCE(ii.category, 'Uncategorized') AS category,
                SUM($quantityField * $unitCostField) as category_total,
                COUNT(*) as item_count
            FROM inventory_items ii
            GROUP BY ii.category
            ORDER BY category_total DESC
        ";
    } else {
        $categorySql = "
            SELECT 
                'Uncategorized' AS category,
                SUM($quantityField * $unitCostField) as category_total,
                COUNT(*) as item_count
            FROM inventory_items ii
            ORDER BY category_total DESC
        ";
    }
    
    $stmt = $db->prepare($categorySql);
    $stmt->execute();
    $category_rows = $stmt->fetchAll();
    
    $category_breakdown = array_map(function ($row) {
        return [
            'category' => $row['category'] ?? 'Uncategorized',
            'category_total' => (float) ($row['category_total'] ?? 0),
            'item_count' => (int) ($row['item_count'] ?? 0)
        ];
    }, $category_rows);
    
    Response::success([
        'inventory_data' => $inventory_data,
        'category_breakdown' => $category_breakdown
    ]);
    
} catch (Exception $e) {
    error_log("Inventory Cost Error: " . $e->getMessage());
    Response::error('Database error: ' . $e->getMessage());
}
?>
