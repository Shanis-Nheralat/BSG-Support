<?php
/**
 * Session Check
 * Controls access to protected pages based on user role
 */

// Start session if not already started
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Include database configuration
require_once 'config.php';
require_once 'functions.php';

/**
 * Check if user is logged in and has the required role
 * 
 * @param array $allowed_roles The roles allowed to access the page
 * @param string $redirect_url The URL to redirect to if access is denied
 * @return bool True if user is allowed, false otherwise
 */
function check_user_access($allowed_roles = [], $redirect_url = 'admin-login.html') {
    // Check if user is logged in
    if (!isset($_SESSION['user_id']) || !isset($_SESSION['user_role']) || !isset($_SESSION['logged_in']) || $_SESSION['logged_in'] !== true) {
        // If using remember_me, try to auto-login
        if (isset($_COOKIE['remember_me']) && !empty($_COOKIE['remember_me'])) {
            // Try to login with remember_me cookie
            $remembered = remember_me_login();
            if (!$remembered) {
                // If auto-login fails, redirect to login page
                if (!headers_sent()) {
                    header("Location: $redirect_url?error=session_expired");
                    exit;
                } else {
                    $js_url = json_encode($redirect_url . '?error=session_expired');
                    echo "<script>window.location.href = $js_url;</script>";
                    exit;
                }
            }
        } else {
            // No remember_me cookie, redirect to login
            if (!headers_sent()) {
                header("Location: $redirect_url?error=session_expired");
                exit;
            } else {
                $js_url = json_encode($redirect_url . '?error=session_expired');
                echo "<script>window.location.href = $js_url;</script>";
                exit;
            }
        }
    }

    // Check for session hijacking
    if (!validate_session_ip()) {
        // IP has changed, possible session hijacking
        regenerate_session();
        if (!headers_sent()) {
            header("Location: $redirect_url?error=security_breach");
            exit;
        } else {
            $js_url = json_encode($redirect_url . '?error=security_breach');
            echo "<script>window.location.href = $js_url;</script>";
            exit;
        }
    }

    // Regenerate session ID periodically to prevent fixation attacks
    if (!isset($_SESSION['last_regeneration']) || (time() - $_SESSION['last_regeneration']) > 1800) {
        // Regenerate session ID every 30 minutes
        regenerate_session();
    }

    // If allowed_roles is empty, any logged-in user is allowed
    if (empty($allowed_roles)) {
        return true;
    }

    // Check if user role is in allowed roles
    if (in_array($_SESSION['user_role'], $allowed_roles)) {
        return true;
    }

    // User does not have the required role
    if (!headers_sent()) {
        header("Location: $redirect_url?error=access_denied");
        exit;
    } else {
        $js_url = json_encode($redirect_url . '?error=access_denied');
        echo "<script>window.location.href = $js_url;</script>";
        exit;
    }
}

/**
 * Auto-login using remember_me cookie
 * 
 * @return bool True if logged in successfully, false otherwise
 */
function remember_me_login() {
    if (!isset($_COOKIE['remember_me'])) {
        return false;
    }

    // Extract selector and token
    $parts = explode(':', $_COOKIE['remember_me']);
    if (count($parts) !== 2) {
        return false;
    }

    $selector = $parts[0];
    $validator = $parts[1];

    try {
        // Connect to database
        $pdo = new PDO(
            'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4',
            DB_USER,
            DB_PASSWORD,
            [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false
            ]
        );
        
        // Get token from database
        $stmt = $pdo->prepare('SELECT * FROM remember_tokens WHERE selector = ? AND expires > NOW()');
        $stmt->execute([$selector]);
        $token = $stmt->fetch();
        
        if (!$token) {
            return false;
        }
        
        // Verify token
        if (!password_verify($validator, $token['token'])) {
            return false;
        }
        
        // Get user
        $stmt = $pdo->prepare('SELECT id, name, email, role, status FROM users WHERE id = ? AND status = "active"');
        $stmt->execute([$token['user_id']]);
        $user = $stmt->fetch();
        
        if (!$user) {
            return false;
        }
        
        // Set session variables
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['user_name'] = $user['name'];
        $_SESSION['user_email'] = $user['email'];
        $_SESSION['user_role'] = $user['role'];
        $_SESSION['logged_in'] = true;
        
        // Set session token for CSRF protection
        $_SESSION['token'] = bin2hex(random_bytes(32));
        
        // Update last login time
        $stmt = $pdo->prepare('UPDATE users SET last_login = NOW() WHERE id = ?');
        $stmt->execute([$user['id']]);
        
        // Regenerate session ID
        regenerate_session();
        
        return true;
    } catch (PDOException $e) {
        error_log('Remember me login error: ' . $e->getMessage());
        return false;
    }
}

/**
 * Validate session IP to prevent session hijacking
 * 
 * @return bool True if IP matches or is in allowed range, false otherwise
 */
function validate_session_ip() {
    if (!isset($_SESSION['ip_address'])) {
        // First time setting the IP
        $_SESSION['ip_address'] = $_SERVER['REMOTE_ADDR'];
        return true;
    }

    // Check exact match first
    if ($_SESSION['ip_address'] === $_SERVER['REMOTE_ADDR']) {
        return true;
    }

    // If IPs don't match exactly, check if they're in the same subnet
    // This handles cases where users might have dynamic IPs but from the same ISP/subnet
    $sessionIpParts = explode('.', $_SESSION['ip_address']);
    $currentIpParts = explode('.', $_SERVER['REMOTE_ADDR']);

    // Compare first 3 octets (Class C subnet)
    if (count($sessionIpParts) === 4 && count($currentIpParts) === 4) {
        if ($sessionIpParts[0] === $currentIpParts[0] && 
            $sessionIpParts[1] === $currentIpParts[1] && 
            $sessionIpParts[2] === $currentIpParts[2]) {
            // Update the stored IP to the current one
            $_SESSION['ip_address'] = $_SERVER['REMOTE_ADDR'];
            return true;
        }
    }

    return false;
}

/**
 * Regenerate session ID to prevent fixation attacks
 */
function regenerate_session() {
    // Keep a copy of the session variables
    $old_session = $_SESSION;
    
    // Start with an empty session
    session_regenerate_id(true);
    $_SESSION = [];
    
    // Restore session variables
    $_SESSION = $old_session;
    
    // Update the time of last regeneration
    $_SESSION['last_regeneration'] = time();
}

// The following are utility functions that can be used throughout the application

/**
 * Check if the current user is an admin
 * 
 * @return bool True if user is an admin, false otherwise
 */
function is_admin() {
    return isset($_SESSION['user_role']) && ($_SESSION['user_role'] === 'admin' || $_SESSION['user_role'] === 'super_admin');
}

/**
 * Check if the current user is a client
 * 
 * @return bool True if user is a client, false otherwise
 */
function is_client() {
    return isset($_SESSION['is_client']) && $_SESSION['is_client'] === true;
}

/**
 * Check if the current user has a specific role
 * 
 * @param string $role The role to check
 * @return bool True if user has the role, false otherwise
 */
function has_role($role) {
    return isset($_SESSION['user_role']) && $_SESSION['user_role'] === $role;
}
