-- ============================================
-- Add Sample Data for Doctor Dashboard (Philippines)
-- This script adds sample invoices and invoice items
-- to populate doctor statistics and surgery fees
-- All data is Philippines-specific
-- ============================================

USE fur_ever_care_db;

-- First, ensure we have some veterinarians in the employees table
-- Using Philippines-specific names and data
-- Note: employee_id is auto-increment, so we don't specify it
-- We'll check by name and position to avoid duplicates
INSERT INTO employees (
    first_name, middle_name, last_name, 
    Position, department, rate, employment_type,
    contact_email, phone_number, address, system_role, hire_date
)
SELECT * FROM (
    SELECT 
        'Maria' as first_name,
        'Cruz' as middle_name,
        'Santos' as last_name,
        'Veterinarian' as Position,
        'Vet Clinic' as department,
        50000.00 as rate,
        'Active Full-Time' as employment_type,
        'maria.santos@furevercare.ph' as contact_email,
        '09171234567' as phone_number,
        '123 Rizal Street, Quezon City, Metro Manila' as address,
        'Admin' as system_role,
        '2024-01-15' as hire_date
    UNION ALL
    SELECT 
        'Juan',
        'Dela',
        'Cruz',
        'Veterinarian',
        'Vet Clinic',
        48000.00,
        'Active Full-Time',
        'juan.delacruz@furevercare.ph',
        '09182345678',
        '456 EDSA, Mandaluyong City, Metro Manila',
        'Employee',
        '2024-02-01'
    UNION ALL
    SELECT 
        'Ana',
        'Reyes',
        'Garcia',
        'Senior Veterinarian',
        'Vet Clinic',
        55000.00,
        'Active Full-Time',
        'ana.garcia@furevercare.ph',
        '09193456789',
        '789 Ayala Avenue, Makati City, Metro Manila',
        'Employee',
        '2024-03-01'
) AS tmp
WHERE NOT EXISTS (
    SELECT 1 FROM employees 
    WHERE first_name = tmp.first_name 
    AND last_name = tmp.last_name 
    AND Position = tmp.Position
);

-- Ensure we have patients with Philippines-specific data
INSERT INTO patients (name, owner_name, species, breed, contact_phone)
SELECT * FROM (
    SELECT 'Buddy' as name, 'Roberto Santos' as owner_name, 'Dog' as species, 'Aspin' as breed, '09171111111' as contact_phone
    UNION ALL
    SELECT 'Mingming', 'Maria Lopez', 'Cat', 'Persian', '09182222222'
    UNION ALL
    SELECT 'Max', 'Jose Reyes', 'Dog', 'German Shepherd', '09193333333'
    UNION ALL
    SELECT 'Luna', 'Cristina Torres', 'Cat', 'Siamese', '09204444444'
    UNION ALL
    SELECT 'Charlie', 'Carlos Mendoza', 'Dog', 'Beagle', '09215555555'
    UNION ALL
    SELECT 'Mittens', 'Lourdes Fernandez', 'Cat', 'Maine Coon', '09226666666'
    UNION ALL
    SELECT 'Rocky', 'Antonio Villanueva', 'Dog', 'Bulldog', '09237777777'
    UNION ALL
    SELECT 'Bella', 'Patricia Ramos', 'Dog', 'Poodle', '09248888888'
    UNION ALL
    SELECT 'Shadow', 'Michael Ocampo', 'Cat', 'British Shorthair', '09259999999'
    UNION ALL
    SELECT 'Daisy', 'Sarah Bautista', 'Dog', 'Labrador', '09260000000'
) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM patients WHERE name = tmp.name AND owner_name = tmp.owner_name);

-- Ensure we have Surgery services with Philippines pricing (in PHP)
INSERT INTO services (name, description, price, category)
SELECT * FROM (
    SELECT 'Surgery' as name, 'General surgical procedure' as description, 5000.00 as price, 'Surgery' as category
    UNION ALL
    SELECT 'Spay Surgery', 'Spay/neuter procedure for female pets', 3500.00, 'Surgery'
    UNION ALL
    SELECT 'Neuter Surgery', 'Neuter procedure for male pets', 3000.00, 'Surgery'
    UNION ALL
    SELECT 'Emergency Surgery', 'Emergency surgical procedure', 8000.00, 'Surgery'
    UNION ALL
    SELECT 'Dental Surgery', 'Dental surgical procedure', 4000.00, 'Surgery'
) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM services WHERE name = tmp.name AND category = 'Surgery');

