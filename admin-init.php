<?php
/**
 * Admin Initialization Script
 * 
 * Include this at the top of all admin pages
 * It handles authentication and common setup
 */

// Include required files
require_once 'db_config.php';
require_once 'admin-auth.php';

// Require admin authentication
require_admin_auth();

// Set page variables (customize for each page)
$page_title = 'Admin Dashboard';
$current_page = basename($_SERVER['PHP_SELF']);
$breadcrumbs = [
    ['title' => 'Dashboard', 'url' => 'admin-dashboard.php']
];

// Get admin user info
$admin_user = get_admin_user();
$admin_username = $admin_user['username'];
$admin_role = $admin_user['role'];

// Check if role is empty and redirect to fix-admin-role page
if (empty($admin_role) && $admin_username === 'shanisbsg') {
    header("Location: fix-admin-role.php");
    exit();
}
