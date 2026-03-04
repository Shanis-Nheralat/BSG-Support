-- Add new columns to the admins table if they don't exist already
-- Using ALTER IGNORE to skip errors if columns already exist

-- Add the profile columns
ALTER TABLE admins 
ADD COLUMN IF NOT EXISTS full_name VARCHAR(100) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS phone VARCHAR(30) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS department VARCHAR(50) DEFAULT NULL, 
ADD COLUMN IF NOT EXISTS bio TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS avatar VARCHAR(255) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS notify_email TINYINT(1) DEFAULT 1,
ADD COLUMN IF NOT EXISTS notify_system TINYINT(1) DEFAULT 1,
ADD COLUMN IF NOT EXISTS notify_sms TINYINT(1) DEFAULT 0;

-- Create the admin activity log table if it doesn't exist
CREATE TABLE IF NOT EXISTS admin_activity_log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    username VARCHAR(50),
    action_type VARCHAR(20),
    resource VARCHAR(30),
    resource_id INT,
    details TEXT,
    ip_address VARCHAR(45),
    timestamp DATETIME,
    FOREIGN KEY (user_id) REFERENCES admins(id) ON DELETE SET NULL
);

-- Note: Run this command manually on your server:
-- mkdir -p media-library/admin-profiles
-- chmod 755 media-library/admin-profiles
