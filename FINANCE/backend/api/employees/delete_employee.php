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

if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    Response::error('Method not allowed', 405);
}

// Handle both GET and query string parameters
$id = isset($_GET['id']) ? $_GET['id'] : null;

// If id is not numeric, it might be employee_id
if (!$id) {
    Response::error('Employee ID is required');
}

try {
    // Check what primary key column exists
    $columnsStmt = $db->query("SHOW COLUMNS FROM employees");
    $columns = $columnsStmt->fetchAll(PDO::FETCH_COLUMN);
    $hasId = in_array('id', $columns);
    $hasEmployeeId = in_array('employee_id', $columns);
    
    // Determine primary key column
    $primaryKey = $hasId ? 'id' : ($hasEmployeeId ? 'employee_id' : 'id');
    
    // Check if employee exists using the appropriate primary key
    $checkSql = "SELECT $primaryKey FROM employees WHERE $primaryKey = ?";
    $stmt = $db->prepare($checkSql);
    $stmt->execute([$id]);
    
    if ($stmt->rowCount() === 0) {
        Response::error('Employee not found');
    }
    
    // Delete employee using the appropriate primary key
    $deleteSql = "DELETE FROM employees WHERE $primaryKey = ?";
    $stmt = $db->prepare($deleteSql);
    $result = $stmt->execute([$id]);
    
    if ($result) {
        Response::success(null, 'Employee deleted successfully');
    } else {
        Response::error('Failed to delete employee');
    }
    
} catch (Exception $e) {
    Response::error('Database error: ' . $e->getMessage());
}
?>
