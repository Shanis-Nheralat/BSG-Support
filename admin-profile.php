<?php
/**
 * Admin Profile Page
 * Allows viewing and editing of admin profile information
 */

// Authentication and permissions
require_once 'admin-auth.php';
require_admin_auth();

// Include notifications system
require_once 'admin-notifications.php';

// Process form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Process profile update
    if (isset($_POST['update_profile'])) {
        // Sanitize input
        $full_name = filter_input(INPUT_POST, 'full_name', FILTER_SANITIZE_STRING);
        $email = filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL);
        $phone = filter_input(INPUT_POST, 'phone', FILTER_SANITIZE_STRING);
        $department = filter_input(INPUT_POST, 'department', FILTER_SANITIZE_STRING);
        $bio = filter_input(INPUT_POST, 'bio', FILTER_SANITIZE_STRING);
        
        // Get notification preferences
        $notify_email = isset($_POST['notify_email']) ? 1 : 0;
        $notify_system = isset($_POST['notify_system']) ? 1 : 0;
        $notify_sms = isset($_POST['notify_sms']) ? 1 : 0;
        
        try {
            // Get database connection
            $db = get_db_connection();
            
            // Update profile
            $stmt = $db->prepare("UPDATE admins SET 
                full_name = ?, 
                email = ?, 
                phone = ?, 
                department = ?, 
                bio = ?,
                notify_email = ?,
                notify_system = ?,
                notify_sms = ?
                WHERE id = ?");
                
            $stmt->execute([
                $full_name, 
                $email, 
                $phone, 
                $department, 
                $bio,
                $notify_email,
                $notify_system,
                $notify_sms,
                $_SESSION['admin_id']
            ]);
            
            // Set success message
            set_success_message("Profile updated successfully.");
            
        } catch (PDOException $e) {
            set_error_message("Error updating profile: " . $e->getMessage());
        }
    }
    
    // Process avatar upload
    if (isset($_FILES['avatar']) && $_FILES['avatar']['error'] === 0) {
        // Check file type
        $allowed_types = ['image/jpeg', 'image/png', 'image/webp'];
        $file_type = $_FILES['avatar']['type'];
        
        if (!in_array($file_type, $allowed_types)) {
            set_error_message("Invalid file type. Only JPG, PNG, and WEBP are allowed.");
        } else {
            // Create upload directory if it doesn't exist
            $target_dir = "media-library/admin-profiles/";
            if (!file_exists($target_dir)) {
                mkdir($target_dir, 0755, true);
            }
            
            // Generate unique filename
            $ext = pathinfo($_FILES['avatar']['name'], PATHINFO_EXTENSION);
            $filename = uniqid() . "." . $ext;
            $target_path = $target_dir . $filename;
            
            // Move uploaded file
            if (move_uploaded_file($_FILES['avatar']['tmp_name'], $target_path)) {
                try {
                    // Get database connection
                    $db = get_db_connection();
                    
                    // Update avatar in database
                    $stmt = $db->prepare("UPDATE admins SET avatar = ? WHERE id = ?");
                    $stmt->execute([$target_path, $_SESSION['admin_id']]);
                    
                    // Set success message
                    set_success_message("Profile picture updated successfully.");
                    
                } catch (PDOException $e) {
                    set_error_message("Error updating profile picture: " . $e->getMessage());
                }
            } else {
                set_error_message("Failed to upload profile picture.");
            }
        }
    }
    
    // Redirect to prevent form resubmission
    header("Location: admin-profile.php");
    exit;
}

// Get admin info
$admin_user = get_admin_user();
$admin_username = $admin_user['username'];
$admin_role = $admin_user['role'];

