<?php
// ==========================================
// Sales Verification Status
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

    // Calculate verification metrics
    $invoiceQuery = "SELECT 
                    COUNT(*) as verified_sales,
                    SUM(CASE WHEN status = 'Paid' THEN 1 ELSE 0 END) as paid_count
                  FROM invoices 
                  WHERE YEAR(invoice_date) = YEAR(CURDATE())";

    $stmt = $db->prepare($invoiceQuery);
    $stmt->execute();
    $invoiceData = $stmt->fetch(PDO::FETCH_ASSOC);

    // Calculate system health based on data completeness
    $treatments = $db->prepare("SELECT COUNT(*) as total FROM appointments WHERE YEAR(appointment_date) = YEAR(CURDATE())")->execute()->fetch(PDO::FETCH_ASSOC)['total'] ?? 0;
    $invoices = $invoiceData['verified_sales'] ?? 0;
    
    $verificationRate = $invoices > 0 ? round(($treatments / $invoices * 100), 2) : 0;
    $systemHealth = min(100, round(($verificationRate + ($invoiceData['paid_count'] ?? 0) / max(1, $invoiceData['verified_sales'] ?? 1) * 100) / 2, 2));

    // Prepare verification status
    $verificationData = [
        'verified_sales' => (int)($invoiceData['verified_sales'] ?? 0),
        'paid_sales' => (int)($invoiceData['paid_count'] ?? 0),
        'verification_rate' => min(100, (float)$verificationRate),
        'system_health' => (float)$systemHealth,
        'last_sync' => date('Y-m-d H:i:s'),
        'all_systems_operational' => true,
        'timestamp' => time()
    ];

    Response::success($verificationData);

} catch (Exception $e) {
    Response::error('Error fetching verification status: ' . $e->getMessage());
}
?>
