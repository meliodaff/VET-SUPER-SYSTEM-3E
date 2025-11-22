# Inventory Transactions Table Setup

## Quick Setup Instructions

To enable the Inventory Transaction Tracking feature, you need to create the `inventory_transactions` table in your database.

### Option 1: Using phpMyAdmin (Recommended)

1. Open phpMyAdmin: http://localhost/phpmyadmin
2. Select the `fur_ever_care_db` database
3. Click on the "SQL" tab
4. Copy and paste the contents of `inventory_transactions_table.sql`
5. Click "Go" to execute

### Option 2: Using MySQL Command Line

```bash
mysql -u root -p fur_ever_care_db < backend/database/inventory_transactions_table.sql
```

### What This Creates

- **Table**: `inventory_transactions`
  - Tracks all inventory movements (IN, OUT, ADJUSTMENT)
  - Links to inventory items
  - Records who performed the transaction
  - Stores transaction numbers, quantities, prices, and totals

- **Sample Data**: 10 sample transactions are included for testing

### After Setup

Once the table is created, the "Track Transactions" button on the Inventory & Supplies Cost section will work and display:
- Summary cards (Total Items, Total Value, Low Stock, Last Updated)
- Recent Transactions table
- Current Inventory Levels table

### Notes

- The table includes sample data matching the design shown in the modal
- Transaction numbers are auto-generated (TXN-XXXX format)
- Transactions can be linked to inventory items via `inventory_id` (optional)
- The modal fetches real-time data from this table

