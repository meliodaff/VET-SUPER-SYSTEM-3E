<?php
require_once '../../config/database.php';
require_once '../../utils/cors.php';
require_once '../../utils/response.php';

$database = new Database();
$db = $database->getConnection();

if (!$db) {
    Response::error('Database connection failed');
}

$months = isset($_GET['months']) ? (int)$_GET['months'] : 6;

try {
    // Compute date boundary in PHP instead of binding inside INTERVAL
    $from_date = date('Y-m-d', strtotime("-$months months"));

    // Check if invoices table exists
    $tablesStmt = $db->query("SHOW TABLES LIKE 'invoices'");
    $hasInvoices = $tablesStmt->rowCount() > 0;
    
    if (!$hasInvoices) {
        Response::error('Invoices table not found');
    }

    // Check what columns exist in invoices table
    $columnsStmt = $db->query("SHOW COLUMNS FROM invoices");
    $columns = $columnsStmt->fetchAll(PDO::FETCH_COLUMN);
    
    // Determine date and amount fields
    $dateField = in_array('invoice_date', $columns) ? 'invoice_date' : (in_array('date', $columns) ? 'date' : 'created_at');
    $amountField = in_array('total_amount', $columns) ? 'total_amount' : (in_array('amount', $columns) ? 'amount' : '0');
    $statusField = in_array('status', $columns) ? 'status' : 'paid';

    // Get sales trend from invoices table (paid invoices only)
    // Using invoices table directly for accurate sales data
    $stmt = $db->prepare("
        SELECT 
            DATE_FORMAT($dateField, '%Y-%m') as month,
            COALESCE(SUM($amountField), 0) as total_sales,
            COUNT(*) as invoice_count
        FROM invoices
        WHERE $dateField >= :from_date 
          AND LOWER($statusField) = 'paid'
        GROUP BY DATE_FORMAT($dateField, '%Y-%m')
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
