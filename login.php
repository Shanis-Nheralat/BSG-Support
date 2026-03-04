<?php
/**
 * Admin Login - Enhanced All-in-One Solution
 * 
 * This script handles both login form display and processing
 * with enhanced security features and integration with the unified authentication system.
 */

// Start session if not already started
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Include required files
require_once 'db.php';
require_once 'admin-auth.php';

// Initialize variables
$error = '';
$success = '';
$username = '';

// Check if user is already logged in
if (isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true) {
    // Redirect to admin dashboard
    header('Location: admin-dashboard.php');
    exit;
}

// Check for timeout message
if (isset($_GET['timeout']) && $_GET['timeout'] == 1) {
    $error = 'Your session has expired. Please log in again.';
}

// Check for logout message
if (isset($_GET['logout']) && $_GET['logout'] == 1) {
    $success = 'You have been successfully logged out.';
}

// Generate CSRF token if not exists
if (!isset($_SESSION['csrf_token'])) {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}

// Check for remember-me cookie
if (!isset($_SESSION['admin_logged_in']) && isset($_COOKIE['remember_token'])) {
    // Use the check_remember_me function from admin-auth.php
    if (function_exists('check_remember_me') && check_remember_me()) {
        // User was logged in via remember-me cookie, redirect to dashboard
        header('Location: admin-dashboard.php');
        exit;
    }
}

