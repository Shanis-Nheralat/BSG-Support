<?php
/**
 * Client Login Process
 * Handles login authentication for clients
 */

// Start session
session_start();

// Include database configuration
require_once 'config.php';
require_once 'functions.php';

// Set content type to JSON for API responses
header('Content-Type: application/json');

// Check if the request is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method.']);
    exit;
}

// Get login data
$email = isset($_POST['email']) ? trim(strtolower($_POST['email'])) : '';
$password = isset($_POST['password']) ? $_POST['password'] : '';
$remember = isset($_POST['remember']) ? (bool)$_POST['remember'] : false;

// Validate inputs
$errors = [];

if (empty($email)) {
    $errors[] = 'Email address is required.';
} elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'Please enter a valid email address.';
}

if (empty($password)) {
    $errors[] = 'Password is required.';
}

// If there are validation errors, return them
if (!empty($errors)) {
    echo json_encode(['success' => false, 'message' => implode(' ', $errors)]);
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
    
    // Find user by email
    $stmt = $pdo->prepare('SELECT id, name, email, username, password, role, status, login_attempts, last_attempt_time FROM users WHERE email = ?');
    $stmt->execute([$email]);
    $user = $stmt->fetch();
    
    // If user not found or is blocked
    if (!$user) {
        // For security, use the same message for non-existent accounts to prevent user enumeration
        echo json_encode(['success' => false, 'message' => 'Invalid email or password.']);
        exit;
    }
    
    // Check if account is blocked
    if ($user['status'] === 'blocked') {
        echo json_encode(['success' => false, 'message' => 'Your account has been blocked. Please contact support.']);
        exit;
    }
    
    // Check if account is pending verification
    if ($user['status'] === 'pending') {
        echo json_encode(['success' => false, 'message' => 'Your account is pending verification. Please check your email to verify your account.']);
        exit;
    }
    
    // Check for too many login attempts
    $maxAttempts = 5; // Maximum failed login attempts
    $lockoutTime = 15 * 60; // 15 minutes lockout in seconds
    
    $currentTime = time();
    $lastAttemptTime = strtotime($user['last_attempt_time'] ?? '0');
    $timeSinceLastAttempt = $currentTime - $lastAttemptTime;
    
    // If account was locked but the lockout time has passed, reset the attempts
    if ($timeSinceLastAttempt > $lockoutTime && $user['login_attempts'] >= $maxAttempts) {
        $stmt = $pdo->prepare('UPDATE users SET login_attempts = 0 WHERE id = ?');
        $stmt->execute([$user['id']]);
        $user['login_attempts'] = 0;
    }
    
    // Check if account is temporarily locked
    if ($user['login_attempts'] >= $maxAttempts && $timeSinceLastAttempt <= $lockoutTime) {
        $remainingTime = ceil(($lockoutTime - $timeSinceLastAttempt) / 60);
        echo json_encode([
            'success' => false, 
            'message' => "Too many failed login attempts. Your account is temporarily locked. Please try again in {$remainingTime} minutes."
        ]);
        exit;
    }
    
    // Verify password
    if (!password_verify($password, $user['password'])) {
        // Increment login attempts and update last attempt time
        $stmt = $pdo->prepare('UPDATE users SET login_attempts = login_attempts + 1, last_attempt_time = NOW() WHERE id = ?');
        $stmt->execute([$user['id']]);
        
        $attemptsLeft = $maxAttempts - ($user['login_attempts'] + 1);
        
        if ($attemptsLeft <= 0) {
            echo json_encode([
                'success' => false, 
                'message' => 'Invalid email or password. Your account has been temporarily locked due to too many failed attempts.'
            ]);
        } else {
            echo json_encode([
                'success' => false, 
                'message' => "Invalid email or password. You have {$attemptsLeft} attempts left before your account is temporarily locked."
            ]);
        }
        exit;
    }
    
    // Reset login attempts on successful login
    $stmt = $pdo->prepare('UPDATE users SET login_attempts = 0, last_login = NOW() WHERE id = ?');
    $stmt->execute([$user['id']]);
    
    // Set session variables
    $_SESSION['user_id'] = $user['id'];
    $_SESSION['user_name'] = $user['name'];
    $_SESSION['user_email'] = $user['email'];
    $_SESSION['user_role'] = $user['role'];
    $_SESSION['is_client'] = true;
    $_SESSION['logged_in'] = true;
    
    // Generate session token for CSRF protection
    $_SESSION['token'] = bin2hex(random_bytes(32));
    
    // Set remember me cookie if requested
    if ($remember) {
        $selector = bin2hex(random_bytes(16));
        $authenticator = bin2hex(random_bytes(32));
        
        // Set cookie that expires in 30 days
        setcookie(
            'remember_me',
            $selector . ':' . $authenticator,
            time() + 60 * 60 * 24 * 30,
            '/',
            '',
            true, // Only transmit over HTTPS
            true  // HTTP only (not accessible via JavaScript)
        );
        
        // Hash the authenticator before storing
        $hashedAuthenticator = password_hash($authenticator, PASSWORD_DEFAULT);
        
        // Delete any existing tokens for this user
        $stmt = $pdo->prepare('DELETE FROM remember_tokens WHERE user_id = ?');
        $stmt->execute([$user['id']]);
        
        // Store the token
        $expiry = date('Y-m-d H:i:s', time() + 60 * 60 * 24 * 30);
        $stmt = $pdo->prepare('INSERT INTO remember_tokens (user_id, selector, token, expires) VALUES (?, ?, ?, ?)');
        $stmt->execute([$user['id'], $selector, $hashedAuthenticator, $expiry]);
    }
    
    // Log successful login
    $ipAddress = $_SERVER['REMOTE_ADDR'];
    $userAgent = $_SERVER['HTTP_USER_AGENT'];
    
    $stmt = $pdo->prepare('INSERT INTO login_logs (user_id, ip_address, user_agent, success) VALUES (?, ?, ?, 1)');
    $stmt->execute([$user['id'], $ipAddress, $userAgent]);
    
    // Return success response
    echo json_encode([
        'success' => true,
        'message' => 'Login successful. Redirecting to dashboard...',
        'redirect' => 'client-dashboard.html'
    ]);
    
} catch (PDOException $e) {
    // Log error
    error_log('Login error: ' . $e->getMessage());
    
    echo json_encode(['success' => false, 'message' => 'A database error occurred. Please try again later.']);
}