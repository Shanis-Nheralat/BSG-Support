<?php
/**
 * settings-handler.php
 * Handles all server-side operations for the site settings
 */

// Initialize session if not already started
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Load configuration
require_once 'config.php';
require_once 'functions.php';

// Check authentication
if (!is_user_logged_in() || !current_user_can('manage_settings')) {
    header('HTTP/1.1 403 Forbidden');
    echo json_encode(['success' => false, 'message' => 'You do not have permission to manage settings.']);
    exit;
}

// Connect to database
try {
    $pdo = new PDO(
        'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4',
        DB_USER,
        DB_PASSWORD,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false
        ]
    );
} catch (PDOException $e) {
    error_log('Database connection error: ' . $e->getMessage());
    header('HTTP/1.1 500 Internal Server Error');
    echo json_encode(['success' => false, 'message' => 'Database connection error.']);
    exit;
}

// Get action from request
$action = isset($_POST['action']) ? $_POST['action'] : (isset($_GET['action']) ? $_GET['action'] : '');

// Handle different actions
switch ($action) {
    case 'get_settings':
        // Get settings group
        $group = isset($_GET['group']) ? $_GET['group'] : 'general';
        get_settings($pdo, $group);
        break;
        
    case 'save_settings':
        // Validate nonce for security
        if (!verify_nonce($_POST['nonce'], 'save_settings')) {
            header('HTTP/1.1 403 Forbidden');
            echo json_encode(['success' => false, 'message' => 'Security check failed.']);
            exit;
        }
        
        // Get settings group
        $group = isset($_POST['group']) ? $_POST['group'] : '';
        
        if (empty($group)) {
            header('HTTP/1.1 400 Bad Request');
            echo json_encode(['success' => false, 'message' => 'Settings group is required.']);
            exit;
        }
        
        // Get settings data
        $settings = isset($_POST['settings']) ? $_POST['settings'] : [];
        
        if (empty($settings)) {
            header('HTTP/1.1 400 Bad Request');
            echo json_encode(['success' => false, 'message' => 'No settings data provided.']);
            exit;
        }
        
        save_settings($pdo, $group, $settings);
        break;
        
    case 'upload_media':
        // Validate nonce for security
        if (!verify_nonce($_POST['nonce'], 'upload_media')) {
            header('HTTP/1.1 403 Forbidden');
            echo json_encode(['success' => false, 'message' => 'Security check failed.']);
            exit;
        }
        
        // Check if file was uploaded
        if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
            header('HTTP/1.1 400 Bad Request');
            echo json_encode(['success' => false, 'message' => 'No file uploaded or upload error.']);
            exit;
        }
        
        upload_media($pdo, $_FILES['file']);
        break;
        
    case 'get_media':
        get_media($pdo);
        break;
        
    case 'delete_media':
        // Validate nonce for security
        if (!verify_nonce($_POST['nonce'], 'delete_media')) {
            header('HTTP/1.1 403 Forbidden');
            echo json_encode(['success' => false, 'message' => 'Security check failed.']);
            exit;
        }
        
        // Get media ID
        $media_id = isset($_POST['media_id']) ? intval($_POST['media_id']) : 0;
        
        if ($media_id <= 0) {
            header('HTTP/1.1 400 Bad Request');
            echo json_encode(['success' => false, 'message' => 'Invalid media ID.']);
            exit;
        }
        
        delete_media($pdo, $media_id);
        break;
        
    case 'create_backup':
        // Validate nonce for security
        if (!verify_nonce($_POST['nonce'], 'create_backup')) {
            header('HTTP/1.1 403 Forbidden');
            echo json_encode(['success' => false, 'message' => 'Security check failed.']);
            exit;
        }
        
        // Get backup options
        $options = isset($_POST['options']) ? $_POST['options'] : [];
        
        if (empty($options)) {
            header('HTTP/1.1 400 Bad Request');
            echo json_encode(['success' => false, 'message' => 'No backup options selected.']);
            exit;
        }
        
        create_backup($pdo, $options);
        break;
        
    case 'get_backups':
        get_backups($pdo);
        break;
        
    case 'restore_backup':
        // Validate nonce for security
        if (!verify_nonce($_POST['nonce'], 'restore_backup')) {
            header('HTTP/1.1 403 Forbidden');
            echo json_encode(['success' => false, 'message' => 'Security check failed.']);
            exit;
        }
        
        // Get backup ID
        $backup_id = isset($_POST['backup_id']) ? intval($_POST['backup_id']) : 0;
        
        if ($backup_id <= 0) {
            header('HTTP/1.1 400 Bad Request');
            echo json_encode(['success' => false, 'message' => 'Invalid backup ID.']);
            exit;
        }
        
        restore_backup($pdo, $backup_id);
        break;
        
    case 'delete_backup':
        // Validate nonce for security
        if (!verify_nonce($_POST['nonce'], 'delete_backup')) {
            header('HTTP/1.1 403 Forbidden');
            echo json_encode(['success' => false, 'message' => 'Security check failed.']);
            exit;
        }
        
        // Get backup ID
        $backup_id = isset($_POST['backup_id']) ? intval($_POST['backup_id']) : 0;
        
        if ($backup_id <= 0) {
            header('HTTP/1.1 400 Bad Request');
            echo json_encode(['success' => false, 'message' => 'Invalid backup ID.']);
            exit;
        }
        
        delete_backup($pdo, $backup_id);
        break;
        
    case 'clear_cache':
        // Validate nonce for security
        if (!verify_nonce($_POST['nonce'], 'clear_cache')) {
            header('HTTP/1.1 403 Forbidden');
            echo json_encode(['success' => false, 'message' => 'Security check failed.']);
            exit;
        }
        
        // Get cache type
        $cache_type = isset($_POST['cache_type']) ? $_POST['cache_type'] : 'all';
        
        clear_cache($pdo, $cache_type);
        break;
        
    case 'regenerate_sitemap':
        // Validate nonce for security
        if (!verify_nonce($_POST['nonce'], 'regenerate_sitemap')) {
            header('HTTP/1.1 403 Forbidden');
            echo json_encode(['success' => false, 'message' => 'Security check failed.']);
            exit;
        }
        
        regenerate_sitemap($pdo);
        break;
        
    case 'send_test_email':
        // Validate nonce for security
        if (!verify_nonce($_POST['nonce'], 'send_test_email')) {
            header('HTTP/1.1 403 Forbidden');
            echo json_encode(['success' => false, 'message' => 'Security check failed.']);
            exit;
        }
        
        // Get SMTP settings
        $smtp_host = isset($_POST['smtp_host']) ? $_POST['smtp_host'] : '';
        $smtp_port = isset($_POST['smtp_port']) ? intval($_POST['smtp_port']) : 0;
        $smtp_username = isset($_POST['smtp_username']) ? $_POST['smtp_username'] : '';
        $smtp_password = isset($_POST['smtp_password']) ? $_POST['smtp_password'] : '';
        $smtp_secure = isset($_POST['smtp_secure']) ? $_POST['smtp_secure'] : 'tls';
        
        if (empty($smtp_host) || $smtp_port <= 0 || empty($smtp_username) || empty($smtp_password)) {
            header('HTTP/1.1 400 Bad Request');
            echo json_encode(['success' => false, 'message' => 'SMTP settings are incomplete.']);
            exit;
        }
        
        send_test_email($smtp_host, $smtp_port, $smtp_username, $smtp_password, $smtp_secure);
        break;
        
    default:
        header('HTTP/1.1 400 Bad Request');
        echo json_encode(['success' => false, 'message' => 'Invalid action.']);
        exit;
}

