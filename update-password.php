<?php
/**
 * Update Password
 * Processes the password reset form submission
 */

// Include database configuration
require_once 'config.php';
require_once 'functions.php';

// Check if the request is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: client-login.html');
    exit;
}

// Get form data
$email = isset($_POST['email']) ? trim($_POST['email']) : '';
$token = isset($_POST['token']) ? trim($_POST['token']) : '';
$password = isset($_POST['password']) ? $_POST['password'] : '';
$confirmPassword = isset($_POST['confirm-password']) ? $_POST['confirm-password'] : '';

// Validate inputs
$errors = [];

if (empty($email) || empty($token)) {
    $errors[] = 'Invalid password reset link.';
}

if (empty($password)) {
    $errors[] = 'Password is required.';
} elseif (strlen($password) < 8) {
    $errors[] = 'Password must be at least 8 characters long.';
}

if ($password !== $confirmPassword) {
    $errors[] = 'Passwords do not match.';
}

// Check password strength
$hasLowercase = preg_match('/[a-z]/', $password);
$hasUppercase = preg_match('/[A-Z]/', $password);
$hasNumber = preg_match('/[0-9]/', $password);
$hasSpecial = preg_match('/[!@#$%^&*(),.?":{}|<>]/', $password);

$strength = 0;
if (strlen($password) >= 8) $strength++;
if ($hasLowercase && $hasUppercase) $strength++;
if ($hasNumber) $strength++;
if ($hasSpecial) $strength++;

if ($strength < 3) {
    $errors[] = 'Please choose a stronger password with at least 3 of the following: lowercase, uppercase, numbers, and special characters.';
}

// If there are validation errors, display them
if (!empty($errors)) {
    $error = implode(' ', $errors);
    require 'reset-password-form.php';
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
    
    // Check if token is valid and not expired
    $stmt = $pdo->prepare('SELECT * FROM password_resets WHERE email = ? AND token = ? AND expires > NOW()');
    $stmt->execute([$email, $token]);
    $reset = $stmt->fetch();
    
    if (!$reset) {
        $error = 'Invalid or expired password reset link. Please request a new password reset.';
        require 'reset-password-form.php';
        exit;
    }
    
    // Determine if this is an admin or client account
    $stmt = $pdo->prepare('SELECT id, email FROM admin_users WHERE email = ?');
    $stmt->execute([$email]);
    $adminUser = $stmt->fetch();

    if ($adminUser) {
        // This is an admin account
        $table = 'admin_users';
        $userId = $adminUser['id'];
    } else {
        // Check if it's a client account
        $stmt = $pdo->prepare('SELECT id, email FROM users WHERE email = ?');
        $stmt->execute([$email]);
        $clientUser = $stmt->fetch();
        
        if ($clientUser) {
            $table = 'users';
            $userId = $clientUser['id'];
        } else {
            // User not found in either table
            $error = 'Account not found. Please contact support.';
            require 'reset-password-form.php';
            exit;
        }
    }
    
    // Hash the new password
    $passwordHash = password_hash($password, PASSWORD_DEFAULT);
    
    // Update the password
    $stmt = $pdo->prepare("UPDATE {$table} SET password = ?, updated_at = NOW() WHERE id = ?");
    $stmt->execute([$passwordHash, $userId]);
    
    // Delete all reset tokens for this email
    $stmt = $pdo->prepare('DELETE FROM password_resets WHERE email = ?');
    $stmt->execute([$email]);
    
    // Delete any remember me tokens for this user
    $stmt = $pdo->prepare('DELETE FROM remember_tokens WHERE user_id = ?');
    $stmt->execute([$userId]);
    
    // Log the password reset
    $ipAddress = $_SERVER['REMOTE_ADDR'];
    $userAgent = $_SERVER['HTTP_USER_AGENT'];
    
    $stmt = $pdo->prepare('INSERT INTO activity_logs (user_id, action, ip_address, user_agent, details) VALUES (?, "password_reset", ?, ?, ?)');
    $stmt->execute([$userId, $ipAddress, $userAgent, 'Password reset successful']);
    
    // Set success message
    $success = 'Your password has been reset successfully. You can now log in with your new password.';
    require 'reset-password-form.php';
    
} catch (PDOException $e) {
    // Log error
    error_log('Update password error: ' . $e->getMessage());
    
    $error = 'A database error occurred. Please try again later or contact support.';
    require 'reset-password-form.php';
}