<?php
/**
 * Admin Analytics Functions
 * Contains functions for tracking and retrieving analytics data
 */

// Database connection handling
function get_analytics_db_connection() {
    global $db;
    
    // If db_config.php uses a different variable name, adjust accordingly
    if (!isset($db) && file_exists('db_config.php')) {
        require_once 'db_config.php';
    }
    
    // Return the database connection
    return $db ?? null;
}

/**
 * Logs page view to analytics
 * @param string $page_name Name of the page being viewed
 * @return bool Success status
 */
function log_page_view($page_name = null) {
    // If no page name specified, get from current file
    if ($page_name === null) {
        $page_name = basename($_SERVER['PHP_SELF']);
    }
    
    // Log the activity safely
    return log_admin_activity('page_view', $page_name);
}

/**
 * Logs admin activity to database
 * @param string $action_type Type of action (e.g., 'login', 'edit', 'delete')
 * @param string $action_details Additional details about the action
 * @return bool Success status
 */
function log_admin_activity($action_type = '', $action_details = '') {
    $db = get_analytics_db_connection();
    
    // Skip if no database connection
    if (!$db) {
        return false;
    }
    
    try {
        // Get current admin ID
        $admin_id = 1; // Default fallback
        if (function_exists('get_admin_user')) {
            $admin = get_admin_user();
            if (isset($admin['id'])) {
                $admin_id = $admin['id'];
            }
        }
        
        // Get IP address
        $ip_address = $_SERVER['REMOTE_ADDR'] ?? '';
        
        // Prepare and execute query
        $stmt = $db->prepare("INSERT INTO admin_activity_log 
                             (admin_id, action_type, action_details, ip_address, created_at) 
                             VALUES (?, ?, ?, ?, NOW())");
        
        return $stmt->execute([$admin_id, $action_type, $action_details, $ip_address]);
    } catch (Exception $e) {
        error_log("Error logging admin activity: " . $e->getMessage());
        return false;
    }
}

/**
 * Gets recent activity for the admin dashboard
 * @param int $limit Number of entries to return
 * @return array Recent activity data
 */
function get_admin_recent_activity($limit = 10) {
    $db = get_analytics_db_connection();
    
    // Return empty array if no database connection
    if (!$db) {
        return [
            ['action_type' => 'page_view', 'action_details' => 'Sample Activity', 'created_at' => date('Y-m-d H:i:s')]
        ];
    }
    
    try {
        $stmt = $db->prepare("SELECT a.action_type, a.action_details, a.created_at, u.username
                             FROM admin_activity_log a
                             LEFT JOIN admin_users u ON a.admin_id = u.id
                             ORDER BY a.created_at DESC
                             LIMIT ?");
        $stmt->execute([$limit]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (Exception $e) {
        error_log("Error getting recent activity: " . $e->getMessage());
        return [];
    }
}

/**
 * Renders the analytics dashboard
 * @param string $date_from Start date for analytics
 * @param string $date_to End date for analytics
 * @return string HTML for the analytics dashboard
 */
function render_analytics_dashboard($date_from, $date_to) {
    // Get analytics data
    $page_views = get_page_views_by_date($date_from, $date_to);
    $top_pages = get_top_pages($date_from, $date_to);
    $user_activity = get_user_activity($date_from, $date_to);
    
    // Start building output
    $output = '<div class="analytics-dashboard">';
    
    // Date range selector
    $output .= '<div class="analytics-controls">
        <form method="get" class="date-range-form">
            <div class="form-group">
                <label for="date_from">From:</label>
                <input type="date" id="date_from" name="date_from" value="' . htmlspecialchars($date_from) . '" class="form-control">
            </div>
            <div class="form-group">
                <label for="date_to">To:</label>
                <input type="date" id="date_to" name="date_to" value="' . htmlspecialchars($date_to) . '" class="form-control">
            </div>
            <button type="submit" class="btn btn-primary">Apply</button>
        </form>
    </div>';
    
    // Analytics summary cards
    $output .= '<div class="analytics-summary">
        <div class="analytics-card">
            <div class="analytics-card-content">
                <h3>Page Views</h3>
                <div class="analytics-value">' . number_format(count_page_views($date_from, $date_to)) . '</div>
            </div>
        </div>
        <div class="analytics-card">
            <div class="analytics-card-content">
                <h3>Unique Pages</h3>
                <div class="analytics-value">' . number_format(count_unique_pages($date_from, $date_to)) . '</div>
            </div>
        </div>
        <div class="analytics-card">
            <div class="analytics-card-content">
                <h3>Active Users</h3>
                <div class="analytics-value">' . number_format(count_active_users($date_from, $date_to)) . '</div>
            </div>
        </div>
    </div>';
    
    // Page views chart
    $output .= '<div class="analytics-chart-container">
        <h2>Page Views</h2>
        <canvas id="pageViewsChart"></canvas>
    </div>';
    
    // Top pages table
    $output .= '<div class="analytics-top-pages">
        <h2>Top Pages</h2>
        <table class="admin-table">
            <thead>
                <tr>
                    <th>Page</th>
                    <th>Views</th>
                    <th>Percentage</th>
                </tr>
            </thead>
            <tbody>';
    
    foreach ($top_pages as $page) {
        $output .= '<tr>
            <td>' . htmlspecialchars($page['page']) . '</td>
            <td>' . number_format($page['views']) . '</td>
            <td>' . number_format($page['percentage'], 1) . '%</td>
        </tr>';
    }
    
    $output .= '</tbody>
        </table>
    </div>';
    
    // User activity
    $output .= '<div class="analytics-user-activity">
        <h2>User Activity</h2>
        <table class="admin-table">
            <thead>
                <tr>
                    <th>User</th>
                    <th>Actions</th>
                    <th>Last Active</th>
                </tr>
            </thead>
            <tbody>';
    
    foreach ($user_activity as $user) {
        $output .= '<tr>
            <td>' . htmlspecialchars($user['username']) . '</td>
            <td>' . number_format($user['actions']) . '</td>
            <td>' . htmlspecialchars($user['last_active']) . '</td>
        </tr>';
    }
    
    $output .= '</tbody>
        </table>
    </div>';
    
    // JavaScript for charts
    $output .= '<script>
        document.addEventListener("DOMContentLoaded", function() {
            // Page views chart
            const pageViewsData = ' . json_encode(get_page_views_chart_data($date_from, $date_to)) . ';
            const pageViewsCtx = document.getElementById("pageViewsChart").getContext("2d");
            new Chart(pageViewsCtx, {
                type: "line",
                data: {
                    labels: pageViewsData.labels,
                    datasets: [{
                        label: "Page Views",
                        data: pageViewsData.values,
                        borderColor: "#3498db",
                        backgroundColor: "rgba(52, 152, 219, 0.1)",
                        tension: 0.3,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        });
    </script>';
    
    $output .= '</div>'; // Close analytics-dashboard
    
    return $output;
}

// Helper functions for analytics data
function get_page_views_by_date($date_from, $date_to) {
    $db = get_analytics_db_connection();
    
    if (!$db) {
        // Sample data if no database
        $data = [];
        $start = strtotime($date_from);
        $end = strtotime($date_to);
        $current = $start;
        
        while ($current <= $end) {
            $date = date('Y-m-d', $current);
            $data[] = [
                'date' => $date,
                'views' => rand(50, 200)
            ];
            $current = strtotime('+1 day', $current);
        }
        
        return $data;
    }
    
    try {
        $stmt = $db->prepare("SELECT DATE(created_at) as date, COUNT(*) as views
                             FROM admin_activity_log
                             WHERE action_type = 'page_view'
                             AND created_at BETWEEN ? AND ?
                             GROUP BY DATE(created_at)
                             ORDER BY date ASC");
        $stmt->execute([$date_from, $date_to . ' 23:59:59']);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (Exception $e) {
        error_log("Error getting page views by date: " . $e->getMessage());
        return [];
    }
}

function get_top_pages($date_from, $date_to) {
    $db = get_analytics_db_connection();
    
    if (!$db) {
        // Sample data if no database
        return [
            ['page' => 'admin-dashboard.php', 'views' => 120, 'percentage' => 35.3],
            ['page' => 'admin-blog.php', 'views' => 85, 'percentage' => 25.0],
            ['page' => 'admin-candidate.php', 'views' => 65, 'percentage' => 19.1],
            ['page' => 'admin-settings.php', 'views' => 45, 'percentage' => 13.2],
            ['page' => 'admin-analytics.php', 'views' => 25, 'percentage' => 7.4]
        ];
    }
    
    try {
        $stmt = $db->prepare("SELECT 
                                action_details as page, 
                                COUNT(*) as views,
                                (COUNT(*) / (SELECT COUNT(*) FROM admin_activity_log 
                                              WHERE action_type = 'page_view' 
                                              AND created_at BETWEEN ? AND ?)) * 100 as percentage
                             FROM admin_activity_log
                             WHERE action_type = 'page_view'
                             AND created_at BETWEEN ? AND ?
                             GROUP BY action_details
                             ORDER BY views DESC
                             LIMIT 10");
        $stmt->execute([$date_from, $date_to . ' 23:59:59', $date_from, $date_to . ' 23:59:59']);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (Exception $e) {
        error_log("Error getting top pages: " . $e->getMessage());
        return [];
    }
}

function get_user_activity($date_from, $date_to) {
    $db = get_analytics_db_connection();
    
    if (!$db) {
        // Sample data if no database
        return [
            ['username' => 'admin', 'actions' => 185, 'last_active' => date('Y-m-d H:i:s')],
            ['username' => 'editor1', 'actions' => 120, 'last_active' => date('Y-m-d H:i:s', strtotime('-2 hours'))],
            ['username' => 'author1', 'actions' => 75, 'last_active' => date('Y-m-d H:i:s', strtotime('-1 day'))]
        ];
    }
    
    try {
        $stmt = $db->prepare("SELECT 
                                u.username, 
                                COUNT(*) as actions,
                                MAX(a.created_at) as last_active
                             FROM admin_activity_log a
                             JOIN admin_users u ON a.admin_id = u.id
                             WHERE a.created_at BETWEEN ? AND ?
                             GROUP BY a.admin_id, u.username
                             ORDER BY actions DESC");
        $stmt->execute([$date_from, $date_to . ' 23:59:59']);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (Exception $e) {
        error_log("Error getting user activity: " . $e->getMessage());
        return [];
    }
}

function count_page_views($date_from, $date_to) {
    $db = get_analytics_db_connection();
    
    if (!$db) {
        // Sample count if no database
        return rand(500, 2000);
    }
    
    try {
        $stmt = $db->prepare("SELECT COUNT(*) 
                             FROM admin_activity_log
                             WHERE action_type = 'page_view'
                             AND created_at BETWEEN ? AND ?");
        $stmt->execute([$date_from, $date_to . ' 23:59:59']);
        return $stmt->fetchColumn();
    } catch (Exception $e) {
        error_log("Error counting page views: " . $e->getMessage());
        return 0;
    }
}

function count_unique_pages($date_from, $date_to) {
    $db = get_analytics_db_connection();
    
    if (!$db) {
        // Sample count if no database
        return rand(10, 30);
    }
    
    try {
        $stmt = $db->prepare("SELECT COUNT(DISTINCT action_details) 
                             FROM admin_activity_log
                             WHERE action_type = 'page_view'
                             AND created_at BETWEEN ? AND ?");
        $stmt->execute([$date_from, $date_to . ' 23:59:59']);
        return $stmt->fetchColumn();
    } catch (Exception $e) {
        error_log("Error counting unique pages: " . $e->getMessage());
        return 0;
    }
}

function count_active_users($date_from, $date_to) {
    $db = get_analytics_db_connection();
    
    if (!$db) {
        // Sample count if no database
        return rand(5, 15);
    }
    
    try {
        $stmt = $db->prepare("SELECT COUNT(DISTINCT admin_id) 
                             FROM admin_activity_log
                             WHERE created_at BETWEEN ? AND ?");
        $stmt->execute([$date_from, $date_to . ' 23:59:59']);
        return $stmt->fetchColumn();
    } catch (Exception $e) {
        error_log("Error counting active users: " . $e->getMessage());
        return 0;
    }
}

function get_page_views_chart_data($date_from, $date_to) {
    $page_views = get_page_views_by_date($date_from, $date_to);
    
    $labels = [];
    $values = [];
    
    foreach ($page_views as $record) {
        $labels[] = date('M d', strtotime($record['date']));
        $values[] = $record['views'];
    }
    
    return [
        'labels' => $labels,
        'values' => $values
    ];
}