-- Also ensure we have other services
INSERT INTO services (name, description, price, category)
SELECT * FROM (
    SELECT 'General Check-up' as name, 'Routine health examination' as description, 500.00 as price, 'Consultation' as category
    UNION ALL
    SELECT 'Vaccination', 'Annual vaccination', 800.00, 'Prevention'
    UNION ALL
    SELECT 'Dental Cleaning', 'Professional teeth cleaning', 1200.00, 'Dental'
) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM services WHERE name = tmp.name AND category = tmp.category);

-- Get employee IDs for veterinarians (using employee_id as primary key)
-- First try to get the ones we just inserted by name
SET @vet1_id = (SELECT employee_id FROM employees WHERE first_name = 'Maria' AND last_name = 'Santos' AND Position = 'Veterinarian' LIMIT 1);
SET @vet2_id = (SELECT employee_id FROM employees WHERE first_name = 'Juan' AND last_name = 'Cruz' AND Position = 'Veterinarian' LIMIT 1);
SET @vet3_id = (SELECT employee_id FROM employees WHERE first_name = 'Ana' AND last_name = 'Garcia' AND Position = 'Senior Veterinarian' LIMIT 1);

-- If still null, try to get by Position (any existing veterinarians)
SET @vet1_id = IFNULL(@vet1_id, (SELECT employee_id FROM employees WHERE (Position LIKE '%Veterinarian%' OR system_role = 'Admin') LIMIT 1));
SET @vet2_id = IFNULL(@vet2_id, (SELECT employee_id FROM employees WHERE (Position LIKE '%Veterinarian%' OR system_role = 'Employee') AND (@vet1_id IS NULL OR employee_id != @vet1_id) ORDER BY employee_id LIMIT 1));
SET @vet3_id = IFNULL(@vet3_id, (SELECT employee_id FROM employees WHERE (Position LIKE '%Veterinarian%' OR system_role = 'Employee') AND (@vet1_id IS NULL OR employee_id != @vet1_id) AND (@vet2_id IS NULL OR employee_id != @vet2_id) ORDER BY employee_id LIMIT 1));

-- If we don't have 3 vets, use the first one for all
SET @vet2_id = IFNULL(@vet2_id, @vet1_id);
SET @vet3_id = IFNULL(@vet3_id, @vet1_id);

-- Get patient IDs
SET @patient1_id = (SELECT id FROM patients LIMIT 1);
SET @patient2_id = (SELECT id FROM patients ORDER BY id LIMIT 1 OFFSET 1);
SET @patient3_id = (SELECT id FROM patients ORDER BY id LIMIT 1 OFFSET 2);
SET @patient4_id = (SELECT id FROM patients ORDER BY id LIMIT 1 OFFSET 3);
SET @patient5_id = (SELECT id FROM patients ORDER BY id LIMIT 1 OFFSET 4);
SET @patient6_id = (SELECT id FROM patients ORDER BY id LIMIT 1 OFFSET 5);

-- Get surgery service IDs
SET @surgery1_id = (SELECT id FROM services WHERE category = 'Surgery' AND name = 'Surgery' LIMIT 1);
SET @surgery2_id = (SELECT id FROM services WHERE category = 'Surgery' AND name = 'Spay Surgery' LIMIT 1);
SET @surgery3_id = (SELECT id FROM services WHERE category = 'Surgery' AND name = 'Neuter Surgery' LIMIT 1);
SET @surgery4_id = (SELECT id FROM services WHERE category = 'Surgery' AND name = 'Emergency Surgery' LIMIT 1);

