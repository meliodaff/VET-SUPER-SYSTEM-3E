-- ============================================
-- Add Philippine Dashboard Data
-- This script adds sample data for:
-- 1. Sales Trend (payments over last 6 months)
-- 2. Doctor Statistics (patients and revenue)
-- 3. Doctor Surgery Fees (surgery services)
-- ============================================

USE fur_ever_care_db;

-- ============================================
-- 1. ADD MORE PAYMENTS FOR SALES TREND
-- Spread payments over last 6 months
-- ============================================

-- Get existing invoice IDs that are paid
SET @invoice1 = (SELECT id FROM invoices WHERE invoice_number = 'INV-2024-001' LIMIT 1);
SET @invoice2 = (SELECT id FROM invoices WHERE invoice_number = 'INV-2024-002' LIMIT 1);
SET @invoice4 = (SELECT id FROM invoices WHERE invoice_number = 'INV-2024-004' LIMIT 1);
SET @invoice6 = (SELECT id FROM invoices WHERE invoice_number = 'INV-2024-006' LIMIT 1);
SET @invoice8 = (SELECT id FROM invoices WHERE invoice_number = 'INV-2024-008' LIMIT 1);
SET @invoice9 = (SELECT id FROM invoices WHERE invoice_number = 'INV-2024-009' LIMIT 1);

-- Update existing payments with recent dates (last 6 months)
UPDATE payments SET payment_date = DATE_SUB(CURDATE(), INTERVAL 5 MONTH) WHERE invoice_id = @invoice1;
UPDATE payments SET payment_date = DATE_SUB(CURDATE(), INTERVAL 4 MONTH) WHERE invoice_id = @invoice2;
UPDATE payments SET payment_date = DATE_SUB(CURDATE(), INTERVAL 3 MONTH) WHERE invoice_id = @invoice4;
UPDATE payments SET payment_date = DATE_SUB(CURDATE(), INTERVAL 2 MONTH) WHERE invoice_id = @invoice6;
UPDATE payments SET payment_date = DATE_SUB(CURDATE(), INTERVAL 1 MONTH) WHERE invoice_id = @invoice8;
UPDATE payments SET payment_date = DATE_SUB(CURDATE(), INTERVAL 3 WEEK) WHERE invoice_id = @invoice9;

-- Add more payments for sales trend (spread over 6 months)
INSERT INTO payments (invoice_id, amount, payment_date, payment_method, reference_number) 
SELECT 
    inv.id,
    inv.total_amount,
    DATE_SUB(CURDATE(), INTERVAL FLOOR(RAND() * 6) MONTH),
    CASE (FLOOR(RAND() * 5))
        WHEN 0 THEN 'cash'
        WHEN 1 THEN 'gcash'
        WHEN 2 THEN 'paymaya'
        WHEN 3 THEN 'transfer'
        ELSE 'debit_card'
    END,
    CONCAT('PH-', DATE_FORMAT(NOW(), '%Y%m%d'), '-', FLOOR(RAND() * 1000))
FROM invoices inv
WHERE inv.status = 'paid' 
AND inv.id NOT IN (SELECT invoice_id FROM payments WHERE invoice_id IS NOT NULL)
LIMIT 5;

-- ============================================
-- 2. ADD MORE INVOICES WITH SURGERY SERVICES
-- For Doctor Surgery Fees chart
-- Multiple surgeries per doctor for better visualization
-- ============================================

-- Get surgery service ID
SET @surgery_service_id = (SELECT id FROM services WHERE category = 'Surgery' LIMIT 1);

-- Get veterinarian employee IDs (Filipino doctors)
SET @vet1_id = (SELECT id FROM employees WHERE role = 'veterinarian' AND name LIKE '%Juan%' LIMIT 1);
SET @vet2_id = (SELECT id FROM employees WHERE role = 'veterinarian' AND name LIKE '%Ana%' LIMIT 1);

-- If not found, get any veterinarian
SET @vet1_id = IFNULL(@vet1_id, (SELECT id FROM employees WHERE role = 'veterinarian' LIMIT 1));
SET @vet2_id = IFNULL(@vet2_id, (SELECT id FROM employees WHERE role = 'veterinarian' ORDER BY id DESC LIMIT 1));

