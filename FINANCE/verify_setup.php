<?php
/**
 * Setup Verification Script
 * Place this file in: C:\xampp\htdocs\fur-ever-care\backend\api\
 * Then access: http://localhost/fur-ever-care/backend/api/verify_setup.php
 */

echo "<h1>Fur-Ever Care Setup Verification</h1>";
echo "<hr>";

// Check 1: Database Connection
echo "<h2>1. Database Connection</h2>";
try {
    require_once '../config/database.php';
    $database = new Database();
    $db = $database->getConnection();
    
    if ($db) {
        echo "✅ Database connection: <strong>SUCCESS</strong><br>";
        
        // Check 2: Database exists
        echo "<h2>2. Database Exists</h2>";
        $stmt = $db->query("SELECT DATABASE()");
        $currentDb = $stmt->fetchColumn();
        if ($currentDb === 'fur_ever_care') {
            echo "✅ Database name: <strong>fur_ever_care</strong><br>";
        } else {
            echo "❌ Database name: <strong>$currentDb</strong> (Expected: fur_ever_care)<br>";
        }
        
        // Check 3: Tables exist
        echo "<h2>3. Tables Exist</h2>";
        $requiredTables = ['admins', 'employees', 'invoices', 'payments', 'sales', 'inventory'];
        $stmt = $db->query("SHOW TABLES");
        $existingTables = $stmt->fetchAll(PDO::FETCH_COLUMN);
        
        foreach ($requiredTables as $table) {
            if (in_array($table, $existingTables)) {
                echo "✅ Table <strong>$table</strong>: EXISTS<br>";
            } else {
                echo "❌ Table <strong>$table</strong>: MISSING<br>";
            }
        }
        
        // Check 4: Admin count
        echo "<h2>4. Admin Accounts</h2>";
        if (in_array('admins', $existingTables)) {
            $stmt = $db->query("SELECT COUNT(*) as count FROM admins");
            $adminCount = $stmt->fetch()['count'];
            echo "✅ Admin accounts in database: <strong>$adminCount</strong><br>";
        }
        
        // Check 5: Test insert (don't actually insert)
        echo "<h2>5. Database Permissions</h2>";
        try {
            $stmt = $db->prepare("SELECT 1 FROM admins LIMIT 1");
            $stmt->execute();
            echo "✅ Database permissions: <strong>OK</strong><br>";
        } catch (Exception $e) {
            echo "❌ Database permissions: <strong>ERROR - " . $e->getMessage() . "</strong><br>";
        }
        
    } else {
        echo "❌ Database connection: <strong>FAILED</strong><br>";
    }
} catch (Exception $e) {
    echo "❌ Database connection: <strong>ERROR - " . $e->getMessage() . "</strong><br>";
    echo "<p>Please check:</p>";
    echo "<ul>";
    echo "<li>XAMPP MySQL is running</li>";
    echo "<li>Database 'fur_ever_care' is created</li>";
    echo "<li>Database credentials in config/database.php are correct</li>";
    echo "</ul>";
}

// Check 6: File structure
echo "<h2>6. File Structure</h2>";
$requiredFiles = [
    '../config/database.php',
    '../utils/cors.php',
    '../utils/response.php',
    '../api/auth/create_account.php',
    '../api/auth/login.php',
    '../database/schema.sql'
];

foreach ($requiredFiles as $file) {
    if (file_exists($file)) {
        echo "✅ File <strong>$file</strong>: EXISTS<br>";
    } else {
        echo "❌ File <strong>$file</strong>: MISSING<br>";
    }
}

// Check 7: PHP version
echo "<h2>7. PHP Version</h2>";
$phpVersion = phpversion();
echo "✅ PHP version: <strong>$phpVersion</strong><br>";
if (version_compare($phpVersion, '7.4.0', '>=')) {
    echo "✅ PHP version is compatible<br>";
} else {
    echo "❌ PHP version should be 7.4 or higher<br>";
}

// Check 8: Extensions
echo "<h2>8. PHP Extensions</h2>";
$requiredExtensions = ['pdo', 'pdo_mysql', 'json'];
foreach ($requiredExtensions as $ext) {
    if (extension_loaded($ext)) {
        echo "✅ Extension <strong>$ext</strong>: LOADED<br>";
    } else {
        echo "❌ Extension <strong>$ext</strong>: MISSING<br>";
    }
}

echo "<hr>";
echo "<h2>Summary</h2>";
echo "<p>If all checks pass, your setup is correct!</p>";
echo "<p>If any checks fail, please refer to the TROUBLESHOOTING.md guide.</p>";
?>
