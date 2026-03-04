CREATE TABLE admin_activity_log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    username VARCHAR(255) NOT NULL,
    action VARCHAR(255) NOT NULL,
    page VARCHAR(255) NOT NULL,
    details TEXT NULL,
    ip_address VARCHAR(45) NOT NULL,
    user_agent TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_admin_activity_user ON admin_activity_log(user_id);
CREATE INDEX idx_admin_activity_action ON admin_activity_log(action);
CREATE INDEX idx_admin_activity_page ON admin_activity_log(page);
CREATE INDEX idx_admin_activity_date ON admin_activity_log(created_at);
