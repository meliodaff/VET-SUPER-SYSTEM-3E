<?php
// ==========================================
// Inventory Deductions Monitoring
// ==========================================

require_once '../../config/database.php';
require_once '../../utils/cors.php';
require_once '../../utils/response.php';

try {
    $database = new Database();
    $db = $database->getConnection();

    if (!$db) {
        Response::error('Database connection failed');
    }

    // Query inventory deductions from products
    $query = "SELECT 
                COUNT(*) as total_deductions,
                SUM(CASE WHEN DATE(updated_at) = CURDATE() THEN 1 ELSE 0 END) as today_deductions,
                ROUND(SUM(cost * quantity), 2) as total_value_deducted,
                ROUND(
                    COUNT(*) / COALESCE(
                        (SELECT COUNT(*) FROM products WHERE YEAR(updated_at) = YEAR(CURDATE())), 1
                    ) * 100, 2
                ) as accuracy_rate
              FROM products
              WHERE YEAR(updated_at) = YEAR(CURDATE())
              AND quantity > 0";

    $stmt = $db->prepare($query);
    $stmt->execute();
    $metrics = $stmt->fetch(PDO::FETCH_ASSOC);

    // Query recent inventory deductions
    $deductionsQuery = "SELECT 
                        id,
                        DATE(updated_at) as date,
                        name as item_name,
                        quantity,
                        'unit' as unit,
                        cost as unit_price,
                        (quantity * cost) as total_value,
                        'Sales' as reason,
                        'Automatic' as type
                      FROM products
                      WHERE YEAR(updated_at) = YEAR(CURDATE())
                      AND quantity > 0
                      ORDER BY updated_at DESC
                      LIMIT 20";

    $stmt = $db->prepare($deductionsQuery);
    $stmt->execute();
    $deductions = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Prepare metrics
    $metricsData = [
        'total_deductions' => (int)($metrics['total_deductions'] ?? 0),
        'today_deductions' => (int)($metrics['today_deductions'] ?? 0),
        'total_value_deducted' => (float)($metrics['total_value_deducted'] ?? 0),
        'accuracy_rate' => (float)($metrics['accuracy_rate'] ?? 0),
        'deduction_status' => 'automatic',
        'deduction_method' => 'Automatic',
        'manual_deductions' => 0,
        'deduction_details' => 'Inventory items are automatically deducted when products are updated'
    ];

    Response::success([
        'metrics' => $metricsData,
        'deductions' => $deductions
    ]);

} catch (Exception $e) {
    Response::error('Error fetching inventory deductions: ' . $e->getMessage());
}
?>
