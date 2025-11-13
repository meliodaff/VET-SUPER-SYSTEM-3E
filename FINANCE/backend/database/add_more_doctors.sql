-- ============================================
-- Add More Sample Doctors for Dashboard (Philippines)
-- This script adds more veterinarians to the employees table
-- and creates sample invoices so they appear on the dashboard
-- ============================================

USE fur_ever_care_db;

-- Add more veterinarians to the employees table
INSERT INTO employees (
    first_name, middle_name, last_name, 
    Position, department, rate, employment_type,
    contact_email, phone_number, address, system_role, hire_date
)
SELECT * FROM (
    SELECT 
        'Maricris' as first_name,
        'Villolet' as middle_name,
        'Santos' as last_name,
        'Veterinarian' as Position,
        'Vet Clinic' as department,
        52000.00 as rate,
        'Active Full-Time' as employment_type,
        'maricris.villolet@furevercare.ph' as contact_email,
        '09174567890' as phone_number,
        '321 Taft Avenue, Manila City, Metro Manila' as address,
        'Admin' as system_role,
        '2024-01-10' as hire_date
    UNION ALL
    SELECT 
        'Roberto',
        'Dela',
        'Torres',
        'Veterinarian',
        'Vet Clinic',
        49000.00,
        'Active Full-Time',
        'roberto.torres@furevercare.ph',
        '09185678901',
        '654 Ortigas Avenue, Pasig City, Metro Manila',
        'Employee',
        '2024-02-15'
    UNION ALL
    SELECT 
        'Catherine',
        'Ramos',
        'Fernandez',
        'Senior Veterinarian',
        'Vet Clinic',
        56000.00,
        'Active Full-Time',
        'catherine.fernandez@furevercare.ph',
        '09196789012',
        '987 BGC, Taguig City, Metro Manila',
        'Employee',
        '2024-03-20'
    UNION ALL
    SELECT 
        'James',
        'Michael',
        'Ocampo',
        'Veterinarian',
        'Vet Clinic',
        48000.00,
        'Active Full-Time',
        'james.ocampo@furevercare.ph',
        '09207890123',
        '147 Shaw Boulevard, Mandaluyong City, Metro Manila',
        'Employee',
        '2024-04-05'
    UNION ALL
    SELECT 
        'Patricia',
        'Ann',
        'Bautista',
        'Veterinarian',
        'Vet Clinic',
        50000.00,
        'Active Full-Time',
        'patricia.bautista@furevercare.ph',
        '09218901234',
        '258 Commonwealth Avenue, Quezon City, Metro Manila',
        'Employee',
        '2024-05-12'
) AS tmp
WHERE NOT EXISTS (
    SELECT 1 FROM employees 
    WHERE first_name = tmp.first_name 
    AND last_name = tmp.last_name 
    AND Position = tmp.Position
);

-- Get the newly added doctor IDs (or existing ones if they already exist)
SET @new_vet1_id = (SELECT employee_id FROM employees WHERE first_name = 'Maricris' AND last_name = 'Santos' AND Position = 'Veterinarian' LIMIT 1);
SET @new_vet2_id = (SELECT employee_id FROM employees WHERE first_name = 'Roberto' AND last_name = 'Torres' AND Position = 'Veterinarian' LIMIT 1);
SET @new_vet3_id = (SELECT employee_id FROM employees WHERE first_name = 'Catherine' AND last_name = 'Fernandez' AND Position = 'Senior Veterinarian' LIMIT 1);
SET @new_vet4_id = (SELECT employee_id FROM employees WHERE first_name = 'James' AND last_name = 'Ocampo' AND Position = 'Veterinarian' LIMIT 1);
SET @new_vet5_id = (SELECT employee_id FROM employees WHERE first_name = 'Patricia' AND last_name = 'Bautista' AND Position = 'Veterinarian' LIMIT 1);

-- Get some existing patients (or use any available patients)
SET @pat1 = (SELECT id FROM patients ORDER BY id LIMIT 1);
SET @pat2 = (SELECT id FROM patients ORDER BY id LIMIT 1 OFFSET 1);
SET @pat3 = (SELECT id FROM patients ORDER BY id LIMIT 1 OFFSET 2);
SET @pat4 = (SELECT id FROM patients ORDER BY id LIMIT 1 OFFSET 3);
SET @pat5 = (SELECT id FROM patients ORDER BY id LIMIT 1 OFFSET 4);
SET @pat6 = (SELECT id FROM patients ORDER BY id LIMIT 1 OFFSET 5);
SET @pat7 = (SELECT id FROM patients ORDER BY id LIMIT 1 OFFSET 6);
SET @pat8 = (SELECT id FROM patients ORDER BY id LIMIT 1 OFFSET 7);

