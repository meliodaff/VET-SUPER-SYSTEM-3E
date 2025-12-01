# Quick Reference Guide - API & Data Fetching

## ⚡ 30-Second Fix

1. **Start XAMPP** → Apache + MySQL "Running"
2. **Open terminal** → `cd FINANCE/frontend && npm start`
3. **Wait for "Compiled successfully"**
4. **Visit** → `http://localhost:3000/api-debug`
5. **Click "Run Tests"** → All should be green ✅

## 🎯 What Changed?

| Before | After |
|--------|-------|
| Hardcoded URLs | Proxy-based routing |
| No error visibility | Detailed logging |
| Guessing errors | API Debugger page |
| 404 errors | Better path handling |

## 🔍 How to Debug

### Quick Test (30 seconds)
```javascript
// Copy & paste into Browser Console (F12)
fetch('/backend-api/test_connection.php')
  .then(r => r.json())
  .then(d => console.log(d))
  .catch(e => console.error(e))
```

### Full Diagnostics (2 minutes)
1. Open DevTools (F12)
2. Go to Console tab
3. Visit `/api-debug` page
4. Click "Run Tests"
5. Take screenshot

## ❌ Common Issues

| Issue | Fix |
|-------|-----|
| "Cannot connect" | Start Apache in XAMPP |
| "404 Not Found" | Restart npm with `npm start` |
| "No data" | Check database exists & has data |
| CORS error | Refresh page, restart npm |
| Timeout | Database too slow, increase timeout |

## 📋 Files to Check

```
✅ setupProxy.js - Routes /backend-api to backend
✅ api.js - Handles API calls with logging
✅ index.php - Central API router
✅ ApiDebugger.jsx - Visual testing tool
✅ .env - Environment configuration
```

## 🚨 Emergency Checklist

- [ ] Is Apache running in XAMPP?
- [ ] Is MySQL running in XAMPP?
- [ ] Did you run `npm start`?
- [ ] Did it say "Compiled successfully"?
- [ ] Did you wait 30 seconds for compilation?
- [ ] Are you looking at `http://localhost:3000`?
- [ ] Did you try `/api-debug`?
- [ ] Did you check browser console (F12)?

## 📊 Expected Behavior

### Working ✅
- Dashboard shows sales data
- Employee list loads
- No red errors in console
- API Debugger all green
- Network tab shows 200 status

### Broken ❌
- "No data available" messages
- 404 errors in Network
- Red X in API Debugger
- Timeout errors in console

## 💡 Pro Tips

1. **Check Network Tab First** - Shows actual API responses
2. **Clear Cache** - Ctrl+Shift+Delete browser cache
3. **Restart npm** - `npm start` after any changes
4. **Use API Debugger** - Faster than manual testing
5. **Check Console Logs** - Look for [API Request] messages

## 🔗 Direct Links

- **Backend Test:** http://localhost/VET-SUPER-SYSTEM-3E/FINANCE/backend/api/test_connection.php
- **API Debugger:** http://localhost:3000/api-debug
- **Dashboard:** http://localhost:3000/

## 🎯 Success Indicators

✅ When working properly you'll see:
```
[API Request] GET http://localhost:3000/backend-api/employees/get_employees.php
[PROXY] GET /backend-api/... -> /VET-SUPER-SYSTEM-3E/FINANCE/backend/api/...
[PROXY RESPONSE] ... -> Status: 200
```

❌ When failing you'll see:
```
[API Request] GET http://localhost:3000/backend-api/...
Cannot connect to backend server (CORS error or 404)
```

## 📞 Need Help?

1. **Take screenshot** of browser DevTools Console
2. **Run API tests** - Go to `/api-debug` and take screenshot
3. **Check** DATA_FETCHING_TROUBLESHOOTING.md for your error
4. **Verify** XAMPP has Apache + MySQL running
