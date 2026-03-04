<?php
/**
 * Common Functions
 * Utility functions used throughout the application
 */

// Include configuration if not already included
if (!defined('DB_HOST')) {
    require_once 'config.php';
}

/**
 * Check password strength
 * Returns a score from 0-4
 * 0: Too weak, 1: Weak, 2: Medium, 3: Strong, 4: Very strong
 * 
 * @param string $password The password to check
 * @return int The password strength score
 */
function checkPasswordStrength($password) {
    $score = 0;
    
    // Length check
    if (strlen($password) >= 8) $score++;
    if (strlen($password) >= 12) $score++;
    
    // Complexity checks
    if (preg_match('/[0-9]/', $password)) $score++;
    if (preg_match('/[a-z]/', $password) && preg_match('/[A-Z]/', $password)) $score++;
    if (preg_match('/[^a-zA-Z0-9]/', $password)) $score++;
    
    // Cap score at 4
    return min(4, $score);
}

/**
 * Securely generate a random token
 * 
 * @param int $length The length of the token
 * @return string The generated token
 */
function generateToken($length = 32) {
    return bin2hex(random_bytes($length / 2));
}

/**
 * Safely redirect to a URL
 * 
 * @param string $url The URL to redirect to
 * @param array $params Optional query parameters
 * @return void
 */
function safeRedirect($url, $params = []) {
    // Build query string if params provided
    if (!empty($params)) {
        $query = http_build_query($params);
        $url .= (strpos($url, '?') === false) ? '?' . $query : '&' . $query;
    }
    
    // Check if headers already sent
    if (!headers_sent()) {
        header('Location: ' . $url);
        exit;
    } else {
        // Use JavaScript fallback if headers already sent
        $js_url = json_encode($url);
        $html_url = htmlspecialchars($url, ENT_QUOTES, 'UTF-8');
        echo '<script>window.location.href = ' . $js_url . ';</script>';
        echo '<noscript><meta http-equiv="refresh" content="0;url=' . $html_url . '"></noscript>';
        echo 'If you are not redirected automatically, please <a href="' . $html_url . '">click here</a>.';
        exit;
    }
}

/**
 * Log an activity
 * 
 * @param int $userId The user ID
 * @param string $action The action performed
 * @param string $details Additional details
 * @return bool Success or failure
 */
function logActivity($userId, $action, $details = null) {
    try {
        global $pdo;
        
        $ipAddress = $_SERVER['REMOTE_ADDR'];
        $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? null;
        
        $stmt = $pdo->prepare('INSERT INTO activity_logs (user_id, action, ip_address, user_agent, details) VALUES (?, ?, ?, ?, ?)');
        $stmt->execute([$userId, $action, $ipAddress, $userAgent, $details]);
        
        return true;
    } catch (PDOException $e) {
        error_log('Activity log error: ' . $e->getMessage());
        return false;
    }
}

/**
 * Sanitize user input
 * 
 * @param string $input The input to sanitize
 * @param bool $allowHtml Whether to allow HTML
 * @return string The sanitized input
 */
function sanitizeInput($input, $allowHtml = false) {
    if (is_array($input)) {
        foreach ($input as $key => $value) {
            $input[$key] = sanitizeInput($value, $allowHtml);
        }
        return $input;
    }
    
    // Remove whitespace from both ends
    $input = trim($input);
    
    if ($allowHtml) {
        // Allow text content but strip HTML tags
        return strip_tags($input);
    } else {
        // Convert special characters to HTML entities
        return htmlspecialchars($input, ENT_QUOTES, 'UTF-8');
    }
}

/**
 * Send an email
 * 
 * @param string $to Recipient email
 * @param string $subject Email subject
 * @param string $message Email body (HTML)
 * @param array $attachments Optional attachments
 * @return bool Success or failure
 */
function sendEmail($to, $subject, $message, $attachments = []) {
    // In a real implementation, you would use a proper email library
    // For example, PHPMailer, Swift Mailer, or a mail service like SendGrid
    
    // For now, we'll log the email for demonstration purposes
    error_log("Email would be sent to: $to");
    error_log("Subject: $subject");
    error_log("Message: $message");
    
    // For development/testing, return true
    return true;
}

/**
 * Get a user by ID
 * 
 * @param int $userId The user ID
 * @param bool $isAdmin Whether to check admin users
 * @return array|false The user data or false if not found
 */
function getUserById($userId, $isAdmin = false) {
    try {
        global $pdo;
        
        $table = $isAdmin ? 'admin_users' : 'users';
        $stmt = $pdo->prepare("SELECT * FROM {$table} WHERE id = ?");
        $stmt->execute([$userId]);
        
        return $stmt->fetch();
    } catch (PDOException $e) {
        error_log('getUserById error: ' . $e->getMessage());
        return false;
    }
}

/**
 * Get user metadata
 * 
 * @param int $userId The user ID
 * @param string $key Optional specific meta key
 * @return mixed The meta value, array of all meta, or false if not found
 */