-- Add sample invoices with different statuses for doctor statistics
-- Doctor 1 invoices (paid - will show in statistics)
INSERT INTO invoices (patient_id, employee_id, invoice_number, invoice_date, due_date, total_amount, status)
SELECT patient_id, employee_id, invoice_number, invoice_date, due_date, total_amount, status FROM (
    SELECT @patient1_id as patient_id, @vet1_id as employee_id, CONCAT('INV-', YEAR(CURDATE()), '-', LPAD(1, 4, '0')) as invoice_number, DATE_SUB(CURDATE(), INTERVAL 30 DAY) as invoice_date, DATE_SUB(CURDATE(), INTERVAL 15 DAY) as due_date, 5500.00 as total_amount, 'paid' as status
    UNION ALL
    SELECT @patient2_id as patient_id, @vet1_id as employee_id, CONCAT('INV-', YEAR(CURDATE()), '-', LPAD(2, 4, '0')) as invoice_number, DATE_SUB(CURDATE(), INTERVAL 25 DAY) as invoice_date, DATE_SUB(CURDATE(), INTERVAL 10 DAY) as due_date, 3500.00 as total_amount, 'paid' as status
    UNION ALL
    SELECT @patient3_id as patient_id, @vet1_id as employee_id, CONCAT('INV-', YEAR(CURDATE()), '-', LPAD(3, 4, '0')) as invoice_number, DATE_SUB(CURDATE(), INTERVAL 20 DAY) as invoice_date, DATE_SUB(CURDATE(), INTERVAL 5 DAY) as due_date, 3000.00 as total_amount, 'paid' as status
    UNION ALL
    SELECT @patient4_id as patient_id, @vet1_id as employee_id, CONCAT('INV-', YEAR(CURDATE()), '-', LPAD(4, 4, '0')) as invoice_number, DATE_SUB(CURDATE(), INTERVAL 15 DAY) as invoice_date, CURDATE() as due_date, 500.00 as total_amount, 'paid' as status
    UNION ALL
    SELECT @patient5_id as patient_id, @vet1_id as employee_id, CONCAT('INV-', YEAR(CURDATE()), '-', LPAD(5, 4, '0')) as invoice_number, DATE_SUB(CURDATE(), INTERVAL 10 DAY) as invoice_date, DATE_ADD(CURDATE(), INTERVAL 5 DAY) as due_date, 800.00 as total_amount, 'paid' as status
) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM invoices WHERE invoice_number = tmp.invoice_number)
AND @vet1_id IS NOT NULL
LIMIT 5;

-- Doctor 2 invoices
INSERT INTO invoices (patient_id, employee_id, invoice_number, invoice_date, due_date, total_amount, status)
SELECT patient_id, employee_id, invoice_number, invoice_date, due_date, total_amount, status FROM (
    SELECT @patient2_id as patient_id, @vet2_id as employee_id, CONCAT('INV-', YEAR(CURDATE()), '-', LPAD(6, 4, '0')) as invoice_number, DATE_SUB(CURDATE(), INTERVAL 28 DAY) as invoice_date, DATE_SUB(CURDATE(), INTERVAL 13 DAY) as due_date, 8000.00 as total_amount, 'paid' as status
    UNION ALL
    SELECT @patient3_id as patient_id, @vet2_id as employee_id, CONCAT('INV-', YEAR(CURDATE()), '-', LPAD(7, 4, '0')) as invoice_number, DATE_SUB(CURDATE(), INTERVAL 22 DAY) as invoice_date, DATE_SUB(CURDATE(), INTERVAL 7 DAY) as due_date, 3500.00 as total_amount, 'paid' as status
    UNION ALL
    SELECT @patient4_id as patient_id, @vet2_id as employee_id, CONCAT('INV-', YEAR(CURDATE()), '-', LPAD(8, 4, '0')) as invoice_number, DATE_SUB(CURDATE(), INTERVAL 18 DAY) as invoice_date, DATE_SUB(CURDATE(), INTERVAL 3 DAY) as due_date, 5000.00 as total_amount, 'paid' as status
    UNION ALL
    SELECT @patient5_id as patient_id, @vet2_id as employee_id, CONCAT('INV-', YEAR(CURDATE()), '-', LPAD(9, 4, '0')) as invoice_number, DATE_SUB(CURDATE(), INTERVAL 12 DAY) as invoice_date, DATE_ADD(CURDATE(), INTERVAL 3 DAY) as due_date, 3000.00 as total_amount, 'paid' as status
) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM invoices WHERE invoice_number = tmp.invoice_number)
AND @vet2_id IS NOT NULL
LIMIT 4;

