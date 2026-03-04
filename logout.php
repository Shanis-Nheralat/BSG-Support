<?php
/**
 * Unified Logout System for Backsure Global Support
 * Handles user logout, session destruction, and token cleanup
 */

// Start session if not already started
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Include database connection
require_once 'db.php';
require_once 'admin-auth.php'; // Optional - if you want to use the log_admin_action function

// Get user info before destroying session
$userId = $_SESSION['admin_id'] ?? null;
$username = $_SESSION['admin_username'] ?? null;
$userRole = $_SESSION['admin_role'] ?? 'admin';

// Determine where to redirect after logout
$redirectUrl = 'login.php';

// Check for CSRF protection
if (isset($_GET['token'])) {
    if (!isset($_SESSION['token']) || $_GET['token'] !== $_SESSION['token']) {
        // Invalid CSRF token
        header("Location: $redirectUrl?error=invalid_token");
        exit;
    }
}

// If this is an AJAX request, we'll return JSON
$isAjax = isset($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest';

// Clean up remember_me token if exists
if (isset($_COOKIE['remember_token']) && $userId) {
    try {
        // Update user record to clear the token
        $stmt = $pdo->prepare('UPDATE users SET remember_token = NULL, token_expiry = NULL WHERE id = ?');
        $stmt->execute([$userId]);
        
        // Delete the cookie
        setcookie('remember_token', '', time() - 3600, '/', '', true, true);
    } catch (PDOException $e) {
        error_log('Logout error: ' . $e->getMessage());
    }
}

// Log the logout event
if ($userId) {
    // Method 1: Use admin-auth.php function if available
    if (function_exists('log_admin_action')) {
        log_admin_action('logout', 'User logged out');
    } else {
        // Method 2: Log directly to the database
        try {
            $ipAddress = $_SERVER['REMOTE_ADDR'];
            $userAgent = $_SERVER['HTTP_USER_AGENT'];
            
            $stmt = $pdo->prepare('INSERT INTO admin_activity_log (user_id, username, action_type, details, ip_address) VALUES (?, ?, ?, ?, ?)');
            $stmt->execute([$userId, $username, 'logout', 'User logged out', $ipAddress]);
        } catch (PDOException $e) {
            error_log('Logout log error: ' . $e->getMessage());
        }
    }
}

// Destroy session
$_SESSION = [];

// Delete the session cookie
if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(
        session_name(),
        '',
        time() - 42000,
        $params["path"],
        $params["domain"],
        $params["secure"],
        $params["httponly"]
    );
}

// Destroy the session
session_destroy();

// Return response based on request type
if ($isAjax) {
    header('Content-Type: application/json');
    echo json_encode([
        'success' => true,
        'message' => 'You have been successfully logged out.',
        'redirect' => $redirectUrl
    ]);
} else {
    // Redirect to login page
    header("Location: $redirectUrl?logout=1");
}
exit;
