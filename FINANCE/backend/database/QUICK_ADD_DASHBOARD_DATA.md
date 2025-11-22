# Quick Guide: Add Philippine Dashboard Data

## 🎯 What This Does

This script adds Philippine-specific sample data for:
1. **Sales Trend** - Payments spread over last 6 months
2. **Doctor Statistics** - Patient counts and revenue per Filipino doctor
3. **Doctor Surgery Fees** - Surgery services with Philippine payment methods

## 📋 How to Run

### Method 1: Using phpMyAdmin (Easiest)

1. **Open phpMyAdmin**: http://localhost/phpmyadmin
2. **Select Database**: Click on `fur_ever_care_db` in the left sidebar
3. **Go to SQL Tab**: Click the "SQL" tab at the top
4. **Import Script**:
   - Click "Choose File"
   - Select: `C:\xampp\htdocs\fur-ever-care\backend\database\ADD_DASHBOARD_DATA_PH.sql`
   - Click "Go"
5. **Wait for Success**: You should see "X rows affected" messages

### Method 2: Using Command Line

```bash
cd C:\xampp\mysql\bin
mysql.exe -u root fur_ever_care_db < "C:\xampp\htdocs\fur-ever-care\backend\database\ADD_DASHBOARD_DATA_PH.sql"
```

## ✅ What Gets Added

### Sales Trend Data:
- ✅ Payments with dates spread over last 6 months
- ✅ Philippine payment methods (GCash, PayMaya, Cash, Bank Transfer)
- ✅ Multiple payments per month for better trend visualization

### Doctor Statistics Data:
- ✅ More invoices linked to Filipino veterinarians
- ✅ Patient counts per doctor
- ✅ Revenue totals per doctor
- ✅ All using Philippine peso amounts

### Doctor Surgery Fees Data:
- ✅ Surgery services linked to invoices
- ✅ Multiple surgeries per doctor
- ✅ Total fees calculated per doctor
- ✅ All invoices marked as 'paid'

## 🔍 Verify Data Was Added

After running the script, check your dashboard:
1. **Sales Trend Chart** - Should show line graph with data points
2. **Doctor Statistics Chart** - Should show bars for each doctor
3. **Doctor Surgery Fees Chart** - Should show surgery counts and fees

Or run these queries in phpMyAdmin SQL tab:

```sql
-- Check sales trend
SELECT DATE_FORMAT(payment_date, '%Y-%m') as month, 
       SUM(amount) as total 
FROM payments 
WHERE payment_date >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
GROUP BY DATE_FORMAT(payment_date, '%Y-%m')
ORDER BY month ASC;

-- Check doctor statistics
SELECT e.name AS doctor, 
       COUNT(DISTINCT inv.patient_id) AS patients,
       SUM(inv.total_amount) AS revenue
FROM invoices inv
JOIN employees e ON inv.employee_id = e.id
WHERE e.role = 'veterinarian' AND inv.status = 'paid'
GROUP BY e.name;

-- Check surgery fees
SELECT e.name AS doctor,
       COUNT(ii.id) AS surgeries,
       SUM(ii.line_total) AS total_fees
FROM invoice_items ii
JOIN services s ON ii.service_id = s.id
JOIN invoices inv ON ii.invoice_id = inv.id
JOIN employees e ON inv.employee_id = e.id
WHERE s.category = 'Surgery' AND inv.status = 'paid'
GROUP BY e.name;
```

## 🇵🇭 Philippine-Specific Features

- ✅ Filipino doctor names (Dr. Juan dela Cruz, Dr. Ana Reyes)
- ✅ Philippine payment methods (GCash, PayMaya)
- ✅ Philippine peso amounts (₱)
- ✅ Filipino pet names (Bantay, Muning)
- ✅ Local breeds (Aspin, Puspin)

## ⚠️ Notes

- This script adds data to your existing database
- It won't delete any existing data
- If you run it multiple times, it may create duplicate invoices (but that's okay for testing)
- All dates are relative to today (CURDATE())

## 🎉 After Running

1. Refresh your dashboard page
2. Click the "Refresh" button
3. All three charts should now display data!

---

**Need Help?** Check the main README.md or TROUBLESHOOTING.md files.