-- Get surgery service IDs
SET @surg1 = (SELECT id FROM services WHERE category = 'Surgery' LIMIT 1);
SET @surg2 = (SELECT id FROM services WHERE category = 'Surgery' ORDER BY id LIMIT 1 OFFSET 1);
SET @checkup = (SELECT id FROM services WHERE category = 'Consultation' LIMIT 1);
SET @vaccine = (SELECT id FROM services WHERE category = 'Prevention' LIMIT 1);

-- Add invoices for Maricris Villolet (Doctor 1)
INSERT INTO invoices (patient_id, employee_id, invoice_number, invoice_date, due_date, total_amount, status)
SELECT patient_id, employee_id, invoice_number, invoice_date, due_date, total_amount, status FROM (
    SELECT @pat1 as patient_id, @new_vet1_id as employee_id, CONCAT('INV-', YEAR(CURDATE()), '-', LPAD(100, 4, '0')) as invoice_number, DATE_SUB(CURDATE(), INTERVAL 5 DAY) as invoice_date, DATE_ADD(CURDATE(), INTERVAL 10 DAY) as due_date, 6000.00 as total_amount, 'paid' as status
    UNION ALL
    SELECT @pat2, @new_vet1_id, CONCAT('INV-', YEAR(CURDATE()), '-', LPAD(101, 4, '0')), DATE_SUB(CURDATE(), INTERVAL 3 DAY), DATE_ADD(CURDATE(), INTERVAL 12 DAY), 4500.00, 'paid'
    UNION ALL
    SELECT @pat3, @new_vet1_id, CONCAT('INV-', YEAR(CURDATE()), '-', LPAD(102, 4, '0')), DATE_SUB(CURDATE(), INTERVAL 1 DAY), DATE_ADD(CURDATE(), INTERVAL 14 DAY), 3200.00, 'paid'
) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM invoices WHERE invoice_number = tmp.invoice_number)
AND @new_vet1_id IS NOT NULL;

-- Add invoices for Roberto Torres (Doctor 2)
INSERT INTO invoices (patient_id, employee_id, invoice_number, invoice_date, due_date, total_amount, status)
SELECT patient_id, employee_id, invoice_number, invoice_date, due_date, total_amount, status FROM (
    SELECT @pat4 as patient_id, @new_vet2_id as employee_id, CONCAT('INV-', YEAR(CURDATE()), '-', LPAD(103, 4, '0')) as invoice_number, DATE_SUB(CURDATE(), INTERVAL 7 DAY) as invoice_date, DATE_ADD(CURDATE(), INTERVAL 8 DAY) as due_date, 7500.00 as total_amount, 'paid' as status
    UNION ALL
    SELECT @pat5, @new_vet2_id, CONCAT('INV-', YEAR(CURDATE()), '-', LPAD(104, 4, '0')), DATE_SUB(CURDATE(), INTERVAL 4 DAY), DATE_ADD(CURDATE(), INTERVAL 11 DAY), 4000.00, 'paid'
) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM invoices WHERE invoice_number = tmp.invoice_number)
AND @new_vet2_id IS NOT NULL;

-- Add invoices for Catherine Fernandez (Doctor 3 - Senior)
INSERT INTO invoices (patient_id, employee_id, invoice_number, invoice_date, due_date, total_amount, status)
SELECT patient_id, employee_id, invoice_number, invoice_date, due_date, total_amount, status FROM (
    SELECT @pat6 as patient_id, @new_vet3_id as employee_id, CONCAT('INV-', YEAR(CURDATE()), '-', LPAD(105, 4, '0')) as invoice_number, DATE_SUB(CURDATE(), INTERVAL 6 DAY) as invoice_date, DATE_ADD(CURDATE(), INTERVAL 9 DAY) as due_date, 8500.00 as total_amount, 'paid' as status
    UNION ALL
    SELECT @pat7, @new_vet3_id, CONCAT('INV-', YEAR(CURDATE()), '-', LPAD(106, 4, '0')), DATE_SUB(CURDATE(), INTERVAL 2 DAY), DATE_ADD(CURDATE(), INTERVAL 13 DAY), 5500.00, 'paid'
    UNION ALL
    SELECT @pat8, @new_vet3_id, CONCAT('INV-', YEAR(CURDATE()), '-', LPAD(107, 4, '0')), CURDATE(), DATE_ADD(CURDATE(), INTERVAL 15 DAY), 4200.00, 'paid'
) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM invoices WHERE invoice_number = tmp.invoice_number)
AND @new_vet3_id IS NOT NULL;

