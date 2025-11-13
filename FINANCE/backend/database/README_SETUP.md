# Database Setup Guide for Fur-Ever Care

## Quick Setup Steps (RECOMMENDED - Use phpMyAdmin)

### Step 1: Start XAMPP Services
1. Open XAMPP Control Panel
2. Start **Apache** (should turn green)
3. Start **MySQL** (should turn green)

### Step 2: Drop Existing Database (if exists)
1. Open your browser and go to: **http://localhost/phpmyadmin**
2. If you see **`fur_ever_care_db`** in the left sidebar, click on it
3. Click on the **"Operations"** tab
4. Scroll down to **"Drop the database (DROP)"**
5. Click **"Drop the database"** button
6. Confirm by clicking **"OK"**

### Step 3: Create Fresh Database
1. Click on **"New"** in the left sidebar
2. Enter database name: **`fur_ever_care_db`**
3. Select collation: **`utf8mb4_general_ci`** (or leave default)
4. Click **"Create"**

### Step 4: Import Schema
1. Click on **`fur_ever_care_db`** database in the left sidebar (it should be empty)
2. Click on the **"Import"** tab at the top
3. Click **"Choose File"** button
4. Navigate to: **`C:\Users\QCU\fur-ever-care(1)\backend\database\fresh_install.sql`**
   - **OR** use: **`schema.sql`** (both work the same)
5. Click **"Go"** button at the bottom
6. Wait for success message: **"Import has been successfully finished"**

### Step 4: Verify Database
1. In phpMyAdmin, click on **`fur_ever_care_db`** database
2. You should see these tables:
   - ✅ `admins`
   - ✅ `employees`
   - ✅ `patients`
   - ✅ `services`
   - ✅ `invoices`
   - ✅ `invoice_items`
   - ✅ `payments`
   - ✅ `inventory`

### Step 5: Test Connection
1. Open browser and go to: **http://localhost/fur-ever-care/backend/api/test_connection.php**
2. You should see:
   ```json
   {
     "success": true,
     "message": "Database connection successful!",
     "data": {
       "database_connected": true,
       "admins_table_exists": true,
       "admin_count": "0"
     }
   }
   ```

## Alternative: Command Line Setup

If you prefer using command line:

```bash
# Navigate to MySQL bin directory
cd C:\xampp\mysql\bin

# Run MySQL and import schema
mysql.exe -u root < "C:\Users\QCU\fur-ever-care(1)\backend\database\schema.sql"
```

Or interactively:
```bash
mysql.exe -u root
```

Then in MySQL prompt:
```sql
SOURCE C:/Users/QCU/fur-ever-care(1)/backend/database/schema.sql;
```

## Database Structure

### Tables Overview:
- **admins** - Admin user accounts for login
- **employees** - Staff members (veterinarians, staff, admins)
- **patients** - Pet patients and their owners
- **services** - Available veterinary services
- **invoices** - Customer invoices
- **invoice_items** - Line items for each invoice
- **payments** - Payment records linked to invoices
- **inventory** - Clinic inventory and supplies

## Sample Data Included

The schema includes sample data for:
- 5 employees (1 admin, 2 veterinarians, 2 staff)
- 10 patients with pets
- 8 services (check-up, vaccination, surgery, etc.)
- 10 invoices with various statuses
- 8 payments
- 8 inventory items

## Troubleshooting

### Error: "Database already exists"
- Solution: Drop the existing database first:
  ```sql
  DROP DATABASE IF EXISTS fur_ever_care_db;
  ```
  Then run the schema.sql again.

### Error: "Access denied"
- Solution: Check if MySQL is running in XAMPP
- Default username: `root`
- Default password: (empty/blank)

### Error: "Table already exists"
- Solution: The schema uses `CREATE TABLE IF NOT EXISTS`, so this shouldn't happen
- If it does, drop the specific table and re-import

## Next Steps

After database setup:
1. ✅ Test backend connection
2. ✅ Create your first admin account via the web interface
3. ✅ Login and start using the system

---

**Need Help?** Check the main README.md or TROUBLESHOOTING.md files.

