<?php
/**
 * Forgot Password for BSG Support Admin
 * Displays and processes password reset requests
 */

// Start session if not already started
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Include required files
require_once 'db.php';
require_once 'admin-auth.php';

// Redirect if already logged in
if (is_admin_logged_in()) {
    header('Location: admin-dashboard.php');
    exit;
}

// Initialize variables
$message = '';
$messageType = '';

// Process form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = filter_var($_POST['email'] ?? '', FILTER_VALIDATE_EMAIL);
    
    if (!$email) {
        $message = 'Please enter a valid email address.';
        $messageType = 'danger';
    } else {
        try {
            // Check if email exists
            $stmt = $pdo->prepare("SELECT id, username, name FROM users WHERE email = ? AND status = 'active'");
            $stmt->execute([$email]);
            $user = $stmt->fetch();
            
            if ($user) {
                // Generate token
                $token = bin2hex(random_bytes(32));
                $expires = date('Y-m-d H:i:s', time() + 3600); // 1 hour expiry
                
                // Delete any existing tokens for this email
                $stmt = $pdo->prepare("DELETE FROM password_resets WHERE email = ?");
                $stmt->execute([$email]);
                
                // Store new token
                $stmt = $pdo->prepare("INSERT INTO password_resets (email, token, expires_at) VALUES (?, ?, ?)");
                $stmt->execute([$email, $token, $expires]);
                
                // Create reset link
                $baseUrl = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https://' : 'http://';
                $baseUrl .= $_SERVER['HTTP_HOST'];
                $resetUrl = $baseUrl . '/reset-password.php?email=' . urlencode($email) . '&token=' . $token;
                
                // In Phase 1 (no email integration yet), show the reset link on screen
                // This will be replaced with actual email sending in Phase 2
                $message = "A password reset link has been generated. <br><strong>In Phase 1 (no email yet):</strong> <a href=\"$resetUrl\">$resetUrl</a>";
                $messageType = 'success';
                
                // Log the reset request
                $stmt = $pdo->prepare("INSERT INTO admin_activity_log (user_id, username, action_type, details, ip_address) 
                                     VALUES (?, ?, 'password_reset_request', 'Password reset requested', ?)");
                $stmt->execute([$user['id'], $user['username'], $_SERVER['REMOTE_ADDR']]);
                
                // Phase 2: Send email using mailer.php
                if (function_exists('send_password_reset_email')) {
                    $result = send_password_reset_email($email, $user['name'], $resetUrl);
                    if (!$result['success']) {
                        error_log('Error sending password reset email: ' . $result['message']);
                    }
                }
            } else {
                // Don't reveal if email exists or not (security best practice)
                $message = 'If your email exists in our system, you will receive a password reset link shortly.';
                $messageType = 'info';
            }
        } catch (PDOException $e) {
            $message = 'An error occurred. Please try again later.';
            $messageType = 'danger';
            error_log("Password Reset Error: " . $e->getMessage());
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Forgot Password - BSG Support Admin</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        body {
            background-color: #f8f9fa;
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .forgot-password-container {
            max-width: 450px;
            width: 100%;
            padding: 2rem;
            background: white;
            border-radius: 8px;
            box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
        }
        .forgot-password-header {
            background: #0b2e59;
            margin: -2rem -2rem 2rem -2rem;
            padding: 1.5rem;
            color: white;
            text-align: center;
            border-top-left-radius: 8px;
            border-top-right-radius: 8px;
        }
    </style>
</head>
<body>
    <div class="forgot-password-container">
        <div class="forgot-password-header">
            <h3 class="m-0">Forgot Password</h3>
        </div>
        
        <?php if (!empty($message)): ?>
            <div class="alert alert-<?php echo $messageType; ?>" role="alert">
                <?php echo $message; ?>
            </div>
        <?php endif; ?>
        
        <p class="mb-4">Enter your email address and we will send you a link to reset your password.</p>
        
        <form method="post">
            <div class="mb-4">
                <label for="email" class="form-label">Email address</label>
                <div class="input-group">
                    <span class="input-group-text"><i class="fas fa-envelope"></i></span>
                    <input type="email" class="form-control" id="email" name="email" required>
                </div>
            </div>
            
            <div class="d-grid mb-3">
                <button type="submit" class="btn btn-primary">Send Reset Link</button>
            </div>
            
            <div class="text-center">
                <a href="login.php" class="text-decoration-none">Back to Login</a>
            </div>
        </form>
    </div>
</body>
</html>
