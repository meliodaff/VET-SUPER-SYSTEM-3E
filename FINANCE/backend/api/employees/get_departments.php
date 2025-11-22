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
    // Get department statistics from actual database columns
    $stmt = $db->prepare("
        SELECT 
            department,
            rate,
            employment_type
        FROM employees
        WHERE department IS NOT NULL AND department != ''
    ");
    $stmt->execute();
    $rows = $stmt->fetchAll();
    
    $departments = [];
    
    foreach ($rows as $row) {
        $departmentName = $row['department'] ?? 'General';
        
        if (!isset($departments[$departmentName])) {
            $departments[$departmentName] = [
                'department' => $departmentName,
                'staff_count' => 0,
                'total_salary' => 0,
                'average_salary' => 0
            ];
        }
        
        $departments[$departmentName]['staff_count'] += 1;
        $rate = isset($row['rate']) ? (float) $row['rate'] : 0;
        $departments[$departmentName]['total_salary'] += $rate;
    }
    
    foreach ($departments as &$dept) {
        if ($dept['staff_count'] > 0) {
            $dept['average_salary'] = $dept['total_salary'] / $dept['staff_count'];
        }
    }
    
    // Reindex array for JSON response
    $departments = array_values($departments);
    
    Response::success($departments);
    
} catch (Exception $e) {
    Response::error('Database error: ' . $e->getMessage());
}
?>