function getUserMeta($userId, $key = null) {
    try {
        global $pdo;
        
        if ($key !== null) {
            // Get specific meta value
            $stmt = $pdo->prepare('SELECT meta_value FROM user_meta WHERE user_id = ? AND meta_key = ?');
            $stmt->execute([$userId, $key]);
            $result = $stmt->fetch();
            
            return $result ? $result['meta_value'] : false;
        } else {
            // Get all meta for user
            $stmt = $pdo->prepare('SELECT meta_key, meta_value FROM user_meta WHERE user_id = ?');
            $stmt->execute([$userId]);
            $results = $stmt->fetchAll();
            
            $meta = [];
            foreach ($results as $row) {
                $meta[$row['meta_key']] = $row['meta_value'];
            }
            
            return $meta;
        }
    } catch (PDOException $e) {
        error_log('getUserMeta error: ' . $e->getMessage());
        return false;
    }
}

/**
 * Update user metadata
 * 
 * @param int $userId The user ID
 * @param string $key The meta key
 * @param mixed $value The meta value
 * @return bool Success or failure
 */
function updateUserMeta($userId, $key, $value) {
    try {
        global $pdo;
        
        // Check if meta key exists
        $stmt = $pdo->prepare('SELECT id FROM user_meta WHERE user_id = ? AND meta_key = ?');
        $stmt->execute([$userId, $key]);
        $exists = $stmt->fetch();
        
        if ($exists) {
            // Update existing meta
            $stmt = $pdo->prepare('UPDATE user_meta SET meta_value = ? WHERE user_id = ? AND meta_key = ?');
            $stmt->execute([$value, $userId, $key]);
        } else {
            // Insert new meta
            $stmt = $pdo->prepare('INSERT INTO user_meta (user_id, meta_key, meta_value) VALUES (?, ?, ?)');
            $stmt->execute([$userId, $key, $value]);
        }
        
        return true;
    } catch (PDOException $e) {
        error_log('updateUserMeta error: ' . $e->getMessage());
        return false;
    }
}

/**
 * Check if a user has a specific permission
 * 
 * @param int $userId The user ID
 * @param string $permission The permission to check
 * @param bool $isAdmin Whether to check admin users
 * @return bool True if user has permission, false otherwise
 */
function userHasPermission($userId, $permission, $isAdmin = false) {
    try {
        global $pdo;
        
        // Get user role
        $table = $isAdmin ? 'admin_users' : 'users';
        $stmt = $pdo->prepare("SELECT role FROM {$table} WHERE id = ?");
        $stmt->execute([$userId]);
        $user = $stmt->fetch();
        
        if (!$user) {
            return false;
        }
        
        // Super admin always has all permissions
        if ($user['role'] === ROLE_SUPER_ADMIN) {
            return true;
        }
        
        // Check role-based permission
        $stmt = $pdo->prepare('
            SELECT COUNT(*) as count FROM role_permissions rp
            JOIN roles r ON rp.role_id = r.id
            JOIN permissions p ON rp.permission_id = p.id
            WHERE r.slug = ? AND p.slug = ?
        ');
        $stmt->execute([$user['role'], $permission]);
        $result = $stmt->fetch();
        
        return $result['count'] > 0;
    } catch (PDOException $e) {
        error_log('userHasPermission error: ' . $e->getMessage());
        return false;
    }
}

/**
 * Create CSRF token and store in session
 * 
 * @return string The CSRF token
 */
function createCSRFToken() {
    if (!isset($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

/**
 * Verify CSRF token
 * 
 * @param string $token The token to verify
 * @return bool True if valid, false otherwise
 */
function verifyCSRFToken($token) {
    if (!isset($_SESSION['csrf_token']) || $token !== $_SESSION['csrf_token']) {
        return false;
    }
    return true;
}

/**
 * Get client IP address
 * 
 * @return string The client IP address
 */
function getClientIP() {
    // Default to remote address
    $ip = $_SERVER['REMOTE_ADDR'] ?? '';

    // Check common proxy headers
    if (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
        // In case of multiple IPs (e.g. client, proxy1, proxy2) take the first
        $forwarded = explode(',', $_SERVER['HTTP_X_FORWARDED_FOR']);
        $ip = trim($forwarded[0]);
    } elseif (!empty($_SERVER['HTTP_CLIENT_IP'])) {
        $ip = $_SERVER['HTTP_CLIENT_IP'];
    } elseif (!empty($_SERVER['HTTP_X_REAL_IP'])) {
        $ip = $_SERVER['HTTP_X_REAL_IP'];
    }

    // Validate IP format
    if (filter_var($ip, FILTER_VALIDATE_IP)) {
        return $ip;
    }

    return '0.0.0.0';
}

/**
 * Format date/time
 * 
 * @param string $datetime The date/time to format
 * @param string $format The desired format (PHP date format)
 * @return string The formatted date/time
 */
function formatDateTime($datetime, $format = 'M j, Y g:i A') {
    $dt = new DateTime($datetime);
    return $dt->format($format);
}