<?php
/**
 * Set Admin Role
 * Updates both session and database for the shanisbsg user
 */

// Start session
session_start();

// Include database config
require_once 'db_config.php';

try {
    // Update role in database
    $db = get_db_connection();
    
    // First check if user exists and role is empty
    $checkStmt = $db->prepare("SELECT id, username, role FROM admins WHERE username = 'shanisbsg'");
    $checkStmt->execute();
    $user = $checkStmt->fetch();
    
    if ($user) {
        // Update role to superadmin (this has more permissions than regular admin)
        $stmt = $db->prepare("UPDATE admins SET role = 'superadmin' WHERE username = 'shanisbsg'");
        $result = $stmt->execute();
        
        if ($result) {
            echo "<p style='color: green;'>✅ Database updated - Role set to 'superadmin' for user 'shanisbsg'</p>";
        } else {
            echo "<p style='color: red;'>❌ Failed to update database</p>";
        }
        
        // Set session variables
        $_SESSION['admin_logged_in'] = true;
        $_SESSION['admin_id'] = $user['id'];
        $_SESSION['admin_username'] = $user['username'];
        $_SESSION['admin_role'] = 'superadmin';
        $_SESSION['ip_address'] = $_SERVER['REMOTE_ADDR'];
        $_SESSION['last_activity'] = time();
        
        echo "<p style='color: green;'>✅ Session updated - Role set to 'superadmin'</p>";
        echo "<p>Current session variables:</p>";
        echo "<pre>";
        print_r($_SESSION);
        echo "</pre>";
    } else {
        echo "<p style='color: red;'>❌ User 'shanisbsg' not found in database</p>";
    }
} catch (Exception $e) {
    echo "<p style='color: red;'>❌ Error: " . $e->getMessage() . "</p>";
}

echo "<p><a href='admin-dashboard.php'>Go to Dashboard</a></p>";
