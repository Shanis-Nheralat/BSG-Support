<?php
// Initialize session first thing - no whitespace before this
session_start();

// Block unauthorized users
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    header("Location: admin-login.php");
    exit();
}

// Common variables and functions
$admin_username = isset($_SESSION['admin_username']) ? $_SESSION['admin_username'] : 'Admin User';
$admin_role = isset($_SESSION['admin_role']) ? $_SESSION['admin_role'] : 'Administrator';
$admin_avatar = isset($_SESSION['admin_avatar']) ? $_SESSION['admin_avatar'] : 'assets/images/admin-avatar.jpg';

// Helper function to check if a menu item should be marked as active
function is_menu_active($current_menu, $target_menu) {
    return ($current_menu == $target_menu) ? 'active' : '';
}

function is_submenu_active($current_submenu, $target_submenu) {
    return ($current_submenu == $target_submenu) ? 'active' : '';
}

// Set default page title if not specified
if (!isset($page_title)) {
    $page_title = "Admin Dashboard";
}

// Set default active menu if not specified
if (!isset($active_menu)) {
    $active_menu = "dashboard";
}

// Set default active submenu if not specified
if (!isset($active_submenu)) {
    $active_submenu = "";
}
?>
