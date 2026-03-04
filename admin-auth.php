<?php
/**
 * Unified Admin Authentication System
 * 
 * Handles user authentication, session management, permission control,
 * and security for the admin panel.
 */

// Include centralized database connection
require_once 'db.php';

// Start session if not already started
if (session_status() === PHP_SESSION_NONE) {
    if (!headers_sent()) {
        // Start with secure session parameters
        session_start([
            'cookie_httponly' => true,
            'cookie_secure' => isset($_SERVER['HTTPS']),
            'cookie_samesite' => 'Strict'
        ]);
    } else {
        error_log('Headers already sent before session_start in admin-auth.php');
        if (!isset($_SESSION)) {
            $_SESSION = array();
        }
    }
}

/**
 * Check if user is logged in
 * 
 * @return bool True if user is logged in, false otherwise
 */
function is_admin_logged_in() {
    return isset($_SESSION['admin_logged_in']) && 
           ($_SESSION['admin_logged_in'] === true || 
            $_SESSION['admin_logged_in'] == 1 || 
            $_SESSION['admin_logged_in'] === "1");
}

/**
 * Check if current page is the login page
 * Prevents redirect loops by identifying if we're already on the login page
 * 
 * @return bool True if current page is login page
 */
function is_login_page() {
    $current_script = basename($_SERVER['SCRIPT_NAME']);
    $login_pages = ['admin-login.php', 'login.php', 'admin/login.php', 'forgot-password.php', 'reset-password.php'];
    
    return in_array($current_script, $login_pages);
}

/**
 * Check if user has required role
 * 
 * @param array|string $allowed_roles Array or string of roles allowed to access the page
 * @return bool True if user has required role, false otherwise
 */
function has_admin_role($allowed_roles = []) {
    // Convert string to array if necessary
    if (!is_array($allowed_roles)) {
        $allowed_roles = [$allowed_roles];
    }
    
    // If no specific roles are required, just check if logged in
    if (empty($allowed_roles)) {
        return is_admin_logged_in();
    }
    
    // Superadmin and admin always have access to everything
    if (isset($_SESSION['admin_role']) && 
        (strtolower($_SESSION['admin_role']) === 'superadmin' || 
         strtolower($_SESSION['admin_role']) === 'admin')) {
        return true;
    }
    
    // Check if user has any of the required roles
    return isset($_SESSION['admin_role']) && in_array($_SESSION['admin_role'], $allowed_roles);
}

/**
 * Require authentication - redirects to login page if not logged in
 */
function require_admin_auth() {
    // Skip redirect if already on login page
    if (is_login_page()) {
        return;
    }

    // Check session validity
    check_session_validity();

    // If not logged in, redirect to login
    if (!is_admin_logged_in()) {
        if (!headers_sent()) {
            // Store current URL for redirect after login
            $_SESSION['redirect_after_login'] = $_SERVER['REQUEST_URI'];
            
            header("Location: login.php");
            exit();
        } else {
            // If headers already sent, display error message
            echo '<div class="auth-error alert alert-danger">
                Authentication required. Please <a href="login.php">log in</a> to continue.
                </div>';
            die();
        }
    }
    
    // Update last activity time
    $_SESSION['last_activity'] = time();
}

/**
 * Require specific role - redirects if not authorized
 * 
 * @param array|string $allowed_roles Array or string of roles allowed to access the page
 */
function require_admin_role($allowed_roles = []) {
    // Skip checks if on login page
    if (is_login_page()) {
        return;
    }
    
    // First check if logged in
    require_admin_auth();
    
    // Convert string to array if necessary
    if (!is_array($allowed_roles)) {
        $allowed_roles = [$allowed_roles];
    }
    
    // Check role if specified
    if (!empty($allowed_roles) && !has_admin_role($allowed_roles)) {
        // Log unauthorized access attempt
        log_admin_action('access_denied', 'Attempted to access restricted page: ' . $_SERVER['REQUEST_URI']);
        
        if (!headers_sent()) {
            header("Location: admin-dashboard.php?error=unauthorized");
            exit();
        } else {
            echo '<div class="auth-error alert alert-danger">
                You do not have permission to access this page.
                </div>';
            die();
        }
    }
}