-- Get patient IDs (Filipino pet owners)
SET @patient1 = (SELECT id FROM patients LIMIT 1);
SET @patient2 = (SELECT id FROM patients ORDER BY id LIMIT 1 OFFSET 1);
SET @patient3 = (SELECT id FROM patients ORDER BY id LIMIT 1 OFFSET 2);
SET @patient4 = (SELECT id FROM patients ORDER BY id LIMIT 1 OFFSET 3);
SET @patient5 = (SELECT id FROM patients ORDER BY id LIMIT 1 OFFSET 4);
SET @patient6 = (SELECT id FROM patients ORDER BY id LIMIT 1 OFFSET 5);

-- Add multiple invoices with surgery services for Dr. Juan dela Cruz
INSERT INTO invoices (patient_id, employee_id, invoice_number, invoice_date, due_date, total_amount, status) VALUES
(@patient1, @vet1_id, CONCAT('INV-SURG-', DATE_FORMAT(NOW(), '%Y%m%d'), '-001'), DATE_SUB(CURDATE(), INTERVAL 3 MONTH), DATE_ADD(CURDATE(), INTERVAL 15 DAY), 3500.00, 'paid'),
(@patient2, @vet1_id, CONCAT('INV-SURG-', DATE_FORMAT(NOW(), '%Y%m%d'), '-002'), DATE_SUB(CURDATE(), INTERVAL 2 MONTH), DATE_ADD(CURDATE(), INTERVAL 15 DAY), 4500.00, 'paid'),
(@patient3, @vet1_id, CONCAT('INV-SURG-', DATE_FORMAT(NOW(), '%Y%m%d'), '-003'), DATE_SUB(CURDATE(), INTERVAL 1 MONTH), DATE_ADD(CURDATE(), INTERVAL 15 DAY), 6000.00, 'paid'),
(@patient4, @vet1_id, CONCAT('INV-SURG-', DATE_FORMAT(NOW(), '%Y%m%d'), '-004'), DATE_SUB(CURDATE(), INTERVAL 3 WEEK), DATE_ADD(CURDATE(), INTERVAL 15 DAY), 2500.00, 'paid'),
(@patient5, @vet1_id, CONCAT('INV-SURG-', DATE_FORMAT(NOW(), '%Y%m%d'), '-005'), DATE_SUB(CURDATE(), INTERVAL 2 WEEK), DATE_ADD(CURDATE(), INTERVAL 15 DAY), 4200.00, 'paid');

-- Add multiple invoices with surgery services for Dr. Ana Reyes
INSERT INTO invoices (patient_id, employee_id, invoice_number, invoice_date, due_date, total_amount, status) VALUES
(@patient6, @vet2_id, CONCAT('INV-SURG-', DATE_FORMAT(NOW(), '%Y%m%d'), '-006'), DATE_SUB(CURDATE(), INTERVAL 4 MONTH), DATE_ADD(CURDATE(), INTERVAL 15 DAY), 3800.00, 'paid'),
(@patient1, @vet2_id, CONCAT('INV-SURG-', DATE_FORMAT(NOW(), '%Y%m%d'), '-007'), DATE_SUB(CURDATE(), INTERVAL 3 MONTH), DATE_ADD(CURDATE(), INTERVAL 15 DAY), 5500.00, 'paid'),
(@patient2, @vet2_id, CONCAT('INV-SURG-', DATE_FORMAT(NOW(), '%Y%m%d'), '-008'), DATE_SUB(CURDATE(), INTERVAL 2 MONTH), DATE_ADD(CURDATE(), INTERVAL 15 DAY), 3200.00, 'paid'),
(@patient3, @vet2_id, CONCAT('INV-SURG-', DATE_FORMAT(NOW(), '%Y%m%d'), '-009'), DATE_SUB(CURDATE(), INTERVAL 1 MONTH), DATE_ADD(CURDATE(), INTERVAL 15 DAY), 4800.00, 'paid'),
(@patient4, @vet2_id, CONCAT('INV-SURG-', DATE_FORMAT(NOW(), '%Y%m%d'), '-010'), DATE_SUB(CURDATE(), INTERVAL 2 WEEK), DATE_ADD(CURDATE(), INTERVAL 15 DAY), 5100.00, 'paid');

