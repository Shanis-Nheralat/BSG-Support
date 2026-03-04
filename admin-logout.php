<?php
/**
 * Admin Logout
 * 
 * Handles logging out admin users
 */

// Start session
session_start();

// Clear all session variables
$_SESSION = [];

// Destroy the session
session_destroy();

// Redirect to login page
header('Location: admin-login.php');
exit;
?>