# Data Fetching Troubleshooting Guide

## Current Issue Analysis

Your screenshot shows **404 errors** on all API endpoints:
```
Failed to load resource: the server responded with a status of 404 (Not Found)
- backend-api/dashboard-sales_metrics.php ❌
- backend-api/dashboard-doctor_statistics.php ❌
- backend-api/dashboard-inventory_cost.php ❌
- backend-api/dashboard-products_revenue.php ❌
```

## Root Cause

The setupProxy is correctly rewriting paths, but there are potential issues:

1. **XAMPP/WAMP not running** - Apache must be started
2. **Incorrect file paths** - PHP files exist but not being routed correctly
3. **Database not accessible** - Connection issues on backend
4. **Proxy configuration** - setupProxy.js needs proper configuration

## Recent Improvements ✅

### 1. **Enhanced setupProxy.js**
   - Better path rewriting
   - Improved error logging
   - Added fallback proxy for direct requests
   - Logs proxy requests for debugging

### 2. **API Proxy Bridge** (`backend/api/index.php`)
   - Created central routing file
   - Routes all /backend-api/* requests to correct endpoints
   - Better error handling and logging

### 3. **Improved API Interceptors**
   - Request logging to console
   - Detailed error information
   - Better debugging capabilities

### 4. **API Debugger Page** (`pages/ApiDebugger.jsx`)
   - Visual test dashboard
   - Tests all major endpoints
   - Shows response data
   - Easy identification of failing endpoints

## How to Use the API Debugger

1. **Add to your app** - Add debugger page to your router:
   ```jsx
   import ApiDebugger from './pages/ApiDebugger';
   
   // In your routes
   <Route path="/api-debug" element={<ApiDebugger />} />
   ```

2. **Access it** - Visit `http://localhost:3000/api-debug`

3. **Run tests** - Click "Run Tests" button

4. **Check results** - Green ✓ means working, Red ✗ means failing

## Step-by-Step Fix

### Step 1: Verify Backend Server
```bash
# Start XAMPP/WAMP
# Open XAMPP Control Panel
# Click "Start" for Apache and MySQL
```

### Step 2: Test Direct Backend Access
```
http://localhost/VET-SUPER-SYSTEM-3E/FINANCE/backend/api/test_connection.php
```

Should show:
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

### Step 3: Clear Node Modules & Rebuild
```bash
cd FINANCE/frontend

# Clear cache
rm -r node_modules
npm install

# Restart dev server
npm start
```

### Step 4: Check Console Logs
1. Open Browser DevTools (F12)
2. Go to **Console** tab
3. Look for `[API Request]` logs
4. Should show: `[API Request] GET http://localhost:3000/backend-api/...`

### Step 5: Check Network Tab
1. Open **Network** tab in DevTools
2. Look for `backend-api` requests
3. Check response for actual error
4. Verify status code (should be 200 for success)

## Common 404 Errors & Fixes

### Error: "Not Found /backend-api/dashboard/sales_metrics.php"
**Cause:** Path rewriting not working
**Solution:**
1. Check setupProxy.js is loaded (should see logs when starting)
2. Verify XAMPP is serving files at correct path
3. Try direct: `http://localhost/VET-SUPER-SYSTEM-3E/FINANCE/backend/api/dashboard/sales_metrics.php`

### Error: "Backend server is not responding"
**Cause:** Apache not running
**Solution:**
1. Open XAMPP Control Panel
2. Click Start for Apache
3. Verify "Running" status (green)
4. Check firewall isn't blocking port 80

### Error: "Database connection failed"
**Cause:** MySQL not running or DB doesn't exist
**Solution:**
1. Start MySQL in XAMPP Control Panel
2. Create database: `CREATE DATABASE fur_ever_care_db;`
3. Import schema if needed

## Browser Console Debug Commands

```javascript
// Test basic connectivity
fetch('/backend-api/test_connection.php')
  .then(r => r.json())
  .then(d => {
    console.log('✓ Connection successful:', d);
  })
  .catch(e => {
    console.error('✗ Connection failed:', e);
  });

// Test employees endpoint
fetch('/backend-api/employees/get_employees.php')
  .then(r => r.json())
  .then(d => {
    console.log('✓ Employees loaded:', d);
  })
  .catch(e => {
    console.error('✗ Employees failed:', e);
  });

// Test all endpoints at once
async function testAllEndpoints() {
  const endpoints = [
    '/backend-api/test_connection.php',
    '/backend-api/employees/get_employees.php',
    '/backend-api/dashboard/sales_metrics.php',
    '/backend-api/invoices/get_invoices.php',
    '/backend-api/payments/get_payments.php'
  ];
  
  for (const endpoint of endpoints) {
    try {
      const r = await fetch(endpoint);
      console.log(`${endpoint}: ${r.status} ${r.statusText}`);
    } catch (e) {
      console.error(`${endpoint}: ERROR - ${e.message}`);
    }
  }
}

// Run all tests
testAllEndpoints();
```

## Expected Behavior

### ✅ When Everything Works
1. Page loads without errors
2. Data populates in dashboard
3. No 404 errors in Network tab
4. Console shows successful API requests
5. All endpoint tests pass in API Debugger

### ❌ When Something's Wrong
1. "No data available" messages
2. 404 errors in Network tab
3. Red X in API Debugger
4. Timeout errors in console
5. CORS errors (less likely now)

## Quick Checklist

- [ ] XAMPP is running (Apache + MySQL)
- [ ] Database `fur_ever_care_db` exists
- [ ] Backend files exist at `/VET-SUPER-SYSTEM-3E/FINANCE/backend/api/`
- [ ] setupProxy.js is not modified incorrectly
- [ ] Node dev server restarted after changes
- [ ] No firewall blocking port 80
- [ ] Checked browser console for specific errors
- [ ] Tested with API Debugger page

## Files Changed

✅ `src/services/api.js` - Enhanced logging
✅ `src/setupProxy.js` - Improved proxy configuration  
✅ `backend/api/index.php` - Created API router
✅ `src/pages/ApiDebugger.jsx` - New debugging tool
✅ `.env` - Environment configuration
