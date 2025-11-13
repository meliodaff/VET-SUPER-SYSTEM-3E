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
    // Check employees table structure
    $columnsStmt = $db->query("SHOW COLUMNS FROM employees");
    $columns = $columnsStmt->fetchAll(PDO::FETCH_COLUMN);
    
    echo "<h2>Employees Table Columns:</h2>";
    echo "<pre>" . print_r($columns, true) . "</pre>";
    
    // Check if we have any employees
    $empStmt = $db->query("SELECT COUNT(*) as count FROM employees");
    $empCount = $empStmt->fetch()['count'];
    echo "<h2>Total Employees: $empCount</h2>";
    
    // Check employees with Position or system_role
    $vetStmt = $db->query("
        SELECT employee_id, first_name, last_name, Position, system_role, role
        FROM employees 
        WHERE Position LIKE '%Veterinarian%' OR Position LIKE '%Vet%' OR system_role = 'Admin'
        LIMIT 10
    ");
    $vets = $vetStmt->fetchAll();
    echo "<h2>Veterinarians Found:</h2>";
    echo "<pre>" . print_r($vets, true) . "</pre>";
    
    // Check invoices
    $invStmt = $db->query("
        SELECT COUNT(*) as count, 
               COUNT(DISTINCT employee_id) as unique_employees,
               SUM(CASE WHEN status = 'paid' THEN total_amount ELSE 0 END) as paid_revenue
        FROM invoices
    ");
    $invData = $invStmt->fetch();
    echo "<h2>Invoices Data:</h2>";
    echo "<pre>" . print_r($invData, true) . "</pre>";
    
    // Check invoice-employee relationship
    $relStmt = $db->query("
        SELECT e.employee_id, e.first_name, e.last_name, 
               COUNT(inv.id) as invoice_count,
               SUM(CASE WHEN inv.status = 'paid' THEN inv.total_amount ELSE 0 END) as revenue
        FROM employees e
        LEFT JOIN invoices inv ON inv.employee_id = e.employee_id
        WHERE e.Position LIKE '%Veterinarian%' OR e.system_role = 'Admin'
        GROUP BY e.employee_id, e.first_name, e.last_name
    ");
    $relationships = $relStmt->fetchAll();
    echo "<h2>Employee-Invoice Relationships:</h2>";
    echo "<pre>" . print_r($relationships, true) . "</pre>";
    
    // Check surgery data
    $surgeryStmt = $db->query("
        SELECT e.employee_id, e.first_name, e.last_name,
               COUNT(ii.id) as surgery_count,
               SUM(ii.line_total) as surgery_fees
        FROM employees e
        LEFT JOIN invoices inv ON inv.employee_id = e.employee_id
        LEFT JOIN invoice_items ii ON ii.invoice_id = inv.id
        LEFT JOIN services s ON ii.service_id = s.id
        WHERE (e.Position LIKE '%Veterinarian%' OR e.system_role = 'Admin')
        AND s.category = 'Surgery' AND inv.status = 'paid'
        GROUP BY e.employee_id, e.first_name, e.last_name
    ");
    $surgeryData = $surgeryStmt->fetchAll();
    echo "<h2>Surgery Data:</h2>";
    echo "<pre>" . print_r($surgeryData, true) . "</pre>";
    
} catch (Exception $e) {
    echo "<h2>Error:</h2>";
    echo "<pre>" . $e->getMessage() . "</pre>";
}
?>

