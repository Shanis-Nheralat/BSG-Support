<?php
/**
 * Page header with breadcrumbs and theme switcher
 */
?>
<!-- Top Navigation Bar -->
<header class="admin-header">
  <div class="header-left">
    <button id="sidebar-toggle" class="sidebar-toggle">
      <i class="fas fa-bars"></i>
    </button>
    <div class="breadcrumbs">
      <?php foreach ($breadcrumbs as $index => $crumb): ?>
        <?php if ($index > 0): ?>
          <span class="breadcrumb-separator"><i class="fas fa-chevron-right"></i></span>
        <?php endif; ?>
        <?php if (isset($crumb['url']) && $crumb['url'] != '#'): ?>
          <a href="<?php echo $crumb['url']; ?>"><?php echo htmlspecialchars($crumb['title']); ?></a>
        <?php else: ?>
          <span class="current-breadcrumb"><?php echo htmlspecialchars($crumb['title']); ?></span>
        <?php endif; ?>
      <?php endforeach; ?>
    </div>
  </div>
  
  <div class="header-right">
    <div class="admin-search">
      <form action="admin-search.php" method="get">
        <input type="text" name="q" placeholder="Search..." value="<?php echo isset($_GET['q']) ? htmlspecialchars($_GET['q']) : ''; ?>">
        <button type="submit">
          <i class="fas fa-search"></i>
        </button>
      </form>
    </div>
    
    <div class="header-actions">
      <!-- Theme Switcher -->
      <div class="theme-switcher">
        <select id="theme-selector" class="form-select form-select-sm">
          <option value="default">Default Theme</option>
          <option value="dark">Dark Theme</option>
          <option value="blue">Blue Theme</option>
          <option value="green">Green Theme</option>
          <option value="purple">Purple Theme</option>
          <option value="high-contrast">High Contrast</option>
        </select>
        <div class="auto-dark-mode form-check">
          <input type="checkbox" class="form-check-input" id="auto-dark-mode">
          <label class="form-check-label" for="auto-dark-mode">Auto Dark Mode</label>
        </div>
      </div>
      
      <!-- Notifications Dropdown -->
      <div class="dropdown">
        <button class="action-btn notification-btn" type="button" id="notificationsDropdown" data-bs-toggle="dropdown" aria-expanded="false" title="Notifications">
          <i class="fas fa-bell"></i>
          <?php 
          // Get unread notifications count
          $unread_notifications = function_exists('get_unread_notifications_count') ? get_unread_notifications_count() : 5;
          if ($unread_notifications > 0): 
          ?>
          <span class="badge bg-danger"><?php echo $unread_notifications; ?></span>
          <?php endif; ?>
        </button>
        <div class="dropdown-menu notification-dropdown dropdown-menu-end" aria-labelledby="notificationsDropdown">
          <div class="dropdown-header d-flex justify-content-between align-items-center">
            <h6 class="m-0">Notifications</h6>
            <a href="javascript:void(0)" id="mark-all-read" class="text-decoration-none small">Mark All as Read</a>
          </div>
          <?php 
          // Get recent notifications
          if (function_exists('get_recent_notifications')) {
            $notifications = get_recent_notifications(5);
          } else {
            // Placeholder notifications
            $notifications = [
              [
                'read' => false,
                'link' => '#',
                'type' => 'inquiry',
                'message' => 'New inquiry received from John Smith',
                'time' => '2 hours ago'
              ],
              [
                'read' => false,
                'link' => '#',
                'type' => 'user',
                'message' => 'New user registered: Sarah Johnson',
                'time' => 'Yesterday'
              ],
              [
                'read' => true,
                'link' => '#',
                'type' => 'system',
                'message' => 'System backup completed successfully',
                'time' => '2 days ago'
              ]
            ];
          }
          
          if (!empty($notifications)): 
          ?>
          <div class="notification-list">
            <?php foreach ($notifications as $notification): ?>
            <a href="<?php echo $notification['link']; ?>" class="dropdown-item notification-item <?php echo ($notification['read'] ? '' : 'unread'); ?>">
              <div class="notification-icon <?php echo $notification['type']; ?>">
                <i class="fas fa-<?php echo function_exists('get_notification_icon') ? get_notification_icon($notification['type']) : 'bell'; ?>"></i>
              </div>
              <div class="notification-content">
                <p><?php echo htmlspecialchars($notification['message']); ?></p>
                <span class="time"><?php echo $notification['time']; ?></span>
              </div>
            </a>
            <?php endforeach; ?>
          </div>
          <?php else: ?>
          <div class="dropdown-item text-center py-3">
            <p class="m-0">No new notifications</p>
          </div>
          <?php endif; ?>
          <div class="dropdown-footer">
            <a href="admin-notifications.php" class="text-center d-block py-2">View All Notifications</a>
          </div>
        </div>
      </div>
      
      <!-- Tasks Dropdown -->
      <div class="dropdown">
        <button class="action-btn task-btn" type="button" id="tasksDropdown" data-bs-toggle="dropdown" aria-expanded="false" title="Tasks">
          <i class="fas fa-check-circle"></i>
          <?php 
          // Get pending tasks count
          $pending_tasks = function_exists('get_pending_tasks_count') ? get_pending_tasks_count() : 2;
          if ($pending_tasks > 0): 
          ?>
          <span class="badge bg-warning"><?php echo $pending_tasks; ?></span>
          <?php endif; ?>
        </button>
        <div class="dropdown-menu task-dropdown dropdown-menu-end" aria-labelledby="tasksDropdown">
          <div class="dropdown-header d-flex justify-content-between align-items-center">
            <h6 class="m-0">Pending Tasks</h6>
            <a href="admin-tasks.php" class="text-decoration-none small">View All</a>
          </div>
          <?php 
          // Get pending tasks
          if (function_exists('get_pending_tasks')) {
            $tasks = get_pending_tasks(3);
          } else {
            // Placeholder tasks
            $tasks = [
              [
                'link' => '#',
                'title' => 'Update homepage banner',
                'priority' => 'high',
                'due' => 'Today'
              ],
              [
                'link' => '#',
                'title' => 'Review new testimonials',
                'priority' => 'medium',
                'due' => 'Tomorrow'
              ]
            ];
          }
          
          if (!empty($tasks)): 
          ?>
          <div class="task-list">
            <?php foreach($tasks as $index => $task): ?>
            <div class="dropdown-item task-item">
              <div class="form-check">
                <input class="form-check-input task-checkbox" type="checkbox" id="task<?php echo $index; ?>">
                <label class="form-check-label" for="task<?php echo $index; ?>">
                  <?php echo htmlspecialchars($task['title']); ?>
                  <div class="task-meta">
                    <span class="priority badge bg-<?php 
                      echo $task['priority'] == 'high' ? 'danger' : 
                           ($task['priority'] == 'medium' ? 'warning' : 'info'); 
                    ?>"><?php echo ucfirst($task['priority']); ?></span>
                    <span class="due"><?php echo $task['due']; ?></span>
                  </div>
                </label>
              </div>
            </div>
            <?php endforeach; ?>
          </div>
          <?php else: ?>
          <div class="dropdown-item text-center py-3">
            <p class="m-0">No pending tasks</p>
          </div>
          <?php endif; ?>
          <div class="dropdown-footer">
            <a href="admin-tasks.php" class="text-center d-block py-2">Manage Tasks</a>
          </div>
        </div>
      </div>
      
      <!-- Help Dropdown -->
      <div class="dropdown">
        <button class="action-btn help-btn" type="button" id="helpDropdown" data-bs-toggle="dropdown" aria-expanded="false" title="Help & Resources">
          <i class="fas fa-question-circle"></i>
        </button>
        <div class="dropdown-menu help-dropdown dropdown-menu-end" aria-labelledby="helpDropdown">
          <a class="dropdown-item" href="#"><i class="fas fa-book me-2"></i> Documentation</a>
          <a class="dropdown-item" href="#"><i class="fas fa-video me-2"></i> Video Tutorials</a>
          <a class="dropdown-item" href="#"><i class="fas fa-headset me-2"></i> Support Center</a>
        </div>
      </div>
    </div>
  </div>
</header>

<!-- Display notification messages if any -->
<?php
// Include notifications if the function exists
if (function_exists('display_notifications')) {
  display_notifications();
} else {
  // Basic notification display
  if (isset($_SESSION['notifications']) && !empty($_SESSION['notifications'])) {
    echo '<div class="admin-notifications">';
    foreach ($_SESSION['notifications'] as $notification) {
      $type = $notification['type'] == 'error' ? 'danger' : $notification['type'];
      echo '<div class="alert alert-' . $type . ' alert-dismissible fade show" role="alert">';
      echo $notification['message'];
      echo '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>';
      echo '</div>';
    }
    echo '</div>';
    // Clear notifications
    $_SESSION['notifications'] = [];
  }
}
?>
