# API Architecture & Data Flow

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    React Frontend                            │
│                   (localhost:3000)                           │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │  Pages (Dashboard, Employees, Invoices, etc)      │    │
│  └──────────────────────┬─────────────────────────────┘    │
│                         │                                    │
│  ┌──────────────────────▼─────────────────────────────┐    │
│  │  Components (Cards, Lists, Modals, etc)           │    │
│  └──────────────────────┬─────────────────────────────┘    │
│                         │                                    │
│  ┌──────────────────────▼─────────────────────────────┐    │
│  │  Services/api.js [IMPROVED]                        │    │
│  │  - Request logging [API Request]                  │    │
│  │  - Error interception                             │    │
│  │  - Base: /backend-api                             │    │
│  └──────────────────────┬─────────────────────────────┘    │
└─────────────────────────┼────────────────────────────────────┘
                          │ HTTP Request
                          │ /backend-api/employees/...
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                   Node Dev Server                            │
│              (setupProxy.js) [IMPROVED]                     │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │  Proxy Middleware                                  │    │
│  │  - Logs: [PROXY] GET /backend-api/... -> /VET...  │    │
│  │  - Rewrites path to: /VET-SUPER-SYSTEM-3E/...     │    │
│  │  - Forwards headers (X-Forwarded-*)                │    │
│  │  - Logs: [PROXY RESPONSE] Status: 200             │    │
│  └────────────────────────┬─────────────────────────┘    │
└─────────────────────────────┼──────────────────────────────┘
                              │ HTTP Request
                              │ /VET-SUPER-SYSTEM-3E/FINANCE/backend/api/...
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      Apache Server                           │
│                  (localhost:80, XAMPP)                       │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │  API Router (index.php) [NEW]                      │    │
│  │  - Parses request path                             │    │
│  │  - Validates endpoint exists                       │    │
│  │  - Routes to correct PHP file                      │    │
│  │  - Logs request/response                           │    │
│  └────────────────────┬───────────────────────────────┘    │
│                       │                                     │
│  ┌────────────────────▼───────────────────────────────┐    │
│  │  Endpoint Files                                    │    │
│  │  /dashboard/sales_metrics.php                     │    │
│  │  /employees/get_employees.php                     │    │
│  │  /invoices/get_invoices.php                       │    │
│  │  /payments/get_payments.php                       │    │
│  │  etc...                                            │    │
│  └────────────────────┬───────────────────────────────┘    │
│                       │                                     │
│  ┌────────────────────▼───────────────────────────────┐    │
│  │  Utilities                                         │    │
│  │  - cors.php (CORS headers)                         │    │
│  │  - response.php (JSON responses)                   │    │
│  │  - database.php (Connection)                       │    │
│  └────────────────────┬───────────────────────────────┘    │
└─────────────────────────┼──────────────────────────────────┘
                          │ PDO Connection
                          ▼
         ┌────────────────────────────────┐
         │      MySQL Database            │
         │  fur_ever_care_db              │
         │  - employees                   │
         │  - invoices                    │
         │  - payments                    │
         │  - etc...                      │
         └────────────────────────────────┘
```

## Request Flow with Logging

```
1. USER CLICKS BUTTON
   ↓
2. REACT COMPONENT CALLS
   dashboardAPI.getSalesMetrics()
   ↓
   [API Request] GET http://localhost:3000/backend-api/dashboard/sales_metrics.php
   ↓
3. AXIOS SENDS TO SETUPPROXY
   ↓
   [PROXY] GET /backend-api/dashboard/sales_metrics.php
   → /VET-SUPER-SYSTEM-3E/FINANCE/backend/api/dashboard/sales_metrics.php
   ↓
4. APACHE ROUTES TO index.php
   ↓
5. index.php INCLUDES dashboard/sales_metrics.php
   ↓
6. PHP CONNECTS TO DATABASE
   ↓
7. EXECUTES QUERY
   SELECT SUM(amount) FROM payments WHERE DATE(payment_date) = CURDATE()
   ↓
8. RETURNS RESPONSE
   Response::success($data);
   ↓
   {
     "success": true,
     "message": "Success",
     "data": {...}
   }
   ↓
   [PROXY RESPONSE] Status: 200
   ↓
9. REACT RECEIVES DATA
   ↓
10. COMPONENT UPDATES UI
    Dashboard shows sales data ✅
```

## Error Handling Flow

```
ERROR SCENARIO: Database Connection Failed

1. USER VISITS DASHBOARD
   ↓
2. COMPONENT CALLS getSalesMetrics()
   ↓
   [API Request] GET /backend-api/dashboard/sales_metrics.php
   ↓
3. REQUEST SENT TO SETUPPROXY
   ↓
4. APACHE ROUTES TO index.php
   ↓
5. PHP TRIES TO CONNECT TO DATABASE
   ↓
6. PDO CONNECTION FAILS
   catch (PDOException $e) {
     Response::error('Database connection failed');
   }
   ↓
7. RETURNS ERROR RESPONSE
   {
     "success": false,
     "message": "Database connection failed",
     "data": null
   }
   Status: 400 or 503
   ↓
   [PROXY RESPONSE] Status: 503
   ↓
8. AXIOS INTERCEPTS ERROR
   ↓
   [API Error Details] {
     status: 503,
     message: "Database connection failed",
     ...
   }
   ↓
9. COMPONENT CATCHES ERROR
   catch (error) {
     setError(error.response?.data?.message);
   }
   ↓
10. UI SHOWS ERROR
    "Database connection failed"
    ↓
11. USER SEES MESSAGE
    With helpful suggestion ✅
