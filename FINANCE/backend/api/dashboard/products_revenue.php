<?php
require_once '../../config/database.php';
require_once '../../utils/cors.php';
require_once '../../utils/response.php';

// Connect to appointment_sia database for revenue data
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

try {
    // Get products revenue from paid appointments grouped by service type
    // Extract service category from service field (e.g., "Surgery (General)" -> "Surgery")
    $stmt = $db->prepare("
        SELECT 
            CASE 
                WHEN service LIKE '%Surgery%' THEN 'Surgery'
                WHEN service LIKE '%Consultation%' OR service LIKE '%Checkup%' THEN 'Consultation'
                WHEN service LIKE '%Vaccination%' OR service LIKE '%Vaccine%' THEN 'Vaccination'
                WHEN service LIKE '%Grooming%' THEN 'Grooming'
                WHEN service LIKE '%Laboratory%' OR service LIKE '%Lab%' THEN 'Laboratory'
                WHEN service LIKE '%Medication%' OR service LIKE '%Medicine%' THEN 'Medication'
                ELSE 'Other Services'
            END AS category,
            SUM(service_price) AS total_revenue,
            COUNT(*) AS service_count
        FROM book_appointment
        WHERE payment_status = 'Paid'
        GROUP BY category
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
            'category' => $row['category'] ?? 'Other Services',
            'amount' => $amount,
            'percentage' => $percentage,
            'count' => (int) ($row['service_count'] ?? 0)
        ];
    }, $rows);
    
    Response::success($products_revenue);
    
} catch (Exception $e) {
    Response::error('Database error: ' . $e->getMessage());
}
?>
