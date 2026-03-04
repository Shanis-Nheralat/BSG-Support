<?php
/**
 * Activity tracking and analytics
 * Logs page views and user actions for analytics dashboard
 */

/**
 * Log page view for analytics
 * 
 * @param string $page_name Name of the page being viewed
 * @return bool Success status
 */
function log_page_view($page_name) {
    // Check if session is started
    if (session_status() !== PHP_SESSION_ACTIVE) {
        session_start();
    }
    
    // Get current user information
    $user_id = $_SESSION['admin_user_id'] ?? 0;
    $username = $_SESSION['admin_username'] ?? 'Guest';
    
    // Get request information
    $ip_address = $_SERVER['REMOTE_ADDR'] ?? '';
    $user_agent = $_SERVER['HTTP_USER_AGENT'] ?? '';
    $timestamp = date('Y-m-d H:i:s');
    
    // TODO: Implement actual database logging
    // Example SQL:
    // INSERT INTO admin_page_views (user_id, username, page_name, ip_address, user_agent, timestamp) 
    // VALUES (?, ?, ?, ?, ?, ?)
    
    // For now, we'll just return true as a placeholder
    return true;
}

/**
 * Log admin action for analytics
 * 
 * @param string $action_type Type of action (create, update, delete, etc.)
 * @param string $resource Type of resource affected (user, page, post, etc.)
 * @param int $resource_id ID of the resource
 * @param string $details Additional details about the action
 * @return bool Success status
 */
if (!function_exists('log_admin_action')) {
function log_admin_action($action_type, $resource, $resource_id, $details = '') {
    // Check if session is started
    if (session_status() !== PHP_SESSION_ACTIVE) {
        session_start();
    }
    
    // Get current user information
    $user_id = $_SESSION['admin_user_id'] ?? 0;
    $username = $_SESSION['admin_username'] ?? 'Guest';
    
    // Get request information
    $ip_address = $_SERVER['REMOTE_ADDR'] ?? '';
    $timestamp = date('Y-m-d H:i:s');
    
    // TODO: Implement actual database logging
    // Example SQL:
    // INSERT INTO admin_activity_log (user_id, username, action_type, resource, resource_id, details, ip_address, timestamp) 
    // VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    
    // For now, we'll just return true as a placeholder
    return true;
}
} // end if (!function_exists('log_admin_action'))

/**
 * Get page view statistics for a specific period
 * 
 * @param string $period Period type (daily, weekly, monthly, yearly)
 * @param int $limit Number of data points to return
 * @return array Statistics data
 */
function get_page_view_stats($period = 'weekly', $limit = 7) {
    // TODO: Implement actual database query
    // For now, return sample data for testing
    
    $sample_data = [];
    
    switch ($period) {
        case 'daily':
            // Last 24 hours by hour
            for ($i = 0; $i < $limit; $i++) {
                $hour = date('ga', strtotime('-' . $i . ' hours'));
                $sample_data[] = [
                    'label' => $hour,
                    'value' => rand(10, 150)
                ];
            }
            break;
            
        case 'weekly':
            // Last X days
            for ($i = $limit - 1; $i >= 0; $i--) {
                $day = date('D', strtotime('-' . $i . ' days'));
                $sample_data[] = [
                    'label' => $day,
                    'value' => rand(200, 500)
                ];
            }
            break;
            
        case 'monthly':
            // Last X weeks
            for ($i = $limit - 1; $i >= 0; $i--) {
                $week = 'Week ' . ($limit - $i);
                $sample_data[] = [
                    'label' => $week,
                    'value' => rand(1000, 3000)
                ];
            }
            break;
            
        case 'yearly':
            // Last X months
            $months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            $current_month = date('n') - 1; // 0-based
            
            for ($i = 0; $i < $limit; $i++) {
                $month_index = ($current_month - $i + 12) % 12;
                $sample_data[] = [
                    'label' => $months[$month_index],
                    'value' => rand(5000, 15000)
                ];
            }
            break;
    }
    
    // Reverse to get chronological order
    return array_reverse($sample_data);
}

/**
 * Get traffic source statistics
 * 
 * @return array Traffic source data
 */
function get_traffic_sources() {
    // TODO: Implement actual database query
    // For now, return sample data for testing
    
    return [
        [
            'name' => 'Direct',
            'value' => 45,
            'color' => '#4e73df'
        ],
        [
            'name' => 'Organic Search',
            'value' => 30,
            'color' => '#1cc88a'
        ],
        [
            'name' => 'Social Media',
            'value' => 15,
            'color' => '#36b9cc'
        ],
        [
            'name' => 'Referral',
            'value' => 10,
            'color' => '#f6c23e'
        ]
    ];
}

/**
 * Get top performing pages
 * 
 * @param int $limit Number of pages to return
 * @return array Top pages data
 */
function get_top_pages($limit = 5) {
    // TODO: Implement actual database query
    // For now, return sample data for testing
    
    return [
        [
            'name' => 'Home',
            'views' => 1245
        ],
        [
            'name' => 'Finance & Accounting',
            'views' => 842
        ],
        [
            'name' => 'Contact Us',
            'views' => 625
        ],
        [
            'name' => 'Dedicated Teams',
            'views' => 418
        ],
        [
            'name' => 'About Us',
            'views' => 385
        ]
    ];
}

/**
 * Get recent admin activities
 * 
 * @param int $limit Number of activities to return
 * @return array Recent activities data
 */
