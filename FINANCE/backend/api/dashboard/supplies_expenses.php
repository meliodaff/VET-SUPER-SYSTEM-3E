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
    // Get months parameter (default 6 months)
    $months = isset($_GET['months']) ? (int)$_GET['months'] : 6;
    $months = max(1, min($months, 24)); // Limit between 1 and 24 months
    
    // Calculate date range
    $from_date = date('Y-m-d', strtotime("-$months months"));
    
    // Check what columns exist in the products table
    $columnsStmt = $db->query("SHOW COLUMNS FROM products");
    $columns = $columnsStmt->fetchAll(PDO::FETCH_COLUMN);
    
    // Determine field names
    $quantityField = in_array('quantity', $columns) ? 'p.quantity' : (in_array('qty', $columns) ? 'p.qty' : (in_array('stock', $columns) ? 'p.stock' : '0'));
    $unitCostField = in_array('unit_cost', $columns) ? 'p.unit_cost' : (in_array('unitCost', $columns) ? 'p.unitCost' : (in_array('price', $columns) ? 'p.price' : (in_array('cost', $columns) ? 'p.cost' : '0')));
    $hasCategoryId = in_array('category_id', $columns);
    $hasCreatedAt = in_array('created_at', $columns);
    $hasUpdatedAt = in_array('updated_at', $columns);
    
    // Build category field
    if ($hasCategoryId) {
        $categoryField = "COALESCE(c.name, c.category_name, 'Uncategorized')";
        $categoryJoin = "LEFT JOIN categories c ON p.category_id = c.id";
    } else if (in_array('category', $columns)) {
        $categoryField = "COALESCE(p.category, 'Uncategorized')";
        $categoryJoin = "";
    } else {
        $categoryField = "'Uncategorized'";
        $categoryJoin = "";
    }
    
    // 1. Get monthly expenses trend (based on products created_at/updated_at)
    if ($hasCreatedAt) {
        $trendSql = "
            SELECT
                DATE_FORMAT(created_at, '%Y-%m') as month,
                COALESCE(SUM($quantityField * $unitCostField), 0) as total_expenses,
                COUNT(*) as items_count
            FROM products p
            $categoryJoin
            WHERE created_at >= :from_date
            GROUP BY DATE_FORMAT(created_at, '%Y-%m')
            ORDER BY month ASC
        ";
    } else {
        // If no created_at, use current date for all items
        $trendSql = "
            SELECT
                DATE_FORMAT(NOW(), '%Y-%m') as month,
                COALESCE(SUM($quantityField * $unitCostField), 0) as total_expenses,
                COUNT(*) as items_count
            FROM products p
            $categoryJoin
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
    
    // 2. Get category breakdown
    $categorySql = "
        SELECT
            $categoryField AS category,
            COUNT(*) as items_count,
            COALESCE(SUM($quantityField * $unitCostField), 0) as total_expenses,
            COALESCE(SUM($quantityField), 0) as total_quantity,
            COALESCE(AVG($unitCostField), 0) as avg_unit_cost
        FROM products p
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
    
    // 3. Get total expenses summary
    $summarySql = "
        SELECT
            COUNT(*) as total_items,
            COALESCE(SUM($quantityField * $unitCostField), 0) as total_expenses,
            COALESCE(SUM($quantityField), 0) as total_quantity,
            COALESCE(AVG($unitCostField), 0) as avg_unit_cost
        FROM products p
    ";
    
    if ($hasCreatedAt) {
        $summarySql .= ",
            COALESCE(SUM(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH) THEN ($quantityField * $unitCostField) ELSE 0 END), 0) as monthly_expenses,
            COALESCE(SUM(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 1 WEEK) THEN ($quantityField * $unitCostField) ELSE 0 END), 0) as weekly_expenses";
    } else {
        $summarySql .= ",
            0 as monthly_expenses,
            0 as weekly_expenses";
    }
    
    $stmt = $db->prepare($summarySql);
    $stmt->execute();
    $summary = $stmt->fetch();
    
    // 4. Get recent expenses (last 10 items)
    $nameField = in_array('name', $columns) ? 'p.name' : (in_array('product_name', $columns) ? 'p.product_name' : 'p.id');
    
    if ($hasCreatedAt && $hasUpdatedAt) {
        $recentSql = "
            SELECT
                p.id,
                $nameField AS item,
                $categoryField AS category,
                $quantityField AS qty,
                $unitCostField AS unitCost,
                ($quantityField * $unitCostField) AS totalCost,
                p.created_at,
                p.updated_at
            FROM products p
            $categoryJoin
            ORDER BY GREATEST(COALESCE(p.created_at, '1970-01-01'), COALESCE(p.updated_at, '1970-01-01')) DESC
            LIMIT 10
        ";
    } else if ($hasCreatedAt) {
        $recentSql = "
            SELECT
                p.id,
                $nameField AS item,
                $categoryField AS category,
                $quantityField AS qty,
                $unitCostField AS unitCost,
                ($quantityField * $unitCostField) AS totalCost,
                p.created_at,
                NULL AS updated_at
            FROM products p
            $categoryJoin
            ORDER BY p.created_at DESC
            LIMIT 10
        ";
    } else {
        $recentSql = "
            SELECT
                p.id,
                $nameField AS item,
                $categoryField AS category,
                $quantityField AS qty,
                $unitCostField AS unitCost,
                ($quantityField * $unitCostField) AS totalCost,
                NULL AS created_at,
                NULL AS updated_at
            FROM products p
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