/**
 * Get settings for a specific group
 */
function get_settings($pdo, $group) {
    try {
        // Validate group to prevent SQL injection
        $allowed_groups = ['general', 'branding', 'contact', 'social', 'seo', 'notification', 'performance', 'security', 'api'];
        
        if (!in_array($group, $allowed_groups)) {
            throw new Exception('Invalid settings group.');
        }
        
        // Query settings from database
        $stmt = $pdo->prepare('SELECT setting_key, setting_value, field_type, description FROM settings WHERE setting_group = :group ORDER BY id');
        $stmt->execute(['group' => $group]);
        
        $settings = $stmt->fetchAll();
        
        // Handle special settings groups
        if ($group === 'social') {
            // Get social media platforms
            $stmt = $pdo->prepare('SELECT * FROM social_media ORDER BY display_order');
            $stmt->execute();
            
            $social_media = $stmt->fetchAll();
            
            echo json_encode(['success' => true, 'settings' => $settings, 'social_media' => $social_media]);
            exit;
        } else if ($group === 'branding') {
            // Get color schemes
            $stmt = $pdo->prepare('SELECT * FROM colors ORDER BY id');
            $stmt->execute();
            
            $colors = $stmt->fetchAll();
            
            echo json_encode(['success' => true, 'settings' => $settings, 'colors' => $colors]);
            exit;
        }
        
        echo json_encode(['success' => true, 'settings' => $settings]);
    } catch (Exception $e) {
        error_log('Get settings error: ' . $e->getMessage());
        header('HTTP/1.1 500 Internal Server Error');
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        exit;
    }
}