-- Get the newly inserted invoice IDs
SET @surg_inv1 = LAST_INSERT_ID() - 9;
SET @surg_inv2 = @surg_inv1 + 1;
SET @surg_inv3 = @surg_inv1 + 2;
SET @surg_inv4 = @surg_inv1 + 3;
SET @surg_inv5 = @surg_inv1 + 4;
SET @surg_inv6 = @surg_inv1 + 5;
SET @surg_inv7 = @surg_inv1 + 6;
SET @surg_inv8 = @surg_inv1 + 7;
SET @surg_inv9 = @surg_inv1 + 8;
SET @surg_inv10 = @surg_inv1 + 9;

-- Add surgery items to Dr. Juan's invoices
INSERT INTO invoice_items (invoice_id, service_id, quantity, unit_price, line_total) VALUES
(@surg_inv1, @surgery_service_id, 1, 3500.00, 3500.00),
(@surg_inv2, @surgery_service_id, 1, 4500.00, 4500.00),
(@surg_inv3, @surgery_service_id, 1, 6000.00, 6000.00),
(@surg_inv4, @surgery_service_id, 1, 2500.00, 2500.00),
(@surg_inv5, @surgery_service_id, 1, 4200.00, 4200.00);

-- Add surgery items to Dr. Ana's invoices
INSERT INTO invoice_items (invoice_id, service_id, quantity, unit_price, line_total) VALUES
(@surg_inv6, @surgery_service_id, 1, 3800.00, 3800.00),
(@surg_inv7, @surgery_service_id, 1, 5500.00, 5500.00),
(@surg_inv8, @surgery_service_id, 1, 3200.00, 3200.00),
(@surg_inv9, @surgery_service_id, 1, 4800.00, 4800.00),
(@surg_inv10, @surgery_service_id, 1, 5100.00, 5100.00);

-- Add payments for Dr. Juan's surgery invoices (Philippine payment methods)
INSERT INTO payments (invoice_id, amount, payment_date, payment_method, reference_number) VALUES
(@surg_inv1, 3500.00, DATE_SUB(CURDATE(), INTERVAL 3 MONTH), 'gcash', CONCAT('GCASH-SURG-', @surg_inv1)),
(@surg_inv2, 4500.00, DATE_SUB(CURDATE(), INTERVAL 2 MONTH), 'paymaya', CONCAT('PAYMAYA-SURG-', @surg_inv2)),
(@surg_inv3, 6000.00, DATE_SUB(CURDATE(), INTERVAL 1 MONTH), 'transfer', CONCAT('BANK-SURG-', @surg_inv3)),
(@surg_inv4, 2500.00, DATE_SUB(CURDATE(), INTERVAL 3 WEEK), 'cash', CONCAT('CASH-SURG-', @surg_inv4)),
(@surg_inv5, 4200.00, DATE_SUB(CURDATE(), INTERVAL 2 WEEK), 'gcash', CONCAT('GCASH-SURG-', @surg_inv5));

-- Add payments for Dr. Ana's surgery invoices (Philippine payment methods)
INSERT INTO payments (invoice_id, amount, payment_date, payment_method, reference_number) VALUES
(@surg_inv6, 3800.00, DATE_SUB(CURDATE(), INTERVAL 4 MONTH), 'paymaya', CONCAT('PAYMAYA-SURG-', @surg_inv6)),
(@surg_inv7, 5500.00, DATE_SUB(CURDATE(), INTERVAL 3 MONTH), 'transfer', CONCAT('BANK-SURG-', @surg_inv7)),
(@surg_inv8, 3200.00, DATE_SUB(CURDATE(), INTERVAL 2 MONTH), 'cash', CONCAT('CASH-SURG-', @surg_inv8)),
(@surg_inv9, 4800.00, DATE_SUB(CURDATE(), INTERVAL 1 MONTH), 'gcash', CONCAT('GCASH-SURG-', @surg_inv9)),
(@surg_inv10, 5100.00, DATE_SUB(CURDATE(), INTERVAL 2 WEEK), 'paymaya', CONCAT('PAYMAYA-SURG-', @surg_inv10));