-- Doctor 3 invoices
INSERT INTO invoices (patient_id, employee_id, invoice_number, invoice_date, due_date, total_amount, status)
SELECT patient_id, employee_id, invoice_number, invoice_date, due_date, total_amount, status FROM (
    SELECT @patient1_id as patient_id, @vet3_id as employee_id, CONCAT('INV-', YEAR(CURDATE()), '-', LPAD(10, 4, '0')) as invoice_number, DATE_SUB(CURDATE(), INTERVAL 24 DAY) as invoice_date, DATE_SUB(CURDATE(), INTERVAL 9 DAY) as due_date, 5000.00 as total_amount, 'paid' as status
    UNION ALL
    SELECT @patient6_id as patient_id, @vet3_id as employee_id, CONCAT('INV-', YEAR(CURDATE()), '-', LPAD(11, 4, '0')) as invoice_number, DATE_SUB(CURDATE(), INTERVAL 16 DAY) as invoice_date, DATE_SUB(CURDATE(), INTERVAL 1 DAY) as due_date, 3500.00 as total_amount, 'paid' as status
    UNION ALL
    SELECT @patient2_id as patient_id, @vet3_id as employee_id, CONCAT('INV-', YEAR(CURDATE()), '-', LPAD(12, 4, '0')) as invoice_number, DATE_SUB(CURDATE(), INTERVAL 8 DAY) as invoice_date, DATE_ADD(CURDATE(), INTERVAL 7 DAY) as due_date, 3000.00 as total_amount, 'paid' as status
) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM invoices WHERE invoice_number = tmp.invoice_number)
AND @vet3_id IS NOT NULL
LIMIT 3;

-- Add invoice items with surgery services for doctor surgery fees
-- Get invoice IDs for paid invoices
SET @inv1_id = (SELECT id FROM invoices WHERE employee_id = @vet1_id AND status = 'paid' ORDER BY id LIMIT 1);
SET @inv2_id = (SELECT id FROM invoices WHERE employee_id = @vet1_id AND status = 'paid' ORDER BY id LIMIT 1 OFFSET 1);
SET @inv3_id = (SELECT id FROM invoices WHERE employee_id = @vet2_id AND status = 'paid' ORDER BY id LIMIT 1);
SET @inv4_id = (SELECT id FROM invoices WHERE employee_id = @vet2_id AND status = 'paid' ORDER BY id LIMIT 1 OFFSET 1);
SET @inv5_id = (SELECT id FROM invoices WHERE employee_id = @vet3_id AND status = 'paid' ORDER BY id LIMIT 1);

-- Add surgery invoice items for Doctor 1
INSERT INTO invoice_items (invoice_id, service_id, quantity, unit_price, line_total)
SELECT invoice_id, service_id, quantity, unit_price, line_total FROM (
    SELECT @inv1_id as invoice_id, @surgery1_id as service_id, 1 as quantity, 5000.00 as unit_price, 5000.00 as line_total
    UNION ALL
    SELECT @inv2_id as invoice_id, @surgery2_id as service_id, 1 as quantity, 3500.00 as unit_price, 3500.00 as line_total
    UNION ALL
    SELECT @inv2_id as invoice_id, @surgery3_id as service_id, 1 as quantity, 3000.00 as unit_price, 3000.00 as line_total
) AS tmp
WHERE NOT EXISTS (
    SELECT 1 FROM invoice_items 
    WHERE invoice_id = tmp.invoice_id 
    AND service_id = tmp.service_id
)
AND @inv1_id IS NOT NULL AND @inv2_id IS NOT NULL AND @surgery1_id IS NOT NULL;