/**
 * Save settings for a specific group
 */
function save_settings($pdo, $group, $settings) {
    try {
        // Start transaction
        $pdo->beginTransaction();
        
        // Validate group to prevent SQL injection
        $allowed_groups = ['general', 'branding', 'contact', 'social', 'seo', 'notification', 'performance', 'security', 'api'];
        
        if (!in_array($group, $allowed_groups)) {
            throw new Exception('Invalid settings group.');
        }
        
        // Handle special settings groups
        if ($group === 'social') {
            save_social_media($pdo, $settings);
        } else if ($group === 'branding') {
            save_branding($pdo, $settings);
        } else {
            // Update regular settings
            foreach ($settings as $key => $value) {
                // Sanitize key and value
                $key = sanitize_key($key);
                $value = sanitize_value($value);
                
                // Check if setting exists
                $stmt = $pdo->prepare('SELECT id FROM settings WHERE setting_key = :key AND setting_group = :group');
                $stmt->execute(['key' => $key, 'group' => $group]);
                
                if ($stmt->rowCount() > 0) {
                    // Update existing setting
                    $stmt = $pdo->prepare('UPDATE settings SET setting_value = :value, updated_at = NOW() WHERE setting_key = :key AND setting_group = :group');
                } else {
                    // Insert new setting
                    $stmt = $pdo->prepare('INSERT INTO settings (setting_key, setting_value, setting_group) VALUES (:key, :value, :group)');
                }
                
                $stmt->execute(['key' => $key, 'value' => $value, 'group' => $group]);
            }
        }
        
        // Process additional actions based on settings
        if ($group === 'general' && isset($settings['maintenance_mode'])) {
            // Update maintenance mode file
            update_maintenance_mode($settings['maintenance_mode'] === '1' || $settings['maintenance_mode'] === 'on', $settings['maintenance_message'] ?? '');
        } else if ($group === 'seo' && isset($settings['robots_txt'])) {
            // Update robots.txt
            update_robots_txt($settings['robots_txt']);
        }
        
        // Commit transaction
        $pdo->commit();
        
        echo json_encode(['success' => true, 'message' => ucfirst($group) . ' settings saved successfully.']);
    } catch (Exception $e) {
        // Rollback transaction on error
        $pdo->rollBack();
        
        error_log('Save settings error: ' . $e->getMessage());
        header('HTTP/1.1 500 Internal Server Error');
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        exit;
    }
}

/**
 * Save social media settings
 */
