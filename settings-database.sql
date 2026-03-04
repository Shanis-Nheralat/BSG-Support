-- Settings System Database Tables
-- Run this script to create the necessary tables for the settings system

-- Settings Table
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
);

-- Chatbot Session Table
CREATE TABLE IF NOT EXISTS chat_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    session_id VARCHAR(50) NOT NULL,
    visitor_ip VARCHAR(45),
    visitor_info TEXT,
    started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_activity DATETIME DEFAULT CURRENT_TIMESTAMP,
    status ENUM('active', 'closed', 'transferred') DEFAULT 'active',
    INDEX (session_id)
);

-- Chatbot Logs Table
CREATE TABLE IF NOT EXISTS chat_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    session_id VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    sender ENUM('visitor', 'bot', 'agent') NOT NULL,
    agent_id INT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX (session_id)
);

-- Insert default settings
-- SEO Homepage Settings
INSERT IGNORE INTO settings (setting_group, setting_key, setting_value, type) VALUES
('seo_homepage', 'meta_title', 'Welcome to Our Website', 'text'),
('seo_homepage', 'meta_description', 'Your comprehensive solution for all your needs.', 'textarea'),
('seo_homepage', 'meta_keywords', 'website, services, solutions', 'textarea'),
('seo_homepage', 'og_image', '', 'image');

-- Default Meta Tags
INSERT IGNORE INTO settings (setting_group, setting_key, setting_value, type) VALUES
('seo_default', 'default_title', '{page_title} | {site_name}', 'text'),
('seo_default', 'default_description', 'Learn more about our services and solutions.', 'textarea'),
('seo_default', 'robots_tag', 'index, follow', 'text');

-- Social Sharing
INSERT IGNORE INTO settings (setting_group, setting_key, setting_value, type) VALUES
('social_sharing', 'facebook_app_id', '', 'text'),
('social_sharing', 'twitter_card_type', 'summary_large_image', 'text'),
('social_sharing', 'og_default_title', '', 'text'),
('social_sharing', 'og_default_description', '', 'textarea');

-- Sitemap & Robots
INSERT IGNORE INTO settings (setting_group, setting_key, setting_value, type) VALUES
('sitemap_config', 'sitemap_url', 'sitemap.xml', 'text'),
('sitemap_config', 'robots_txt', 'User-agent: *\nDisallow: /admin/\nSitemap: https://example.com/sitemap.xml', 'textarea'),
('sitemap_config', 'ping_engines', '1', 'boolean');

-- Google Tools
INSERT IGNORE INTO settings (setting_group, setting_key, setting_value, type) VALUES
('google_tools', 'ga_id', '', 'text'),
('google_tools', 'gtm_id', '', 'text'),
('google_tools', 'search_console_code', '', 'text');

-- Advanced SEO
INSERT IGNORE INTO settings (setting_group, setting_key, setting_value, type) VALUES
('seo_advanced', 'canonical_url', 'https://example.com{path}', 'text'),
('seo_advanced', 'enable_breadcrumb_schema', '1', 'boolean'),
('seo_advanced', 'structured_data_json', '{\n  "@context": "https://schema.org",\n  "@type": "Organization",\n  "name": "Your Company Name",\n  "url": "https://example.com"\n}', 'json');

-- Chatbot Settings
INSERT IGNORE INTO settings (setting_group, setting_key, setting_value, type) VALUES
('chatbot', 'enabled', '0', 'boolean'),
('chatbot', 'chatbot_type', 'basic', 'text'),
('chatbot', 'default_message', 'Hello! How can I help you today?', 'textarea'),
('chatbot', 'notify_admin', '1', 'boolean'),
('chatbot', 'interface_position', 'bottom-right', 'text'),
('chatbot', 'show_on_all_pages', '1', 'boolean'),
('chatbot', 'session_timeout', '30', 'text'),
('chatbot', 'log_retention', '30', 'text');

-- Site General Settings
INSERT IGNORE INTO settings (setting_group, setting_key, setting_value, type) VALUES
('site_general', 'site_name', 'Your Website', 'text'),
('site_general', 'site_tagline', 'Your Comprehensive Solution', 'text'),
('site_general', 'site_url', 'https://example.com', 'text'),
('site_general', 'admin_email', 'admin@example.com', 'text'),
('site_general', 'timezone', 'UTC', 'text'),
('site_general', 'date_format', 'F j, Y', 'text'),
('site_general', 'time_format', 'g:i a', 'text'),
('site_general', 'maintenance_mode', '0', 'boolean'),
('site_general', 'registration_enabled', '1', 'boolean');

-- Notification Settings
INSERT IGNORE INTO settings (setting_group, setting_key, setting_value, type) VALUES
('notification_config', 'desktop_notifications', '0', 'boolean'),
('notification_config', 'default_popup_duration', '5000', 'text'),
('notification_config', 'allow_user_opt_out', '1', 'boolean'),
('notification_config', 'sound_enabled', '0', 'boolean'),
('notification_config', 'position', 'top-right', 'text');

-- Notification Types
INSERT IGNORE INTO settings (setting_group, setting_key, setting_value, type) VALUES
('notification_types', 'success_icon', 'fas fa-check-circle', 'text'),
('notification_types', 'success_color', '#28a745', 'text'),
('notification_types', 'error_icon', 'fas fa-times-circle', 'text'),
('notification_types', 'error_color', '#dc3545', 'text'),
('notification_types', 'warning_icon', 'fas fa-exclamation-triangle', 'text'),
('notification_types', 'warning_color', '#ffc107', 'text'),
('notification_types', 'info_icon', 'fas fa-info-circle', 'text'),
('notification_types', 'info_color', '#17a2b8', 'text');
