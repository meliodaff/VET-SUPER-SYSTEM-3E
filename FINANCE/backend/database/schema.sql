-- ============================================
-- Fur-Ever Care Database Schema
-- Database: fur_ever_care_db
-- ============================================

-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS fur_ever_care_db;
USE fur_ever_care_db;

-- ============================================
-- Admins Table
-- ============================================
CREATE TABLE IF NOT EXISTS admins (
    id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- Employees Table
-- ============================================
CREATE TABLE IF NOT EXISTS employees (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    role ENUM('admin', 'veterinarian', 'staff') NOT NULL,
    salary DECIMAL(10,2) DEFAULT NULL,
    hire_date DATE DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_role (role)
);

-- ============================================
-- Patients Table
-- ============================================
CREATE TABLE IF NOT EXISTS patients (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    owner_name VARCHAR(100) NOT NULL,
    species VARCHAR(50) DEFAULT NULL,
    breed VARCHAR(50) DEFAULT NULL,
    contact_phone VARCHAR(20) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_owner (owner_name)
);

-- ============================================
-- Services Table
-- ============================================
CREATE TABLE IF NOT EXISTS services (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT DEFAULT NULL,
    price DECIMAL(10,2) NOT NULL,
    category VARCHAR(50) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- Invoices Table
-- ============================================
CREATE TABLE IF NOT EXISTS invoices (
    id INT PRIMARY KEY AUTO_INCREMENT,
    patient_id INT DEFAULT NULL,
    employee_id INT DEFAULT NULL,
    invoice_number VARCHAR(50) UNIQUE DEFAULT NULL,
    invoice_date DATE NOT NULL,
    due_date DATE DEFAULT NULL,
    total_amount DECIMAL(10,2) DEFAULT 0.00,
    status ENUM('draft', 'pending', 'paid', 'overdue') DEFAULT 'draft',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_patient (patient_id),
    INDEX idx_employee (employee_id),
    INDEX idx_status (status),
    INDEX idx_invoice_date (invoice_date),
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE SET NULL,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE SET NULL
);

-- ============================================
-- Invoice Items Table
-- ============================================
CREATE TABLE IF NOT EXISTS invoice_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    invoice_id INT DEFAULT NULL,
    service_id INT DEFAULT NULL,
    quantity INT DEFAULT 1,
    unit_price DECIMAL(10,2) DEFAULT NULL,
    line_total DECIMAL(10,2) DEFAULT NULL,
    FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE,
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE SET NULL,
    INDEX idx_invoice (invoice_id),
    INDEX idx_service (service_id)
);

-- ============================================
-- Payments Table
-- ============================================
CREATE TABLE IF NOT EXISTS payments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    invoice_id INT DEFAULT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_date DATE NOT NULL,
    payment_method ENUM('cash', 'credit_card', 'debit_card', 'insurance', 'transfer') NOT NULL,
    reference_number VARCHAR(100) DEFAULT NULL,
    notes TEXT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_invoice (invoice_id),
    INDEX idx_payment_date (payment_date),
    FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE
);