/**
 * Login user and create session
 * 
 * @param string $username Username or email
 * @param string $password Password
 * @param bool $remember Whether to remember the user
 * @return bool|array False if login fails, user data array if successful
 */
function admin_login($username, $password, $remember = false) {
    global $pdo;
    
    try {
        // Check if username is an email
        $is_email = filter_var($username, FILTER_VALIDATE_EMAIL);
        
        // Find user by username or email
        if ($is_email) {
            $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ? AND status = 'active'");
        } else {
            $stmt = $pdo->prepare("SELECT * FROM users WHERE username = ? AND status = 'active'");
        }
        
        $stmt->execute([$username]);
        $user = $stmt->fetch();
        
        // Check if user exists and password is valid
        if (!$user || !password_verify($password, $user['password'])) {
            // Update login attempts for existing users
            if ($user) {
                $attempts = $user['login_attempts'] + 1;
                $updateStmt = $pdo->prepare("UPDATE users SET login_attempts = ?, last_attempt_time = NOW() WHERE id = ?");
                $updateStmt->execute([$attempts, $user['id']]);
                
                // Check for account lockout
                if ($attempts >= 5) {
                    error_log("Account locked: {$username} - Too many failed attempts");
                }
            }
            
            return false;
        }
        
        // Check if account is locked/inactive
        if ($user['status'] !== 'active') {
            error_log("Login rejected: Account {$username} is inactive or locked");
            return false;
        }

        // Check for too many failed attempts
        if (isset($user['login_attempts']) && $user['login_attempts'] >= 5 && 
            isset($user['last_attempt_time']) && strtotime($user['last_attempt_time']) > (time() - 900)) {
            error_log("Login rejected: Account {$username} is temporarily locked due to too many failed attempts");
            return false;
        }

        // Check for empty role and set a default
        if (empty($user['role'])) {
            $role = 'user'; // Default role
            
            // Update the role in database
            $updateRoleStmt = $pdo->prepare("UPDATE users SET role = ? WHERE id = ?");
            $updateRoleStmt->execute([$role, $user['id']]);
            $user['role'] = $role;
        }
        
        // Set up session
        $_SESSION['admin_logged_in'] = true;
        $_SESSION['admin_id'] = $user['id'];
        $_SESSION['admin_username'] = $user['username'];
        $_SESSION['admin_role'] = $user['role'];
        $_SESSION['admin_email'] = $user['email'];
        $_SESSION['admin_name'] = $user['name'] ?? $user['username'];
        $_SESSION['ip_address'] = $_SERVER['REMOTE_ADDR'];
        $_SESSION['login_time'] = time();
        $_SESSION['last_activity'] = time();
        
        // Handle remember me
        if ($remember) {
            $token = bin2hex(random_bytes(32));
            $hashedToken = password_hash($token, PASSWORD_DEFAULT);
            $expiry = time() + (30 * 24 * 60 * 60); // 30 days
            
            // Save hashed token in database
            $tokenStmt = $pdo->prepare("UPDATE users SET remember_token = ?, token_expiry = ? WHERE id = ?");
            $tokenStmt->execute([$hashedToken, date('Y-m-d H:i:s', $expiry), $user['id']]);
            
            // Set cookie with username:plaintext_token for lookup + verification
            $cookieValue = $user['username'] . ':' . $token;
            setcookie('remember_token', $cookieValue, $expiry, '/', '', isset($_SERVER['HTTPS']), true);
        }
        
        // Reset login attempts
        $resetStmt = $pdo->prepare("UPDATE users SET login_attempts = 0, last_login = NOW() WHERE id = ?");
        $resetStmt->execute([$user['id']]);
        
        // Log successful login
        log_admin_action('login', 'User logged in successfully');
        
        return $user;
    } catch (PDOException $e) {
        error_log("Login error: " . $e->getMessage());
        return false;
    }
}

/**
 * Logout current user
 */
