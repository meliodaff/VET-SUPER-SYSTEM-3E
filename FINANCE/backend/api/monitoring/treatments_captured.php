<?php
// ==========================================
// Treatments Captured Monitoring
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

    // Query appointments to get treatments
    $query = "SELECT 
                COUNT(*) as total_treatments,
                SUM(CASE WHEN DATE(appointment_date) = CURDATE() THEN 1 ELSE 0 END) as today_treatments,
                ROUND(COUNT(*) / COALESCE(
                    (SELECT COUNT(*) FROM appointments WHERE YEAR(appointment_date) = YEAR(CURDATE())), 1
                ) * 100, 2) as capture_rate
              FROM appointments 
              WHERE YEAR(appointment_date) = YEAR(CURDATE())
              AND status = 'Completed'";

    $stmt = $db->prepare($query);
    $stmt->execute();
    $metrics = $stmt->fetch(PDO::FETCH_ASSOC);

    // Query recent treatments
    $treatmentsQuery = "SELECT 
                        a.id,
                        a.appointment_date as date,
                        a.client_name as patient_name,
                        a.service as treatment_type,
                        a.veterinarian_name as veterinarian,
                        'Captured' as status
                      FROM appointments a
                      WHERE a.status = 'Completed'
                      ORDER BY a.appointment_date DESC
                      LIMIT 20";

    $stmt = $db->prepare($treatmentsQuery);
    $stmt->execute();
    $treatments = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Prepare metrics
    $metricsData = [
        'total_treatments' => (int)($metrics['total_treatments'] ?? 0),
        'today_treatments' => (int)($metrics['today_treatments'] ?? 0),
        'capture_rate' => (float)($metrics['capture_rate'] ?? 0),
        'auto_capture_enabled' => true,
        'month_captured' => (int)($metrics['today_treatments'] ?? 0),
        'total_appointments' => (int)($metrics['total_treatments'] ?? 0),
        'capture_status_details' => 'Treatments are automatically captured when appointments are marked as completed'
    ];

    Response::success([
        'metrics' => $metricsData,
        'list' => $treatments
    ]);

} catch (Exception $e) {
    Response::error('Error fetching treatments data: ' . $e->getMessage());
}
?>
