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
    
    // Build WHERE clause for veterinarians only
    $whereConditions = [];
    if ($hasSystemRole && $hasPosition) {
        $conditions = ["e.system_role = 'Admin'", "e.Position LIKE '%Veterinarian%'", "e.Position LIKE '%Vet%'"];
        $excludeConditions = [];
        if ($hasPosition) {
            $excludeConditions[] = "e.Position NOT LIKE '%Technician%'";
            $excludeConditions[] = "e.Position NOT LIKE '%Staff%'";
        }
        if ($hasRole) {
            $conditions[] = "e.role = 'veterinarian'";
            $conditions[] = "e.role = 'admin'";
            $excludeConditions[] = "e.role != 'staff'";
        }
        $whereConditions[] = "(" . implode(" OR ", $conditions) . ")";
        if (!empty($excludeConditions)) {
            $whereConditions[] = "(" . implode(" AND ", $excludeConditions) . ")";
        }
    } elseif ($hasSystemRole) {
        $conditions = ["e.system_role = 'Admin'"];
        $excludeConditions = [];
        if ($hasRole) {
            $conditions[] = "e.role = 'veterinarian'";
            $conditions[] = "e.role = 'admin'";
            $excludeConditions[] = "e.role != 'staff'";
        }
        $whereConditions[] = "(" . implode(" OR ", $conditions) . ")";
        if (!empty($excludeConditions)) {
            $whereConditions[] = "(" . implode(" AND ", $excludeConditions) . ")";
        }
    } elseif ($hasRole) {
        $whereConditions[] = "(e.role = 'veterinarian' OR e.role = 'admin')";
        $whereConditions[] = "e.role != 'staff'";
    } elseif ($hasPosition) {
        $whereConditions[] = "(e.Position LIKE '%Veterinarian%' OR e.Position LIKE '%Vet%')";
        $whereConditions[] = "e.Position NOT LIKE '%Technician%'";
        $whereConditions[] = "e.Position NOT LIKE '%Staff%'";
    }
    
    $employeeIdField = $hasEmployeeId ? "e.employee_id" : ($hasId ? "e.id" : "e.employee_id");
    $idSelectField = $hasEmployeeId ? "e.employee_id" : ($hasId ? "COALESCE(e.id, e.employee_id)" : "e.employee_id");
    
    // Get all veterinarians
    $sql = "
        SELECT 
            $idSelectField AS employee_id,
            $nameField AS doctor,
            COALESCE(e.Position, e.system_role, e.role, 'Veterinarian') AS position,
            COALESCE(e.system_role, e.role, 'Employee') AS role
        FROM employees e
    ";
    
    if (!empty($whereConditions)) {
        $sql .= " WHERE " . implode(" AND ", $whereConditions);
    }
    
    $stmt = $db_employees->prepare($sql);
    $stmt->execute();
    $doctors = $stmt->fetchAll();
    
    // Get appointment statistics from appointment_sia.book_appointment
    // Group by doctor_id
    $stmt_appointments = $db_appointments->prepare("
        SELECT 
            doctor_id,
            COUNT(DISTINCT user_id) as patients_count,
            COUNT(*) as appointments_count,
            SUM(CASE WHEN payment_status = 'Paid' THEN service_price ELSE 0 END) as total_revenue,
            COUNT(CASE WHEN payment_status = 'Paid' THEN 1 END) as paid_appointments_count
        FROM book_appointment
        WHERE payment_status = 'Paid'
        GROUP BY doctor_id
    ");
    $stmt_appointments->execute();
    $appointment_stats = $stmt_appointments->fetchAll();
    
    // Create a map of doctor_id to appointment statistics
    $appointment_map = [];
    foreach ($appointment_stats as $stat) {
        $appointment_map[(int)$stat['doctor_id']] = $stat;
    }
    
    // Combine doctor data with appointment statistics
    $doctor_stats = [];
    foreach ($doctors as $doctor) {
        $employeeId = (int)($doctor['employee_id'] ?? 0);
        $appointmentData = $appointment_map[$employeeId] ?? null;
        
        if ($appointmentData) {
            $patients = (int)($appointmentData['patients_count'] ?? 0);
            $revenue = (float)($appointmentData['total_revenue'] ?? 0);
            $avgPerPatient = $patients > 0 ? $revenue / $patients : 0;
            
            $doctor_stats[] = [
                'employee_id' => $employeeId,
                'id' => $employeeId,
                'doctor' => trim($doctor['doctor'] ?? 'Unknown Doctor'),
                'title' => $doctor['position'] ?? 'Veterinarian',
                'role' => strtolower($doctor['role'] ?? 'Employee'),
                'patients' => $patients,
                'revenue' => $revenue,
                'avg_per_patient' => $avgPerPatient,
                'paid_invoices' => (int)($appointmentData['paid_appointments_count'] ?? 0)
            ];
        }
    }
    
    // Sort by revenue descending
    usort($doctor_stats, function($a, $b) {
        return $b['revenue'] <=> $a['revenue'];
    });
    
    Response::success($doctor_stats);
    
} catch (Exception $e) {
    error_log("Doctor Statistics Error: " . $e->getMessage());
    Response::error('Database error: ' . $e->getMessage());
}
?>
