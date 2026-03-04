<?php
/**
 * Admin Notifications Library
 * Provides notification helper functions for the admin panel.
 * 
 * This is a library file included by admin pages.
 * The notification settings page is at admin-notification-settings.php.
 */

// Ensure ADMIN_PANEL is defined so settings-functions.php can load
if (!defined('ADMIN_PANEL')) {
    define('ADMIN_PANEL', true);
}

// Include database connection
require_once __DIR__ . '/db.php';

// Include settings functions (provides display_notifications, set_success_message, etc.)
require_once __DIR__ . '/settings-functions.php';

/**
 * Create an admin notification stored in the database
 *
 * @param string $type    Notification type (success, error, warning, info)
 * @param string $message The notification message
 * @param string $link    Optional link for the notification
 * @param int    $user_id The admin user ID who triggered the notification
 * @return bool True on success
 */
function set_admin_notification($type, $message, $link = '#', $user_id = null) {
    global $pdo;

    // Also store as a flash message for immediate display
    switch ($type) {
        case 'success':
            if (function_exists('set_success_message')) {
                set_success_message($message);
            }
            break;
        case 'error':
            if (function_exists('set_error_message')) {
                set_error_message($message);
            }
            break;
        case 'info':
            if (function_exists('set_info_message')) {
                set_info_message($message);
            }
            break;
        case 'warning':
            if (session_status() == PHP_SESSION_NONE) {
                session_start();
            }
            $_SESSION['warning_message'] = $message;
            break;
    }

    // Persist to admin_notifications table if it exists
    try {
        $check = $pdo->query("SHOW TABLES LIKE 'admin_notifications'");
        if ($check->rowCount() > 0) {
            $stmt = $pdo->prepare(
                "INSERT INTO admin_notifications (type, message, link, user_id, created_at)
                 VALUES (?, ?, ?, ?, NOW())"
            );
            $stmt->execute([$type, $message, $link, $user_id]);
            return true;
        }
    } catch (Exception $e) {
        error_log("set_admin_notification error: " . $e->getMessage());
    }

    return true; // flash message was still set
}

/**
 * Get recent admin notifications from the database
 *
 * @param int  $limit  Number of notifications to return
 * @param bool $unread Only return unread notifications
 * @return array
 */
function get_admin_notifications($limit = 10, $unread = false) {
    global $pdo;

    try {
        $check = $pdo->query("SHOW TABLES LIKE 'admin_notifications'");
        if ($check->rowCount() > 0) {
            $sql = "SELECT * FROM admin_notifications";
            if ($unread) {
                $sql .= " WHERE is_read = 0";
            }
            $sql .= " ORDER BY created_at DESC LIMIT " . (int)$limit;
            $stmt = $pdo->query($sql);
            return $stmt->fetchAll();
        }
    } catch (Exception $e) {
        error_log("get_admin_notifications error: " . $e->getMessage());
    }

    return [];
}

/**
 * Mark a notification as read
 *
 * @param int $notification_id
 * @return bool
 */
function mark_notification_read($notification_id) {
    global $pdo;

    try {
        $stmt = $pdo->prepare("UPDATE admin_notifications SET is_read = 1 WHERE id = ?");
        $stmt->execute([$notification_id]);
        return true;
    } catch (Exception $e) {
        error_log("mark_notification_read error: " . $e->getMessage());
    }
    return false;
}

/**
 * Get count of unread notifications
 *
 * @return int
 */
function get_unread_notification_count() {
    global $pdo;

    try {
        $check = $pdo->query("SHOW TABLES LIKE 'admin_notifications'");
        if ($check->rowCount() > 0) {
            $stmt = $pdo->query("SELECT COUNT(*) FROM admin_notifications WHERE is_read = 0");
            return (int)$stmt->fetchColumn();
        }
    } catch (Exception $e) {
        error_log("get_unread_notification_count error: " . $e->getMessage());
    }
    return 0;
}
