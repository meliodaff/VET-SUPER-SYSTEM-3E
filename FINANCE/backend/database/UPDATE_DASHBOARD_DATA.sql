-- ============================================
-- Update Dashboard Data Script
-- Run this after importing fresh_install.sql
-- to update payment dates for sales trend
-- ============================================

USE fur_ever_care_db;

-- Update payment dates to be more recent (last 6 months)
UPDATE payments SET payment_date = DATE_SUB(CURDATE(), INTERVAL 5 MONTH) WHERE id = 1;
UPDATE payments SET payment_date = DATE_SUB(CURDATE(), INTERVAL 4 MONTH) WHERE id = 2;
UPDATE payments SET payment_date = DATE_SUB(CURDATE(), INTERVAL 3 MONTH) WHERE id = 3;
UPDATE payments SET payment_date = DATE_SUB(CURDATE(), INTERVAL 2 MONTH) WHERE id = 4;
UPDATE payments SET payment_date = DATE_SUB(CURDATE(), INTERVAL 1 MONTH) WHERE id = 5;
UPDATE payments SET payment_date = DATE_SUB(CURDATE(), INTERVAL 3 WEEK) WHERE id = 6;
UPDATE payments SET payment_date = DATE_SUB(CURDATE(), INTERVAL 2 WEEK) WHERE id = 7;
UPDATE payments SET payment_date = DATE_SUB(CURDATE(), INTERVAL 1 WEEK) WHERE id = 8;

-- Update invoice 8 total to include both items (3000 + 2000)
UPDATE invoices SET total_amount = 5000.00 WHERE id = 8;

-- Add additional surgery item if not exists
INSERT INTO invoice_items (invoice_id, service_id, quantity, unit_price, line_total)
SELECT 8, 4, 1, 2000.00, 2000.00
WHERE NOT EXISTS (
    SELECT 1 FROM invoice_items WHERE invoice_id = 8 AND service_id = 4
);

