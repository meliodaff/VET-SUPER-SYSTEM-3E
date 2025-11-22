# 🚀 Fur-Ever Care Setup Guide

## ✅ Step-by-Step Setup Instructions

### **Step 1: Verify XAMPP is Running**
- ✅ Apache is running (green in XAMPP Control Panel)
- ✅ MySQL is running (green in XAMPP Control Panel)
- You should see both services as "Running" (green)

### **Step 2: Database Setup**

1. **Open phpMyAdmin**: 
   - Go to: http://localhost/phpmyadmin

2. **Create Database**:
   - Click "New" on the left sidebar
   - Database name: `fur_ever_care_db`
   - Click "Create"

3. **Import Schema**:
   - Click on `fur_ever_care` database
   - Click "Import" tab
   - Click "Choose File"
   - Select: `C:\xampp\htdocs\fur-ever-care\backend\database\schema.sql`
   - Click "Go" at the bottom
   - You should see "Import has been successfully finished"

### **Step 3: Verify Backend Files**

Check if backend files are in XAMPP:
- Location: `C:\xampp\htdocs\fur-ever-care\backend\`
- Should contain: `api/`, `config/`, `utils/`, `database/` folders

### **Step 4: Test Backend Connection**

Open in browser:
- http://localhost/fur-ever-care/backend/api/dashboard/sales_metrics.php
- You should see JSON response (may show error about session, but connection should work)

### **Step 5: Start React Development Server**

1. **Open Command Prompt or PowerShell**:
   - Navigate to your project folder:
   ```bash
   cd C:\Users\QCU\fur-ever-care(1)\frontend
   ```

2. **Install Dependencies** (if not done):
   ```bash
   npm install
   ```

3. **Start React Server**:
   ```bash
   npm start
   ```

4. **Wait for Server to Start**:
   - You should see: "webpack compiled successfully"
   - Browser should automatically open to: http://localhost:3000
   - If browser doesn't open automatically, manually go to: http://localhost:3000

### **Step 6: Create Admin Account**

1. Go to: http://localhost:3000/create-account
2. Fill in the form:
   - First Name
   - Last Name
   - Email
   - Password (min 6 characters)
   - Confirm Password
3. Click "Create Account"
4. You should see success message

### **Step 7: Login**

1. Go to: http://localhost:3000/login
2. Enter your email and password
3. Click "Sign In"
4. You should be redirected to the dashboard

## 🔧 Troubleshooting

### **Problem: Cannot access localhost:3000**

**Solution**:
1. Make sure React server is running
2. Check if port 3000 is already in use:
   - Open Command Prompt
   - Run: `netstat -ano | findstr :3000`
   - If something is using it, you can:
     - Stop that process, OR
     - Use a different port: `set PORT=3001 && npm start`

### **Problem: API calls are failing**

**Solution**:
1. Verify backend is accessible: http://localhost/fur-ever-care/backend/api/dashboard/sales_metrics.php
2. Check browser console (F12) for errors
3. Verify API URL in `frontend/src/services/api.js` is:
   ```javascript
   const API_BASE_URL = 'http://localhost/fur-ever-care/backend/api';
   ```

### **Problem: Database connection error**

**Solution**:
1. Check if MySQL is running in XAMPP
2. Verify database name is `fur_ever_care`
3. Check `backend/config/database.php`:
   ```php
   private $host = 'localhost';
   private $db_name = 'fur_ever_care';
   private $username = 'root';
   private $password = ''; // Leave empty for XAMPP default
   ```

### **Problem: CORS errors in browser console**

**Solution**:
1. Verify `backend/utils/cors.php` contains:
   ```php
   header("Access-Control-Allow-Origin: http://localhost:3000");
   ```
2. Make sure this file is included in all API endpoints

## 📁 File Structure

```
XAMPP Location:
C:\xampp\htdocs\fur-ever-care\
└── backend\
    ├── api\
    ├── config\
    ├── database\
    └── utils\

Your Project Location:
C:\Users\QCU\fur-ever-care(1)\
└── frontend\
    ├── src\
    ├── public\
    └── package.json
```

## 🌐 URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost/fur-ever-care/backend/api/
- **phpMyAdmin**: http://localhost/phpmyadmin
- **XAMPP Dashboard**: http://localhost/

## ✅ Verification Checklist

- [ ] XAMPP Apache is running
- [ ] XAMPP MySQL is running
- [ ] Database `fur_ever_care` is created
- [ ] Schema is imported successfully
- [ ] Backend files are in `C:\xampp\htdocs\fur-ever-care\backend\`
- [ ] React dependencies are installed (`npm install`)
- [ ] React server is running (`npm start`)
- [ ] Can access http://localhost:3000
- [ ] Can access http://localhost/fur-ever-care/backend/api/dashboard/sales_metrics.php
- [ ] Admin account is created
- [ ] Can login successfully

## 🆘 Need Help?

If you're still having issues:
1. Check browser console (F12) for errors
2. Check React terminal for errors
3. Check XAMPP error logs
4. Verify all files are in correct locations
5. Make sure all services are running

---

**Good luck! 🎉**