// Get current profile data
try {
    $db = get_db_connection();
    $stmt = $db->prepare("SELECT * FROM admins WHERE id = ?");
    $stmt->execute([$_SESSION['admin_id']]);
    $profile = $stmt->fetch(PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    set_error_message("Error retrieving profile data: " . $e->getMessage());
    $profile = [];
}

// Set default avatar if none exists
if (empty($profile['avatar'])) {
    $profile['avatar'] = 'assets/images/default-avatar.png';
}

// Page variables
$page_title = 'My Profile';
$current_page = 'profile';
$breadcrumbs = [
    ['title' => 'Dashboard', 'url' => 'admin-dashboard.php'],
    ['title' => 'My Profile', 'url' => '#']
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
  
  <!-- Profile Content -->
  <div class="admin-content container-fluid py-4">
    <div class="row mb-4">
      <div class="col-12">
        <div class="d-flex justify-content-between align-items-center">
          <h1 class="h3 mb-0 text-gray-800">My Profile</h1>
        </div>
      </div>
    </div>
    
    <div class="row">
      <!-- Profile Information -->
      <div class="col-lg-8">
        <div class="card shadow mb-4">
          <div class="card-header py-3">
            <h6 class="m-0 font-weight-bold text-primary">Profile Information</h6>
          </div>
          <div class="card-body">
            <form method="POST" action="admin-profile.php" enctype="multipart/form-data">
              <div class="row">
                <div class="col-md-3 mb-4">
                  <div class="profile-avatar-upload text-center">
                    <label for="avatar-upload" class="cursor-pointer">
                      <div class="avatar-preview mb-3">
                        <img src="<?php echo htmlspecialchars($profile['avatar']); ?>" class="avatar-circle" id="avatarPreview">
                      </div>
                      <input type="file" name="avatar" id="avatar-upload" accept="image/jpeg, image/png, image/webp" style="display: none;">
                      <p class="text-muted small">Click or drag a photo here to upload</p>
                    </label>
                  </div>
                </div>
                
                <div class="col-md-9">
                  <div class="row">
                    <div class="col-md-6 mb-3">
                      <label for="full_name" class="form-label">Full Name</label>
                      <input type="text" class="form-control" id="full_name" name="full_name" value="<?php echo htmlspecialchars($profile['full_name'] ?? ''); ?>" required>
                    </div>
                    
                    <div class="col-md-6 mb-3">
                      <label for="email" class="form-label">Email</label>
                      <input type="email" class="form-control" id="email" name="email" value="<?php echo htmlspecialchars($profile['email'] ?? ''); ?>" required>
                    </div>
                    
                    <div class="col-md-6 mb-3">
                      <label for="phone" class="form-label">Phone</label>
                      <input type="text" class="form-control" id="phone" name="phone" value="<?php echo htmlspecialchars($profile['phone'] ?? ''); ?>">
                    </div>
                    
                    <div class="col-md-6 mb-3">
                      <label for="department" class="form-label">Department</label>
                      <input type="text" class="form-control" id="department" name="department" value="<?php echo htmlspecialchars($profile['department'] ?? ''); ?>">
                    </div>
                    
                    <div class="col-12 mb-3">
                      <label for="bio" class="form-label">Bio</label>
                      <textarea class="form-control" id="bio" name="bio" rows="4"><?php echo htmlspecialchars($profile['bio'] ?? ''); ?></textarea>
                    </div>
                  </div>
                </div>
              </div>
              
              <hr class="mb-4">
              
              <h5 class="mb-3">Notification Preferences</h5>
              <div class="row mb-4">
                <div class="col-md-4">
                  <div class="form-check">
                    <input class="form-check-input" type="checkbox" id="notify_email" name="notify_email" <?php echo isset($profile['notify_email']) && $profile['notify_email'] ? 'checked' : ''; ?>>
                    <label class="form-check-label" for="notify_email">
                      Email Notifications
                    </label>
                  </div>
                </div>
                
                <div class="col-md-4">
                  <div class="form-check">
                    <input class="form-check-input" type="checkbox" id="notify_system" name="notify_system" <?php echo isset($profile['notify_system']) && $profile['notify_system'] ? 'checked' : ''; ?>>
                    <label class="form-check-label" for="notify_system">
                      System Notifications
                    </label>
                  </div>
                </div>
                
                <div class="col-md-4">
                  <div class="form-check">
                    <input class="form-check-input" type="checkbox" id="notify_sms" name="notify_sms" <?php echo isset($profile['notify_sms']) && $profile['notify_sms'] ? 'checked' : ''; ?>>
                    <label class="form-check-label" for="notify_sms">
                      SMS Notifications
                    </label>
                  </div>
                </div>
              </div>
              
              <div class="text-end">
                <button type="submit" name="update_profile" class="btn btn-primary">
                  <i class="fas fa-save me-2"></i> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      
      <!-- Account Settings -->
      <div class="col-lg-4">
        <div class="card shadow mb-4">
          <div class="card-header py-3">
            <h6 class="m-0 font-weight-bold text-primary">Account Settings</h6>
          </div>
          <div class="card-body">
            <div class="mb-4">
              <h6 class="text-primary">Username</h6>
              <p class="mb-0"><?php echo htmlspecialchars($admin_username); ?></p>
            </div>
            
            <div class="mb-4">
              <h6 class="text-primary">Role</h6>
              <p class="mb-0"><?php echo ucfirst(htmlspecialchars($admin_role)); ?></p>
            </div>
            
            <div class="mb-4">
              <h6 class="text-primary">Last Login</h6>
              <p class="mb-0"><?php echo isset($profile['last_login']) ? date('F j, Y, g:i a', strtotime($profile['last_login'])) : 'Not available'; ?></p>
            </div>
            
            <hr>
            
            <h6 class="mb-3">Account Actions</h6>
            <a href="admin-change-password.php" class="btn btn-outline-primary btn-block mb-2">
              <i class="fas fa-key me-2"></i> Change Password
            </a>
            
            <a href="admin-two-factor.php" class="btn btn-outline-primary btn-block mb-2">
              <i class="fas fa-shield-alt me-2"></i> Two-Factor Authentication
            </a>
            
            <a href="admin-activity-log.php" class="btn btn-outline-primary btn-block">
              <i class="fas fa-history me-2"></i> Activity Log
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <?php include 'admin-footer.php'; ?>
</main>

<script>
document.addEventListener('DOMContentLoaded', function() {
  // Avatar upload preview
  const avatarUpload = document.getElementById('avatar-upload');
  const avatarPreview = document.getElementById('avatarPreview');
  
  if (avatarUpload && avatarPreview) {
    // Handle file selection
    avatarUpload.addEventListener('change', function() {
      if (this.files && this.files[0]) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
          avatarPreview.src = e.target.result;
        }
        
        reader.readAsDataURL(this.files[0]);
        
        // Auto-submit form when file is selected
        const formData = new FormData();
        formData.append('avatar', this.files[0]);
        
        // Optionally, you can auto-submit the form after selection
        // this.form.submit();
      }
    });
    
    // Setup drag and drop functionality
    const dropArea = avatarPreview.closest('.avatar-preview');
    
    if (dropArea) {
      ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, preventDefaults, false);
      });
      
      function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
      }
      
      ['dragenter', 'dragover'].forEach(eventName => {
        dropArea.addEventListener(eventName, highlight, false);
      });
      
      ['dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, unhighlight, false);
      });
      
      function highlight() {
        dropArea.classList.add('highlight');
      }
      
      function unhighlight() {
        dropArea.classList.remove('highlight');
      }
      
      dropArea.addEventListener('drop', handleDrop, false);
      
      function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        
        if (files && files[0]) {
          avatarUpload.files = files;
          
          // Trigger change event
          const event = new Event('change', { bubbles: true });
          avatarUpload.dispatchEvent(event);
        }
      }
    }
  }
});
</script>

<style>
/* Avatar styles */
.avatar-circle {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #ccc;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.profile-avatar-upload {
  transition: all 0.3s ease;
}

.avatar-preview {
  cursor: pointer;
  transition: all 0.3s ease;
}

.avatar-preview:hover {
  opacity: 0.8;
}

.avatar-preview.highlight {
  border: 2px dashed var(--primary-color);
  background-color: rgba(0, 0, 0, 0.05);
}

.cursor-pointer {
  cursor: pointer;
}

/* Button block style */
.btn-block {
  display: block;
  width: 100%;
}
</style>
</div><!-- .admin-container -->
</body>
</html>
