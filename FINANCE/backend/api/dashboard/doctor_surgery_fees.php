<?php
require_once '../../config/database.php';
require_once '../../utils/cors.php';
require_once '../../utils/response.php';

// Connect to fur_ever_care_db for employees
$host = 'localhost';
$db_name_employees = 'fur_ever_care_db';
$username = 'root';
$password = '';

try {
    $db_employees = new PDO(
        "mysql:host=$host;dbname=$db_name_employees",
        $username,
        $password
    );
    $db_employees->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $db_employees->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch(PDOException $e) {
    Response::error('Database connection failed: ' . $e->getMessage());
}

// Connect to appointment_sia for appointments
try {
    $db_appointments = new PDO(
        "mysql:host=$host;dbname=appointment_sia",
        $username,
        $password
    );
    $db_appointments->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $db_appointments->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch(PDOException $e) {
    Response::error('Appointment database connection failed: ' . $e->getMessage());
}

try {
    // Check what columns exist in employees table
    $columnsStmt = $db_employees->query("SHOW COLUMNS FROM employees");
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
    
    $stmt = $db_employees->prepare($sql);
    $stmt->execute();
    $doctors = $stmt->fetchAll();
    
    // Get surgery fees from appointment_sia.book_appointment
    // Filter for services containing "Surgery"
    $stmt_surgeries = $db_appointments->prepare("
        SELECT 
            doctor_id,
            COUNT(*) as surgeries_count,
            SUM(service_price) as total_fees
        FROM book_appointment
        WHERE payment_status = 'Paid' 
          AND (service LIKE '%Surgery%' OR service LIKE '%surgery%')
        GROUP BY doctor_id
    ");
    $stmt_surgeries->execute();
    $surgery_stats = $stmt_surgeries->fetchAll();
    
    // Create a map of doctor_id to surgery statistics
    $surgery_map = [];
    foreach ($surgery_stats as $stat) {
        $surgery_map[(int)$stat['doctor_id']] = $stat;
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