function save_social_media($pdo, $settings) {
    // Get social media platforms from settings
    $platforms = [];
    
    foreach ($settings as $key => $value) {
        // Check if key is a social media URL
        if (strpos($key, '_url') !== false) {
            $platform = str_replace('_url', '', $key);
            $platforms[$platform]['url'] = $value;
        }
    }
    
    // Add share enabled status
    if (isset($settings['share_buttons'])) {
        $share_buttons = is_array($settings['share_buttons']) ? $settings['share_buttons'] : [$settings['share_buttons']];
        
        foreach ($platforms as $platform => &$data) {
            $data['share_enabled'] = in_array($platform, $share_buttons) ? 1 : 0;
        }
    }
    
    // Update or insert social media platforms
    foreach ($platforms as $platform => $data) {
        // Check if platform exists
        $stmt = $pdo->prepare('SELECT id FROM social_media WHERE platform = :platform');
        $stmt->execute(['platform' => $platform]);
        
        if ($stmt->rowCount() > 0) {
            // Update existing platform
            $stmt = $pdo->prepare('UPDATE social_media SET url = :url, share_enabled = :share_enabled, updated_at = NOW() WHERE platform = :platform');
        } else {
            // Insert new platform
            $stmt = $pdo->prepare('INSERT INTO social_media (platform, url, share_enabled) VALUES (:platform, :url, :share_enabled)');
        }
        
        $stmt->execute([
            'platform' => $platform,
            'url' => $data['url'],
            'share_enabled' => $data['share_enabled'] ?? 0
        ]);
    }
    
    // Update social sharing setting
    if (isset($settings['social_sharing'])) {
        $share_enabled = $settings['social_sharing'] === '1' || $settings['social_sharing'] === 'on' ? 1 : 0;
        
        $stmt = $pdo->prepare('SELECT id FROM settings WHERE setting_key = :key AND setting_group = :group');
        $stmt->execute(['key' => 'social_sharing', 'group' => 'social']);
        
        if ($stmt->rowCount() > 0) {
            // Update existing setting
            $stmt = $pdo->prepare('UPDATE settings SET setting_value = :value, updated_at = NOW() WHERE setting_key = :key AND setting_group = :group');
        } else {
            // Insert new setting
            $stmt = $pdo->prepare('INSERT INTO settings (setting_key, setting_value, setting_group) VALUES (:key, :value, :group)');
        }
        
        $stmt->execute(['key' => 'social_sharing', 'value' => $share_enabled, 'group' => 'social']);
    }
}

/**
 * Save branding settings
 */
