# Instructions to Copy Files to XAMPP

## Quick Method (Using Batch Script)

1. **Edit the batch file** (`copy_to_xampp.bat`):
   - Open `copy_to_xampp.bat` in Notepad
   - Find the line: `set XAMPP_PATH=C:\xampp\htdocs\fur-ever-care`
   - Change it to match your XAMPP folder name
   - Save the file

2. **Run the batch file**:
   - Double-click `copy_to_xampp.bat`
   - It will copy all the necessary files to XAMPP

## Manual Method

If the batch script doesn't work, copy files manually:

### Step 1: Find Your XAMPP Folder
- Open: `C:\xampp\htdocs\`
- Find your project folder (might be `fur-ever-care` or `fur-ever-care(1)`)

### Step 2: Copy Files
Copy these files from your project to XAMPP:

**From:** `backend\api\dashboard\doctor_statistics.php`  
**To:** `C:\xampp\htdocs\[YOUR_FOLDER_NAME]\backend\api\dashboard\doctor_statistics.php`

**From:** `backend\api\dashboard\doctor_surgery_fees.php`  
**To:** `C:\xampp\htdocs\[YOUR_FOLDER_NAME]\backend\api\dashboard\doctor_surgery_fees.php`

**From:** `backend\api\dashboard\doctor_detail.php`  
**To:** `C:\xampp\htdocs\[YOUR_FOLDER_NAME]\backend\api\dashboard\doctor_detail.php`

**From:** `backend\api\dashboard\test_endpoints.php`  
**To:** `C:\xampp\htdocs\[YOUR_FOLDER_NAME]\backend\api\dashboard\test_endpoints.php`

### Step 3: Verify Files Are Copied
1. Check that files exist in: `C:\xampp\htdocs\[YOUR_FOLDER_NAME]\backend\api\dashboard\`
2. You should see:
   - `doctor_statistics.php`
   - `doctor_surgery_fees.php`
   - `doctor_detail.php`
   - `test_endpoints.php`

### Step 4: Test the Endpoints
Open in browser (replace `[YOUR_FOLDER_NAME]` with your actual folder):
- `http://localhost/[YOUR_FOLDER_NAME]/backend/api/dashboard/test_endpoints.php`
- `http://localhost/[YOUR_FOLDER_NAME]/backend/api/dashboard/doctor_statistics.php`

## Important Notes

1. **Make sure XAMPP Apache is running** before testing
2. **The folder name must match** what's in your `setupProxy.js` file
3. **If you see "Not Found"**, check:
   - Is Apache running in XAMPP?
   - Is the folder name correct?
   - Are the files in the right location?

## File Locations Summary

**Your Project Files:**
- `C:\Users\QCU\fur-ever-care(1)\backend\api\dashboard\`

**XAMPP Files (where they should be):**
- `C:\xampp\htdocs\[YOUR_FOLDER_NAME]\backend\api\dashboard\`

Replace `[YOUR_FOLDER_NAME]` with your actual folder name in XAMPP htdocs.