function get_recent_activities($limit = 5) {
    // TODO: Implement actual database query
    // For now, return sample data for testing
    
    $activities = [
        [
            'type' => 'content',
            'title' => 'Page Content Updated',
            'description' => 'The Home page content was updated by Mark Wilson.',
            'time' => '2 days ago',
            'link' => 'index.php',
            'action_text' => 'View Page'
        ],
        [
            'type' => 'system',
            'title' => 'System Backup Completed',
            'description' => 'Automatic weekly backup completed successfully.',
            'time' => '4 days ago',
            'link' => 'admin-backup.php',
            'action_text' => 'View Backups'
        ]
    ];
    
    return array_slice($activities, 0, $limit);
}

/**
 * Format analytics data for Chart.js
 * 
 * @param array $data Raw data
 * @param string $label Chart label
 * @param string $color Chart color (hex)
 * @return array Formatted data for Chart.js
 */
function format_chart_data($data, $label, $color = '#4e73df') {
    $labels = [];
    $values = [];
    
    foreach ($data as $item) {
        $labels[] = $item['label'];
        $values[] = $item['value'];
    }
    
    return [
        'labels' => $labels,
        'datasets' => [
            [
                'label' => $label,
                'data' => $values,
                'backgroundColor' => 'rgba(' . hex_to_rgb($color) . ', 0.1)',
                'borderColor' => $color,
                'borderWidth' => 2,
                'tension' => 0.3,
                'fill' => true
            ]
        ]
    ];
}

/**
 * Format analytics data for donut/pie chart
 * 
 * @param array $data Raw data
 * @param string $label Chart label
 * @return array Formatted data for Chart.js
 */
function format_donut_chart_data($data, $label) {
    $labels = [];
    $values = [];
    $colors = [];
    
    foreach ($data as $item) {
        $labels[] = $item['name'];
        $values[] = $item['value'];
        $colors[] = $item['color'] ?? '#' . substr(md5($item['name']), 0, 6);
    }
    
    return [
        'labels' => $labels,
        'datasets' => [
            [
                'label' => $label,
                'data' => $values,
                'backgroundColor' => $colors,
                'borderWidth' => 1,
                'hoverOffset' => 4
            ]
        ]
    ];
}

/**
 * Convert hex color to RGB
 * 
 * @param string $hex Hex color code
 * @return string RGB values as comma-separated string
 */
function hex_to_rgb($hex) {
    // Remove # if present
    $hex = ltrim($hex, '#');
    
    // Parse hex color
    if (strlen($hex) == 3) {
        $r = hexdec(substr($hex, 0, 1) . substr($hex, 0, 1));
        $g = hexdec(substr($hex, 1, 1) . substr($hex, 1, 1));
        $b = hexdec(substr($hex, 2, 1) . substr($hex, 2, 1));
    } else {
        $r = hexdec(substr($hex, 0, 2));
        $g = hexdec(substr($hex, 2, 2));
        $b = hexdec(substr($hex, 4, 2));
    }
    
    return "{$r}, {$g}, {$b}";
}

/**
 * Get statistics for dashboard cards
 * 
 * @return array Statistics data
 */
function get_dashboard_stats() {
    // TODO: Implement actual database query
    // For now, return sample data for testing
    
    return [
        'visitors' => [
            'count' => 2458,
            'change' => 15.3,
            'change_type' => 'positive' // positive, negative, neutral
        ],
        'inquiries' => [
            'count' => 37,
            'change' => 8.2,
            'change_type' => 'positive'
        ],
        'blog_posts' => [
            'count' => 14,
            'change' => 0,
            'change_type' => 'neutral'
        ],
        'subscribers' => [
            'count' => 28,
            'change' => -5.7,
            'change_type' => 'negative'
        ]
    ];
}

/**
 * Get visitor data per device type
 * 
 * @return array Device data
 */
function get_device_stats() {
    // TODO: Implement actual database query
    // For now, return sample data for testing
    
    return [
        [
            'name' => 'Desktop',
            'value' => 58,
            'color' => '#4e73df'
        ],
        [
            'name' => 'Mobile',
            'value' => 35,
            'color' => '#1cc88a'
        ],
        [
            'name' => 'Tablet',
            'value' => 7,
            'color' => '#36b9cc'
        ]
    ];
}

/**
 * Get browser usage statistics
 * 
 * @return array Browser data
 */
function get_browser_stats() {
    // TODO: Implement actual database query
    // For now, return sample data for testing
    
    return [
        [
            'name' => 'Chrome',
            'value' => 62,
            'color' => '#4e73df'
        ],
        [
            'name' => 'Safari',
            'value' => 18,
            'color' => '#1cc88a'
        ],
        [
            'name' => 'Firefox',
            'value' => 10,
            'color' => '#36b9cc'
        ],
        [
            'name' => 'Edge',
            'value' => 8,
            'color' => '#f6c23e'
        ],
        [
            'name' => 'Others',
            'value' => 2,
            'color' => '#e74a3b'
        ]
    ];
}

/**
 * Get geographic distribution of visitors
 * 
 * @param int $limit Number of countries to return
 * @return array Country data
 */
function get_country_stats($limit = 5) {
    // TODO: Implement actual database query
    // For now, return sample data for testing
    
    $countries = [
        [
            'name' => 'United States',
            'value' => 45,
            'code' => 'us'
        ],
        [
            'name' => 'United Kingdom',
            'value' => 15,
            'code' => 'gb'
        ],
        [
            'name' => 'Australia',
            'value' => 12,
            'code' => 'au'
        ],
        [
            'name' => 'Canada',
            'value' => 10,
            'code' => 'ca'
        ],
        [
            'name' => 'Germany',
            'value' => 8,
            'code' => 'de'
        ],
        [
            'name' => 'India',
            'value' => 5,
            'code' => 'in'
        ],
        [
            'name' => 'Other',
            'value' => 5,
            'code' => 'globe'
        ]
    ];
    
    return array_slice($countries, 0, $limit);
}