-- ============================================
-- 3. ADD MORE INVOICES FOR DOCTOR STATISTICS
-- To show patient count and revenue per doctor
-- Multiple patients per doctor for better statistics
-- ============================================

-- Get all patient IDs (Filipino pet owners)
SET @pat1 = (SELECT id FROM patients ORDER BY id LIMIT 1 OFFSET 0);
SET @pat2 = (SELECT id FROM patients ORDER BY id LIMIT 1 OFFSET 1);
SET @pat3 = (SELECT id FROM patients ORDER BY id LIMIT 1 OFFSET 2);
SET @pat4 = (SELECT id FROM patients ORDER BY id LIMIT 1 OFFSET 3);
SET @pat5 = (SELECT id FROM patients ORDER BY id LIMIT 1 OFFSET 4);
SET @pat6 = (SELECT id FROM patients ORDER BY id LIMIT 1 OFFSET 5);
SET @pat7 = (SELECT id FROM patients ORDER BY id LIMIT 1 OFFSET 6);
SET @pat8 = (SELECT id FROM patients ORDER BY id LIMIT 1 OFFSET 7);
SET @pat9 = (SELECT id FROM patients ORDER BY id LIMIT 1 OFFSET 8);
SET @pat10 = (SELECT id FROM patients ORDER BY id LIMIT 1 OFFSET 9);

-- Get service IDs for invoice items
SET @checkup_id = (SELECT id FROM services WHERE name LIKE '%Check-up%' LIMIT 1);
SET @vaccination_id = (SELECT id FROM services WHERE name LIKE '%Vaccination%' LIMIT 1);
SET @dental_id = (SELECT id FROM services WHERE name LIKE '%Dental%' LIMIT 1);
SET @xray_id = (SELECT id FROM services WHERE name LIKE '%X-Ray%' LIMIT 1);
SET @blood_id = (SELECT id FROM services WHERE name LIKE '%Blood%' LIMIT 1);
SET @grooming_id = (SELECT id FROM services WHERE name LIKE '%Grooming%' LIMIT 1);

-- Add more invoices for Dr. Juan dela Cruz (multiple patients)
INSERT INTO invoices (patient_id, employee_id, invoice_number, invoice_date, due_date, total_amount, status) VALUES
(@pat1, @vet1_id, CONCAT('INV-DOC-', DATE_FORMAT(NOW(), '%Y%m%d'), '-001'), DATE_SUB(CURDATE(), INTERVAL 5 MONTH), DATE_ADD(CURDATE(), INTERVAL 15 DAY), 1200.00, 'paid'),
(@pat2, @vet1_id, CONCAT('INV-DOC-', DATE_FORMAT(NOW(), '%Y%m%d'), '-002'), DATE_SUB(CURDATE(), INTERVAL 4 MONTH), DATE_ADD(CURDATE(), INTERVAL 15 DAY), 1800.00, 'paid'),
(@pat3, @vet1_id, CONCAT('INV-DOC-', DATE_FORMAT(NOW(), '%Y%m%d'), '-003'), DATE_SUB(CURDATE(), INTERVAL 3 MONTH), DATE_ADD(CURDATE(), INTERVAL 15 DAY), 950.00, 'paid'),
(@pat4, @vet1_id, CONCAT('INV-DOC-', DATE_FORMAT(NOW(), '%Y%m%d'), '-004'), DATE_SUB(CURDATE(), INTERVAL 2 MONTH), DATE_ADD(CURDATE(), INTERVAL 15 DAY), 2100.00, 'paid'),
(@pat5, @vet1_id, CONCAT('INV-DOC-', DATE_FORMAT(NOW(), '%Y%m%d'), '-005'), DATE_SUB(CURDATE(), INTERVAL 1 MONTH), DATE_ADD(CURDATE(), INTERVAL 15 DAY), 1400.00, 'paid'),
(@pat6, @vet1_id, CONCAT('INV-DOC-', DATE_FORMAT(NOW(), '%Y%m%d'), '-006'), DATE_SUB(CURDATE(), INTERVAL 3 WEEK), DATE_ADD(CURDATE(), INTERVAL 15 DAY), 1650.00, 'paid'),
(@pat7, @vet1_id, CONCAT('INV-DOC-', DATE_FORMAT(NOW(), '%Y%m%d'), '-007'), DATE_SUB(CURDATE(), INTERVAL 2 WEEK), DATE_ADD(CURDATE(), INTERVAL 15 DAY), 1950.00, 'paid');

