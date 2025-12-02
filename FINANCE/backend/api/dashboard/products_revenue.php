<?php
require_once '../../config/database.php';
require_once '../../utils/cors.php';
require_once '../../utils/response.php';

$database = new Database();
$db = $database->getConnection();

if (!$db) {
    Response::error('Database connection failed');
}

try {
    // Check if invoice_items and services tables exist
    $tablesStmt = $db->query("SHOW TABLES LIKE 'invoice_items'");
    $hasInvoiceItems = $tablesStmt->rowCount() > 0;
    
    $tablesStmt = $db->query("SHOW TABLES LIKE 'services'");
    $hasServices = $tablesStmt->rowCount() > 0;
    
    if ($hasInvoiceItems && $hasServices) {
        // Get products revenue from invoice_items joined with services, grouped by service category
        $stmt = $db->prepare("
            SELECT 
                COALESCE(s.category, 'Other Services') AS category,
                SUM(ii.line_total) AS total_revenue,
                COUNT(*) AS service_count
            FROM invoice_items ii
            JOIN invoices inv ON ii.invoice_id = inv.id
            LEFT JOIN services s ON ii.service_id = s.id
            WHERE inv.status = 'paid'
            GROUP BY s.category
            ORDER BY total_revenue DESC
        ");
    } else {
        // Fallback: try to get from invoice_items directly if services table doesn't exist
        $columnsStmt = $db->query("SHOW COLUMNS FROM invoice_items");
        $columns = $columnsStmt->fetchAll(PDO::FETCH_COLUMN);
        
        if (in_array('service_name', $columns)) {
            $stmt = $db->prepare("
                SELECT 
                    CASE 
                        WHEN ii.service_name LIKE '%Surgery%' THEN 'Surgery'
                        WHEN ii.service_name LIKE '%Consultation%' OR ii.service_name LIKE '%Checkup%' THEN 'Consultation'
                        WHEN ii.service_name LIKE '%Vaccination%' OR ii.service_name LIKE '%Vaccine%' THEN 'Vaccination'
                        WHEN ii.service_name LIKE '%Grooming%' THEN 'Grooming'
                        WHEN ii.service_name LIKE '%Laboratory%' OR ii.service_name LIKE '%Lab%' THEN 'Laboratory'
                        WHEN ii.service_name LIKE '%Medication%' OR ii.service_name LIKE '%Medicine%' THEN 'Medication'
                        ELSE 'Other Services'
                    END AS category,
                    SUM(ii.line_total) AS total_revenue,
                    COUNT(*) AS service_count
                FROM invoice_items ii
                JOIN invoices inv ON ii.invoice_id = inv.id
                WHERE inv.status = 'paid'
                GROUP BY category
                ORDER BY total_revenue DESC
            ");
        } else {
            // If no service info available, return empty or use invoice totals
            $stmt = $db->prepare("
                SELECT 
                    'All Services' AS category,
                    SUM(inv.total_amount) AS total_revenue,
                    COUNT(*) AS service_count
                FROM invoices inv
                WHERE inv.status = 'paid'
            ");
        }
    }
    
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