-- Add invoices for James Ocampo (Doctor 4)
INSERT INTO invoices (patient_id, employee_id, invoice_number, invoice_date, due_date, total_amount, status)
SELECT patient_id, employee_id, invoice_number, invoice_date, due_date, total_amount, status FROM (
    SELECT @pat1 as patient_id, @new_vet4_id as employee_id, CONCAT('INV-', YEAR(CURDATE()), '-', LPAD(108, 4, '0')) as invoice_number, DATE_SUB(CURDATE(), INTERVAL 8 DAY) as invoice_date, DATE_ADD(CURDATE(), INTERVAL 7 DAY) as due_date, 5000.00 as total_amount, 'paid' as status
    UNION ALL
    SELECT @pat2, @new_vet4_id, CONCAT('INV-', YEAR(CURDATE()), '-', LPAD(109, 4, '0')), DATE_SUB(CURDATE(), INTERVAL 5 DAY), DATE_ADD(CURDATE(), INTERVAL 10 DAY), 3800.00, 'paid'
) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM invoices WHERE invoice_number = tmp.invoice_number)
AND @new_vet4_id IS NOT NULL;

-- Add invoices for Patricia Bautista (Doctor 5)
INSERT INTO invoices (patient_id, employee_id, invoice_number, invoice_date, due_date, total_amount, status)
SELECT patient_id, employee_id, invoice_number, invoice_date, due_date, total_amount, status FROM (
    SELECT @pat3 as patient_id, @new_vet5_id as employee_id, CONCAT('INV-', YEAR(CURDATE()), '-', LPAD(110, 4, '0')) as invoice_number, DATE_SUB(CURDATE(), INTERVAL 9 DAY) as invoice_date, DATE_ADD(CURDATE(), INTERVAL 6 DAY) as due_date, 6800.00 as total_amount, 'paid' as status
    UNION ALL
    SELECT @pat4, @new_vet5_id, CONCAT('INV-', YEAR(CURDATE()), '-', LPAD(111, 4, '0')), DATE_SUB(CURDATE(), INTERVAL 6 DAY), DATE_ADD(CURDATE(), INTERVAL 9 DAY), 4500.00, 'paid'
    UNION ALL
    SELECT @pat5, @new_vet5_id, CONCAT('INV-', YEAR(CURDATE()), '-', LPAD(112, 4, '0')), DATE_SUB(CURDATE(), INTERVAL 3 DAY), DATE_ADD(CURDATE(), INTERVAL 12 DAY), 3600.00, 'paid'
) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM invoices WHERE invoice_number = tmp.invoice_number)
AND @new_vet5_id IS NOT NULL;

-- Add invoice items with surgery services for all new doctors
-- Get invoice IDs for the new doctors
SET @inv_mar1 = (SELECT id FROM invoices WHERE employee_id = @new_vet1_id AND status = 'paid' ORDER BY id LIMIT 1);
SET @inv_mar2 = (SELECT id FROM invoices WHERE employee_id = @new_vet1_id AND status = 'paid' ORDER BY id LIMIT 1 OFFSET 1);
SET @inv_rob1 = (SELECT id FROM invoices WHERE employee_id = @new_vet2_id AND status = 'paid' ORDER BY id LIMIT 1);
SET @inv_cat1 = (SELECT id FROM invoices WHERE employee_id = @new_vet3_id AND status = 'paid' ORDER BY id LIMIT 1);
SET @inv_cat2 = (SELECT id FROM invoices WHERE employee_id = @new_vet3_id AND status = 'paid' ORDER BY id LIMIT 1 OFFSET 1);
SET @inv_jam1 = (SELECT id FROM invoices WHERE employee_id = @new_vet4_id AND status = 'paid' ORDER BY id LIMIT 1);
SET @inv_pat1 = (SELECT id FROM invoices WHERE employee_id = @new_vet5_id AND status = 'paid' ORDER BY id LIMIT 1);
SET @inv_pat2 = (SELECT id FROM invoices WHERE employee_id = @new_vet5_id AND status = 'paid' ORDER BY id LIMIT 1 OFFSET 1);

