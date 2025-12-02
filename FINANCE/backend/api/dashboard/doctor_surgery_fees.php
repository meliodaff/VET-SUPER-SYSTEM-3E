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
    // Check what columns exist in employees table
    $columnsStmt = $db->query("SHOW COLUMNS FROM employees");
    $columns = $columnsStmt->fetchAll(PDO::FETCH_COLUMN);
    $hasId = in_array('id', $columns);
    $hasName = in_array('name', $columns);
    $hasFirstName = in_array('first_name', $columns);
    $hasRole = in_array('role', $columns);
    $hasSystemRole = in_array('system_role', $columns);
    $hasPosition = in_array('Position', $columns);
    $hasEmployeeId = in_array('employee_id', $columns);
    
    // Build name field
    if ($hasName) {
        $nameField = 'e.name';
    } elseif ($hasFirstName) {
        $nameField = "CONCAT(COALESCE(e.first_name, ''), ' ', COALESCE(e.middle_name, ''), ' ', COALESCE(e.last_name, ''))";
    } else {
        $nameField = "COALESCE(e.first_name, 'Unknown')";
    }
    
    // Build WHERE clause for veterinarians
    $whereConditions = [];
    if ($hasSystemRole && $hasPosition) {
        $conditions = ["e.system_role = 'Admin'", "e.Position LIKE '%Veterinarian%'", "e.Position LIKE '%Vet%'"];
        if ($hasRole) {
            $conditions[] = "e.role = 'veterinarian'";
            $conditions[] = "e.role = 'admin'";
        }
        $whereConditions[] = "(" . implode(" OR ", $conditions) . ")";
    } elseif ($hasSystemRole) {
        $conditions = ["e.system_role = 'Admin'"];
        if ($hasRole) {
            $conditions[] = "e.role = 'veterinarian'";
            $conditions[] = "e.role = 'admin'";
        }
        $whereConditions[] = "(" . implode(" OR ", $conditions) . ")";
    } elseif ($hasRole) {
        $whereConditions[] = "(e.role = 'veterinarian' OR e.role = 'admin')";
    } elseif ($hasPosition) {
        $whereConditions[] = "(e.Position LIKE '%Veterinarian%' OR e.Position LIKE '%Vet%')";
    }
    
    $employeeIdField = $hasEmployeeId ? "e.employee_id" : ($hasId ? "e.id" : "e.employee_id");
    $idSelectField = $hasEmployeeId ? "e.employee_id" : ($hasId ? "COALESCE(e.id, e.employee_id)" : "e.employee_id");
    
    // Get all veterinarians
    $sql = "
        SELECT 
            $idSelectField AS employee_id,
            $nameField AS doctor
        FROM employees e
    ";
    
    if (!empty($whereConditions)) {
        $sql .= " WHERE " . implode(" AND ", $whereConditions);
    }
    
    $stmt = $db->prepare($sql);
    $stmt->execute();
    $doctors = $stmt->fetchAll();
    
    // Check if invoice_items and services tables exist
    $tablesStmt = $db->query("SHOW TABLES LIKE 'invoice_items'");
    $hasInvoiceItems = $tablesStmt->rowCount() > 0;
    
    $tablesStmt = $db->query("SHOW TABLES LIKE 'services'");
    $hasServices = $tablesStmt->rowCount() > 0;
    
    // Get surgery fees from invoices and invoice_items
    // Filter for services containing "Surgery"
    if ($hasInvoiceItems && $hasServices) {
        $stmt_surgeries = $db->prepare("
            SELECT 
                inv.employee_id,
                COUNT(DISTINCT inv.id) as surgeries_count,
                SUM(ii.line_total) as total_fees
            FROM invoices inv
            JOIN invoice_items ii ON inv.id = ii.invoice_id
            LEFT JOIN services s ON ii.service_id = s.id
            WHERE inv.status = 'paid' 
              AND (s.name LIKE '%Surgery%' OR s.name LIKE '%surgery%' OR s.category LIKE '%Surgery%' OR s.category LIKE '%surgery%')
            GROUP BY inv.employee_id
        ");
    } else if ($hasInvoiceItems) {
        // Fallback: check service_name in invoice_items if services table doesn't exist
        $invoiceItemsColumnsStmt = $db->query("SHOW COLUMNS FROM invoice_items");
        $invoiceItemsColumns = $invoiceItemsColumnsStmt->fetchAll(PDO::FETCH_COLUMN);
        
        if (in_array('service_name', $invoiceItemsColumns)) {
            $stmt_surgeries = $db->prepare("
                SELECT 
                    inv.employee_id,
                    COUNT(DISTINCT inv.id) as surgeries_count,
                    SUM(ii.line_total) as total_fees
                FROM invoices inv
                JOIN invoice_items ii ON inv.id = ii.invoice_id
                WHERE inv.status = 'paid' 
                  AND (ii.service_name LIKE '%Surgery%' OR ii.service_name LIKE '%surgery%')
                GROUP BY inv.employee_id
            ");
        } else {
            // If no service info, return empty results
            $surgery_stats = [];
            $stmt_surgeries = null;
        }
    } else {
        // If invoice_items doesn't exist, return empty results
        $surgery_stats = [];
        $stmt_surgeries = null;
    }
    
    if ($stmt_surgeries) {
        $stmt_surgeries->execute();
        $surgery_stats = $stmt_surgeries->fetchAll();
    }
    
    // Create a map of employee_id to surgery statistics
    $surgery_map = [];
    foreach ($surgery_stats as $stat) {
        $surgery_map[(int)$stat['employee_id']] = $stat;
    }
    
    // Combine doctor data with surgery statistics
    $surgery_fees = [];
    foreach ($doctors as $doctor) {
        $employeeId = (int)($doctor['employee_id'] ?? 0);
        $surgeryData = $surgery_map[$employeeId] ?? null;
        
        if ($surgeryData && (int)($surgeryData['surgeries_count'] ?? 0) > 0) {
            $surgery_fees[] = [
                'doctor' => trim($doctor['doctor'] ?? 'Unknown Doctor'),
                'surgeries' => (int)($surgeryData['surgeries_count'] ?? 0),
                'total_fees' => (float)($surgeryData['total_fees'] ?? 0)
            ];
        }
    }
    
    // Sort by total_fees descending
    usort($surgery_fees, function($a, $b) {
        return $b['total_fees'] <=> $a['total_fees'];
    });
    
    Response::success($surgery_fees);
    
} catch (Exception $e) {
    error_log("Doctor Surgery Fees Error: " . $e->getMessage());
    Response::error('Database error: ' . $e->getMessage());
}
?>