function save_branding($pdo, $settings) {
    // Handle color scheme
    if (isset($settings['color_scheme'])) {
        $active_scheme = $settings['color_scheme'];
        
        // Reset all schemes
        $stmt = $pdo->prepare('UPDATE colors SET is_active = 0');
        $stmt->execute();
        
        // Set active scheme
        $stmt = $pdo->prepare('UPDATE colors SET is_active = 1 WHERE scheme_name = :scheme');
        $stmt->execute(['scheme' => $active_scheme]);
        
        // If custom scheme, update colors
        if ($active_scheme === 'custom' && isset($settings['primary_color'], $settings['secondary_color'], $settings['accent_color'])) {
            // Check if custom scheme exists
            $stmt = $pdo->prepare('SELECT id FROM colors WHERE scheme_name = :scheme');
            $stmt->execute(['scheme' => 'custom']);
            
            if ($stmt->rowCount() > 0) {
                // Update existing scheme
                $stmt = $pdo->prepare('UPDATE colors SET primary_color = :primary, secondary_color = :secondary, accent_color = :accent, is_active = 1, updated_at = NOW() WHERE scheme_name = :scheme');
            } else {
                // Insert new scheme
                $stmt = $pdo->prepare('INSERT INTO colors (scheme_name, primary_color, secondary_color, accent_color, is_active) VALUES (:scheme, :primary, :secondary, :accent, 1)');
            }
            
            $stmt->execute([
                'scheme' => 'custom',
                'primary' => $settings['primary_color'],
                'secondary' => $settings['secondary_color'],
                'accent' => $settings['accent_color']
            ]);
        }
    }
    
    // Handle typography
    if (isset($settings['typography'])) {
        $typography = $settings['typography'];
        
        $stmt = $pdo->prepare('SELECT id FROM settings WHERE setting_key = :key AND setting_group = :group');
        $stmt->execute(['key' => 'typography', 'group' => 'branding']);
        
        if ($stmt->rowCount() > 0) {
            // Update existing setting
            $stmt = $pdo->prepare('UPDATE settings SET setting_value = :value, updated_at = NOW() WHERE setting_key = :key AND setting_group = :group');
        } else {
            // Insert new setting
            $stmt = $pdo->prepare('INSERT INTO settings (setting_key, setting_value, setting_group) VALUES (:key, :value, :group)');
        }
        
        $stmt->execute(['key' => 'typography', 'value' => $typography, 'group' => 'branding']);
    }
    
    // Handle custom CSS
    if (isset($settings['custom_css'])) {
        $custom_css = $settings['custom_css'];
        
        // Save to database
        $stmt = $pdo->prepare('SELECT id FROM settings WHERE setting_key = :key AND setting_group = :group');
        $stmt->execute(['key' => 'custom_css', 'group' => 'branding']);
        
        if ($stmt->rowCount() > 0) {
            // Update existing setting
            $stmt = $pdo->prepare('UPDATE settings SET setting_value = :value, updated_at = NOW() WHERE setting_key = :key AND setting_group = :group');
        } else {
            // Insert new setting
            $stmt = $pdo->prepare('INSERT INTO settings (setting_key, setting_value, setting_group) VALUES (:key, :value, :group)');
        }
        
        $stmt->execute(['key' => 'custom_css', 'value' => $custom_css, 'group' => 'branding']);
        
        // Update custom CSS file
        update_custom_css($custom_css);
    }
}

/**
 * Upload media file
 */
function upload_media($pdo, $file) {
    try {
        // Validate file type
        $allowed_types = [
            'image/jpeg', 'image/png', 'image/gif', 'image/svg+xml', 'image/webp',
            'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            'text/plain', 'text/csv'
        ];
        
        if (!in_array($file['type'], $allowed_types)) {
            throw new Exception('File type not allowed.');
        }
        
        // Validate file size (max 5MB)
        if ($file['size'] > 5 * 1024 * 1024) {
            throw new Exception('File size exceeds the maximum limit (5MB).');
        }
        
        // Generate unique filename
        $filename = generate_unique_filename($file['name']);
        $upload_dir = '../uploads/';
        $upload_path = $upload_dir . $filename;
        
        // Create upload directory if it doesn't exist
        if (!is_dir($upload_dir)) {
            mkdir($upload_dir, 0755, true);
        }
        
        // Move uploaded file
        if (!move_uploaded_file($file['tmp_name'], $upload_path)) {
            throw new Exception('Failed to move uploaded file.');
        }
        
        // Get file dimensions for images
        $dimensions = null;
        
        if (strpos($file['type'], 'image/') === 0) {
            $imageinfo = getimagesize($upload_path);
            
            if ($imageinfo) {
                $dimensions = $imageinfo[0] . 'x' . $imageinfo[1];
            }
            
            // Optimize image if it's JPEG or PNG
            if ($file['type'] === 'image/jpeg' || $file['type'] === 'image/png') {
                optimize_image($upload_path, $file['type']);
            }
        }
        
        // Save to database
        $stmt = $pdo->prepare('INSERT INTO media (filename, original_filename, file_path, file_url, file_type, file_size, dimensions, user_id) VALUES (:filename, :original, :path, :url, :type, :size, :dimensions, :user_id)');
        
        $stmt->execute([
            'filename' => $filename,
            'original' => $file['name'],
            'path' => $upload_path,
            'url' => '/uploads/' . $filename,
            'type' => $file['type'],
            'size' => $file['size'],
            'dimensions' => $dimensions,
            'user_id' => get_current_user_id()
        ]);
        
        $media_id = $pdo->lastInsertId();
        
        // Get uploaded media data
        $stmt = $pdo->prepare('SELECT * FROM media WHERE id = :id');
        $stmt->execute(['id' => $media_id]);
        
        $media = $stmt->fetch();
        
        echo json_encode(['success' => true, 'media' => $media]);
    } catch (Exception $e) {
        error_log('Upload media error: ' . $e->getMessage());
        header('HTTP/1.1 500 Internal Server Error');
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        exit;
    }
}

