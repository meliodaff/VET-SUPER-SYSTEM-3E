<?php
require_once '../config/database.php';
require_once '../utils/cors.php';
require_once '../utils/response.php';

header('Content-Type: application/json');

try {
    $database = new Database();
    $db = $database->getConnection();
    
    if ($db) {
        // Test database connection
        $stmt = $db->query("SELECT 1");
        
        // Check if admins table exists
        $stmt = $db->query("SHOW TABLES LIKE 'admins'");
        $tableExists = $stmt->rowCount() > 0;
        
        if ($tableExists) {
            // Count admins
            $stmt = $db->query("SELECT COUNT(*) as count FROM admins");
            $adminCount = $stmt->fetch()['count'];
            
            echo json_encode([
                'success' => true,
                'message' => 'Database connection successful!',
                'data' => [
                    'database_connected' => true,
                    'admins_table_exists' => true,
                    'admin_count' => $adminCount
                ]
            ]);
        } else {
            echo json_encode([
                'success' => false,
                'message' => 'Database connected but admins table does not exist. Please import the schema.sql file.',
                'data' => [
                    'database_connected' => true,
                    'admins_table_exists' => false
                ]
            ]);
        }
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Failed to connect to database',
            'data' => [
                'database_connected' => false
            ]
        ]);
    }
} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $e->getMessage(),
        'data' => [
            'database_connected' => false,
            'error' => $e->getMessage()
        ]
    ]);
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage(),
        'data' => [
            'error' => $e->getMessage()
        ]
    ]);
}
?>