// Process login form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Verify CSRF token
    if (!isset($_POST['csrf_token']) || $_POST['csrf_token'] !== $_SESSION['csrf_token']) {
        $error = 'Invalid form submission. Please try again.';
    } else {
        // Get login data
        $username = trim($_POST['username'] ?? '');
        $password = $_POST['password'] ?? '';
        $remember = isset($_POST['remember']);
        
        // Basic validation
        if (empty($username) || empty($password)) {
            $error = 'Please enter both username and password.';
        } else {
            try {
                // Check if username is an email
                $is_email = filter_var($username, FILTER_VALIDATE_EMAIL);
                
                // Find user by username or email
                if ($is_email) {
                    $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ? AND status = 'active'");
                } else {
                    $stmt = $pdo->prepare("SELECT * FROM users WHERE username = ? AND status = 'active'");
                }
                
                $stmt->execute([$username]);
                $user = $stmt->fetch();
                
                // Check for brute force protection
                if ($user && isset($user['login_attempts']) && $user['login_attempts'] >= 5 && 
                    isset($user['last_attempt_time']) && strtotime($user['last_attempt_time']) > (time() - 900)) {
                    // Account is temporarily locked
                    $error = 'Too many failed login attempts. Please try again later or reset your password.';
                    
                    // Log failed login due to lockout
                    $stmt = $pdo->prepare("INSERT INTO admin_activity_log (user_id, username, action_type, details, ip_address) 
                                          VALUES (?, ?, 'login_failed', 'Account locked due to too many failed attempts', ?)");
                    $stmt->execute([$user['id'], $user['username'], $_SERVER['REMOTE_ADDR']]);
                } 
                // Verify password
                else if ($user && password_verify($password, $user['password'])) {
                    // Use admin_login from admin-auth.php if available
                    if (function_exists('admin_login')) {
                        // Login and check if successful
                        if (admin_login($username, $password, $remember)) {
                            // Redirect to dashboard or intended page
                            $redirect = $_SESSION['redirect_after_login'] ?? 'admin-dashboard.php';
                            unset($_SESSION['redirect_after_login']);
                            header("Location: $redirect");
                            exit;
                        } else {
                            $error = 'Authentication failed. Please try again.';
                        }
                    } else {
                        // Fallback to direct login if admin_login function is not available
                        // Reset login attempts
                        $stmt = $pdo->prepare("UPDATE users SET login_attempts = 0, last_attempt_time = NOW() WHERE id = ?");
                        $stmt->execute([$user['id']]);
                        
                        // Set session variables
                        $_SESSION['admin_logged_in'] = true;
                        $_SESSION['admin_id'] = $user['id'];
                        $_SESSION['admin_username'] = $user['username'];
                        $_SESSION['admin_role'] = $user['role'];
                        $_SESSION['admin_email'] = $user['email'];
                        $_SESSION['admin_name'] = $user['name'];
                        $_SESSION['ip_address'] = $_SERVER['REMOTE_ADDR'];
                        $_SESSION['login_time'] = time();
                        $_SESSION['last_activity'] = time();
                        
                        // Handle remember me
                        if ($remember) {
                            $token = bin2hex(random_bytes(32));
                            $expiry = time() + (30 * 24 * 60 * 60); // 30 days
                            
                            // Save token in database
                            $stmt = $pdo->prepare("UPDATE users SET remember_token = ?, token_expiry = ? WHERE id = ?");
                            $stmt->execute([$token, date('Y-m-d H:i:s', $expiry), $user['id']]);
                            
                            // Set cookie
                            setcookie('remember_token', $token, $expiry, '/', '', true, true);
                        }
                        
                        // Log successful login
                        $stmt = $pdo->prepare("INSERT INTO admin_activity_log (user_id, username, action_type, details, ip_address) 
                                             VALUES (?, ?, 'login', 'Successful login', ?)");
                        $stmt->execute([$user['id'], $user['username'], $_SERVER['REMOTE_ADDR']]);
                        
                        // Redirect to dashboard
                        header('Location: admin-dashboard.php');
                        exit;
                    }
                } else {
                    // Login failed
                    $error = 'Invalid username or password.';
                    
                    // Increment login attempts if user exists
                    if ($user && isset($user['id'])) {
                        $stmt = $pdo->prepare("UPDATE users SET login_attempts = login_attempts + 1, last_attempt_time = NOW() WHERE id = ?");
                        $stmt->execute([$user['id']]);
                        
                        // Log failed login
                        $stmt = $pdo->prepare("INSERT INTO admin_activity_log (user_id, username, action_type, details, ip_address) 
                                             VALUES (?, ?, 'login_failed', 'Failed login attempt', ?)");
                        $stmt->execute([$user['id'], $user['username'], $_SERVER['REMOTE_ADDR']]);
                    } else {
                        // Log failed login attempt for non-existent user
                        $stmt = $pdo->prepare("INSERT INTO admin_activity_log (username, action_type, details, ip_address) 
                                             VALUES (?, 'login_failed', 'Failed login attempt for non-existent user', ?)");
                        $stmt->execute([$username, $_SERVER['REMOTE_ADDR']]);
                    }
                }
            } catch (PDOException $e) {
                $error = 'A database error occurred. Please try again later.';
                error_log('Login error: ' . $e->getMessage());
            }
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Login | Backsure Global Support</title>
    <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css">
    <style>
        body {
            font-family: 'Open Sans', Arial, sans-serif;
            background-color: #f8f9fa;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
        }
        .login-container {
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            overflow: hidden;
            width: 100%;
            max-width: 400px;
        }
        .login-header {
            background-color: #062767;
            color: white;
            padding: 20px;
            text-align: center;
        }
        .login-header h1 {
            margin: 0;
            font-size: 1.5rem;
        }
        .login-body {
            padding: 30px;
        }
        .form-group {
            margin-bottom: 20px;
        }
        .form-group label {
            display: block;
            margin-bottom: 5px;
            font-weight: 600;
            color: #062767;
        }
        .form-group input {
            width: 100%;
            padding: 10px;
            border: 1px solid #ced4da;
            border-radius: 4px;
            box-sizing: border-box;
            font-family: inherit;
        }
        .form-group input:focus {
            border-color: #B19763;
            outline: none;
            box-shadow: 0 0 0 2px rgba(177, 151, 99, 0.2);
        }
        .form-check {
            margin-top: 15px;
        }
        .form-check-input {
            margin-right: 8px;
        }
        .form-check-label {
            font-weight: normal;
            color: #333;
        }
        .error-message {
            background-color: #f8d7da;
            color: #721c24;
            padding: 10px;
            border-radius: 4px;
            margin-bottom: 20px;
            font-size: 0.9rem;
        }
        .success-message {
            background-color: #d4edda;
            color: #155724;
            padding: 10px;
            border-radius: 4px;
            margin-bottom: 20px;
            font-size: 0.9rem;
        }
        .login-button {
            background-color: #062767;
            color: white;
            border: none;
            border-radius: 4px;
            padding: 12px;
            font-weight: 600;
            cursor: pointer;
            width: 100%;
            font-family: inherit;
            font-size: 1rem;
            transition: background-color 0.2s;
        }
        .login-button:hover {
            background-color: #051d4d;
        }
        .links {
            display: flex;
            justify-content: space-between;
            margin-top: 20px;
            font-size: 0.9rem;
        }
        .links a {
            color: #062767;
            text-decoration: none;
        }
        .links a:hover {
            text-decoration: underline;
        }
        .form-icon {
            position: relative;
        }
        .form-icon i {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            left: 10px;
            color: #6c757d;
        }
        .form-icon input {
            padding-left: 35px;
        }
        .password-toggle {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            right: 10px;
            color: #6c757d;
            cursor: pointer;
        }
    </style>
</head>
<body>
    <div class="login-container">
        <div class="login-header">
            <h1>BSG Support Admin</h1>
        </div>
        <div class="login-body">
            <?php if (!empty($error)): ?>
            <div class="error-message">
                <?php echo htmlspecialchars($error); ?>
            </div>
            <?php endif; ?>
            
            <?php if (!empty($success)): ?>
            <div class="success-message">
                <?php echo htmlspecialchars($success); ?>
            </div>
            <?php endif; ?>
            
            <form method="post" action="">
                <!-- CSRF Protection -->
                <input type="hidden" name="csrf_token" value="<?php echo $_SESSION['csrf_token']; ?>">
                
                <div class="form-group">
                    <label for="username">Username or Email</label>
                    <div class="form-icon">
                        <i class="fas fa-user"></i>
                        <input type="text" id="username" name="username" value="<?php echo htmlspecialchars($username); ?>" required autofocus>
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="password">Password</label>
                    <div class="form-icon">
                        <i class="fas fa-lock"></i>
                        <input type="password" id="password" name="password" required>
                        <span class="password-toggle" onclick="togglePasswordVisibility()">
                            <i class="far fa-eye" id="password-toggle-icon"></i>
                        </span>
                    </div>
                </div>
                
                <div class="form-group">
                    <div class="form-check">
                        <input type="checkbox" class="form-check-input" id="remember" name="remember">
                        <label class="form-check-label" for="remember">Remember me</label>
                    </div>
                </div>
                
                <button type="submit" class="login-button">Sign In</button>
            </form>
            
            <div class="links">
                <a href="forgot-password.php">Forgot Password?</a>
                <a href="/" class="back-link">&larr; Back to Website</a>
            </div>
        </div>
    </div>

    <script>
        function togglePasswordVisibility() {
            const passwordField = document.getElementById('password');
            const passwordToggleIcon = document.getElementById('password-toggle-icon');
            
            if (passwordField.type === 'password') {
                passwordField.type = 'text';
                passwordToggleIcon.classList.remove('fa-eye');
                passwordToggleIcon.classList.add('fa-eye-slash');
            } else {
                passwordField.type = 'password';
                passwordToggleIcon.classList.remove('fa-eye-slash');
                passwordToggleIcon.classList.add('fa-eye');
            }
        }
    </script>
</body>
</html>
