<?php
// ==========================================
// Lab Tests Ordered Monitoring
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

    // Query lab tests (using appointments as proxy data source)
    $query = "SELECT 
                COUNT(*) as total_tests,
                SUM(CASE WHEN status = 'Pending' THEN 1 ELSE 0 END) as pending_tests,
                SUM(CASE WHEN status = 'Completed' THEN 1 ELSE 0 END) as completed_tests,
                ROUND(
                    SUM(CASE WHEN status = 'Completed' THEN 1 ELSE 0 END) / 
                    COALESCE(COUNT(*), 1) * 100, 2
                ) as test_completion_rate,
                SUM(CASE WHEN status = 'Overdue' THEN 1 ELSE 0 END) as overdue_tests
              FROM appointments
              WHERE YEAR(appointment_date) = YEAR(CURDATE())";

    $stmt = $db->prepare($query);
    $stmt->execute();
    $metrics = $stmt->fetch(PDO::FETCH_ASSOC);

    // Query recent lab tests
    $labTestsQuery = "SELECT 
                        id,
                        appointment_date as date_ordered,
                        client_name as patient_name,
                        service as test_type,
                        'Laboratory' as lab_name,
                        DATE_ADD(appointment_date, INTERVAL 7 DAY) as due_date,
                        status
                      FROM appointments
                      WHERE YEAR(appointment_date) = YEAR(CURDATE())
                      ORDER BY appointment_date DESC
                      LIMIT 20";

    $stmt = $db->prepare($labTestsQuery);
    $stmt->execute();
    $labTests = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Prepare metrics
    $metricsData = [
        'total_tests' => (int)($metrics['total_tests'] ?? 0),
        'pending_tests' => (int)($metrics['pending_tests'] ?? 0),
        'completed_tests' => (int)($metrics['completed_tests'] ?? 0),
        'test_completion_rate' => (float)($metrics['test_completion_rate'] ?? 0),
        'overdue_tests' => (int)($metrics['overdue_tests'] ?? 0),
        'auto_order_enabled' => true,
        'tracking_enabled' => true,
        'test_ordering_details' => 'Lab tests are tracked automatically through the appointment system'
    ];

    Response::success([
        'metrics' => $metricsData,
        'list' => $labTests
    ]);

} catch (Exception $e) {
    Response::error('Error fetching lab tests data: ' . $e->getMessage());
}
?>
