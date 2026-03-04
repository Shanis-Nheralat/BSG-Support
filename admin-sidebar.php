<?php
/**
 * Navigation sidebar with explicit menu structure
 */
?>
<!-- Sidebar Navigation -->
<aside class="admin-sidebar">
  <div class="sidebar-header">
    <img src="<?php echo $baseUrl; ?>assets/images/logo.png" alt="BSG Support Logo" class="admin-logo">
    <h2>Admin Panel</h2>
  </div>
  
  <div class="admin-user">
    <div class="user-avatar">
      <?php 
      $avatar = isset($admin_user['avatar']) && !empty($admin_user['avatar']) 
          ? $admin_user['avatar'] 
          : 'avatar.webp';
      ?>
      <img src="<?php echo $baseUrl; ?>assets/images/<?php echo $avatar; ?>" alt="<?php echo htmlspecialchars($admin_username); ?>">
    </div>
    <div class="user-info">
      <h3><?php echo htmlspecialchars($admin_username); ?></h3>
      <span class="user-role"><?php echo ucfirst(htmlspecialchars($admin_role)); ?></span>
    </div>
    <button id="user-dropdown-toggle" class="dropdown-toggle">
      <i class="fas fa-chevron-down"></i>
    </button>
    <ul id="user-dropdown" class="dropdown-menu">
      <li><a href="admin-profile.php"><i class="fas fa-user"></i> My Profile</a></li>
      <li><a href="admin-settings.php"><i class="fas fa-cog"></i> Settings</a></li>
      <li><a href="logout.php"><i class="fas fa-sign-out-alt"></i> Logout</a></li>
    </ul>
  </div>
  
  <nav class="sidebar-nav">
    <ul>
      <!-- Dashboard -->
      <li class="<?php echo ($current_page === 'dashboard') ? 'active' : ''; ?>">
        <a href="admin-dashboard.php">
          <i class="fas fa-tachometer-alt"></i>
          <span>Dashboard</span>
        </a>
      </li>
      
      <!-- Content Management -->
      <li class="has-submenu <?php echo (in_array($current_page, ['blog', 'media'])) ? 'active open' : ''; ?>">
        <a href="javascript:void(0)">
          <i class="fas fa-edit"></i>
          <span>Content Management</span>
          <i class="fas fa-chevron-right submenu-icon"></i>
        </a>
        <ul class="submenu">
          <li class="<?php echo ($current_page === 'blog') ? 'active' : ''; ?>">
            <a href="admin-blog.php">
              <i class="fas fa-blog"></i> Blog Management
            </a>
          </li>
        </ul>
      </li>
      
      <!-- HR Tools -->
      <li class="has-submenu <?php echo (in_array($current_page, ['candidate', 'candidate-notes'])) ? 'active open' : ''; ?>">
        <a href="javascript:void(0)">
          <i class="fas fa-user-tie"></i>
          <span>HR Tools</span>
          <i class="fas fa-chevron-right submenu-icon"></i>
        </a>
        <ul class="submenu">
          <li class="<?php echo ($current_page === 'candidate') ? 'active' : ''; ?>">
            <a href="admin-candidate.php">
              <i class="fas fa-user-graduate"></i> Candidates
            </a>
          </li>
          <li class="<?php echo ($current_page === 'candidate-notes') ? 'active' : ''; ?>">
            <a href="admin-candidate-notes.php">
              <i class="fas fa-sticky-note"></i> Candidate Notes
            </a>
          </li>
        </ul>
      </li>
      
      <!-- Site Settings -->
      <li class="has-submenu <?php echo (in_array($current_page, ['general', 'appearance', 'backup'])) ? 'active open' : ''; ?>">
        <a href="javascript:void(0)">
          <i class="fas fa-cogs"></i>
          <span>Site Settings</span>
          <i class="fas fa-chevron-right submenu-icon"></i>
        </a>
        <ul class="submenu">
          <li class="<?php echo ($current_page === 'general') ? 'active' : ''; ?>">
            <a href="admin-settings.php">
              <i class="fas fa-sliders-h"></i> General Settings
            </a>
          </li>
          <li class="<?php echo ($current_page === 'appearance') ? 'active' : ''; ?>">
            <a href="admin-appearance.php">
              <i class="fas fa-palette"></i> Appearance
            </a>
          </li>
          <li class="<?php echo ($current_page === 'backup') ? 'active' : ''; ?>">
            <a href="admin-backup.php">
              <i class="fas fa-database"></i> Backup & Restore
            </a>
          </li>
        </ul>
      </li>
    </ul>
  </nav>
  
  <div class="sidebar-footer">
    <a href="<?php echo $baseUrl; ?>index.php" target="_blank">
      <i class="fas fa-external-link-alt"></i>
      <span>View Website</span>
    </a>
  </div>
</aside>

<!-- For mobile sidebar backdrop -->
<div class="sidebar-backdrop"></div>

<!-- DO NOT include duplicate JavaScript here - it will conflict with the main js file -->