-- Add more invoices for Dr. Ana Reyes (multiple patients)
INSERT INTO invoices (patient_id, employee_id, invoice_number, invoice_date, due_date, total_amount, status) VALUES
(@pat8, @vet2_id, CONCAT('INV-DOC-', DATE_FORMAT(NOW(), '%Y%m%d'), '-008'), DATE_SUB(CURDATE(), INTERVAL 5 MONTH), DATE_ADD(CURDATE(), INTERVAL 15 DAY), 2200.00, 'paid'),
(@pat9, @vet2_id, CONCAT('INV-DOC-', DATE_FORMAT(NOW(), '%Y%m%d'), '-009'), DATE_SUB(CURDATE(), INTERVAL 4 MONTH), DATE_ADD(CURDATE(), INTERVAL 15 DAY), 1750.00, 'paid'),
(@pat10, @vet2_id, CONCAT('INV-DOC-', DATE_FORMAT(NOW(), '%Y%m%d'), '-010'), DATE_SUB(CURDATE(), INTERVAL 3 MONTH), DATE_ADD(CURDATE(), INTERVAL 15 DAY), 1300.00, 'paid'),
(@pat1, @vet2_id, CONCAT('INV-DOC-', DATE_FORMAT(NOW(), '%Y%m%d'), '-011'), DATE_SUB(CURDATE(), INTERVAL 2 MONTH), DATE_ADD(CURDATE(), INTERVAL 15 DAY), 2400.00, 'paid'),
(@pat2, @vet2_id, CONCAT('INV-DOC-', DATE_FORMAT(NOW(), '%Y%m%d'), '-012'), DATE_SUB(CURDATE(), INTERVAL 1 MONTH), DATE_ADD(CURDATE(), INTERVAL 15 DAY), 1600.00, 'paid'),
(@pat3, @vet2_id, CONCAT('INV-DOC-', DATE_FORMAT(NOW(), '%Y%m%d'), '-013'), DATE_SUB(CURDATE(), INTERVAL 3 WEEK), DATE_ADD(CURDATE(), INTERVAL 15 DAY), 1850.00, 'paid'),
(@pat4, @vet2_id, CONCAT('INV-DOC-', DATE_FORMAT(NOW(), '%Y%m%d'), '-014'), DATE_SUB(CURDATE(), INTERVAL 2 WEEK), DATE_ADD(CURDATE(), INTERVAL 15 DAY), 2050.00, 'paid');

-- Get the newly inserted invoice IDs for doctor statistics
SET @doc_inv1 = LAST_INSERT_ID() - 13;
SET @doc_inv2 = @doc_inv1 + 1;
SET @doc_inv3 = @doc_inv1 + 2;
SET @doc_inv4 = @doc_inv1 + 3;
SET @doc_inv5 = @doc_inv1 + 4;
SET @doc_inv6 = @doc_inv1 + 5;
SET @doc_inv7 = @doc_inv1 + 6;
SET @doc_inv8 = @doc_inv1 + 7;
SET @doc_inv9 = @doc_inv1 + 8;
SET @doc_inv10 = @doc_inv1 + 9;
SET @doc_inv11 = @doc_inv1 + 10;
SET @doc_inv12 = @doc_inv1 + 11;
SET @doc_inv13 = @doc_inv1 + 12;
SET @doc_inv14 = @doc_inv1 + 13;