-- Add surgery invoice items for Doctor 2
INSERT INTO invoice_items (invoice_id, service_id, quantity, unit_price, line_total)
SELECT invoice_id, service_id, quantity, unit_price, line_total FROM (
    SELECT @inv3_id as invoice_id, @surgery1_id as service_id, 1 as quantity, 5000.00 as unit_price, 5000.00 as line_total
    UNION ALL
    SELECT @inv3_id as invoice_id, @surgery2_id as service_id, 1 as quantity, 3500.00 as unit_price, 3500.00 as line_total
    UNION ALL
    SELECT @inv4_id as invoice_id, @surgery1_id as service_id, 1 as quantity, 5000.00 as unit_price, 5000.00 as line_total
) AS tmp
WHERE NOT EXISTS (
    SELECT 1 FROM invoice_items 
    WHERE invoice_id = tmp.invoice_id 
    AND service_id = tmp.service_id
)
AND @inv3_id IS NOT NULL AND @inv4_id IS NOT NULL AND @surgery1_id IS NOT NULL;

-- Add surgery invoice items for Doctor 3
INSERT INTO invoice_items (invoice_id, service_id, quantity, unit_price, line_total)
SELECT invoice_id, service_id, quantity, unit_price, line_total FROM (
    SELECT @inv5_id as invoice_id, @surgery1_id as service_id, 1 as quantity, 5000.00 as unit_price, 5000.00 as line_total
    UNION ALL
    SELECT @inv5_id as invoice_id, @surgery3_id as service_id, 1 as quantity, 3000.00 as unit_price, 3000.00 as line_total
) AS tmp
WHERE NOT EXISTS (
    SELECT 1 FROM invoice_items 
    WHERE invoice_id = tmp.invoice_id 
    AND service_id = tmp.service_id
)
AND @inv5_id IS NOT NULL AND @surgery1_id IS NOT NULL;

-- Also add some non-surgery services to invoices for complete data
-- Get non-surgery service IDs
SET @checkup_id = (SELECT id FROM services WHERE category != 'Surgery' AND name = 'General Check-up' LIMIT 1);
SET @vaccine_id = (SELECT id FROM services WHERE category != 'Surgery' AND name = 'Vaccination' LIMIT 1);

-- Add non-surgery items to some invoices
INSERT INTO invoice_items (invoice_id, service_id, quantity, unit_price, line_total)
SELECT invoice_id, service_id, quantity, unit_price, line_total FROM (
    SELECT @inv1_id as invoice_id, @checkup_id as service_id, 1 as quantity, 500.00 as unit_price, 500.00 as line_total
    UNION ALL
    SELECT @inv3_id as invoice_id, @vaccine_id as service_id, 1 as quantity, 800.00 as unit_price, 800.00 as line_total
) AS tmp
WHERE NOT EXISTS (
    SELECT 1 FROM invoice_items 
    WHERE invoice_id = tmp.invoice_id 
    AND service_id = tmp.service_id
)
AND @checkup_id IS NOT NULL AND @vaccine_id IS NOT NULL;

-- Verification queries
SELECT 'Sample data added successfully!' as message;

-- Show doctor statistics
SELECT 
    CONCAT(COALESCE(e.first_name, ''), ' ', COALESCE(e.middle_name, ''), ' ', COALESCE(e.last_name, '')) as doctor,
    COUNT(DISTINCT inv.patient_id) as patients,
    SUM(CASE WHEN inv.status = 'paid' THEN inv.total_amount ELSE 0 END) as revenue
FROM employees e
LEFT JOIN invoices inv ON inv.employee_id = e.employee_id
WHERE (e.Position LIKE '%Veterinarian%' OR e.system_role = 'Admin')
GROUP BY e.employee_id, e.first_name, e.middle_name, e.last_name;

-- Show surgery fees
SELECT 
    CONCAT(COALESCE(e.first_name, ''), ' ', COALESCE(e.middle_name, ''), ' ', COALESCE(e.last_name, '')) as doctor,
    COUNT(ii.id) as surgeries,
    SUM(ii.line_total) as total_fees
FROM employees e
JOIN invoices inv ON inv.employee_id = e.employee_id
JOIN invoice_items ii ON ii.invoice_id = inv.id
JOIN services s ON ii.service_id = s.id
WHERE s.category = 'Surgery' AND inv.status = 'paid'
GROUP BY e.employee_id, e.first_name, e.middle_name, e.last_name;