/**
 * Get media files
 */
function get_media($pdo) {
    try {
        // Get type filter
        $type_filter = isset($_GET['type']) ? $_GET['type'] : '';
        
        // Build query
        $sql = 'SELECT * FROM media';
        $params = [];
        
        if (!empty($type_filter) && $type_filter !== 'all') {
            $sql .= ' WHERE file_type LIKE :type';
            $params['type'] = $type_filter . '%';
        }
        
        $sql .= ' ORDER BY created_at DESC';
        
        // Add limit and pagination
        $page = isset($_GET['page']) ? intval($_GET['page']) : 1;
        $per_page = isset($_GET['per_page']) ? intval($_GET['per_page']) : 20;
        
        $sql .= ' LIMIT :offset, :limit';
        $params['offset'] = ($page - 1) * $per_page;
        $params['limit'] = $per_page;
        
        $stmt = $pdo->prepare($sql);
        
        // Bind named parameters
        foreach ($params as $key => $value) {
            if ($key === 'offset' || $key === 'limit') {
                $stmt->bindValue(':' . $key, $value, PDO::PARAM_INT);
            } else {
                $stmt->bindValue(':' . $key, $value);
            }
        }
        
        $stmt->execute();
        
        $media = $stmt->fetchAll();
        
        // Get total count for pagination
        $sql = 'SELECT COUNT(*) AS total FROM media';
        $params = [];
        
        if (!empty($type_filter) && $type_filter !== 'all') {
            $sql .= ' WHERE file_type LIKE :type';
            $params['type'] = $type_filter . '%';
        }
        
        $stmt = $pdo->prepare($sql);
        
        // Bind named parameters
        foreach ($params as $key => $value) {
            $stmt->bindValue(':' . $key, $value);
        }
        
        $stmt->execute();
        
        $total = $stmt->fetch()['total'];
        
        echo json_encode([
            'success' => true,
            'media' => $media,
            'pagination' => [
                'total' => $total,
                'per_page' => $per_page,
                'current_page' => $page,
                'last_page' => ceil($total / $per_page)
            ]
        ]);
    } catch (Exception $e) {
        error_log('Get media error: ' . $e->getMessage());
        header('HTTP/1.1 500 Internal Server Error');
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        exit;
    }
}

/**
 * Delete media file
 */
function delete_media($pdo, $media_id) {
    try {
        // Get media file information
        $stmt = $pdo->prepare('SELECT * FROM media WHERE id = :id');
        $stmt->execute(['id' => $media_id]);
        
        $media = $stmt->fetch();
        
        if (!$media) {
            throw new Exception('Media file not found.');
        }
        
        // Delete file from server
        if (file_exists($media['file_path'])) {
            unlink($media['file_path']);
        }
        
        // Delete from database
        $stmt = $pdo->prepare('DELETE FROM media WHERE id = :id');
        $stmt->execute(['id' => $media_id]);
        
        echo json_encode(['success' => true, 'message' => 'Media file deleted successfully.']);
    } catch (Exception $e) {
        error_log('Delete media error: ' . $e->getMessage());
        header('HTTP/1.1 500 Internal Server Error');
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        exit;
    }
}

/**
 * Create backup
 */
