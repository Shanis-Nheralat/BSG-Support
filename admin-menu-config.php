/**
 * Add settings pages to admin menu
 */
$admin_menu[] = [
    'id' => 'site_settings',
    'title' => 'Site Settings',
    'url' => 'admin-settings.php',
    'icon' => 'fas fa-cogs',
    'roles' => ['admin'],
    'order' => 23
];
-- Settings table
CREATE TABLE settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  setting_group VARCHAR(100) NOT NULL,   -- e.g. 'seo_homepage', 'chatbot', 'site_general'
  setting_key VARCHAR(100) NOT NULL,     -- e.g. 'meta_title', 'enabled'
  setting_value TEXT,
  type ENUM('text','textarea','boolean','image','json','file') DEFAULT 'text',
  autoload BOOLEAN DEFAULT 1,
  updated_by INT NULL,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY group_key (setting_group, setting_key)
);

-- Notifications table
CREATE TABLE admin_notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NULL,
  type VARCHAR(20) NOT NULL,
  message TEXT NOT NULL,
  link VARCHAR(255),
  `read` BOOLEAN DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX (user_id, `read`)
);

-- Chat sessions table (for custom chatbot)
CREATE TABLE chat_sessions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  session_id VARCHAR(50) NOT NULL,
  visitor_ip VARCHAR(45),
  visitor_info TEXT,
  started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_activity DATETIME DEFAULT CURRENT_TIMESTAMP,
  status ENUM('active', 'closed', 'transferred') DEFAULT 'active',
  INDEX (session_id)
);

-- Chat logs table (for custom chatbot)
CREATE TABLE chat_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  session_id VARCHAR(50) NOT NULL,
  message TEXT NOT NULL,
  sender ENUM('visitor', 'bot', 'agent') NOT NULL,
  agent_id INT NULL,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX (session_id)
);
