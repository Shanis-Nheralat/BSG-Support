<?php
/**
 * signup-process.php
 * Processes user registration requests with enhanced security
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

// Get form data
$fullname = isset($_POST['fullname']) ? trim($_POST['fullname']) : '';
$email = isset($_POST['email']) ? trim(strtolower($_POST['email'])) : '';
$username = isset($_POST['username']) ? trim($_POST['username']) : '';
$password = isset($_POST['password']) ? $_POST['password'] : '';
$confirmPassword = isset($_POST['confirm-password']) ? $_POST['confirm-password'] : '';
$termsAccepted = isset($_POST['terms']) ? (bool)$_POST['terms'] : false;
$companyName = isset($_POST['company']) ? trim($_POST['company']) : '';
$companySize = isset($_POST['company_size']) ? trim($_POST['company_size']) : '';
$phoneNumber = isset($_POST['phone']) ? trim($_POST['phone']) : '';

// Validate inputs
$errors = [];

if (empty($fullname)) {
    $errors[] = 'Full name is required.';
}

if (empty($email)) {
    $errors[] = 'Email address is required.';
} elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'Please enter a valid email address.';
} else {
    // Check if it's a valid company email (not free email provider)
    $freeDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com', 'icloud.com', 'mail.com', 'protonmail.com'];
    $emailDomain = substr(strrchr($email, "@"), 1);
    
    if (in_array(strtolower($emailDomain), $freeDomains)) {
        $errors[] = 'Please use your company email address.';
    }
}

if (empty($username)) {
    $errors[] = 'Username is required.';
} elseif (!preg_match('/^[a-zA-Z0-9_]{3,20}$/', $username)) {
    $errors[] = 'Username must be 3-20 characters long and contain only letters, numbers, and underscores.';
}

if (empty($password)) {
    $errors[] = 'Password is required.';
} elseif (strlen($password) < 8) {
    $errors[] = 'Password must be at least 8 characters long.';
}

if ($password !== $confirmPassword) {
    $errors[] = 'Passwords do not match.';
}

if (empty($companyName)) {
    $errors[] = 'Company name is required.';
}

if (!$termsAccepted) {
    $errors[] = 'You must agree to the Terms & Conditions.';
}

// Check password strength
$passwordStrength = checkPasswordStrength($password);
if ($passwordStrength < 3) { // Require at least strong strength
    $errors[] = 'Please choose a stronger password with a mix of uppercase, lowercase, numbers, and special characters.';
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
    
    // Check if username already exists
    $stmt = $pdo->prepare('SELECT id FROM users WHERE username = ?');
    $stmt->execute([$username]);
    
    if ($stmt->rowCount() > 0) {
        echo json_encode(['success' => false, 'message' => 'This username is already taken.']);
        exit;
    }
    
    // Check if email already exists
    $stmt = $pdo->prepare('SELECT id FROM users WHERE email = ?');
    $stmt->execute([$email]);
    
    if ($stmt->rowCount() > 0) {
        echo json_encode(['success' => false, 'message' => 'This email address is already registered.']);
        exit;
    }
    
    // Generate password hash
    $passwordHash = password_hash($password, PASSWORD_DEFAULT);
    
    // Generate email verification token
    $verificationToken = generateToken(64);
    $tokenExpiry = date('Y-m-d H:i:s', time() + (VERIFY_TOKEN_HOURS * 3600)); // Convert hours to seconds
    
    // Set default role as 'client'
    $role = 'client';
    
    // Start transaction
    $pdo->beginTransaction();
    
    // Insert user into database
    $stmt = $pdo->prepare('INSERT INTO users (name, email, username, password, role, status, verification_token, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())');
    $stmt->execute([
        $fullname,
        $email,
        $username,
        $passwordHash,
        $role,
        STATUS_PENDING,
        $verificationToken
    ]);
    
    $userId = $pdo->lastInsertId();
    
    // Insert user meta data
    $stmt = $pdo->prepare('INSERT INTO user_meta (user_id, meta_key, meta_value) VALUES (?, ?, ?)');
    
    // Store registration IP
    $stmt->execute([
        $userId,
        'registration_ip',
        $_SERVER['REMOTE_ADDR']
    ]);
    
    // Store user agent
    $stmt->execute([
        $userId,
        'user_agent',
        $_SERVER['HTTP_USER_AGENT']
    ]);
    
    // Store company name
    if (!empty($companyName)) {
        $stmt->execute([
            $userId,
            'company_name',
            $companyName
        ]);
    }
    
    // Store company size
    if (!empty($companySize)) {
        $stmt->execute([
            $userId,
            'company_size',
            $companySize
        ]);
    }
    
    // Store phone number
    if (!empty($phoneNumber)) {
        $stmt->execute([
            $userId,
            'phone_number',
            $phoneNumber
        ]);
    }
    
    // Log the activity
    $stmt = $pdo->prepare('INSERT INTO activity_logs (user_id, action, ip_address, user_agent, details) VALUES (?, ?, ?, ?, ?)');
    $stmt->execute([
        $userId,
        'user_registered',
        $_SERVER['REMOTE_ADDR'],
        $_SERVER['HTTP_USER_AGENT'],
        'User registered and verification email sent'
    ]);
    
    // Commit transaction
    $pdo->commit();
    
    // Generate the verification link 
    $baseUrl = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https://' : 'http://';
    $baseUrl .= $_SERVER['HTTP_HOST'];
    $verificationLink = $baseUrl . '/verify-client.php?email=' . urlencode($email) . '&token=' . $verificationToken;
    
    // Prepare verification email
    $emailSubject = 'Verify Your Email - Backsure Global Support';
    $emailBody = "
    <html>
    <body>
        <h2>Welcome to Backsure Global Support!</h2>
        <p>Hello {$fullname},</p>
        <p>Thank you for signing up. Please verify your email address to complete your registration.</p>
        <p><a href='{$verificationLink}' style='background-color:#062767;color:white;padding:10px 20px;text-decoration:none;border-radius:4px;display:inline-block;'>Verify Email</a></p>
        <p>Or copy and paste this link into your browser:</p>
        <p>{$verificationLink}</p>
        <p>This link will expire in " . VERIFY_TOKEN_HOURS . " hours.</p>
        <p>If you did not sign up for an account, please ignore this email.</p>
        <p>Thanks,<br>
        Backsure Global Support Team</p>
    </body>
    </html>
    ";
    
    // Send the verification email using our function
    $emailSent = sendEmail($email, $emailSubject, $emailBody);
    
    // For demonstration, we'll just log it
    error_log('Verification email would be sent to: ' . $email);
    error_log('Verification link: ' . $verificationLink);
    
    // Return success response
    echo json_encode([
        'success' => true,
        'message' => 'Your account has been created successfully! Please check your email to verify your account.'
    ]);
    
} catch (PDOException $e) {
    // Rollback transaction on error
    if (isset($pdo) && $pdo->inTransaction()) {
        $pdo->rollBack();
    }
    
    // Log error
    error_log('Signup error: ' . $e->getMessage());
    
    echo json_encode(['success' => false, 'message' => 'A database error occurred. Please try again later.']);
}