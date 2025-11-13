# Quick Database Setup Guide

## ⚡ Fastest Method: Use phpMyAdmin

Since you reinstalled XAMPP, follow these simple steps:

### 1. Open phpMyAdmin
- Go to: **http://localhost/phpmyadmin**
- Make sure MySQL is running in XAMPP Control Panel

### 2. Delete Old Database (if it exists)
- Click on **`fur_ever_care_db`** in the left sidebar (if you see it)
- Click **"Operations"** tab
- Scroll down and click **"Drop the database"**
- Confirm deletion

### 3. Create New Database
- Click **"New"** in left sidebar
- Database name: **`fur_ever_care_db`**
- Collation: **`utf8mb4_general_ci`**
- Click **"Create"**

### 4. Import Database
- Click on **`fur_ever_care_db`** (should be empty)
- Click **"Import"** tab
- Click **"Choose File"**
- Select: **`backend/database/fresh_install.sql`**
- Click **"Go"**
- Wait for: ✅ **"Import has been successfully finished"**

### 5. Verify Setup
You should see these 8 tables:
- ✅ `admins`
- ✅ `employees` (5 sample employees)
- ✅ `patients` (10 sample patients)
- ✅ `services` (8 services)
- ✅ `invoices` (10 invoices)
- ✅ `invoice_items` (11 items)
- ✅ `payments` (8 payments)
- ✅ `inventory` (8 items)

### 6. Test Your Application
- Open: **http://localhost/fur-ever-care/frontend**
- Create your first admin account
- Login and start using the system!

---

## 📁 Database Files Available

1. **`fresh_install.sql`** - ✅ **USE THIS ONE** (handles tablespace issues)
2. **`schema.sql`** - Alternative (same structure)
3. **`reset_database.sql`** - For resetting existing database

---

## ❌ Troubleshooting

### Error: "Tablespace exists"
- **Solution**: Use phpMyAdmin method above (drops database first)
- Or manually delete the database folder: `C:\xampp\mysql\data\fur_ever_care_db`

### Error: "Access denied"
- Check MySQL is running in XAMPP
- Default username: `root`
- Default password: (leave blank)

### Error: "Database not found"
- Make sure you created the database first (Step 3)
- Database name must be exactly: `fur_ever_care_db`

---

## ✅ Success Checklist

- [ ] MySQL is running in XAMPP
- [ ] Database `fur_ever_care_db` exists
- [ ] All 8 tables are created
- [ ] Sample data is imported
- [ ] Can access phpMyAdmin without errors

---

**Need more help?** Check `README_SETUP.md` for detailed instructions.

