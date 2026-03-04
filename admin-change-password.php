<?php
/**
 * Admin Change Password
 * Allows admin users to change their password
 */

// Authentication and permissions
require_once 'admin-auth.php';
require_admin_auth();

// Include notifications system
require_once 'admin-notifications.php';

// Process form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['change_password'])) {
    $current_password = $_POST['current_password'] ?? '';
    $new_password = $_POST['new_password'] ?? '';
    $confirm_password = $_POST['confirm_password'] ?? '';
    
    // Validate inputs
    $errors = [];
    
    if (empty($current_password)) {
        $errors[] = "Current password is required.";
    }
    
    if (empty($new_password)) {
        $errors[] = "New password is required.";
    } elseif (strlen($new_password) < 8) {
        $errors[] = "New password must be at least 8 characters.";
    }
    
    if ($new_password !== $confirm_password) {
        $errors[] = "New passwords do not match.";
    }
    
    // If no validation errors, proceed with password change
    if (empty($errors)) {
        try {
            // Get database connection
            $db = get_db_connection();
            
            // Get current user data
            $stmt = $db->prepare("SELECT password FROM admins WHERE id = ?");
            $stmt->execute([$_SESSION['admin_id']]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            
            // Verify current password
            if ($user && password_verify($current_password, $user['password'])) {
                // Hash new password
                $password_hash = password_hash($new_password, PASSWORD_DEFAULT);
                
                // Update password
                $update_stmt = $db->prepare("UPDATE admins SET password = ? WHERE id = ?");
                $update_stmt->execute([$password_hash, $_SESSION['admin_id']]);
                
                // Set success message
                set_success_message("Password changed successfully.");
                
                // Log the activity
                log_admin_action("password_changed", "admins", $_SESSION['admin_id'], "Password changed");
                
                // Redirect to profile page
                header("Location: admin-profile.php");
                exit;
            } else {
                $errors[] = "Current password is incorrect.";
            }
        } catch (PDOException $e) {
            $errors[] = "Database error: " . $e->getMessage();
        }
    }
    
    // If there are errors, set error messages
    if (!empty($errors)) {
        foreach ($errors as $error) {
            set_error_message($error);
        }
    }
}

// Get admin info
$admin_user = get_admin_user();
$admin_username = $admin_user['username'];
$admin_role = $admin_user['role'];

// Page variables
$page_title = 'Change Password';
$current_page = 'profile';
$breadcrumbs = [
    ['title' => 'Dashboard', 'url' => 'admin-dashboard.php'],
    ['title' => 'My Profile', 'url' => 'admin-profile.php'],
    ['title' => 'Change Password', 'url' => '#']
];

// Base URL for assets
$scriptPath = $_SERVER['SCRIPT_NAME'];
$parentDir = dirname($scriptPath);
$baseUrl = rtrim($parentDir, '/') . '/';

// Include templates
include 'admin-head.php';
include 'admin-sidebar.php';
?>

<main class="admin-main">
  <?php include 'admin-header.php'; ?>
  
  <!-- Change Password Content -->
  <div class="admin-content container-fluid py-4">
    <div class="row mb-4">
      <div class="col-12">
        <div class="d-flex justify-content-between align-items-center">
          <h1 class="h3 mb-0 text-gray-800">Change Password</h1>
        </div>
      </div>
    </div>
    
    <div class="row">
      <div class="col-lg-6 mx-auto">
        <div class="card shadow mb-4">
          <div class="card-header py-3">
            <h6 class="m-0 font-weight-bold text-primary">Update Your Password</h6>
          </div>
          <div class="card-body">
            <form method="POST" action="admin-change-password.php">
              <div class="mb-3">
                <label for="current_password" class="form-label">Current Password</label>
                <input type="password" class="form-control" id="current_password" name="current_password" required>
              </div>
              
              <div class="mb-3">
                <label for="new_password" class="form-label">New Password</label>
                <input type="password" class="form-control" id="new_password" name="new_password" required>
                <div class="form-text">Password must be at least 8 characters long.</div>
              </div>
              
              <div class="mb-4">
                <label for="confirm_password" class="form-label">Confirm New Password</label>
                <input type="password" class="form-control" id="confirm_password" name="confirm_password" required>
              </div>
              
              <div class="d-flex justify-content-between">
                <a href="admin-profile.php" class="btn btn-secondary">
                  <i class="fas fa-arrow-left me-2"></i> Back to Profile
                </a>
                <button type="submit" name="change_password" class="btn btn-primary">
                  <i class="fas fa-key me-2"></i> Change Password
                </button>
              </div>
            </form>
          </div>
        </div>
        
        <div class="card shadow">
          <div class="card-header py-3">
            <h6 class="m-0 font-weight-bold text-primary">Password Guidelines</h6>
          </div>
          <div class="card-body">
            <div class="mb-2">
              <i class="fas fa-check-circle text-success me-2"></i>
              Use at least 8 characters
            </div>
            <div class="mb-2">
              <i class="fas fa-check-circle text-success me-2"></i>
              Include uppercase and lowercase letters
            </div>
            <div class="mb-2">
              <i class="fas fa-check-circle text-success me-2"></i>
              Include at least one number
            </div>
            <div>
              <i class="fas fa-check-circle text-success me-2"></i>
              Include at least one special character (e.g., !@#$%^&*)
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <?php include 'admin-footer.php'; ?>
</main>

<script>
document.addEventListener('DOMContentLoaded', function() {
  // Password strength validation
  const newPasswordInput = document.getElementById('new_password');
  const confirmPasswordInput = document.getElementById('confirm_password');
  
  if (newPasswordInput && confirmPasswordInput) {
    // Check password match
    confirmPasswordInput.addEventListener('input', function() {
      if (this.value !== newPasswordInput.value) {
        this.setCustomValidity("Passwords don't match");
      } else {
        this.setCustomValidity('');
      }
    });
    
    newPasswordInput.addEventListener('input', function() {
      if (confirmPasswordInput.value !== '' && confirmPasswordInput.value !== this.value) {
        confirmPasswordInput.setCustomValidity("Passwords don't match");
      } else {
        confirmPasswordInput.setCustomValidity('');
      }
    });
  }
});
</script>
</div><!-- .admin-container -->
</body>
</html>
