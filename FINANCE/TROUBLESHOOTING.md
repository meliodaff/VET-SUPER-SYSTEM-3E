# 🔧 Troubleshooting Guide - Account Creation Issue

## 🚨 Problem: Cannot Create Account

If you're seeing "Account creation failed" error, follow these steps:

### **Step 1: Verify Database Setup**

1. **Check if Database Exists**:
   - Open phpMyAdmin: http://localhost/phpmyadmin
   - Look for database named `fur_ever_care` in the left sidebar
   - If it doesn't exist, create it:
     - Click "New" → Name: `fur_ever_care` → Click "Create"

2. **Check if Schema is Imported**:
   - Click on `fur_ever_care` database
   - Look for these tables in the left sidebar:
     - `admins`
     - `employees`
     - `invoices`
     - `payments`
     - `sales`
     - `inventory`
   - If tables don't exist, import the schema:
     - Click "Import" tab
     - Choose file: `C:\xampp\htdocs\fur-ever-care\backend\database\schema.sql`
     - Click "Go"

### **Step 2: Test Database Connection**

1. **Test Backend Connection**:
   - Open browser and go to: http://localhost/fur-ever-care/backend/api/test_connection.php
   - You should see JSON response like:
     ```json
     {
       "success": true,
       "message": "Database connection successful!",
       "data": {
         "database_connected": true,
         "admins_table_exists": true,
         "admin_count": 0
       }
     }
     ```

2. **If Connection Fails**:
   - Check XAMPP MySQL is running (green in XAMPP Control Panel)
   - Verify database credentials in `C:\xampp\htdocs\fur-ever-care\backend\config\database.php`:
     ```php
     private $host = 'localhost';
     private $db_name = 'fur_ever_care';
     private $username = 'root';
     private $password = ''; // Leave empty for XAMPP default
     ```

### **Step 3: Verify Backend Files Location**

1. **Check Backend Files**:
   - Navigate to: `C:\xampp\htdocs\fur-ever-care\backend\`
   - Verify these folders exist:
     - `api/`
     - `config/`
     - `database/`
     - `utils/`

2. **Test API Endpoint Directly**:
   - Open browser: http://localhost/fur-ever-care/backend/api/auth/create_account.php
   - You should see JSON error (this is normal if accessed via GET):
     ```json
     {
       "success": false,
       "message": "Method not allowed"
     }
     ```
   - This confirms the endpoint is accessible

### **Step 4: Check Browser Console**

1. **Open Browser Developer Tools**:
   - Press `F12` in your browser
   - Go to "Console" tab
   - Try creating an account again
   - Look for error messages in red

2. **Common Console Errors**:
   - **Network Error (ERR_NETWORK)**: Backend not accessible
     - Solution: Check XAMPP Apache is running
     - Verify backend URL in `frontend/src/services/api.js`:
       ```javascript
       const API_BASE_URL = 'http://localhost/fur-ever-care/backend/api';
       ```
   
   - **CORS Error**: Cross-origin request blocked
     - Solution: Verify `backend/utils/cors.php` has:
       ```php
       header("Access-Control-Allow-Origin: http://localhost:3000");
       ```
   
   - **404 Error**: Endpoint not found
     - Solution: Verify backend files are in correct location
     - Check URL: http://localhost/fur-ever-care/backend/api/auth/create_account.php

### **Step 5: Check PHP Error Logs**

1. **XAMPP Error Logs**:
   - Location: `C:\xampp\apache\logs\error.log`
   - Open this file and look for recent errors
   - Common errors:
     - Database connection failed
     - Table doesn't exist
     - Syntax errors in PHP files

2. **PHP Errors**:
   - Check if PHP errors are displayed
   - In `php.ini`, make sure:
     ```ini
     display_errors = On
     error_reporting = E_ALL
     ```

### **Step 6: Verify Frontend API Configuration**

1. **Check API URL**:
   - Open: `frontend/src/services/api.js`
   - Verify: `const API_BASE_URL = 'http://localhost/fur-ever-care/backend/api';`
   - Make sure it matches your XAMPP setup

2. **Test API from Browser**:
   - Open browser console (F12)
   - Try this in console:
     ```javascript
     fetch('http://localhost/fur-ever-care/backend/api/test_connection.php')
       .then(r => r.json())
       .then(console.log)
       .catch(console.error)
     ```
   - Should return database connection status

### **Step 7: Manual Database Check**

1. **Check if Admin Already Exists**:
   - Open phpMyAdmin
   - Click on `fur_ever_care` database
   - Click on `admins` table
   - Check if your email already exists
   - If yes, either:
     - Delete the existing record, OR
     - Use a different email

2. **Test Direct Database Insert**:
   - In phpMyAdmin, go to SQL tab
   - Try this query:
     ```sql
     INSERT INTO admins (first_name, last_name, email, password) 
     VALUES ('Test', 'User', 'test@example.com', '$2y$10$...');
     ```
   - If this fails, there's a database issue

### **Step 8: Common Solutions**

#### **Solution 1: Database Not Created**
```sql
-- Run in phpMyAdmin SQL tab
CREATE DATABASE IF NOT EXISTS fur_ever_care;
USE fur_ever_care;
-- Then import schema.sql
```

#### **Solution 2: Reset Database**
```sql
-- Run in phpMyAdmin SQL tab
DROP DATABASE IF EXISTS fur_ever_care;
CREATE DATABASE fur_ever_care;
-- Then import schema.sql again
```

#### **Solution 3: Check File Permissions**
- Make sure XAMPP has read/write permissions
- Right-click `C:\xampp\htdocs\fur-ever-care` folder
- Properties → Security → Make sure XAMPP user has full control

#### **Solution 4: Restart XAMPP**
1. Stop Apache and MySQL in XAMPP Control Panel
2. Wait 5 seconds
3. Start Apache and MySQL again
4. Try creating account again

### **Step 9: Detailed Error Messages**

After the improvements, the error message should now show:
- **Database connection error**: Database not set up or MySQL not running
- **Email already exists**: Account with this email already created
- **Cannot connect to server**: XAMPP not running or backend not accessible
- **Invalid email format**: Email format is incorrect
- **Passwords do not match**: Password and confirm password don't match

### **Step 10: Final Verification**

1. ✅ XAMPP Apache is running (green)
2. ✅ XAMPP MySQL is running (green)
3. ✅ Database `fur_ever_care` exists
4. ✅ All tables are imported (admins, employees, etc.)
5. ✅ Backend files are in `C:\xampp\htdocs\fur-ever-care\backend\`
6. ✅ Test connection works: http://localhost/fur-ever-care/backend/api/test_connection.php
7. ✅ API endpoint accessible: http://localhost/fur-ever-care/backend/api/auth/create_account.php
8. ✅ Frontend API URL is correct
9. ✅ No errors in browser console
10. ✅ No errors in PHP error logs

## 🆘 Still Having Issues?

1. **Check Browser Console** (F12) for specific error messages
2. **Check PHP Error Logs** in `C:\xampp\apache\logs\error.log`
3. **Verify all steps** in this guide are completed
4. **Test with test_connection.php** to isolate the issue
5. **Try creating account with different email** to rule out duplicate email issue

## 📞 Quick Test Commands

**Test Database Connection**:
```
http://localhost/fur-ever-care/backend/api/test_connection.php
```

**Test Create Account Endpoint** (should show "Method not allowed" for GET):
```
http://localhost/fur-ever-care/backend/api/auth/create_account.php
```

**Check PHP Info**:
```
http://localhost/phpinfo.php
```

---

**Good luck! 🎉**