-- Add invoice items for Dr. Juan's invoices (various services)
INSERT INTO invoice_items (invoice_id, service_id, quantity, unit_price, line_total) VALUES
(@doc_inv1, @checkup_id, 1, 500.00, 500.00),
(@doc_inv1, @vaccination_id, 1, 800.00, 800.00),
(@doc_inv2, @dental_id, 1, 1200.00, 1200.00),
(@doc_inv2, @checkup_id, 1, 500.00, 500.00),
(@doc_inv3, @vaccination_id, 1, 800.00, 800.00),
(@doc_inv3, @checkup_id, 1, 500.00, 500.00),
(@doc_inv4, @xray_id, 1, 1500.00, 1500.00),
(@doc_inv4, @checkup_id, 1, 500.00, 500.00),
(@doc_inv5, @blood_id, 1, 800.00, 800.00),
(@doc_inv5, @checkup_id, 1, 500.00, 500.00),
(@doc_inv6, @dental_id, 1, 1200.00, 1200.00),
(@doc_inv6, @vaccination_id, 1, 800.00, 800.00),
(@doc_inv7, @grooming_id, 1, 600.00, 600.00),
(@doc_inv7, @checkup_id, 1, 500.00, 500.00),
(@doc_inv7, @vaccination_id, 1, 800.00, 800.00);

-- Add invoice items for Dr. Ana's invoices (various services)
INSERT INTO invoice_items (invoice_id, service_id, quantity, unit_price, line_total) VALUES
(@doc_inv8, @dental_id, 1, 1200.00, 1200.00),
(@doc_inv8, @vaccination_id, 1, 800.00, 800.00),
(@doc_inv9, @xray_id, 1, 1500.00, 1500.00),
(@doc_inv9, @checkup_id, 1, 500.00, 500.00),
(@doc_inv10, @blood_id, 1, 800.00, 800.00),
(@doc_inv10, @checkup_id, 1, 500.00, 500.00),
(@doc_inv11, @dental_id, 1, 1200.00, 1200.00),
(@doc_inv11, @vaccination_id, 1, 800.00, 800.00),
(@doc_inv11, @checkup_id, 1, 500.00, 500.00),
(@doc_inv12, @grooming_id, 1, 600.00, 600.00),
(@doc_inv12, @vaccination_id, 1, 800.00, 800.00),
(@doc_inv12, @checkup_id, 1, 500.00, 500.00),
(@doc_inv13, @xray_id, 1, 1500.00, 1500.00),
(@doc_inv13, @checkup_id, 1, 500.00, 500.00),
(@doc_inv14, @dental_id, 1, 1200.00, 1200.00),
(@doc_inv14, @blood_id, 1, 800.00, 800.00),
(@doc_inv14, @checkup_id, 1, 500.00, 500.00);

-- Add payments for Dr. Juan's invoices (Philippine payment methods)
INSERT INTO payments (invoice_id, amount, payment_date, payment_method, reference_number) VALUES
(@doc_inv1, 1200.00, DATE_SUB(CURDATE(), INTERVAL 5 MONTH), 'cash', CONCAT('CASH-DOC-', @doc_inv1)),
(@doc_inv2, 1800.00, DATE_SUB(CURDATE(), INTERVAL 4 MONTH), 'gcash', CONCAT('GCASH-DOC-', @doc_inv2)),
(@doc_inv3, 950.00, DATE_SUB(CURDATE(), INTERVAL 3 MONTH), 'paymaya', CONCAT('PAYMAYA-DOC-', @doc_inv3)),
(@doc_inv4, 2100.00, DATE_SUB(CURDATE(), INTERVAL 2 MONTH), 'transfer', CONCAT('BANK-DOC-', @doc_inv4)),
(@doc_inv5, 1400.00, DATE_SUB(CURDATE(), INTERVAL 1 MONTH), 'cash', CONCAT('CASH-DOC-', @doc_inv5)),
(@doc_inv6, 1650.00, DATE_SUB(CURDATE(), INTERVAL 3 WEEK), 'gcash', CONCAT('GCASH-DOC-', @doc_inv6)),
(@doc_inv7, 1950.00, DATE_SUB(CURDATE(), INTERVAL 2 WEEK), 'paymaya', CONCAT('PAYMAYA-DOC-', @doc_inv7));

