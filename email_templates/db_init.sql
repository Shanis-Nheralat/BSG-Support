-- Create users table if not exists
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    role ENUM('admin', 'hr', 'marketing', 'support', 'editor', 'author', 'user') NOT NULL,
    avatar VARCHAR(255),
    status ENUM('active', 'inactive') DEFAULT 'active',
    remember_token VARCHAR(255),
    token_expiry DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP
);

-- Create roles table if not exists
CREATE TABLE IF NOT EXISTS roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP
);

-- Create permissions table if not exists
CREATE TABLE IF NOT EXISTS permissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create role_permissions table if not exists
CREATE TABLE IF NOT EXISTS role_permissions (
    role_id INT NOT NULL,
    permission_id INT NOT NULL,
    PRIMARY KEY (role_id, permission_id),
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
);

-- Create password_resets table if not exists
CREATE TABLE IF NOT EXISTS password_resets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL,
    token VARCHAR(255) NOT NULL,
    expires_at DATETIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX (email, token)
);

-- Create admin_activity_log table if not exists
CREATE TABLE IF NOT EXISTS admin_activity_log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    username VARCHAR(50),
    action_type VARCHAR(30) NOT NULL,
    resource VARCHAR(50),
    resource_id INT,
    details TEXT,
    ip_address VARCHAR(45),
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX (user_id, action_type)
);

-- Create admin_page_views table if not exists
CREATE TABLE IF NOT EXISTS admin_page_views (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    username VARCHAR(50),
    page_name VARCHAR(100),
    ip_address VARCHAR(45),
    user_agent TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX (user_id, page_name)
);

-- Insert default admin user if not exists
INSERT INTO users (username, password, email, name, role, status, created_at)
SELECT 'shanisbsg', '$2y$10$UIUNJk9jmZH3jm7FlACULe0FNwqcJ.zXCiZlXZcnLWFnKc5G5XKDe', 'shanis@backsureglobalsupport.com', 'Shanis BSG', 'admin', 'active', NOW()
WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'shanisbsg')
LIMIT 1;

-- Insert default roles
INSERT INTO roles (name, description)
VALUES
('admin', 'Full system access'),
('hr', 'Human resources access'),
('marketing', 'Marketing content access'),
('support', 'Customer support access'),
('editor', 'Content editor access'),
('author', 'Content author access'),
('user', 'Basic user access')
ON DUPLICATE KEY UPDATE description = VALUES(description);

-- Insert default permissions
INSERT INTO permissions (name, description)
VALUES
('manage_users', 'Create, update, and delete users'),
('view_dashboard', 'View admin dashboard'),
('manage_content', 'Create, update, and delete content'),
('manage_settings', 'Update system settings'),
('view_reports', 'View system reports'),
('manage_hr', 'Manage HR content and applications'),
('manage_marketing', 'Manage marketing content and campaigns'),
('manage_support', 'Manage support tickets and inquiries')
ON DUPLICATE KEY UPDATE description = VALUES(description);

-- Assign permissions to roles
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.name = 'admin' AND p.name IN ('manage_users', 'view_dashboard', 'manage_content', 'manage_settings', 'view_reports', 'manage_hr', 'manage_marketing', 'manage_support')
ON DUPLICATE KEY UPDATE role_id = role_id;

INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.name = 'hr' AND p.name IN ('view_dashboard', 'manage_hr', 'view_reports')
ON DUPLICATE KEY UPDATE role_id = role_id;

INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.name = 'marketing' AND p.name IN ('view_dashboard', 'manage_marketing', 'view_reports')
ON DUPLICATE KEY UPDATE role_id = role_id;

INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.name = 'support' AND p.name IN ('view_dashboard', 'manage_support', 'view_reports')
ON DUPLICATE KEY UPDATE role_id = role_id;
