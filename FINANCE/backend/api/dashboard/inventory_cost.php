<?php
require_once '../../config/database.php';
require_once '../../utils/cors.php';
require_once '../../utils/response.php';

// Connect to vet-inventory database
$host = 'localhost';
$db_name = 'vet-inventory';
$username = 'root';
$password = '';

try {
    $db = new PDO(
        "mysql:host=$host;dbname=$db_name",
        $username,
        $password
    );
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $db->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch(PDOException $e) {
    Response::error('Database connection failed: ' . $e->getMessage());
}

try {
    // First, check what columns exist in the products table
    $columnsStmt = $db->query("SHOW COLUMNS FROM products");
    $columns = $columnsStmt->fetchAll(PDO::FETCH_COLUMN);
    
    // Determine field names based on what exists
    $hasQuantity = in_array('quantity', $columns) || in_array('qty', $columns) || in_array('stock', $columns);
    $hasUnitCost = in_array('unit_cost', $columns) || in_array('unitCost', $columns) || in_array('price', $columns) || in_array('cost', $columns);
    $hasCategoryId = in_array('category_id', $columns);
    $hasName = in_array('name', $columns) || in_array('product_name', $columns);
    
    // Build field selections
    $quantityField = in_array('quantity', $columns) ? 'p.quantity' : (in_array('qty', $columns) ? 'p.qty' : (in_array('stock', $columns) ? 'p.stock' : '0'));
    $unitCostField = in_array('unit_cost', $columns) ? 'p.unit_cost' : (in_array('unitCost', $columns) ? 'p.unitCost' : (in_array('price', $columns) ? 'p.price' : (in_array('cost', $columns) ? 'p.cost' : '0')));
    $nameField = in_array('name', $columns) ? 'p.name' : (in_array('product_name', $columns) ? 'p.product_name' : 'p.id');
    
    // Get inventory data from products table, joining with categories
    $sql = "
        SELECT 
            p.id,
            $nameField AS product_name,
            COALESCE(c.name, c.category_name, 'Uncategorized') AS category,
            $quantityField AS quantity,
            $unitCostField AS unit_cost,
            ($quantityField * $unitCostField) AS total_cost
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        ORDER BY ($quantityField * $unitCostField) DESC
    ";
    
    // If category_id doesn't exist, try alternative approach
    if (!$hasCategoryId) {
        // Check if category is stored directly in products table
        if (in_array('category', $columns)) {
            $sql = "
                SELECT 
                    p.id,
                    $nameField AS product_name,
                    COALESCE(p.category, 'Uncategorized') AS category,
                    $quantityField AS quantity,
                    $unitCostField AS unit_cost,
                    ($quantityField * $unitCostField) AS total_cost
                FROM products p
                ORDER BY ($quantityField * $unitCostField) DESC
            ";
        } else {
            $sql = "
                SELECT 
                    p.id,
                    $nameField AS product_name,
                    'Uncategorized' AS category,
                    $quantityField AS quantity,
                    $unitCostField AS unit_cost,
                    ($quantityField * $unitCostField) AS total_cost
                FROM products p
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
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            GROUP BY category
            ORDER BY category_total DESC
        ";
    } else if (in_array('category', $columns)) {
        $categorySql = "
            SELECT 
                COALESCE(p.category, 'Uncategorized') AS category,
                SUM($quantityField * $unitCostField) as category_total,
                COUNT(*) as item_count
            FROM products p
            GROUP BY p.category
            ORDER BY category_total DESC
        ";
    } else {
        $categorySql = "
            SELECT 
                'Uncategorized' AS category,
                SUM($quantityField * $unitCostField) as category_total,
                COUNT(*) as item_count
            FROM products p
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