-- Add payments for Dr. Ana's invoices (Philippine payment methods)
INSERT INTO payments (invoice_id, amount, payment_date, payment_method, reference_number) VALUES
(@doc_inv8, 2200.00, DATE_SUB(CURDATE(), INTERVAL 5 MONTH), 'transfer', CONCAT('BANK-DOC-', @doc_inv8)),
(@doc_inv9, 1750.00, DATE_SUB(CURDATE(), INTERVAL 4 MONTH), 'cash', CONCAT('CASH-DOC-', @doc_inv9)),
(@doc_inv10, 1300.00, DATE_SUB(CURDATE(), INTERVAL 3 MONTH), 'gcash', CONCAT('GCASH-DOC-', @doc_inv10)),
(@doc_inv11, 2400.00, DATE_SUB(CURDATE(), INTERVAL 2 MONTH), 'paymaya', CONCAT('PAYMAYA-DOC-', @doc_inv11)),
(@doc_inv12, 1600.00, DATE_SUB(CURDATE(), INTERVAL 1 MONTH), 'transfer', CONCAT('BANK-DOC-', @doc_inv12)),
(@doc_inv13, 1850.00, DATE_SUB(CURDATE(), INTERVAL 3 WEEK), 'cash', CONCAT('CASH-DOC-', @doc_inv13)),
(@doc_inv14, 2050.00, DATE_SUB(CURDATE(), INTERVAL 2 WEEK), 'gcash', CONCAT('GCASH-DOC-', @doc_inv14));

-- ============================================
-- 4. ADD MORE PHILIPPINE PATIENTS
-- For better doctor statistics
-- ============================================

INSERT INTO patients (name, owner_name, species, breed, contact_phone) VALUES
('Bantay', 'Roberto Santos', 'Dog', 'Aspin (Asong Pinoy)', '09171234567'),
('Muning', 'Maria dela Cruz', 'Cat', 'Puspin (Pusang Pinoy)', '09182345678'),
('Max', 'Jose Reyes', 'Dog', 'German Shepherd', '09193456789'),
('Luna', 'Carmen Villanueva', 'Cat', 'Siamese', '09204567890'),
('Charlie', 'Antonio Garcia', 'Dog', 'Beagle', '09215678901')
ON DUPLICATE KEY UPDATE name = name;

-- ============================================
-- VERIFICATION QUERIES
-- Run these to check the data was added
-- ============================================

-- Check sales trend data (should show payments over last 6 months)
-- SELECT DATE_FORMAT(payment_date, '%Y-%m') as month, SUM(amount) as total 
-- FROM payments 
-- WHERE payment_date >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
-- GROUP BY DATE_FORMAT(payment_date, '%Y-%m')
-- ORDER BY month ASC;

-- Check doctor statistics (should show patients and revenue per doctor)
-- SELECT e.name AS doctor, 
--        COUNT(DISTINCT inv.patient_id) AS patients,
--        SUM(inv.total_amount) AS revenue
-- FROM invoices inv
-- JOIN employees e ON inv.employee_id = e.id
-- WHERE e.role = 'veterinarian' AND inv.status = 'paid'
-- GROUP BY e.name;

-- Check surgery fees (should show surgeries and fees per doctor)
-- SELECT e.name AS doctor,
--        COUNT(ii.id) AS surgeries,
--        SUM(ii.line_total) AS total_fees
-- FROM invoice_items ii
-- JOIN services s ON ii.service_id = s.id
-- JOIN invoices inv ON ii.invoice_id = inv.id
-- JOIN employees e ON inv.employee_id = e.id
-- WHERE s.category = 'Surgery' AND inv.status = 'paid'
-- GROUP BY e.name;

-- ============================================
-- END OF SCRIPT
-- ============================================

