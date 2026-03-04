<?php
/**
 * Installation Script for BSG Support Website
 * 
 * This script:
 * 1. Checks database connection
 * 2. Creates required database tables
 * 3. Sets up upload directories
 * 4. Creates initial admin user
 * 
 * IMPORTANT: Delete this file after successful installation!
 */

// Start session
session_start();

// Include database configuration
require_once 'db_config.php';

// Define upload directories
$upload_dirs = [
    'uploads/',
    'uploads/resumes/'
];

// Path to SQL file
$sql_file = 'database.sql';

// Installation steps
$steps = [
    'check_db' => [
        'name' => 'Database Connection',
        'status' => 'pending',
        'message' => ''
    ],
    'create_tables' => [
        'name' => 'Database Tables',
        'status' => 'pending',
        'message' => ''
    ],
    'create_dirs' => [
        'name' => 'Upload Directories',
        'status' => 'pending',
        'message' => ''
    ],
    'create_admin' => [
        'name' => 'Admin User',
        'status' => 'pending',
        'message' => ''
    ]
];

// Process installation
if (isset($_POST['install'])) {
    // Step 1: Check database connection
    try {
        $db = get_db_connection();
        $steps['check_db']['status'] = 'success';
        $steps['check_db']['message'] = 'Successfully connected to database.';
        
        // Step 2: Create tables
        try {
            // Read SQL file
            if (file_exists($sql_file)) {
                $sql = file_get_contents($sql_file);
                
                // Split SQL file into separate queries
                $queries = explode(';', $sql);
                
                // Execute each query
                foreach ($queries as $query) {
                    $query = trim($query);
                    if (!empty($query)) {
                        $db->exec($query);
                    }
                }
                
                $steps['create_tables']['status'] = 'success';
                $steps['create_tables']['message'] = 'Database tables created successfully.';
            } else {
                $steps['create_tables']['status'] = 'error';
                $steps['create_tables']['message'] = 'SQL file not found. Please upload database.sql file.';
            }
        } catch (PDOException $e) {
            $steps['create_tables']['status'] = 'error';
            $steps['create_tables']['message'] = 'Error creating tables: ' . $e->getMessage();
        }
        
        // Step 3: Create upload directories
        $dir_errors = [];
        foreach ($upload_dirs as $dir) {
            if (!file_exists($dir)) {
                if (!mkdir($dir, 0755, true)) {
                    $dir_errors[] = "Could not create directory: $dir";
                }
            } else if (!is_writable($dir)) {
                if (!chmod($dir, 0755)) {
                    $dir_errors[] = "Directory exists but is not writable: $dir";
                }
            }
        }
        
        if (empty($dir_errors)) {
            $steps['create_dirs']['status'] = 'success';
            $steps['create_dirs']['message'] = 'Upload directories created successfully.';
        } else {
            $steps['create_dirs']['status'] = 'error';
            $steps['create_dirs']['message'] = implode('<br>', $dir_errors);
        }
        
        // Step 4: Create admin user if form was submitted
        if (isset($_POST['admin_username']) && isset($_POST['admin_password'])) {
            $username = trim($_POST['admin_username']);
            $password = $_POST['admin_password'];
            $confirm_password = $_POST['confirm_password'];
            
            if (empty($username) || empty($password)) {
                $steps['create_admin']['status'] = 'error';
                $steps['create_admin']['message'] = 'Username and password are required.';
            } else if ($password !== $confirm_password) {
                $steps['create_admin']['status'] = 'error';
                $steps['create_admin']['message'] = 'Passwords do not match.';
            } else {
                try {
                    // Check if admin table exists, create if not
                    $db->exec("
                        CREATE TABLE IF NOT EXISTS `admins` (
                          `id` int(11) NOT NULL AUTO_INCREMENT,
                          `username` varchar(50) NOT NULL,
                          `password` varchar(255) NOT NULL,
                          `email` varchar(100) DEFAULT NULL,
                          `role` enum('admin','hr','content') NOT NULL DEFAULT 'admin',
                          `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
                          `last_login` datetime DEFAULT NULL,
                          PRIMARY KEY (`id`),
                          UNIQUE KEY `username` (`username`)
                        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
                    ");
                    
                    // Check if admin user already exists
                    $stmt = $db->prepare("SELECT COUNT(*) FROM admins WHERE username = ?");
                    $stmt->execute([$username]);
                    $user_exists = (int)$stmt->fetchColumn();
                    
                    if ($user_exists) {
                        $steps['create_admin']['status'] = 'warning';
                        $steps['create_admin']['message'] = 'Admin user already exists. You can log in with existing credentials.';
                    } else {
                        // Hash password
                        $hashed_password = password_hash($password, PASSWORD_DEFAULT);
                        
                        // Insert admin user
                        $stmt = $db->prepare("INSERT INTO admins (username, password, role) VALUES (?, ?, 'admin')");
                        $stmt->execute([$username, $hashed_password]);
                        
                        $steps['create_admin']['status'] = 'success';
                        $steps['create_admin']['message'] = 'Admin user created successfully.';
                    }
                } catch (PDOException $e) {
                    $steps['create_admin']['status'] = 'error';
                    $steps['create_admin']['message'] = 'Error creating admin user: ' . $e->getMessage();
                }
            }
        } else {
            $steps['create_admin']['status'] = 'pending';
            $steps['create_admin']['message'] = 'Please create an admin user.';
        }
        
    } catch (PDOException $e) {
        $steps['check_db']['status'] = 'error';
        $steps['check_db']['message'] = 'Database connection failed: ' . $e->getMessage();
    }
    
    // Check if all steps were successful
    $all_success = true;
    foreach ($steps as $step) {
        if ($step['status'] !== 'success' && $step['status'] !== 'warning') {
            $all_success = false;
            break;
        }
    }
    
    if ($all_success) {
        $_SESSION['installation_complete'] = true;
    }
}

// Generate SQL file content
if (isset($_POST['generate_sql'])) {
    $sql_content = <<<SQL
-- BSG Support Database Schema
-- Generated on: {$date_string}

-- Table structure for candidates
CREATE TABLE IF NOT EXISTS `candidates` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `position` varchar(100) NOT NULL,
  `resume_path` varchar(255) NOT NULL,
  `status` enum('New', 'Under Review', 'Shortlisted', 'Interviewed', 'Offered', 'Hired', 'Rejected') NOT NULL DEFAULT 'New',
  `submitted_at` datetime NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `notes` text,
  PRIMARY KEY (`id`),
  KEY `idx_email` (`email`),
  KEY `idx_status` (`status`),
  KEY `idx_submitted_at` (`submitted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table structure for inquiries
CREATE TABLE IF NOT EXISTS `inquiries` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `company` varchar(100) DEFAULT NULL,
  `form_type` enum('general_inquiry', 'meeting_request', 'service_intake') NOT NULL,
  `message` text NOT NULL,
  `status` enum('New', 'In Progress', 'Replied', 'Closed') NOT NULL DEFAULT 'New',
  `submitted_at` datetime NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `services` varchar(255) DEFAULT NULL,
  `meeting_date` date DEFAULT NULL,
  `meeting_time` varchar(20) DEFAULT NULL, 
  `timezone` varchar(20) DEFAULT NULL,
  `service_type` varchar(100) DEFAULT NULL,
  `business_industry` varchar(100) DEFAULT NULL,
  `implementation_timeline` varchar(50) DEFAULT NULL,
  `requirements` text DEFAULT NULL,
  `additional_comments` text DEFAULT NULL,
  `admin_notes` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_email` (`email`),
  KEY `idx_form_type` (`form_type`),
  KEY `idx_status` (`status`),
  KEY `idx_submitted_at` (`submitted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table structure for admin users
CREATE TABLE IF NOT EXISTS `admins` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `role` enum('admin','hr','content') NOT NULL DEFAULT 'admin',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_login` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
SQL;

    // Write to file
    file_put_contents($sql_file, $sql_content);
    
    // Redirect to refresh page
    header('Location: install.php?sql_generated=1');
    exit;
}

// Check if we need to display success message
$installation_complete = isset($_SESSION['installation_complete']) && $_SESSION['installation_complete'];
$sql_generated = isset($_GET['sql_generated']) && $_GET['sql_generated'] == 1;
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BSG Support - Installation</title>
    <style>
        body {
            font-family: 'Open Sans', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        header {
            margin-bottom: 30px;
            text-align: center;
            border-bottom: 1px solid #eee;
            padding-bottom: 20px;
        }
        h1 {
            color: #062767;
            margin-bottom: 10px;
        }
        .warning-box {
            background-color: #fff3cd;
            border: 1px solid #ffeeba;
            color: #856404;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
        }
        .alert {
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 15px;
        }
        .alert-success {
            background-color: #d4edda;
            border: 1px solid #c3e6cb;
            color: #155724;
        }
        .alert-error {
            background-color: #f8d7da;
            border: 1px solid #f5c6cb;
            color: #721c24;
        }
        .alert-warning {
            background-color: #fff3cd;
            border: 1px solid #ffeeba;
            color: #856404;
        }
        .alert-pending {
            background-color: #e2e3e5;
            border: 1px solid #d6d8db;
            color: #383d41;
        }
        .installation-steps {
            margin-bottom: 30px;
        }
        .step {
            margin-bottom: 15px;
            padding: 15px;
            border-radius: 5px;
            background-color: #f8f9fa;
            border: 1px solid #eee;
        }
        .step-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
        }
        .step-title {
            font-weight: bold;
            font-size: 1.1rem;
        }
        .step-status {
            padding: 3px 10px;
            border-radius: 3px;
            font-size: 0.8rem;
            font-weight: bold;
            text-transform: uppercase;
        }
        .status-success {
            background-color: #28a745;
            color: white;
        }
        .status-error {
            background-color: #dc3545;
            color: white;
        }
        .status-warning {
            background-color: #ffc107;
            color: #212529;
        }
        .status-pending {
            background-color: #6c757d;
            color: white;
        }
        .step-message {
            margin-top: 10px;
            padding: 10px;
            background-color: rgba(0,0,0,0.05);
            border-radius: 3px;
        }
        form {
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 5px;
            margin-bottom: 20px;
        }
        .form-group {
            margin-bottom: 15px;
        }
        label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
        }
        input[type="text"],
        input[type="password"],
        input[type="email"] {
            width: 100%;
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
            box-sizing: border-box;
        }
        button {
            background-color: #062767;
            color: white;
            border: none;
            padding: 10px 15px;
            border-radius: 4px;
            cursor: pointer;
            font-weight: bold;
        }
        button:hover {
            background-color: #051d4d;
        }
        .button-secondary {
            background-color: #6c757d;
        }
        .button-secondary:hover {
            background-color: #5a6268;
        }
        .completion-message {
            background-color: #d4edda;
            border: 1px solid #c3e6cb;
            color: #155724;
            padding: 20px;
            border-radius: 5px;
            margin-bottom: 20px;
            text-align: center;
        }
        .next-steps {
            margin-top: 30px;
        }
        .next-steps h3 {
            color: #062767;
            margin-bottom: 10px;
        }
        .next-steps ol {
            padding-left: 20px;
        }
        .next-steps li {
            margin-bottom: 10px;
        }
        .danger-zone {
            background-color: #f8d7da;
            border: 1px solid #f5c6cb;
            color: #721c24;
            padding: 15px;
            border-radius: 5px;
            margin-top: 30px;
        }
        .sql-generator {
            margin-top: 30px;
            padding: 15px;
            background-color: #e2e3e5;
            border-radius: 5px;
        }
    </style>
</head>
<body>
    <header>
        <h1>BSG Support - Installation</h1>
        <p>This script will help you set up the necessary components for your website.</p>
    </header>
    
    <div class="warning-box">
        <strong>Important:</strong> This installation script should be deleted after successful installation for security reasons.
    </div>
    
    <?php if ($sql_generated): ?>
    <div class="alert alert-success">
        <strong>Success!</strong> SQL file has been generated successfully. You can now proceed with the installation.
    </div>
    <?php endif; ?>
    
    <?php if ($installation_complete): ?>
    <div class="completion-message">
        <h2>🎉 Installation Complete!</h2>
        <p>Your BSG Support website has been successfully set up.</p>
    </div>
    
    <div class="next-steps">
        <h3>Next Steps:</h3>
        <ol>
            <li><strong>Delete this file (install.php)</strong> from your server for security reasons.</li>
            <li>Log in to your admin panel at <a href="admin-login.php">admin-login.php</a> using the credentials you created.</li>
            <li>Configure your website settings in the admin panel.</li>
            <li>Start managing job applications and inquiries!</li>
        </ol>
    </div>
    <?php else: ?>
    
    <?php if (!file_exists($sql_file)): ?>
    <div class="sql-generator">
        <h3>SQL File Generator</h3>
        <p>Before beginning the installation, you need to generate the database SQL file.</p>
        <form method="post" action="">
            <button type="submit" name="generate_sql">Generate SQL File</button>
        </form>
    </div>
    <?php else: ?>
    
    <div class="installation-steps">
        <?php foreach ($steps as $key => $step): ?>
        <div class="step">
            <div class="step-header">
                <div class="step-title"><?php echo $step['name']; ?></div>
                <div class="step-status status-<?php echo $step['status']; ?>">
                    <?php echo ucfirst($step['status']); ?>
                </div>
            </div>
            <?php if (!empty($step['message'])): ?>
            <div class="step-message"><?php echo $step['message']; ?></div>
            <?php endif; ?>
        </div>
        <?php endforeach; ?>
    </div>
    
    <?php if ($steps['create_admin']['status'] !== 'success'): ?>
    <form method="post" action="">
        <input type="hidden" name="install" value="1">
        
        <h3>Create Admin User</h3>
        <div class="form-group">
            <label for="admin_username">Username:</label>
            <input type="text" id="admin_username" name="admin_username" required>
        </div>
        <div class="form-group">
            <label for="admin_password">Password:</label>
            <input type="password" id="admin_password" name="admin_password" required>
        </div>
        <div class="form-group">
            <label for="confirm_password">Confirm Password:</label>
            <input type="password" id="confirm_password" name="confirm_password" required>
        </div>
        
        <button type="submit">Complete Installation</button>
    </form>
    <?php else: ?>
    <div class="danger-zone">
        <h3>⚠️ Important Security Notice</h3>
        <p>Now that you have successfully completed the installation:</p>
        <ol>
            <li><strong>Delete this file (install.php)</strong> from your server immediately.</li>
            <li>Make sure your database credentials are secure.</li>
            <li>Consider setting proper file permissions on your server.</li>
        </ol>
    </div>
    <?php endif; ?>
    
    <?php endif; // End SQL file check ?>
    <?php endif; // End installation complete check ?>
</body>
</html>