function create_backup($pdo, $options) {
    try {
        // Initialize backup process
        $backup_type = in_array('database', $options) && in_array('files', $options) ? 'full' : (in_array('database', $options) ? 'database' : 'files');
        $timestamp = date('Y-m-d_H-i-s');
        $backup_filename = 'backup_' . $backup_type . '_' . $timestamp . '.zip';
        $backup_path = '../backups/' . $backup_filename;
        
        // Create backups directory if it doesn't exist
        if (!is_dir('../backups/')) {
            mkdir('../backups/', 0755, true);
        }
        
        // Create backup record in database
        $stmt = $pdo->prepare('INSERT INTO backups (filename, file_path, file_size, backup_type, status, user_id) VALUES (:filename, :path, 0, :type, :status, :user_id)');
        
        $stmt->execute([
            'filename' => $backup_filename,
            'path' => $backup_path,
            'type' => $backup_type,
            'status' => 'processing',
            'user_id' => get_current_user_id()
        ]);
        
        $backup_id = $pdo->lastInsertId();
        
        // Start backup process in background (in a real app, this would be done by a cron job or queue)
        // For demonstration, we'll pretend it's processing
        header('Content-Type: application/json');
        echo json_encode(['success' => true, 'message' => 'Backup process started.', 'backup_id' => $backup_id]);
        
        // In a real implementation, the following would be handled by a separate process
        // Here we'll simulate completion
        if (connection_status() != CONNECTION_NORMAL) {
            return;
        }
        
        // Close connection to browser
        ob_end_flush();
        flush();
        
        // Wait a bit to simulate processing
        sleep(2);
        
        // Update backup record to indicate completion
        $filesize = 1024 * 1024 * rand(10, 50); // Random size between 10-50 MB
        
        $stmt = $pdo->prepare('UPDATE backups SET status = :status, file_size = :size, completed_at = NOW() WHERE id = :id');
        $stmt->execute([
            'status' => 'completed',
            'size' => $filesize,
            'id' => $backup_id
        ]);
    } catch (Exception $e) {
        error_log('Create backup error: ' . $e->getMessage());
        
        // Update backup record to indicate failure
        if (isset($backup_id)) {
            $stmt = $pdo->prepare('UPDATE backups SET status = :status, notes = :notes WHERE id = :id');
            $stmt->execute([
                'status' => 'failed',
                'notes' => $e->getMessage(),
                'id' => $backup_id
            ]);
        }
        
        header('HTTP/1.1 500 Internal Server Error');
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        exit;
    }
}

// Helper functions

/**
 * Sanitize input key
 */
function sanitize_key($key) {
    return preg_replace('/[^a-z0-9_]/i', '', $key);
}

/**
 * Sanitize input value
 */
function sanitize_value($value) {
    if (is_array($value)) {
        return implode(',', array_map('sanitize_value', $value));
    }
    
    return htmlspecialchars($value, ENT_QUOTES, 'UTF-8');
}

/**
 * Verify nonce for CSRF protection
 */
function verify_nonce($nonce, $action) {
    // In a real app, implement proper nonce verification
    return true;
}

/**
 * Get current user ID
 */
function get_current_user_id() {
    // In a real app, get ID from session
    return 1;
}

/**
 * Generate unique filename
 */
function generate_unique_filename($filename) {
    $info = pathinfo($filename);
    $extension = isset($info['extension']) ? '.' . $info['extension'] : '';
    $name = isset($info['filename']) ? $info['filename'] : 'file';
    
    return $name . '_' . time() . '_' . substr(md5(rand()), 0, 6) . $extension;
}

/**
 * Optimize image
 */
function optimize_image($path, $type) {
    // In a real app, implement image optimization
    return true;
}

/**
 * Update maintenance mode
 */
function update_maintenance_mode($enabled, $message) {
    if ($enabled) {
        // Create maintenance file
        file_put_contents('../.maintenance', $message);
    } else {
        // Remove maintenance file if it exists
        if (file_exists('../.maintenance')) {
            unlink('../.maintenance');
        }
    }
}

/**
 * Update robots.txt
 */
function update_robots_txt($content) {
    file_put_contents('../robots.txt', $content);
}

/**
 * Update custom CSS file
 */
function update_custom_css($css) {
    file_put_contents('../css/custom.css', $css);
}
