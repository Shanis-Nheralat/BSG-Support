-- Consolidated Database Init Script for Backsure Global Support (Local Dev)
-- Run order matters due to foreign key constraints.

-- 1. Core users table (from email_templates/db_init.sql - most complete version)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    role ENUM('admin', 'hr', 'marketing', 'support', 'editor', 'author', 'user') NOT NULL DEFAULT 'user',
    avatar VARCHAR(255),
    status ENUM('active', 'inactive', 'pending', 'blocked') DEFAULT 'active',
    verification_token VARCHAR(100) DEFAULT NULL,
    email_verified_at DATETIME DEFAULT NULL,
    remember_token VARCHAR(255),
    token_expiry DATETIME,
    login_attempts INT NOT NULL DEFAULT 0,
    last_attempt_time DATETIME DEFAULT NULL,
    last_login DATETIME DEFAULT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Admin users table
CREATE TABLE IF NOT EXISTS admin_users (
    id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'admin',
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    login_attempts INT(11) NOT NULL DEFAULT 0,
    last_attempt_time DATETIME DEFAULT NULL,
    last_login DATETIME DEFAULT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY admin_users_email_unique (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. User metadata
CREATE TABLE IF NOT EXISTS user_meta (
    id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    meta_key VARCHAR(50) NOT NULL,
    meta_value TEXT DEFAULT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY user_meta_user_id_foreign (user_id),
    KEY user_meta_meta_key_index (meta_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Roles
CREATE TABLE IF NOT EXISTS roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    slug VARCHAR(50) DEFAULT NULL,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Permissions
CREATE TABLE IF NOT EXISTS permissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    slug VARCHAR(50) DEFAULT NULL,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Role permissions pivot
CREATE TABLE IF NOT EXISTS role_permissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    role_id INT NOT NULL,
    permission_id INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY role_perm_unique (role_id, permission_id),
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Password resets
CREATE TABLE IF NOT EXISTS password_resets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL,
    token VARCHAR(255) NOT NULL,
    expires_at DATETIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX (email, token)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Activity logs
CREATE TABLE IF NOT EXISTS activity_logs (
    id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id INT DEFAULT NULL,
    action VARCHAR(50) NOT NULL,
    ip_address VARCHAR(45) NOT NULL,
    user_agent TEXT DEFAULT NULL,
    details TEXT DEFAULT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY activity_logs_user_id_index (user_id),
    KEY activity_logs_action_index (action)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Admin activity log
CREATE TABLE IF NOT EXISTS admin_activity_log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    username VARCHAR(50),
    action_type VARCHAR(30) NOT NULL DEFAULT '',
    action VARCHAR(255) DEFAULT NULL,
    page VARCHAR(255) DEFAULT NULL,
    resource VARCHAR(50),
    resource_id INT,
    details TEXT,
    ip_address VARCHAR(45),
    user_agent TEXT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX (user_id, action_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. Admin page views
CREATE TABLE IF NOT EXISTS admin_page_views (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    username VARCHAR(50),
    page_name VARCHAR(100),
    ip_address VARCHAR(45),
    user_agent TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX (user_id, page_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. Login logs
CREATE TABLE IF NOT EXISTS login_logs (
    id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id INT DEFAULT NULL,
    email VARCHAR(255) DEFAULT NULL,
    ip_address VARCHAR(45) NOT NULL,
    user_agent TEXT DEFAULT NULL,
    action VARCHAR(20) DEFAULT 'login',
    success TINYINT(1) NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 12. Remember tokens
CREATE TABLE IF NOT EXISTS remember_tokens (
    id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    selector VARCHAR(255) NOT NULL,
    token VARCHAR(255) NOT NULL,
    expires DATETIME NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY (selector)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 13. Settings
CREATE TABLE IF NOT EXISTS settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_group VARCHAR(100) NOT NULL,
    setting_key VARCHAR(100) NOT NULL,
    setting_value TEXT,
    type ENUM('text', 'textarea', 'boolean', 'image', 'json', 'file') DEFAULT 'text',
    autoload BOOLEAN DEFAULT 1,
    updated_by INT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY group_key (setting_group, setting_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 14. Chat sessions
CREATE TABLE IF NOT EXISTS chat_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    session_id VARCHAR(50) NOT NULL,
    visitor_ip VARCHAR(45),
    visitor_info TEXT,
    started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_activity DATETIME DEFAULT CURRENT_TIMESTAMP,
    status ENUM('active', 'closed', 'transferred') DEFAULT 'active',
    INDEX (session_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 15. Chat logs
CREATE TABLE IF NOT EXISTS chat_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    session_id VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    sender ENUM('visitor', 'bot', 'agent') NOT NULL,
    agent_id INT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX (session_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 16. Candidates
CREATE TABLE IF NOT EXISTS candidates (
    id INT(11) NOT NULL AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    position VARCHAR(100) NOT NULL,
    resume_path VARCHAR(255) NOT NULL,
    status ENUM('New', 'Under Review', 'Shortlisted', 'Interviewed', 'Offered', 'Hired', 'Rejected') NOT NULL DEFAULT 'New',
    submitted_at DATETIME NOT NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    notes TEXT,
    PRIMARY KEY (id),
    KEY idx_email (email),
    KEY idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 17. Inquiries
CREATE TABLE IF NOT EXISTS inquiries (
    id INT(11) NOT NULL AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20) DEFAULT NULL,
    company VARCHAR(100) DEFAULT NULL,
    form_type ENUM('general_inquiry', 'meeting_request', 'service_intake') NOT NULL,
    message TEXT NOT NULL,
    status ENUM('New', 'In Progress', 'Replied', 'Closed') NOT NULL DEFAULT 'New',
    submitted_at DATETIME NOT NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    services VARCHAR(255) DEFAULT NULL,
    meeting_date DATE DEFAULT NULL,
    meeting_time VARCHAR(20) DEFAULT NULL,
    timezone VARCHAR(20) DEFAULT NULL,
    service_type VARCHAR(100) DEFAULT NULL,
    business_industry VARCHAR(100) DEFAULT NULL,
    implementation_timeline VARCHAR(50) DEFAULT NULL,
    requirements TEXT DEFAULT NULL,
    additional_comments TEXT DEFAULT NULL,
    admin_notes TEXT DEFAULT NULL,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 18. Solutions
CREATE TABLE IF NOT EXISTS solutions (
    id INT(11) NOT NULL AUTO_INCREMENT,
    solution_id VARCHAR(50) NOT NULL,
    hero_title TEXT NOT NULL,
    hero_description TEXT NOT NULL,
    hero_image_url VARCHAR(255) NOT NULL,
    intro_text TEXT NOT NULL,
    feature1_title TEXT NOT NULL,
    feature1_description TEXT NOT NULL,
    feature1_image_url VARCHAR(255) NOT NULL,
    feature2_title TEXT NOT NULL,
    feature2_features TEXT NOT NULL,
    feature2_image_url VARCHAR(255) NOT NULL,
    feature3_title TEXT NOT NULL,
    feature3_features TEXT NOT NULL,
    feature3_image_url VARCHAR(255) NOT NULL,
    summary_title TEXT NOT NULL,
    summary_text TEXT NOT NULL,
    cta_title TEXT NOT NULL,
    cta_text TEXT NOT NULL,
    cta_button1_text VARCHAR(100) NOT NULL,
    cta_button1_link VARCHAR(255) NOT NULL,
    cta_button2_text VARCHAR(100) NOT NULL,
    cta_button2_link VARCHAR(255) NOT NULL,
    date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY solution_id (solution_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 19. Services
CREATE TABLE IF NOT EXISTS services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    icon VARCHAR(100) DEFAULT NULL,
    status ENUM('active', 'inactive') DEFAULT 'active',
    sort_order INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 20. Blog categories
CREATE TABLE IF NOT EXISTS blog_categories (
    id INT(11) NOT NULL AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL,
    description TEXT DEFAULT NULL,
    parent_id INT(11) DEFAULT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 21. Blog posts
CREATE TABLE IF NOT EXISTS blog_posts (
    id INT(11) NOT NULL AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    excerpt TEXT DEFAULT NULL,
    content LONGTEXT NOT NULL,
    image_path VARCHAR(255) DEFAULT NULL,
    featured TINYINT(1) NOT NULL DEFAULT 0,
    status ENUM('draft','pending','published','archived') NOT NULL DEFAULT 'draft',
    published_at DATETIME DEFAULT NULL,
    category_id INT(11) DEFAULT NULL,
    author_id INT DEFAULT NULL,
    views INT(11) NOT NULL DEFAULT 0,
    meta_title VARCHAR(255) DEFAULT NULL,
    meta_description TEXT DEFAULT NULL,
    meta_keywords VARCHAR(255) DEFAULT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 22. Blog tags
CREATE TABLE IF NOT EXISTS blog_tags (
    id INT(11) NOT NULL AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    slug VARCHAR(50) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 23. Blog post tags pivot
CREATE TABLE IF NOT EXISTS blog_post_tags (
    post_id INT(11) NOT NULL,
    tag_id INT(11) NOT NULL,
    PRIMARY KEY (post_id, tag_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 24. Blog comments
CREATE TABLE IF NOT EXISTS blog_comments (
    id INT(11) NOT NULL AUTO_INCREMENT,
    post_id INT(11) NOT NULL,
    parent_id INT(11) DEFAULT NULL,
    author_name VARCHAR(100) NOT NULL,
    author_email VARCHAR(100) NOT NULL,
    author_website VARCHAR(255) DEFAULT NULL,
    content TEXT NOT NULL,
    status ENUM('pending','approved','spam','trash') NOT NULL DEFAULT 'pending',
    ip_address VARCHAR(45) DEFAULT NULL,
    user_agent VARCHAR(255) DEFAULT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY post_id (post_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 25. Admin notifications
CREATE TABLE IF NOT EXISTS admin_notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    type VARCHAR(50) NOT NULL DEFAULT 'info',
    title VARCHAR(255) NOT NULL,
    message TEXT,
    is_read TINYINT(1) DEFAULT 0,
    link VARCHAR(255) DEFAULT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 26. Email templates
CREATE TABLE IF NOT EXISTS email_templates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    template_name VARCHAR(100) NOT NULL UNIQUE,
    subject VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    variables TEXT,
    is_active TINYINT(1) DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- SEED DATA
-- ============================================================

-- Default admin user (password: 'password' hashed with bcrypt)
INSERT INTO users (username, password, email, name, role, status, created_at)
SELECT 'admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin@backsureglobalsupport.com', 'Admin User', 'admin', 'active', NOW()
WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'admin')
LIMIT 1;

-- Default roles
INSERT IGNORE INTO roles (name, slug, description) VALUES
('Super Admin', 'super_admin', 'Full system access'),
('Admin', 'admin', 'Administrative access'),
('HR Manager', 'hr_manager', 'HR access'),
('Editor', 'editor', 'Content editor access'),
('Author', 'author', 'Content author access'),
('Client', 'client', 'Client access'),
('User', 'user', 'Basic user access');

-- Default permissions
INSERT IGNORE INTO permissions (name, slug, description) VALUES
('View Dashboard', 'view_dashboard', 'Can view the dashboard'),
('Manage Users', 'manage_users', 'Can manage users'),
('Manage Content', 'manage_content', 'Can manage content'),
('Manage Settings', 'manage_settings', 'Can modify settings'),
('View Reports', 'view_reports', 'Can view reports'),
('Manage HR', 'manage_hr', 'Can manage HR'),
('Manage Marketing', 'manage_marketing', 'Can manage marketing'),
('Manage Support', 'manage_support', 'Can manage support');

-- Default blog categories
INSERT IGNORE INTO blog_categories (name, slug, description) VALUES
('Business Growth', 'business-growth', 'Articles about business growth strategies'),
('Outsourcing Tips', 'outsourcing', 'Best practices for outsourcing'),
('HR Management', 'hr-management', 'Human resources management'),
('Finance & Accounting', 'finance', 'Financial management and accounting'),
('Compliance & Admin', 'compliance', 'Administrative and compliance');

-- Default settings
INSERT IGNORE INTO settings (setting_group, setting_key, setting_value, type) VALUES
('site_general', 'site_name', 'Backsure Global Support', 'text'),
('site_general', 'site_tagline', 'Your Comprehensive Business Solution', 'text'),
('site_general', 'site_url', 'http://localhost:8000', 'text'),
('site_general', 'admin_email', 'admin@backsureglobalsupport.com', 'text'),
('site_general', 'maintenance_mode', '0', 'boolean'),
('chatbot', 'enabled', '0', 'boolean'),
('chatbot', 'default_message', 'Hello! How can I help you today?', 'textarea');
