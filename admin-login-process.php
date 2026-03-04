<?php
/**
 * Admin Login Process
 * Handles admin authentication with enhanced security
 */

// IMPORTANT: No whitespace, comments, or output before this point!
// Start session first thing
session_start();

// Enable error logging - but don't display errors
ini_set('display_errors', 0);
ini_set('log_errors', 1);
error_reporting(E_ALL);

// Include database configuration
try {
    require_once 'db.php';
} catch (Exception $e) {
    error_log('Admin login config error: ' . $e->getMessage());
    header("Location: admin-login.php?error=" . urlencode("Configuration error. Please contact the administrator."));
    exit;
}

// Check if the request is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header("Location: admin-login.php?error=" . urlencode("Invalid request method."));
    exit;
}

// Get login data
$username = isset($_POST['username']) ? trim($_POST['username']) : '';
$password = isset($_POST['password']) ? $_POST['password'] : '';
$remember = isset($_POST['remember']) ? (bool)$_POST['remember'] : false;

// Validate inputs
$errors = [];

if (empty($username)) {
    $errors[] = 'Username is required.';
}

if (empty($password)) {
    $errors[] = 'Password is required.';
}

// If there are validation errors, return them
if (!empty($errors)) {
    header("Location: admin-login.php?error=" . urlencode(implode(' ', $errors)));
    exit;
}

try {
    // Use the function from db.php
    $pdo = get_db_connection();
    
    // Check if admins table exists
    $tables_stmt = $pdo->query("SHOW TABLES LIKE 'admins'");
    $table_exists = $tables_stmt->fetchColumn();
    
    if (!$table_exists) {
        $tables_stmt = $pdo->query("SHOW TABLES LIKE 'admin_users'");
        $admin_users_exists = $tables_stmt->fetchColumn();
        
        if (!$admin_users_exists) {
            error_log('Admin login: Neither admins nor admin_users table exists');
            header("Location: admin-login.php?error=" . urlencode("Admin system not set up properly. Tables do not exist."));
            exit;
        } else {
            $table_name = 'admin_users';
        }
    } else {
        $table_name = 'admins';
    }
    
    // Check if username is an email
    $isEmail = filter_var($username, FILTER_VALIDATE_EMAIL);
    
    // Find admin by username or email
    if ($isEmail) {
        $stmt = $pdo->prepare("SELECT id, username, email, password, role, status, login_attempts, last_attempt_time FROM $table_name WHERE email = ?");
    } else {
        $stmt = $pdo->prepare("SELECT id, username, email, password, role, status, login_attempts, last_attempt_time FROM $table_name WHERE username = ?");
    }
    
    $stmt->execute([$username]);
    $admin = $stmt->fetch();
    
    // If admin not found
    if (!$admin) {
        // For security, use the same message for non-existent accounts to prevent user enumeration
        error_log('Admin login: Failed attempt for username: ' . $username . ' from IP: ' . $_SERVER['REMOTE_ADDR']);
        header("Location: admin-login.php?error=" . urlencode("Invalid username or password."));
        exit;
    }
    
    // Check if account is blocked
    if (isset($admin['status']) && $admin['status'] === 'blocked') {
        error_log('Admin login: Blocked account login attempt for user ID: ' . $admin['id'] . ' from IP: ' . $_SERVER['REMOTE_ADDR']);
        header("Location: admin-login.php?error=" . urlencode("Your account has been blocked. Please contact support."));
        exit;
    }
    
    // Verify password
    if (!password_verify($password, $admin['password'])) {
        // Increment login attempts if that column exists
        if (isset($admin['login_attempts'])) {
            $stmt = $pdo->prepare("UPDATE $table_name SET login_attempts = login_attempts + 1, last_attempt_time = NOW() WHERE id = ?");
            $stmt->execute([$admin['id']]);
        }
        
        error_log('Admin login: Failed password for user ID: ' . $admin['id'] . ' from IP: ' . $_SERVER['REMOTE_ADDR']);
        header("Location: admin-login.php?error=" . urlencode("Invalid username or password."));
        exit;
    }
    
    // Reset login attempts on successful login if that column exists
    if (isset($admin['login_attempts'])) {
        $stmt = $pdo->prepare("UPDATE $table_name SET login_attempts = 0, last_login = NOW() WHERE id = ?");
        $stmt->execute([$admin['id']]);
    }
    
    // Set session variables
    $_SESSION['admin_logged_in'] = true;
    $_SESSION['admin_id'] = $admin['id'];
    $_SESSION['admin_username'] = $admin['username'] ?? '';
    $_SESSION['admin_role'] = $admin['role'] ?? 'admin';
    
    // Set current IP for session security
    $_SESSION['ip_address'] = $_SERVER['REMOTE_ADDR'];
    
    // Generate session token for CSRF protection
    $_SESSION['token'] = bin2hex(random_bytes(32));
    
    // Determine redirect based on role
    $redirectUrl = 'admin-dashboard.php';
    
    error_log('Admin login: Successful login for user ID: ' . $admin['id'] . ' from IP: ' . $_SERVER['REMOTE_ADDR']);
    
    // Direct redirect instead of JSON response
    header("Location: $redirectUrl");
    exit;
    
} catch (PDOException $e) {
    error_log('Admin login error: ' . $e->getMessage());
    
    header("Location: admin-login.php?error=" . urlencode("A database error occurred. Please try again later."));
    exit;
} catch (Exception $e) {
    error_log('Admin login general error: ' . $e->getMessage());
    
    header("Location: admin-login.php?error=" . urlencode("An error occurred. Please try again later."));
    exit;
}