```

## Files & Their Responsibilities

```
Frontend Layer:
├── src/pages/*.jsx
│   └── Make API calls
├── src/components/*.jsx
│   └── Display data and call parent methods
├── src/services/api.js [IMPROVED]
│   └── Axios instance with logging & error handling
│       ├── Request interceptor: [API Request] logging
│       └── Response interceptor: [API Error Details] logging
├── src/setupProxy.js [IMPROVED]
│   └── Development proxy configuration
│       ├── onProxyReq: [PROXY] logging
│       └── onProxyRes: [PROXY RESPONSE] logging
└── .env
    └── Environment variables

Backend Layer:
├── backend/api/index.php [NEW]
│   └── Central router for all requests
│       ├── Parse endpoint from URL
│       ├── Validate path security
│       ├── Include correct PHP file
│       └── Return error if not found
├── backend/api/*/endpoint.php
│   └── Individual endpoint handlers
│       ├── Import database
│       ├── Execute query
│       └── Return Response::success/error
├── backend/config/database.php
│   └── Database connection class
├── backend/utils/cors.php
│   └── CORS headers
└── backend/utils/response.php
    └── JSON response formatter

Database Layer:
└── MySQL (localhost)
    └── fur_ever_care_db
        ├── employees
        ├── invoices
        ├── payments
        └── etc...
```

## Data Flow Example: Get Employees

```
FRONTEND
┌─────────────────────────────────────────────┐
│ Employees.jsx                               │
│                                             │
│ useEffect(() => {                          │
│   fetchEmployees();  ◄─── User loads page  │
│ }, []);                                     │
└────────────────┬────────────────────────────┘
                 │ Call employeesAPI.getEmployees()
                 ▼
┌─────────────────────────────────────────────┐
│ api.js                                      │
│                                             │
│ export const employeesAPI = {               │
│   getEmployees: () =>                       │
│     api.get("/employees/get_employees.php") │
│ }                                           │
│                                             │
│ Request Interceptor:                        │
│ [API Request] GET /employees/get_employees.php
└────────────────┬────────────────────────────┘
                 │ HTTP GET /backend-api/employees/get_employees.php
                 ▼
┌─────────────────────────────────────────────┐
│ setupProxy.js (Node Dev Server)             │
│                                             │
│ [PROXY] GET /backend-api/employees/...      │
│ → /VET-SUPER-SYSTEM-3E/FINANCE/backend/api/│
│   employees/get_employees.php               │
│                                             │
│ onProxyReq: Logs request                    │
│ onProxyRes: Logs response status            │
└────────────────┬────────────────────────────┘
                 │ HTTP GET to Apache
                 ▼
┌─────────────────────────────────────────────┐
│ Apache + PHP                                │
│                                             │
│ index.php routes to:                        │
│ employees/get_employees.php                 │
│                                             │
│ require_once '../../config/database.php';   │
│ $database = new Database();                 │
│ $db = $database->getConnection();           │
│                                             │
│ if (!$db) {                                 │
│   Response::error('DB failed');             │
│ }                                           │
└────────────────┬────────────────────────────┘
                 │ Execute Query
                 ▼
┌─────────────────────────────────────────────┐
│ MySQL Database                              │
│                                             │
│ SELECT * FROM employees                     │
│ ORDER BY hire_date DESC, id DESC            │
│                                             │
│ Returns: [                                  │
│   {id, first_name, last_name, ...},         │
│   {id, first_name, last_name, ...}          │
│ ]                                           │
└────────────────┬────────────────────────────┘
                 │ Format Response
                 ▼
┌─────────────────────────────────────────────┐
│ PHP Response                                │
│                                             │
│ Response::success($employees);              │
│                                             │
│ Returns:                                    │
│ {                                           │
│   "success": true,                          │
│   "message": "Success",                     │
│   "data": [employee1, employee2, ...]       │
│ }                                           │
│ Status: 200 OK                              │
└────────────────┬────────────────────────────┘
                 │ HTTP 200 response
                 ▼
┌─────────────────────────────────────────────┐
│ setupProxy.js                               │
│                                             │
│ [PROXY RESPONSE] GET /backend-api/...       │
│ → Status: 200                               │
└────────────────┬────────────────────────────┘
                 │ Forward response
                 ▼
┌─────────────────────────────────────────────┐
│ React Component                             │
│                                             │
│ Response Interceptor:                       │
│ (response) => response  ◄─── Success!       │
│                                             │
│ setEmployees(response.data.data);           │
└────────────────┬────────────────────────────┘
                 │ Update state
                 ▼
┌─────────────────────────────────────────────┐
│ UI Updates                                  │
│ - Shows employee list                       │
│ - Displays names, roles, departments        │
│ - Renders employee cards                    │
│ - User sees data ✅                         │
└─────────────────────────────────────────────┘
```

## Debugging Checklist

```
Problem: Data not loading
├─ Step 1: Check XAMPP
│  ├─ Apache running? (green)
│  ├─ MySQL running? (green)
│  └─ Check: http://localhost/VET-SUPER-SYSTEM-3E/FINANCE/backend/api/test_connection.php
│
├─ Step 2: Check Frontend
│  ├─ npm start running?
│  ├─ Shows "Compiled successfully"?
│  └─ Visit: http://localhost:3000
│
├─ Step 3: Check API Debugger
│  ├─ Visit: http://localhost:3000/api-debug
│  ├─ Click "Run Tests"
│  └─ All green ✅ or any red ❌?
│
├─ Step 4: Check DevTools Console (F12)
│  ├─ [API Request] logs visible?
│  ├─ [API Error Details] showing errors?
│  └─ Any CORS or 404 errors?
│
└─ Step 5: Check Network Tab (F12)
   ├─ backend-api requests visible?
   ├─ Status: 200 or 404?
   └─ Response has data or error message?
```
