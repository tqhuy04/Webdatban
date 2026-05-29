-- Fix: Các cột trong bảng customers phải cho phép NULL
-- Chạy lệnh này trong MySQL (phpMyAdmin hoặc MySQL CLI)

-- 1. Cho phép account_id NULL (khách vãng lai không cần tài khoản)
ALTER TABLE customers MODIFY COLUMN account_id INT NULL;

-- 2. Cho phép address NULL (khách có thể không cung cấp địa chỉ)
ALTER TABLE customers MODIFY COLUMN address VARCHAR(255) NULL;
