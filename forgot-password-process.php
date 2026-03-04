<?php
/**
 * Forgot Password Process
 * Handles password reset requests
 */

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

// Get form data
$email = isset($_POST['email']) ? trim(strtolower($_POST['email'])) : '';
$isClient = isset($_POST['is_client']) ? (bool)$_POST['is_client'] : true;

// Validate email
if (empty($email)) {
    echo json_encode(['success' => false, 'message' => 'Email address is required.']);
    exit;
} elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Please enter a valid email address.']);
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
    
    // Determine which table to query based on user type
    $table = $isClient ? 'users' : 'admin_users';
    
    // Find user by email
    $stmt = $pdo->prepare("SELECT id, email, name, status FROM {$table} WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();
    
    // If user not found, still return success for security reasons
    // This prevents email enumeration attacks
    if (!$user) {
        echo json_encode([
            'success' => true,
            'message' => 'If your email exists in our system, you will receive password reset instructions shortly.'
        ]);
        exit;
    }
    
    // Check if account is blocked
    if ($user['status'] === 'blocked') {
        echo json_encode([
            'success' => true,
            'message' => 'If your email exists in our system, you will receive password reset instructions shortly.'
        ]);
        exit;
    }
    
    // Check for any existing token and delete it
    $stmt = $pdo->prepare('DELETE FROM password_resets WHERE email = ?');
    $stmt->execute([$email]);
    
    // Generate token
    $token = bin2hex(random_bytes(32));
    $expires = date('Y-m-d H:i:s', time() + 3600); // 1 hour expiry
    
    // Store token in database
    $stmt = $pdo->prepare('INSERT INTO password_resets (email, token, expires, created_at) VALUES (?, ?, ?, NOW())');
    $stmt->execute([$email, $token, $expires]);
    
    // Create reset link
    $baseUrl = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https://' : 'http://';
    $baseUrl .= $_SERVER['HTTP_HOST'];
    $resetUrl = $baseUrl . '/reset-password.php?email=' . urlencode($email) . '&token=' . $token;
    
    // Prepare email
    $userName = $user['name'];
    $subject = 'Reset Your Password - Backsure Global Support';
    $message = "
    <html>
    <body>
        <h2>Reset Your Password</h2>
        <p>Hello {$userName},</p>
        <p>We received a request to reset your password for your Backsure Global Support account.</p>
        <p>To reset your password, click the button below:</p>
        <p><a href='{$resetUrl}' style='background-color:#062767;color:white;padding:10px 20px;text-decoration:none;border-radius:4px;display:inline-block;'>Reset Password</a></p>
        <p>Or copy and paste this link into your browser:</p>
        <p>{$resetUrl}</p>
        <p>This link will expire in 1 hour.</p>
        <p>If you did not request a password reset, please ignore this email or contact support if you have concerns.</p>
        <p>Thanks,<br>
        Backsure Global Support Team</p>
    </body>
    </html>
    ";
    
    // In a real application, you would send this email
    // For demonstration, we'll just log it
    error_log('Password reset email would be sent to: ' . $email);
    error_log('Reset link: ' . $resetUrl);
    
    // Log the request
    $ipAddress = $_SERVER['REMOTE_ADDR'];
    $userAgent = $_SERVER['HTTP_USER_AGENT'];
    
    $stmt = $pdo->prepare('INSERT INTO activity_logs (user_id, action, ip_address, user_agent, details) VALUES (?, "password_reset_request", ?, ?, ?)');
    $stmt->execute([$user['id'], $ipAddress, $userAgent, 'Reset token generated']);
    
    // Return success
    echo json_encode([
        'success' => true,
        'message' => 'If your email exists in our system, you will receive password reset instructions shortly.'
    ]);
    
} catch (PDOException $e) {
    // Log error
    error_log('Password reset error: ' . $e->getMessage());
    
    echo json_encode(['success' => false, 'message' => 'A database error occurred. Please try again later.']);
}