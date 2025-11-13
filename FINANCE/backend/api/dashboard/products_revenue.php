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
    // Get products revenue from paid invoices only
    $stmt = $db->prepare("
        SELECT 
            COALESCE(s.category, 'Other') AS category,
            SUM(ii.line_total) AS total_revenue
        FROM invoice_items ii
        JOIN invoices inv ON ii.invoice_id = inv.id
        LEFT JOIN services s ON ii.service_id = s.id
        WHERE inv.status = 'paid'
        GROUP BY s.category
        ORDER BY total_revenue DESC
    ");
    $stmt->execute();
    $rows = $stmt->fetchAll();
    
    $totalRevenue = array_sum(array_map(function ($row) {
        return (float) $row['total_revenue'];
    }, $rows));
    
    $products_revenue = array_map(function ($row) use ($totalRevenue) {
        $amount = (float) $row['total_revenue'];
        $percentage = $totalRevenue > 0 ? round(($amount / $totalRevenue) * 100, 2) : 0;
        
        return [
            'category' => $row['category'] ?? 'Other',
            'amount' => $amount,
            'percentage' => $percentage
        ];
    }, $rows);
    
    Response::success($products_revenue);
    
} catch (Exception $e) {
    Response::error('Database error: ' . $e->getMessage());
}
?>
