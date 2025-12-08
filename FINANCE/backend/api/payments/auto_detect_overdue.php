<?php
require_once '../../config/database.php';
require_once '../../utils/cors.php';
require_once '../../utils/response.php';

$database = new Database();
$db = $database->getConnection();

if (!$db) {
    Response::error('Database connection failed');
}

// This endpoint automatically detects and marks overdue invoices
// It should be called periodically (e.g., via cron job or scheduled task)

try {
    $today = date('Y-m-d');
    
    // Update invoices in appointment_sia database that are overdue
    // Connect to appointment_sia database
    $host = 'localhost';
    $db_name = 'appointment_sia';
    $username = 'root';
    $password = '';
    
    try {
        $appointmentDb = new PDO(
            "mysql:host=$host;dbname=$db_name",
            $username,
            $password
        );
        $appointmentDb->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $appointmentDb->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        
        // Mark overdue invoices in book_appointment table
        // Assuming date field is the due date or we calculate from date
        $overdueStmt = $appointmentDb->prepare("
            UPDATE book_appointment 
            SET payment_status = 'overdue', 
                status = 'overdue',
                date_update = NOW()
            WHERE payment_status IN ('Pending', 'pending')
            AND DATE(date) < ?
            AND payment_status != 'Paid'
        ");
        
        $overdueStmt->execute([$today]);
        $overdueCount = $overdueStmt->rowCount();
        
        // Also check invoices in the main finance database
        $overdueStmt2 = $db->prepare("
            UPDATE invoices 
            SET status = 'overdue'
            WHERE status IN ('pending', 'Pending', 'Outstanding')
            AND due_date < ?
            AND status != 'paid'
        ");
        
        $overdueStmt2->execute([$today]);
        $overdueCount2 = $overdueStmt2->rowCount();
        
        Response::success([
            'overdue_invoices_updated' => $overdueCount + $overdueCount2,
            'appointment_db_updated' => $overdueCount,
            'finance_db_updated' => $overdueCount2,
            'date_checked' => $today
        ], 'Overdue invoices detected and updated automatically');
        
    } catch (PDOException $e) {
        Response::error('Database connection error: ' . $e->getMessage());
    }
    
} catch (Exception $e) {
    Response::error('Error: ' . $e->getMessage());
}
?>

