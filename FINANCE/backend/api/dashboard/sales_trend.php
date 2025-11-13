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

$months = isset($_GET['months']) ? (int)$_GET['months'] : 6;

try {
    // Compute date boundary in PHP instead of binding inside INTERVAL
    $from_date = date('Y-m-d', strtotime("-$months months"));

    // Get sales trend from payments
    $stmt = $db->prepare("
        SELECT 
            DATE_FORMAT(p.payment_date, '%Y-%m') as month,
            COALESCE(SUM(p.amount), 0) as total_sales
        FROM payments p
        WHERE p.payment_date >= :from_date
        GROUP BY DATE_FORMAT(p.payment_date, '%Y-%m')
        ORDER BY month ASC
    ");
    $stmt->execute([':from_date' => $from_date]);
    $trend_data = $stmt->fetchAll();
    
    // Ensure we have data for all months in the range (fill missing months with 0)
    $all_months = [];
    $current = strtotime($from_date);
    $end = strtotime('now');
    
    while ($current <= $end) {
        $month_key = date('Y-m', $current);
        $all_months[$month_key] = 0;
        $current = strtotime('+1 month', $current);
    }
    
    // Merge actual data with all months
    foreach ($trend_data as $row) {
        $all_months[$row['month']] = (float) $row['total_sales'];
    }
    
    // Convert to array format
    $formatted_data = array_map(function ($month, $sales) {
        return [
            'month' => $month,
            'total_sales' => $sales
        ];
    }, array_keys($all_months), array_values($all_months));
    
    Response::success($formatted_data);
    
} catch (Exception $e) {
    Response::error('Database error: ' . $e->getMessage());
}
?>
