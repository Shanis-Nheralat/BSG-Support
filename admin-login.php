<?php
/**
 * Admin Login - All-in-One Solution
 * 
 * This script handles both the login form display and processing
 * to simplify troubleshooting in a cPanel environment.
 */

// Start session
session_start();

// Initialize error message
$error = '';
$success = '';

// Check if user is already logged in
if (isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true) {
    // Redirect to admin dashboard
    header('Location: admin-dashboard.php');
    exit;
}

// Process login form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get login data
    $username = trim($_POST['username'] ?? '');
    $password = $_POST['password'] ?? '';
    
    // Basic validation
    if (empty($username) || empty($password)) {
        $error = 'Please enter both username and password.';
    } else {
        try {
            // Use shared database connection
            require_once 'db.php';
            $db = $pdo;
            
            // Check for admins table
            $table_exists = false;
            $table_name = '';
            
            // Check if admins table exists
            $stmt = $db->query("SHOW TABLES LIKE 'admins'");
            if ($stmt->rowCount() > 0) {
                $table_exists = true;
                $table_name = 'admins';
            } else {
                // Check if users table exists (used by admin-auth.php)
                $stmt = $db->query("SHOW TABLES LIKE 'users'");
                if ($stmt->rowCount() > 0) {
                    $table_exists = true;
                    $table_name = 'users';
                } else {
                    // Check if admin_users table exists
                    $stmt = $db->query("SHOW TABLES LIKE 'admin_users'");
                    if ($stmt->rowCount() > 0) {
                        $table_exists = true;
                        $table_name = 'admin_users';
                    }
                }
            }
            
            if (!$table_exists) {
                $error = 'Admin system not set up. Please run the installation script first.';
                
                // For demo/testing purpose only - create admin table and a test user
                if ($username === 'setup' && $password === 'install') {
                    $db->exec("CREATE TABLE IF NOT EXISTS admins (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        username VARCHAR(255) NOT NULL UNIQUE,
                        password VARCHAR(255) NOT NULL,
                        email VARCHAR(255),
                        role VARCHAR(50) DEFAULT 'admin',
                        status VARCHAR(20) DEFAULT 'active',
                        login_attempts INT DEFAULT 0,
                        last_attempt_time DATETIME,
                        last_login DATETIME,
                        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
                    )");
                    
                    // Create a test admin user
                    $admin_username = 'admin';
                    $admin_password = password_hash('admin123', PASSWORD_DEFAULT);
                    $admin_email = 'admin@example.com';
                    
                    $stmt = $db->prepare("INSERT INTO admins (username, password, email, role) VALUES (?, ?, ?, 'admin')");
                    $stmt->execute([$admin_username, $admin_password, $admin_email]);
                    
                    $success = 'Admin table and test user created. Username: admin, Password: admin123';
                    $table_exists = true;
                    $table_name = 'admins';
                }
            }
            
            if ($table_exists && empty($success)) {
                // Check if username is an email
                $is_email = filter_var($username, FILTER_VALIDATE_EMAIL);
                
                // Find user by username or email
                if ($is_email) {
                    $stmt = $db->prepare("SELECT * FROM $table_name WHERE email = ?");
                } else {
                    $stmt = $db->prepare("SELECT * FROM $table_name WHERE username = ?");
                }
                
                $stmt->execute([$username]);
                $user = $stmt->fetch();
                
                if ($user && password_verify($password, $user['password'])) {
                    // Login successful
                    $_SESSION['admin_logged_in'] = true;
                    $_SESSION['admin_id'] = $user['id'];
                    $_SESSION['admin_username'] = $user['username'];
                    $_SESSION['admin_role'] = $user['role'];
                    
                    // Update last login timestamp
                    $update_stmt = $db->prepare("UPDATE $table_name SET last_login = NOW() WHERE id = ?");
                    $update_stmt->execute([$user['id']]);
                    
                    // Redirect to admin dashboard
                    header('Location: admin-dashboard.php');
                    exit;
                } else {
                    $error = 'Invalid username or password.';
                }
            }
        } catch (PDOException $e) {
            $error = 'Database error: ' . $e->getMessage();
            error_log('Login error: ' . $e->getMessage());
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
        .back-link {
            text-align: center;
            margin-top: 20px;
        }
        .back-link a {
            color: #062767;
            text-decoration: none;
            font-size: 0.9rem;
        }
        .back-link a:hover {
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
                <div class="form-group">
                    <label for="username">Username</label>
                    <div class="form-icon">
                        <i class="fas fa-user"></i>
                        <input type="text" id="username" name="username" required autofocus>
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="password">Password</label>
                    <div class="form-icon">
                        <i class="fas fa-lock"></i>
                        <input type="password" id="password" name="password" required>
                    </div>
                </div>
                
                <button type="submit" class="login-button">Sign In</button>
            </form>
            
            <div class="back-link">
                <a href="index.html">&larr; Back to Website</a>
            </div>
        </div>
    </div>
</body>
</html>
