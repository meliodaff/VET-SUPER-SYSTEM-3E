<?php
require_once '../../config/database.php';
require_once '../../utils/cors.php';
require_once '../../utils/response.php';

// Connect to appointment_sia database for sales data
$host = 'localhost';
$db_name = 'appointment_sia';
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

if (!$db) {
    Response::error('Database connection failed');
}

$months = isset($_GET['months']) ? (int)$_GET['months'] : 6;

try {
    // Compute date boundary in PHP instead of binding inside INTERVAL
    $from_date = date('Y-m-d', strtotime("-$months months"));

    // Get sales trend from book_appointment table (paid appointments only)
    $stmt = $db->prepare("
        SELECT 
            DATE_FORMAT(date, '%Y-%m') as month,
            COALESCE(SUM(service_price), 0) as total_sales
        FROM book_appointment
        WHERE date >= :from_date AND payment_status = 'Paid'
        GROUP BY DATE_FORMAT(date, '%Y-%m')
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
