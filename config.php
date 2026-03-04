<?php
/**
 * Configuration File
 * Central location for all configuration settings
 */

// Database configuration - COMMENTED OUT since we're using db_config.php
// These are kept as reference only
/*
define('DB_HOST', 'localhost');
define('DB_NAME', 'backzvsg_playground');
define('DB_USER', 'root');
define('DB_PASSWORD', 'password');
*/

// System settings
define('TIMEZONE', 'Asia/Dubai');
define('DEBUG_MODE', true);  // Set to false in production

// Initialize settings
date_default_timezone_set(TIMEZONE);

// Error reporting - Enabling this during troubleshooting
if (DEBUG_MODE) {
    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
    error_reporting(E_ALL);
} else {
    ini_set('display_errors', 0);
    ini_set('display_startup_errors', 0);
    error_reporting(E_ALL & ~E_NOTICE & ~E_DEPRECATED & ~E_STRICT);
}

// Session security settings - ONLY IF SESSION NOT STARTED
if (session_status() === PHP_SESSION_NONE) {
    // Define session security constants
    define('SECURE_COOKIES', false);  // Set to true in production with HTTPS
    define('SESSION_EXPIRY', 7200);  // Session expiry in seconds (2 hours)
    
    // Apply session settings
    ini_set('session.cookie_httponly', 1);
    ini_set('session.use_only_cookies', 1);
    ini_set('session.cookie_secure', SECURE_COOKIES);
    ini_set('session.gc_maxlifetime', SESSION_EXPIRY);
    ini_set('session.cookie_samesite', 'Lax');
}

// Security settings
define('REMEMBER_ME_DAYS', 30);  // Remember me cookie expiry in days
define('PASSWORD_RESET_HOURS', 1);  // Password reset token expiry in hours
define('VERIFY_TOKEN_HOURS', 24);  // Email verification token expiry in hours
define('MAX_LOGIN_ATTEMPTS', 5);  // Maximum number of failed login attempts
define('LOCKOUT_MINUTES', 15);  // Account lockout time in minutes after max failed attempts

// Email settings
define('EMAIL_FROM', 'support@backsureglobalsupport.com');
define('EMAIL_FROM_NAME', 'Backsure Global Support');
define('EMAIL_REPLY_TO', 'no-reply@backsureglobalsupport.com');

// Application URLs
define('BASE_URL', 'http://localhost:8000');  // Update with your domain in production
define('ADMIN_URL', BASE_URL . '/admin');
define('CLIENT_URL', BASE_URL . '/client');

// Define common status values
define('STATUS_PENDING', 'pending');
define('STATUS_ACTIVE', 'active');
define('STATUS_BLOCKED', 'blocked');
define('STATUS_SUSPENDED', 'suspended');

// Define roles
define('ROLE_SUPER_ADMIN', 'super_admin');
define('ROLE_ADMIN', 'admin');
define('ROLE_HR_MANAGER', 'hr_manager');
define('ROLE_CLIENT', 'client');
define('ROLE_PREMIUM_CLIENT', 'premium_client');