-- ============================================
-- Inventory Table
-- ============================================
CREATE TABLE IF NOT EXISTS inventory (
    id INT PRIMARY KEY AUTO_INCREMENT,
    item VARCHAR(255) NOT NULL,
    qty INT DEFAULT 0,
    unitCost DECIMAL(10,2) DEFAULT 0.00,
    category VARCHAR(100) DEFAULT 'General',
    totalCost DECIMAL(12,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================
-- Sample Data - Employees
-- ============================================
INSERT INTO employees (username, password_hash, name, role, salary, hire_date) VALUES
('admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Dr. Sarah Johnson', 'admin', 75000.00, '2024-01-01'),
('vet001', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Dr. Michael Chen', 'veterinarian', 72000.00, '2024-01-15'),
('vet002', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Dr. Lisa Rodriguez', 'veterinarian', 68000.00, '2024-02-01'),
('staff001', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'John Smith', 'staff', 35000.00, '2024-01-10'),
('staff002', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Maria Garcia', 'staff', 40000.00, '2024-01-20');

-- ============================================
-- Sample Data - Patients
-- ============================================
INSERT INTO patients (name, owner_name, species, breed, contact_phone) VALUES
('Buddy', 'John Smith', 'Dog', 'Golden Retriever', '09123456789'),
('Whiskers', 'Mary Johnson', 'Cat', 'Persian', '09234567890'),
('Max', 'Robert Brown', 'Dog', 'German Shepherd', '09345678901'),
('Luna', 'Jennifer Davis', 'Cat', 'Siamese', '09456789012'),
('Charlie', 'William Miller', 'Dog', 'Beagle', '09567890123'),
('Mittens', 'Linda Garcia', 'Cat', 'Maine Coon', '09678901234'),
('Rocky', 'David Martinez', 'Dog', 'Bulldog', '09789012345'),
('Bella', 'Susan Anderson', 'Dog', 'Poodle', '09890123456'),
('Shadow', 'Michael Taylor', 'Cat', 'British Shorthair', '09901234567'),
('Daisy', 'Sarah Thomas', 'Dog', 'Labrador', '09012345678');

-- ============================================
-- Sample Data - Services
-- ============================================
INSERT INTO services (name, description, price, category) VALUES
('General Check-up', 'Routine health examination', 500.00, 'Consultation'),
('Vaccination', 'Annual vaccination', 800.00, 'Prevention'),
('Dental Cleaning', 'Professional teeth cleaning', 1200.00, 'Dental'),
('Surgery', 'Surgical procedure', 5000.00, 'Surgery'),
('X-Ray', 'Radiographic imaging', 1500.00, 'Imaging'),
('Blood Test', 'Complete blood count', 800.00, 'Laboratory'),
('Grooming', 'Full grooming service', 600.00, 'Grooming'),
('Emergency Treatment', 'Emergency care', 3000.00, 'Emergency');

-- ============================================
-- Sample Data - Invoices
-- ============================================
INSERT INTO invoices (patient_id, employee_id, invoice_number, invoice_date, due_date, total_amount, status) VALUES
(1, 2, 'INV-2024-001', '2024-01-15', '2024-01-30', 120.00, 'paid'),
(2, 3, 'INV-2024-002', '2024-01-16', '2024-01-31', 200.00, 'paid'),
(3, 2, 'INV-2024-003', '2024-01-17', '2024-02-01', 75.00, 'pending'),
(4, 3, 'INV-2024-004', '2024-01-18', '2024-02-02', 300.00, 'paid'),
(5, 2, 'INV-2024-005', '2024-01-19', '2024-02-03', 150.00, 'overdue'),
(6, 3, 'INV-2024-006', '2024-01-20', '2024-02-04', 500.00, 'paid'),
(7, 2, 'INV-2024-007', '2024-01-21', '2024-02-05', 250.00, 'pending'),
(8, 3, 'INV-2024-008', '2024-01-22', '2024-02-06', 180.00, 'paid'),
(9, 2, 'INV-2024-009', '2024-01-23', '2024-02-07', 200.00, 'paid'),
(10, 3, 'INV-2024-010', '2024-01-24', '2024-02-08', 60.00, 'pending');

-- ============================================
-- Sample Data - Invoice Items
-- ============================================
INSERT INTO invoice_items (invoice_id, service_id, quantity, unit_price, line_total) VALUES
(1, 1, 1, 500.00, 500.00),
(1, 2, 1, 800.00, 800.00),
(2, 3, 1, 1200.00, 1200.00),
(3, 1, 1, 500.00, 500.00),
(4, 4, 1, 5000.00, 5000.00),
(5, 5, 1, 1500.00, 1500.00),
(6, 6, 1, 800.00, 800.00),
(7, 7, 1, 600.00, 600.00),
(8, 8, 1, 3000.00, 3000.00),
(9, 1, 1, 500.00, 500.00),
(10, 2, 1, 800.00, 800.00);

-- ============================================
-- Sample Data - Payments
-- ============================================
INSERT INTO payments (invoice_id, amount, payment_date, payment_method, reference_number) VALUES
(1, 120.00, '2024-01-15', 'credit_card', 'CC-2024-001'),
(2, 200.00, '2024-01-16', 'cash', 'CASH-2024-002'),
(4, 300.00, '2024-01-18', 'insurance', 'INS-2024-004'),
(5, 75.00, '2024-01-19', 'debit_card', 'DC-2024-005'),
(6, 500.00, '2024-01-20', 'cash', 'CASH-2024-006'),
(7, 250.00, '2024-01-21', 'credit_card', 'CC-2024-007'),
(8, 180.00, '2024-01-22', 'transfer', 'TRF-2024-008'),
(9, 200.00, '2024-01-23', 'transfer', 'TRF-2024-009');

-- ============================================
-- Sample Data - Inventory
-- ============================================
INSERT INTO inventory (item, qty, unitCost, category, totalCost) VALUES
('Vaccines', 120, 250.00, 'Medical', 30000.00),
('Antibiotics', 80, 150.00, 'Medical', 12000.00),
('Surgical Instruments', 50, 500.00, 'Medical', 25000.00),
('Pet Food Premium', 200, 25.00, 'Food', 5000.00),
('Cat Litter', 150, 15.00, 'Supplies', 2250.00),
('Grooming Supplies', 100, 30.00, 'Grooming', 3000.00),
('X-Ray Film', 50, 20.00, 'Imaging', 1000.00),
('Lab Test Kits', 60, 100.00, 'Laboratory', 6000.00);

-- ============================================
-- End of Schema
-- ============================================
