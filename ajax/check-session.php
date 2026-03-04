<?php
/**
 * Check Session Status
 * AJAX endpoint to verify if the user's session is still valid
 */

// Start session if not already started
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Set content type to JSON
header('Content-Type: application/json');

// Check if user is logged in
$isLoggedIn = isset($_SESSION['user_id']) && isset($_SESSION['logged_in']) && $_SESSION['logged_in'] === true;

// Check session expiry
$sessionValid = true;
if ($isLoggedIn) {
    // Check for session hijacking by validating IP
    $currentIp = $_SERVER['REMOTE_ADDR'];
    if (isset($_SESSION['ip_address']) && $_SESSION['ip_address'] !== $currentIp) {
        // Possible session hijacking detected
        $sessionValid = false;
    }
    
    // Check if session has been idle for too long
    if (isset($_SESSION['last_activity'])) {
        $sessionTimeout = defined('SESSION_EXPIRY') ? SESSION_EXPIRY : 7200; // Default 2 hours
        if ((time() - $_SESSION['last_activity']) > $sessionTimeout) {
            $sessionValid = false;
        }
    }
} else {
    $sessionValid = false;
}

// Update last activity time
if ($sessionValid) {
    $_SESSION['last_activity'] = time();
}

// Return session status
echo json_encode([
    'valid' => $sessionValid,
    'logged_in' => $isLoggedIn
]);

// If session is invalid and user was logged in, destroy session
if (!$sessionValid && $isLoggedIn) {
    session_unset();
    session_destroy();
    
    // Delete any remember me cookie
    if (isset($_COOKIE['remember_me'])) {
        setcookie('remember_me', '', time() - 3600, '/', '', true, true);
    }
}
