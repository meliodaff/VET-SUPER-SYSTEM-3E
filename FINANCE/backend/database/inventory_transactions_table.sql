-- ============================================
-- Inventory Transactions Table
-- ============================================
CREATE TABLE IF NOT EXISTS inventory_transactions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    transaction_number VARCHAR(50) UNIQUE NOT NULL,
    inventory_id INT DEFAULT NULL,
    product_name VARCHAR(255) NOT NULL,
    transaction_type ENUM('IN', 'OUT', 'ADJUSTMENT') NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    performed_by VARCHAR(100) DEFAULT NULL,
    notes TEXT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_inventory (inventory_id),
    INDEX idx_transaction_type (transaction_type),
    INDEX idx_created_at (created_at),
    FOREIGN KEY (inventory_id) REFERENCES inventory(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Sample transactions data
INSERT INTO inventory_transactions (transaction_number, inventory_id, product_name, transaction_type, quantity, unit_price, total_amount, performed_by, created_at) VALUES
('TXN-4949', NULL, 'Shampoo', 'OUT', 8, 60.00, 480.00, 'Nurse', '2025-09-19 16:47:40'),
('TXN-1416', NULL, 'Syringes', 'ADJUSTMENT', 4, 12.00, 48.00, 'Dr. Mark Bautista', '2025-09-19 10:48:40'),
('TXN-7469', NULL, 'Syringes', 'OUT', 7, 12.00, 84.00, 'Dr. Elena Garcia', '2025-09-19 05:22:40'),
('TXN-5823', NULL, 'Syringes', 'IN', 95, 12.00, 1140.00, 'Dr. Maria Santos', '2025-09-16 08:13:40'),
('TXN-6950', NULL, 'Syringes', 'OUT', 6, 12.00, 72.00, 'Dr. Juan Dela Cruz', '2025-09-14 21:53:40'),
('TXN-1234', NULL, 'Cat Food', 'IN', 50, 250.00, 12500.00, 'Dr. Maria Santos', '2025-10-01 10:00:00'),
('TXN-5678', NULL, 'Dog Food', 'IN', 30, 180.00, 5400.00, 'Dr. Juan Dela Cruz', '2025-10-02 14:30:00'),
('TXN-9012', NULL, 'Cat Food', 'OUT', 5, 250.00, 1250.00, 'Nurse', '2025-10-03 09:15:00'),
('TXN-3456', NULL, 'Bandages', 'IN', 100, 15.00, 1500.00, 'Dr. Elena Garcia', '2025-10-04 11:20:00'),
('TXN-7890', NULL, 'Bandages', 'OUT', 12, 15.00, 180.00, 'Nurse', '2025-10-04 15:45:00');

