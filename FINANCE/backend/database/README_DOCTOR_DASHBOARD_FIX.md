# Doctor Dashboard Data Fix

## Problem
The doctor performance overview, doctor patient statistics, and surgery data were not fetching on the dashboard page.

## Solution
Fixed the API endpoints to properly query the database and created a SQL script to add sample data.

## Changes Made

### 1. Fixed `doctor_statistics.php`
- Changed from INNER JOIN to LEFT JOIN to show all veterinarians even if they have no invoices
- Improved WHERE clause to handle different employee table structures
- Better handling of employee_id vs id fields
- Now returns all veterinarians with their patient counts and revenue (even if 0)

### 2. Fixed `doctor_surgery_fees.php`
- Changed to LEFT JOIN to ensure all doctors are included
- Improved query to properly count surgeries from invoice_items
- Better filtering for surgery category services
- Only shows doctors who have performed surgeries (HAVING clause)

### 3. Created Sample Data Script
- `add_doctor_dashboard_data.sql` - Adds sample invoices and invoice items for testing

## How to Add Sample Data

### Option 1: Using phpMyAdmin
1. Open phpMyAdmin
2. Select your database: `fur_ever_care_db`
3. Click on "SQL" tab
4. Copy and paste the contents of `add_doctor_dashboard_data.sql`
5. Click "Go" to execute

### Option 2: Using MySQL Command Line
```bash
mysql -u root -p fur_ever_care_db < backend/database/add_doctor_dashboard_data.sql
```

### Option 3: Using XAMPP MySQL
1. Open XAMPP Control Panel
2. Click "Shell" button
3. Navigate to your project directory
4. Run:
```bash
mysql -u root fur_ever_care_db < backend/database/add_doctor_dashboard_data.sql
```

## What the Script Does

1. **Adds Veterinarians** (Philippines-specific, if they don't exist):
   - Dr. Maria Cruz Santos (VET-2024-001) - Quezon City
   - Dr. Juan Dela Cruz (VET-2024-002) - Mandaluyong City
   - Dr. Ana Reyes Garcia (VET-2024-003) - Makati City
   
   All with Philippines addresses, phone numbers, and email addresses.

2. **Adds Patients** (Philippines-specific, if they don't exist):
   - Multiple sample patients with Filipino owner names
   - Philippine phone numbers (+63 format)
   - Common Filipino pet names (Buddy, Mingming, etc.)
   - Common breeds including Aspin (Asong Pinoy)

3. **Adds Surgery Services** (Philippines pricing in PHP, if they don't exist):
   - Surgery (₱5,000)
   - Spay Surgery (₱3,500)
   - Neuter Surgery (₱3,000)
   - Emergency Surgery (₱8,000)
   - Dental Surgery (₱4,000)

4. **Creates Sample Invoices**:
   - Multiple paid invoices for each doctor
   - Different dates to show historical data
   - Various amounts to show revenue differences

5. **Creates Invoice Items**:
   - Surgery items linked to invoices
   - Non-surgery items for complete data

## Expected Results

After running the script, you should see:

### Doctor Statistics:
- Each veterinarian with:
  - Patient count (distinct patients)
  - Total revenue (from paid invoices)
  - Average revenue per patient

### Doctor Surgery Fees:
- Each veterinarian who performed surgeries with:
  - Number of surgeries performed
  - Total fees from surgeries
  - Average fee per surgery

## Testing the API Endpoints

You can test the endpoints directly:

1. **Doctor Statistics**: 
   - URL: `http://localhost/backend-api/dashboard/doctor_statistics.php`
   - Should return JSON with doctor statistics

2. **Doctor Surgery Fees**:
   - URL: `http://localhost/backend-api/dashboard/doctor_surgery_fees.php`
   - Should return JSON with surgery fees data

## Troubleshooting

### If no data appears:

1. **Check if employees exist**:
   ```sql
   SELECT * FROM employees WHERE role = 'veterinarian';
   ```

2. **Check if invoices exist**:
   ```sql
   SELECT * FROM invoices WHERE status = 'paid';
   ```

3. **Check if surgery services exist**:
   ```sql
   SELECT * FROM services WHERE category = 'Surgery';
   ```

4. **Check if invoice items exist**:
   ```sql
   SELECT ii.*, s.category 
   FROM invoice_items ii
   JOIN services s ON ii.service_id = s.id
   WHERE s.category = 'Surgery';
   ```

5. **Verify employee_id matches**:
   ```sql
   SELECT e.id, e.name, inv.employee_id, inv.id as invoice_id
   FROM employees e
   LEFT JOIN invoices inv ON inv.employee_id = e.id
   WHERE e.role = 'veterinarian';
   ```

### Common Issues:

1. **Employee ID mismatch**: 
   - If employees table uses `employee_id` instead of `id`, the queries handle this automatically
   - Check your employees table structure

2. **No paid invoices**:
   - The statistics only count paid invoices
   - Make sure invoices have `status = 'paid'`

3. **No surgery services**:
   - Surgery fees only count services with `category = 'Surgery'`
   - Make sure services are properly categorized

## Database Structure Requirements

The queries work with these table structures:

### Employees Table:
- Must have: `id` (primary key) AND `employee_id` (unique identifier)
- Must have: `first_name`, `last_name` (and optionally `middle_name`)
- Should have: `Position` (capital P) OR `system_role` (to identify veterinarians)
- Should have: `department`, `rate`, `employment_type`
- Optional: `contact_email`, `phone_number`, `address`

### Invoices Table:
- Must have: `id`, `employee_id`, `patient_id`, `total_amount`, `status`

### Invoice Items Table:
- Must have: `id`, `invoice_id`, `service_id`, `line_total`

### Services Table:
- Must have: `id`, `category` (for filtering surgeries)

## Notes

- The queries use LEFT JOIN to show all veterinarians, even if they have no invoices
- Only paid invoices are counted for revenue
- Surgery fees only include services with category = 'Surgery'
- The queries automatically detect your table structure and adjust accordingly

