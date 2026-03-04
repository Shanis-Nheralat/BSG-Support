<?php
/**
 * Reset Password for BSG Support Admin
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
$validToken = false;
$email = '';

// Verify token
if (isset($_GET['email']) && isset($_GET['token'])) {
    $email = filter_var($_GET['email'], FILTER_VALIDATE_EMAIL);
    $token = $_GET['token'];
    
    if (!$email || !$token) {
        $message = 'Invalid password reset link.';
        $messageType = 'danger';
    } else {
        try {
            // Check if token exists and is valid
            $stmt = $pdo->prepare("SELECT * FROM password_resets WHERE email = ? AND token = ? AND expires_at > NOW()");
            $stmt->execute([$email, $token]);
            $reset = $stmt->fetch();
            
            if ($reset) {
                $validToken = true;
            } else {
                $message = 'This password reset link is invalid or has expired.';
                $messageType = 'danger';
            }
        } catch (PDOException $e) {
            $message = 'An error occurred. Please try again later.';
            $messageType = 'danger';
            error_log("Password Reset Verification Error: " . $e->getMessage());
        }
    }
} else {
    $message = 'Invalid password reset link.';
    $messageType = 'danger';
}

// Process password reset
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $validToken) {
    $password = $_POST['password'] ?? '';
    $confirmPassword = $_POST['confirm_password'] ?? '';
    
    // Validate password
    if (strlen($password) < 8) {
        $message = 'Password must be at least 8 characters long.';
        $messageType = 'danger';
    } elseif ($password !== $confirmPassword) {
        $message = 'Passwords do not match.';
        $messageType = 'danger';
    } else {
        try {
            // Hash the new password
            $passwordHash = password_hash($password, PASSWORD_DEFAULT);
            
            // Update the user's password
            $stmt = $pdo->prepare("UPDATE users SET password = ? WHERE email = ? AND status = 'active'");
            $stmt->execute([$passwordHash, $email]);
            
            if ($stmt->rowCount() > 0) {
                // Delete used token
                $stmt = $pdo->prepare("DELETE FROM password_resets WHERE email = ?");
                $stmt->execute([$email]);
                
                // Get user details for logging
                $stmt = $pdo->prepare("SELECT id, username FROM users WHERE email = ?");
                $stmt->execute([$email]);
                $user = $stmt->fetch();
                
                // Log password reset
                if ($user) {
                    $stmt = $pdo->prepare("INSERT INTO admin_activity_log (user_id, username, action_type, details, ip_address) 
                                         VALUES (?, ?, 'password_reset', 'Password reset successfully', ?)");
                    $stmt->execute([$user['id'], $user['username'], $_SERVER['REMOTE_ADDR']]);
                }
                
                $message = 'Your password has been reset successfully. You can now <a href="login.php">login</a> with your new password.';
                $messageType = 'success';
                $validToken = false; // Hide the form
            } else {
                $message = 'Email address not found or account inactive.';
                $messageType = 'danger';
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
    <title>Reset Password - BSG Support Admin</title>
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
        .reset-password-container {
            max-width: 450px;
            width: 100%;
            padding: 2rem;
            background: white;
            border-radius: 8px;
            box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
        }
        .reset-password-header {
            background: #0b2e59;
            margin: -2rem -2rem 2rem -2rem;
            padding: 1.5rem;
            color: white;
            text-align: center;
            border-top-left-radius: 8px;
            border-top-right-radius: 8px;
        }
        .password-field {
            position: relative;
        }
        .password-toggle {
            position: absolute;
            right: 10px;
            top: 10px;
            cursor: pointer;
            color: #6c757d;
        }
        .password-strength {
            height: 5px;
            margin-top: 5px;
            border-radius: 2px;
            background-color: #e9ecef;
        }
        .password-strength-fill {
            height: 100%;
            border-radius: 2px;
            transition: width 0.3s, background-color 0.3s;
        }
    </style>
</head>
<body>
    <div class="reset-password-container">
        <div class="reset-password-header">
            <h3 class="m-0">Reset Password</h3>
        </div>
        
        <?php if (!empty($message)): ?>
            <div class="alert alert-<?php echo $messageType; ?>" role="alert">
                <?php echo $message; ?>
            </div>
        <?php endif; ?>
        
        <?php if ($validToken): ?>
            <p class="mb-4">Enter your new password below.</p>
            
            <form method="post">
                <div class="mb-3">
                    <label for="password" class="form-label">New Password</label>
                    <div class="input-group password-field">
                        <span class="input-group-text"><i class="fas fa-lock"></i></span>
                        <input type="password" class="form-control" id="password" name="password" required minlength="8" oninput="checkPasswordStrength(this.value)">
                        <span class="password-toggle" onclick="togglePasswordVisibility('password', 'password-toggle-icon')">
                            <i class="far fa-eye" id="password-toggle-icon"></i>
                        </span>
                    </div>
                    <div class="password-strength">
                        <div class="password-strength-fill" id="password-strength-meter"></div>
                    </div>
                    <small id="password-strength-text" class="form-text text-muted">Password must be at least 8 characters long</small>
                </div>
                
                <div class="mb-4">
                    <label for="confirm_password" class="form-label">Confirm Password</label>
                    <div class="input-group password-field">
                        <span class="input-group-text"><i class="fas fa-lock"></i></span>
                        <input type="password" class="form-control" id="confirm_password" name="confirm_password" required minlength="8" oninput="checkPasswordMatch()">
                        <span class="password-toggle" onclick="togglePasswordVisibility('confirm_password', 'confirm-password-toggle-icon')">
                            <i class="far fa-eye" id="confirm-password-toggle-icon"></i>
                        </span>
                    </div>
                    <small id="password-match-text" class="form-text"></small>
                </div>
                
                <div class="d-grid mb-3">
                    <button type="submit" class="btn btn-primary" id="submit-btn">Reset Password</button>
                </div>
            </form>
        <?php elseif ($messageType !== 'success'): ?>
            <div class="text-center">
                <a href="forgot-password.php" class="btn btn-primary">Request New Reset Link</a>
            </div>
        <?php endif; ?>
        
        <div class="text-center mt-3">
            <a href="login.php" class="text-decoration-none">Back to Login</a>
        </div>
    </div>

    <script>
        function togglePasswordVisibility(fieldId, iconId) {
            const passwordField = document.getElementById(fieldId);
            const passwordToggleIcon = document.getElementById(iconId);
            
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
        
        function checkPasswordStrength(password) {
            const meter = document.getElementById('password-strength-meter');
            const text = document.getElementById('password-strength-text');
            const submitBtn = document.getElementById('submit-btn');
            
            // Check password strength
            let strength = 0;
            
            // Length check
            if (password.length >= 8) strength += 25;
            
            // Character type checks
            if (password.match(/[a-z]+/)) strength += 25;
            if (password.match(/[A-Z]+/)) strength += 25;
            if (password.match(/[0-9]+/)) strength += 12.5;
            if (password.match(/[^a-zA-Z0-9]+/)) strength += 12.5;
            
            // Update meter
            meter.style.width = strength + '%';
            
            // Update color and text
            if (strength < 25) {
                meter.style.backgroundColor = '#dc3545'; // Red
                text.textContent = 'Very weak';
                text.style.color = '#dc3545';
                submitBtn.disabled = true;
            } else if (strength < 50) {
                meter.style.backgroundColor = '#ffc107'; // Yellow
                text.textContent = 'Weak';
                text.style.color = '#ffc107';
                submitBtn.disabled = true;
            } else if (strength < 75) {
                meter.style.backgroundColor = '#fd7e14'; // Orange
                text.textContent = 'Moderate';
                text.style.color = '#fd7e14';
                submitBtn.disabled = false;
            } else {
                meter.style.backgroundColor = '#28a745'; // Green
                text.textContent = 'Strong';
                text.style.color = '#28a745';
                submitBtn.disabled = false;
            }
            
            // Also check match if confirm field has a value
            const confirmPassword = document.getElementById('confirm_password').value;
            if (confirmPassword) {
                checkPasswordMatch();
            }
        }
        
        function checkPasswordMatch() {
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm_password').value;
            const matchText = document.getElementById('password-match-text');
            const submitBtn = document.getElementById('submit-btn');
            
            if (!confirmPassword) {
                matchText.textContent = '';
                return;
            }
            
            if (password === confirmPassword) {
                matchText.textContent = 'Passwords match';
                matchText.style.color = '#28a745';
                submitBtn.disabled = false;
            } else {
                matchText.textContent = 'Passwords do not match';
                matchText.style.color = '#dc3545';
                submitBtn.disabled = true;
            }
        }
    </script>
</body>
</html>
