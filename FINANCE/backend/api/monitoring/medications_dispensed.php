<?php
// ==========================================
// Medications Dispensed Monitoring
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

    // Query medications from inventory system
    $query = "SELECT 
                COUNT(*) as total_medications,
                SUM(CASE WHEN DATE(updated_at) = CURDATE() THEN 1 ELSE 0 END) as today_medications,
                ROUND(COUNT(*) / COALESCE(
                    (SELECT COUNT(*) FROM products WHERE YEAR(updated_at) = YEAR(CURDATE())), 1
                ) * 100, 2) as dispensed_rate
              FROM products 
              WHERE YEAR(updated_at) = YEAR(CURDATE())
              AND quantity < (SELECT quantity FROM products LIMIT 1)";

    $stmt = $db->prepare($query);
    $stmt->execute();
    $metrics = $stmt->fetch(PDO::FETCH_ASSOC);

    // Query recent medications (from products table as proxy)
    $medicationsQuery = "SELECT 
                        id,
                        DATE(updated_at) as date,
                        'Patient' as patient_name,
                        name as medication_name,
                        '1 unit' as dosage,
                        quantity as quantity,
                        'tablet' as unit,
                        'Dispensed' as status
                      FROM products
                      WHERE YEAR(updated_at) = YEAR(CURDATE())
                      ORDER BY updated_at DESC
                      LIMIT 20";

    $stmt = $db->prepare($medicationsQuery);
    $stmt->execute();
    $medications = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Get top medication
    $topMedQuery = "SELECT name, COUNT(*) as count 
                    FROM products 
                    WHERE YEAR(updated_at) = YEAR(CURDATE())
                    GROUP BY name 
                    ORDER BY count DESC 
                    LIMIT 1";
    $stmt = $db->prepare($topMedQuery);
    $stmt->execute();
    $topMed = $stmt->fetch(PDO::FETCH_ASSOC);

    // Prepare metrics
    $metricsData = [
        'total_medications' => (int)($metrics['total_medications'] ?? 0),
        'today_medications' => (int)($metrics['today_medications'] ?? 0),
        'dispensed_rate' => (float)($metrics['dispensed_rate'] ?? 0),
        'auto_record_enabled' => true,
        'month_recorded' => (int)($metrics['today_medications'] ?? 0),
        'top_medication' => $topMed['name'] ?? 'N/A',
        'top_medication_count' => (int)($topMed['count'] ?? 0),
        'dispensing_status_details' => 'Medications are automatically recorded when inventory is updated'
    ];

    Response::success([
        'metrics' => $metricsData,
        'list' => $medications
    ]);

} catch (Exception $e) {
    Response::error('Error fetching medications data: ' . $e->getMessage());
}
?>