function admin_logout() {
    // Log the logout action if logged in
    if (is_admin_logged_in()) {
        log_admin_action('logout', 'User logged out');
        
        // Clear remember-me token if exists
        if (isset($_COOKIE['remember_token']) && isset($_SESSION['admin_id'])) {
            try {
                global $pdo;
                $stmt = $pdo->prepare("UPDATE users SET remember_token = NULL, token_expiry = NULL WHERE id = ?");
                $stmt->execute([$_SESSION['admin_id']]);
                
                // Delete the cookie
                setcookie('remember_token', '', time() - 3600, '/', '', isset($_SERVER['HTTPS']), true);
            } catch (PDOException $e) {
                error_log("Error clearing remember token: " . $e->getMessage());
            }
        }
    }
    
    // Unset all session variables
    $_SESSION = array();
    
    // Delete the session cookie
    if (ini_get("session.use_cookies")) {
        $params = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000,
            $params["path"], $params["domain"],
            $params["secure"], $params["httponly"]
        );
    }
    
    // Destroy the session
    session_destroy();
}

/**
 * Get current admin user info
 * 
 * @return array Admin user info or empty array if not logged in
 */
function get_admin_user() {
    global $pdo;
    
    // Default values
    $admin_info = [
        'username' => isset($_SESSION['admin_username']) ? $_SESSION['admin_username'] : 'Guest',
        'role' => isset($_SESSION['admin_role']) ? $_SESSION['admin_role'] : '',
        'id' => isset($_SESSION['admin_id']) ? $_SESSION['admin_id'] : 0,
        'email' => isset($_SESSION['admin_email']) ? $_SESSION['admin_email'] : '',
        'name' => isset($_SESSION['admin_name']) ? $_SESSION['admin_name'] : 'Guest'
    ];
    
    // Get additional info from database if logged in
    if (is_admin_logged_in() && isset($_SESSION['admin_id'])) {
        try {
            $stmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");
            $stmt->execute([$_SESSION['admin_id']]);
            $db_profile = $stmt->fetch();
            
            if ($db_profile && is_array($db_profile)) {
                // Merge data, but session values take precedence
                $admin_info = array_merge($db_profile, $admin_info);
                
                // Double-check that we have a valid role - use session role as fallback
                if (empty($admin_info['role']) && isset($_SESSION['admin_role'])) {
                    $admin_info['role'] = $_SESSION['admin_role'];
                }
            }
        } catch (PDOException $e) {
            error_log("Error fetching admin profile: " . $e->getMessage());
        }
    }
    
    return $admin_info;
}

/**
 * Check admin permissions
 * 
 * @param string $permission Permission key to check
 * @return bool True if user has permission
 */
