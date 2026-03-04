<?php
/**
 * Client Email Verification
 * Validates email verification tokens and activates accounts
 */

// Include database configuration
require_once 'config.php';
require_once 'functions.php';

// Get verification parameters
$email = isset($_GET['email']) ? trim($_GET['email']) : '';
$token = isset($_GET['token']) ? trim($_GET['token']) : '';

// Check if parameters are missing
if (empty($email) || empty($token)) {
    $error = 'Invalid verification link. Please check your email or request a new verification link.';
    include 'verification-result.php';
    exit;
}

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
    
    // Find user by email and token
    $stmt = $pdo->prepare('SELECT id, email, verification_token, created_at FROM users WHERE email = ? AND verification_token = ? AND status = "pending"');
    $stmt->execute([$email, $token]);
    $user = $stmt->fetch();
    
    // If user not found or token doesn't match
    if (!$user) {
        $error = 'Invalid verification link or account already verified. Please login or request a new verification link.';
        include 'verification-result.php';
        exit;
    }
    
    // Check if token has expired (1 hour)
    $createdTime = strtotime($user['created_at']);
    $currentTime = time();
    $tokenValidPeriod = 3600; // 1 hour in seconds
    
    if (($currentTime - $createdTime) > $tokenValidPeriod) {
        // Token has expired
        $error = 'Your verification link has expired. Please request a new verification link.';
        include 'verification-result.php';
        exit;
    }
    
    // Update user status to active
    $stmt = $pdo->prepare('UPDATE users SET status = "active", email_verified_at = NOW(), verification_token = NULL WHERE id = ?');
    $stmt->execute([$user['id']]);
    
    // Log the verification
    $ipAddress = $_SERVER['REMOTE_ADDR'];
    $userAgent = $_SERVER['HTTP_USER_AGENT'];
    
    $stmt = $pdo->prepare('INSERT INTO activity_logs (user_id, action, ip_address, user_agent) VALUES (?, "email_verified", ?, ?)');
    $stmt->execute([$user['id'], $ipAddress, $userAgent]);
    
    // Set success message
    $success = 'Your email has been verified successfully. You can now log in to your account.';
    include 'verification-result.php';
    
} catch (PDOException $e) {
    // Log error
    error_log('Verification error: ' . $e->getMessage());
    
    $error = 'A database error occurred. Please try again later or contact support.';
    include 'verification-result.php';
}