-- Add surgery items for Maricris
INSERT INTO invoice_items (invoice_id, service_id, quantity, unit_price, line_total)
SELECT invoice_id, service_id, quantity, unit_price, line_total FROM (
    SELECT @inv_mar1 as invoice_id, @surg1 as service_id, 1 as quantity, 5000.00 as unit_price, 5000.00 as line_total
    UNION ALL
    SELECT @inv_mar1, @checkup, 1, 500.00, 500.00
    UNION ALL
    SELECT @inv_mar2, @surg2, 1, 3500.00, 3500.00
    UNION ALL
    SELECT @inv_mar2, @vaccine, 1, 800.00, 800.00
) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM invoice_items WHERE invoice_id = tmp.invoice_id AND service_id = tmp.service_id)
AND @inv_mar1 IS NOT NULL AND @inv_mar2 IS NOT NULL;

-- Add surgery items for Roberto
INSERT INTO invoice_items (invoice_id, service_id, quantity, unit_price, line_total)
SELECT invoice_id, service_id, quantity, unit_price, line_total FROM (
    SELECT @inv_rob1 as invoice_id, @surg1 as service_id, 1 as quantity, 5000.00 as unit_price, 5000.00 as line_total
    UNION ALL
    SELECT @inv_rob1, @checkup, 1, 500.00, 500.00
    UNION ALL
    SELECT @inv_rob1, @vaccine, 1, 800.00, 800.00
) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM invoice_items WHERE invoice_id = tmp.invoice_id AND service_id = tmp.service_id)
AND @inv_rob1 IS NOT NULL;

-- Add surgery items for Catherine
INSERT INTO invoice_items (invoice_id, service_id, quantity, unit_price, line_total)
SELECT invoice_id, service_id, quantity, unit_price, line_total FROM (
    SELECT @inv_cat1 as invoice_id, @surg1 as service_id, 1 as quantity, 5000.00 as unit_price, 5000.00 as line_total
    UNION ALL
    SELECT @inv_cat1, @surg2, 1, 3500.00, 3500.00
    UNION ALL
    SELECT @inv_cat2, @surg1, 1, 5000.00, 5000.00
) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM invoice_items WHERE invoice_id = tmp.invoice_id AND service_id = tmp.service_id)
AND @inv_cat1 IS NOT NULL AND @inv_cat2 IS NOT NULL;

-- Add surgery items for James
INSERT INTO invoice_items (invoice_id, service_id, quantity, unit_price, line_total)
SELECT invoice_id, service_id, quantity, unit_price, line_total FROM (
    SELECT @inv_jam1 as invoice_id, @surg1 as service_id, 1 as quantity, 5000.00 as unit_price, 5000.00 as line_total
) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM invoice_items WHERE invoice_id = tmp.invoice_id AND service_id = tmp.service_id)
AND @inv_jam1 IS NOT NULL;

-- Add surgery items for Patricia
INSERT INTO invoice_items (invoice_id, service_id, quantity, unit_price, line_total)
SELECT invoice_id, service_id, quantity, unit_price, line_total FROM (
    SELECT @inv_pat1 as invoice_id, @surg1 as service_id, 1 as quantity, 5000.00 as unit_price, 5000.00 as line_total
    UNION ALL
    SELECT @inv_pat1, @checkup, 1, 500.00, 500.00
    UNION ALL
    SELECT @inv_pat2, @surg2, 1, 3500.00, 3500.00
) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM invoice_items WHERE invoice_id = tmp.invoice_id AND service_id = tmp.service_id)
AND @inv_pat1 IS NOT NULL AND @inv_pat2 IS NOT NULL;

-- Verification query
SELECT 'More doctors added successfully!' as message;

-- Show the new doctors with their statistics
SELECT 
    CONCAT(COALESCE(e.first_name, ''), ' ', COALESCE(e.middle_name, ''), ' ', COALESCE(e.last_name, '')) as doctor,
    e.Position,
    COUNT(DISTINCT inv.patient_id) as patients,
    SUM(CASE WHEN inv.status = 'paid' THEN inv.total_amount ELSE 0 END) as revenue
FROM employees e
LEFT JOIN invoices inv ON inv.employee_id = e.employee_id
WHERE (e.Position LIKE '%Veterinarian%' OR e.system_role = 'Admin')
AND e.first_name IN ('Maricris', 'Roberto', 'Catherine', 'James', 'Patricia')
GROUP BY e.employee_id, e.first_name, e.middle_name, e.last_name, e.Position
ORDER BY revenue DESC;