function has_admin_permission($permission) {
    global $pdo;
    
    // Superadmin and admin always have all permissions
    if (isset($_SESSION['admin_role']) && 
        (strtolower($_SESSION['admin_role']) === 'superadmin' || 
         strtolower($_SESSION['admin_role']) === 'admin')) {
        return true;
    }
    
    // For other roles, check specific permissions
    if (isset($_SESSION['admin_id']) && !empty($permission)) {
        try {
            $stmt = $pdo->prepare("SELECT COUNT(*) FROM role_permissions rp
                JOIN permissions p ON rp.permission_id = p.id
                JOIN roles r ON rp.role_id = r.id
                WHERE r.name = ? AND p.name = ?");
            $stmt->execute([$_SESSION['admin_role'], $permission]);
            return $stmt->fetchColumn() > 0;
        } catch (PDOException $e) {
            error_log("Permission check error: " . $e->getMessage());
            return false;
        }
    }
    
    return false;
}

/**
 * Log admin actions
 * 
 * @param string $action_type Action type
 * @param string $details Action details
 * @param string $resource Optional resource type
 * @param int $resource_id Optional resource ID
 * @return bool Success status
 */
function log_admin_action($action_type, $details = '', $resource = null, $resource_id = null) {
    global $pdo;
    
    try {
        $stmt = $pdo->prepare("INSERT INTO admin_activity_log 
            (user_id, username, action_type, resource, resource_id, details, ip_address) 
            VALUES (?, ?, ?, ?, ?, ?, ?)");
            
        $user_id = $_SESSION['admin_id'] ?? null;
        $username = $_SESSION['admin_username'] ?? null;
        
        return $stmt->execute([
            $user_id,
            $username,
            $action_type,
            $resource,
            $resource_id,
            $details,
            $_SERVER['REMOTE_ADDR']
        ]);
    } catch (PDOException $e) {
        error_log("Error logging admin action: " . $e->getMessage());
        return false;
    }
}

/**
 * Check if admin activity log table exists and create if not
 */
function ensure_admin_log_table() {
    global $pdo;
    
    try {
        // Check if table exists
        $tableExists = $pdo->query("SHOW TABLES LIKE 'admin_activity_log'")->rowCount() > 0;
        
        if (!$tableExists) {
            // Create activity log table
            $pdo->exec("CREATE TABLE admin_activity_log (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT,
                username VARCHAR(100),
                action_type VARCHAR(50) NOT NULL,
                resource VARCHAR(50),
                resource_id INT,
                details TEXT,
                ip_address VARCHAR(45),
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                INDEX (user_id),
                INDEX (action_type),
                INDEX (timestamp)
            )");
        }
        
        return true;
    } catch (PDOException $e) {
        error_log("Error creating log table: " . $e->getMessage());
        return false;
    }
}

/**
 * Check session timeout and validate session
 * 
 * @param int $timeout_minutes Session timeout in minutes (default: 30)
 * @return bool True if session is valid
 */
function check_session_validity($timeout_minutes = 30) {
    // Not applicable if not logged in
    if (!is_admin_logged_in()) {
        return true;
    }
    
    // Check session timeout
    $timeout = $timeout_minutes * 60; // Convert to seconds
    if (isset($_SESSION['last_activity']) && (time() - $_SESSION['last_activity'] > $timeout)) {
        admin_logout();
        
        // Redirect to login page with timeout message
        if (!headers_sent()) {
            header('Location: login.php?timeout=1');
            exit;
        }
        return false;
    }
    
    // Check IP address mismatch (potential session hijacking)
    if (isset($_SESSION['ip_address']) && $_SESSION['ip_address'] !== $_SERVER['REMOTE_ADDR']) {
        error_log("Session security: IP mismatch. Session: {$_SESSION['ip_address']}, Current: {$_SERVER['REMOTE_ADDR']}");
        admin_logout();
        return false;
    }
    
    // Update last activity time
    $_SESSION['last_activity'] = time();
    return true;
}

/**
 * Create a new admin user
 * 
 * @param string $username Username
 * @param string $password Password
 * @param string $email Email
 * @param string $name Full name
 * @param string $role Role (default: admin)
 * @return int|false User ID on success, false on failure
 */
function create_admin_user($username, $password, $email, $name, $role = 'admin') {
    global $pdo;
    
    // Validate inputs
    if (empty($username) || empty($password) || empty($email)) {
        return false;
    }
    
    try {
        // Check if username or email already exists
        $checkStmt = $pdo->prepare("SELECT id FROM users WHERE username = ? OR email = ?");
        $checkStmt->execute([$username, $email]);
        
        if ($checkStmt->rowCount() > 0) {
            return false; // User already exists
        }
        
        // Hash password
        $hashed_password = password_hash($password, PASSWORD_DEFAULT);
        
        // Insert new user
        $insertStmt = $pdo->prepare("INSERT INTO users 
            (username, password, email, name, role, status, created_at) 
            VALUES (?, ?, ?, ?, ?, 'active', NOW())");
            
        $insertStmt->execute([$username, $hashed_password, $email, $name, $role]);
        
        $user_id = $pdo->lastInsertId();
        
        // Log action
        log_admin_action('user_created', 'Created new user: ' . $username, 'user', $user_id);
        
        return $user_id;
    } catch (PDOException $e) {
        error_log("Error creating admin user: " . $e->getMessage());
        return false;
    }
}

/**
 * Update admin user password
 * 
 * @param int $user_id User ID
 * @param string $new_password New password
 * @return bool Success status
 */
function update_admin_password($user_id, $new_password) {
    global $pdo;
    
    if (empty($user_id) || empty($new_password)) {
        return false;
    }
    
    try {
        // Hash password
        $hashed_password = password_hash($new_password, PASSWORD_DEFAULT);
        
        // Update password
        $stmt = $pdo->prepare("UPDATE users SET password = ? WHERE id = ?");
        $result = $stmt->execute([$hashed_password, $user_id]);
        
        if ($result) {
            // Log action
            log_admin_action('password_updated', 'Password updated', 'user', $user_id);
        }
        
        return $result;
    } catch (PDOException $e) {
        error_log("Error updating admin password: " . $e->getMessage());
        return false;
    }
}

/**
 * Check for remember-me cookie and log user in if valid
 * 
 * @return bool True if auto-login succeeded
 */
function check_remember_me() {
    if (is_admin_logged_in() || !isset($_COOKIE['remember_token'])) {
        return false;
    }
    
    global $pdo;
    $cookieValue = $_COOKIE['remember_token'];
    
    // Parse cookie format: username:token
    $separatorPos = strpos($cookieValue, ':');
    if ($separatorPos === false) {
        // Legacy cookie format (bare token) — clear it and require re-login
        setcookie('remember_token', '', time() - 3600, '/', '', isset($_SERVER['HTTPS']), true);
        return false;
    }
    
    $cookieUsername = substr($cookieValue, 0, $separatorPos);
    $cookieToken = substr($cookieValue, $separatorPos + 1);
    
    try {
        // Look up user by username with valid expiry
        $stmt = $pdo->prepare("SELECT * FROM users 
            WHERE username = ? AND token_expiry > NOW() AND status = 'active'");
        $stmt->execute([$cookieUsername]);
        $user = $stmt->fetch();
        
        if ($user && !empty($user['remember_token']) && password_verify($cookieToken, $user['remember_token'])) {
            // Set session variables
            $_SESSION['admin_logged_in'] = true;
            $_SESSION['admin_id'] = $user['id'];
            $_SESSION['admin_username'] = $user['username'];
            $_SESSION['admin_role'] = $user['role'];
            $_SESSION['admin_email'] = $user['email'];
            $_SESSION['admin_name'] = $user['name'] ?? $user['username'];
            $_SESSION['ip_address'] = $_SERVER['REMOTE_ADDR'];
            $_SESSION['login_time'] = time();
            $_SESSION['last_activity'] = time();
            
            // Rotate: generate new remember token for security
            $new_token = bin2hex(random_bytes(32));
            $new_hashed = password_hash($new_token, PASSWORD_DEFAULT);
            $expiry = time() + (30 * 24 * 60 * 60); // 30 days
            
            // Update hashed token in database
            $stmt = $pdo->prepare("UPDATE users SET remember_token = ?, token_expiry = ? WHERE id = ?");
            $stmt->execute([$new_hashed, date('Y-m-d H:i:s', $expiry), $user['id']]);
            
            // Set new cookie with username:plaintext_token
            $newCookieValue = $user['username'] . ':' . $new_token;
            setcookie('remember_token', $newCookieValue, $expiry, '/', '', isset($_SERVER['HTTPS']), true);
            
            // Log action
            log_admin_action('login_remember', 'Auto-login via remember-me cookie');
            
            return true;
        }
    } catch (PDOException $e) {
        error_log("Remember Me Check Error: " . $e->getMessage());
    }
    
    // Invalid or expired token, clear the cookie
    setcookie('remember_token', '', time() - 3600, '/', '', isset($_SERVER['HTTPS']), true);
    return false;
}

// Run initialization functions - These are executed when this file is included
ensure_admin_log_table();
check_session_validity();
check_remember_me(); // Try auto-login with remember-me cookie

// Set up global variables for templates
$admin_user = get_admin_user();
$admin_username = $admin_user['username'] ?? 'Guest';
$admin_role = $admin_user['role'] ?? '';
$admin_id = $admin_user['id'] ?? 0;
