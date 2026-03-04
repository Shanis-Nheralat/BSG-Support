<?php
/**
 * Client Session Check
 * Controls access to client protected pages
 */

// Include the main session check
require_once 'session-check.php';

// Check if user is logged in and is a client
if (!check_user_access(['client', 'premium_client'], 'client-login.html')) {
    // If not redirected by check_user_access, do it here
    if (!headers_sent()) {
        header("Location: client-login.html?error=access_denied");
        exit;
    } else {
        echo "<script>window.location.href = 'client-login.html?error=access_denied';</script>";
        exit;
    }
}

// Check if the client's account is active
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
    
    // Get user status
    $stmt = $pdo->prepare('SELECT status FROM users WHERE id = ?');
    $stmt->execute([$_SESSION['user_id']]);
    $user = $stmt->fetch();
    
    // If user is not active, log them out
    if (!$user || $user['status'] !== 'active') {
        // Destroy session
        session_unset();
        session_destroy();
        
        // Redirect to login page with appropriate message
        $message = !$user ? 'account_not_found' : 'account_' . $user['status'];
        if (!headers_sent()) {
            header("Location: client-login.html?error=$message");
            exit;
        } else {
            echo "<script>window.location.href = 'client-login.html?error=$message';</script>";
            exit;
        }
    }
    
} catch (PDOException $e) {
    // Log error
    error_log('Client session check error: ' . $e->getMessage());
    
    // Redirect to login page
    if (!headers_sent()) {
        header("Location: client-login.html?error=server_error");
        exit;
    } else {
        echo "<script>window.location.href = 'client-login.html?error=server_error';</script>";
        exit;
    }
}
