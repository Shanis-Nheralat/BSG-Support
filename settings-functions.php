<?php
/**
 * Settings Functions - Adapted Version
 * Core functionality for settings management system that works with existing database
 */

// Prevent direct access
if (!defined('ADMIN_PANEL')) {
    exit('Direct access not permitted');
}

// Define constants if not already defined
if (!defined('UPLOAD_DIR')) {
    define('UPLOAD_DIR', dirname(__FILE__) . '/uploads/');
}

if (!defined('UPLOAD_URL')) {
    $current_dir = dirname($_SERVER['PHP_SELF']);
    $upload_url = $current_dir . '/uploads/';
    define('UPLOAD_URL', $upload_url);
}

// Create uploads directory if it doesn't exist
if (!is_dir(UPLOAD_DIR)) {
    mkdir(UPLOAD_DIR, 0755, true);
}

// Create media directory if it doesn't exist
if (!is_dir(UPLOAD_DIR . 'media/')) {
    mkdir(UPLOAD_DIR . 'media/', 0755, true);
}

/**
 * Get a setting from the database
 * Modified to work with existing database
 * 
 * @param string $group The settings group (e.g., 'seo_homepage', 'chatbot')
 * @param string $key The setting key (e.g., 'meta_title', 'enabled')
 * @param mixed $default Default value if setting doesn't exist
 * @return mixed The setting value or default
 */
function get_setting($group, $key, $default = null) {
    global $db;
    
    // Static cache to reduce database queries
    static $settings_cache = [];
    
    // Create cache key
    $cache_key = $group . '_' . $key;
    
    // Check if value is in cache
    if (isset($settings_cache[$cache_key])) {
        return format_setting_value($settings_cache[$cache_key]['value'], $settings_cache[$cache_key]['type']);
    }
    
    // Try to get from settings table if it exists
    try {
        // First, check if the settings table exists
        $table_check = $db->query("SHOW TABLES LIKE 'settings'");
        
        if ($table_check && $table_check->num_rows > 0) {
            // Table exists, proceed with standard query
            $stmt = $db->prepare("SELECT setting_value, type FROM settings WHERE setting_group = ? AND setting_key = ? LIMIT 1");
            $stmt->bind_param("ss", $group, $key);
            $stmt->execute();
            $result = $stmt->get_result();
            
            if ($result && $result->num_rows > 0) {
                $row = $result->fetch_assoc();
                
                // Store in cache
                $settings_cache[$cache_key] = [
                    'value' => $row['setting_value'],
                    'type' => $row['type']
                ];
                
                return format_setting_value($row['setting_value'], $row['type']);
            }
        } else {
            // Settings table doesn't exist, try to get from other tables
            // This is where you'd adapt to your existing database structure
            
            // Example: Try to get from options table (common in WordPress)
            $option_name = $group . '_' . $key;
            $result = $db->query("SHOW TABLES LIKE 'options'");
            
            if ($result && $result->num_rows > 0) {
                $stmt = $db->prepare("SELECT option_value FROM options WHERE option_name = ? LIMIT 1");
                $stmt->bind_param("s", $option_name);
                $stmt->execute();
                $result = $stmt->get_result();
                
                if ($result && $result->num_rows > 0) {
                    $row = $result->fetch_assoc();
                    
                    // Store in cache
                    $settings_cache[$cache_key] = [
                        'value' => $row['option_value'],
                        'type' => 'text' // Default type
                    ];
                    
                    return $row['option_value'];
                }
            }
            
            // You can add more fallbacks here for other table structures
        }
    } catch (Exception $e) {
        // Log error if needed
        error_log("Error getting setting: " . $e->getMessage());
    }
    
    return $default;
}

/**
 * Format setting value based on type
 * 
 * @param mixed $value The setting value
 * @param string $type The setting type
 * @return mixed The formatted value
 */
function format_setting_value($value, $type) {
    switch ($type) {
        case 'boolean':
            return filter_var($value, FILTER_VALIDATE_BOOLEAN);
        case 'json':
            $decoded = json_decode($value, true);
            return ($decoded !== null) ? $decoded : $value;
        case 'image':
        case 'file':
            // Add cache-busting parameter for images and files
            if (!empty($value)) {
                return $value . '?v=' . time();
            }
            return $value;
        default:
            return $value;
    }
}

/**
 * Set a setting in the database
 * Modified to work with existing database or create settings table if needed
 * 
 * @param string $group The settings group
 * @param string $key The setting key
 * @param mixed $value The setting value
 * @param string $type The setting type (text, textarea, boolean, image, json, file)
 * @return bool True on success, false on failure
 */
function set_setting($group, $key, $value, $type = 'text') {
    global $db;
    
    // Format value for storage based on type
    if ($type === 'boolean') {
        $value = filter_var($value, FILTER_VALIDATE_BOOLEAN) ? '1' : '0';
    } elseif ($type === 'json' && is_array($value)) {
        $value = json_encode($value);
    }
    
    try {
        // Check if settings table exists
        $table_check = $db->query("SHOW TABLES LIKE 'settings'");
        
        if ($table_check && $table_check->num_rows > 0) {
            // Table exists, proceed with standard approach
            
            // Handle file uploads for image and file types
            if (($type == 'image' || $type == 'file') && $value !== null && $value !== '') {
                // If this is a new file upload, handle the old file
                $old_value = get_setting($group, $key, '');
                
                // Strip cache-busting parameter if present
                if (strpos($old_value, '?v=') !== false) {
                    $old_value = substr($old_value, 0, strpos($old_value, '?v='));
                }
                
                if ($old_value && $old_value !== $value && file_exists(UPLOAD_DIR . $old_value)) {
                    // Check if the file is used elsewhere before deleting
                    $stmt = $db->prepare("SELECT COUNT(*) as count FROM settings 
                                         WHERE setting_value = ? 
                                         AND NOT (setting_group = ? AND setting_key = ?)");
                    $stmt->bind_param("sss", $old_value, $group, $key);
                    $stmt->execute();
                    $result = $stmt->get_result();
                    $row = $result->fetch_assoc();
                    
                    // If file isn't used elsewhere, delete it
                    if ($row['count'] == 0) {
                        @unlink(UPLOAD_DIR . $old_value);
                        // Log the activity if a logging function exists
                        if (function_exists('log_admin_activity')) {
                            log_admin_activity('file_deleted', 'settings', null, "Deleted unused file: $old_value");
                        }
                    }
                }
            }
            
            // Check if setting already exists
            $stmt = $db->prepare("SELECT id FROM settings WHERE setting_group = ? AND setting_key = ? LIMIT 1");
            $stmt->bind_param("ss", $group, $key);
            $stmt->execute();
            $result = $stmt->get_result();
            
            // Get current user ID for tracking if available
            $updated_by = null;
            if (function_exists('get_admin_user')) {
                $admin_user = get_admin_user();
                $updated_by = $admin_user ? $admin_user['id'] : null;
            }
            
            if ($result && $result->num_rows > 0) {
                // Update existing setting
                if ($updated_by !== null) {
                    $stmt = $db->prepare("UPDATE settings SET setting_value = ?, type = ?, updated_by = ? 
                                        WHERE setting_group = ? AND setting_key = ?");
                    $stmt->bind_param("ssiss", $value, $type, $updated_by, $group, $key);
                } else {
                    $stmt = $db->prepare("UPDATE settings SET setting_value = ?, type = ? 
                                        WHERE setting_group = ? AND setting_key = ?");
                    $stmt->bind_param("ssss", $value, $type, $group, $key);
                }
            } else {
                // Insert new setting
                if ($updated_by !== null) {
                    $stmt = $db->prepare("INSERT INTO settings (setting_group, setting_key, setting_value, type, updated_by) 
                                        VALUES (?, ?, ?, ?, ?)");
                    $stmt->bind_param("ssssi", $group, $key, $value, $type, $updated_by);
                } else {
                    $stmt = $db->prepare("INSERT INTO settings (setting_group, setting_key, setting_value, type) 
                                        VALUES (?, ?, ?, ?)");
                    $stmt->bind_param("ssss", $group, $key, $value, $type);
                }
            }
            
            $success = $stmt->execute();
            
            if ($success) {
                // Log the activity if a logging function exists
                if (function_exists('log_admin_activity')) {
                    log_admin_activity('setting_updated', 'settings', null, "Updated setting: $group.$key");
                }
                
                // Clear cache for this setting
                static $settings_cache = [];
                unset($settings_cache[$group . '_' . $key]);
                
                // Set success notification if function exists
                if (function_exists('set_success_message')) {
                    set_success_message("Setting '$key' updated successfully.");
                }
                
                return true;
            }
            
            // Set error notification if function exists
            if (function_exists('set_error_message')) {
                set_error_message("Failed to update setting '$key'.");
            }
            return false;
            
        } else {
            // Settings table doesn't exist, create it
            $create_table_sql = "CREATE TABLE IF NOT EXISTS settings (
                id INT AUTO_INCREMENT PRIMARY KEY,
                setting_group VARCHAR(100) NOT NULL,
                setting_key VARCHAR(100) NOT NULL,
                setting_value TEXT,
                type ENUM('text','textarea','boolean','image','json','file') DEFAULT 'text',
                autoload BOOLEAN DEFAULT 1,
                updated_by INT NULL,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                UNIQUE KEY group_key (setting_group, setting_key)
            )";
            
            $db->query($create_table_sql);
            
            // Try setting again after creating the table
            return set_setting($group, $key, $value, $type);
        }
    } catch (Exception $e) {
        // Log error if needed
        error_log("Error setting setting: " . $e->getMessage());
        
        // Set error notification if function exists
        if (function_exists('set_error_message')) {
            set_error_message("Database error while updating setting '$key'.");
        }
        return false;
    }
}

/**
 * Handle file upload for settings
 * 
 * @param string $file_input_name The name of the file input field
 * @param string $destination_dir The destination directory
 * @param array $allowed_types Array of allowed MIME types
 * @param int $max_size Maximum file size in bytes
 * @return string|false The path to the uploaded file or false on failure
 */
function handle_file_upload($file_input_name, $destination_dir = 'uploads/', $allowed_types = ['image/jpeg', 'image/png', 'image/gif'], $max_size = 5242880) {
    // Check if file was uploaded
    if (!isset($_FILES[$file_input_name]) || $_FILES[$file_input_name]['error'] !== UPLOAD_ERR_OK) {
        return false;
    }
    
    $file = $_FILES[$file_input_name];
    
    // Check file size
    if ($file['size'] > $max_size) {
        if (function_exists('set_error_message')) {
            set_error_message("File is too large. Maximum size is " . ($max_size / 1024 / 1024) . "MB.");
        }
        return false;
    }
    
    // Check file type
    $finfo = new finfo(FILEINFO_MIME_TYPE);
    $file_type = $finfo->file($file['tmp_name']);
    
    if (!in_array($file_type, $allowed_types)) {
        if (function_exists('set_error_message')) {
            set_error_message("File type not allowed. Allowed types: " . implode(', ', array_map(function($type) {
                return explode('/', $type)[1];
            }, $allowed_types)));
        }
        return false;
    }
    
    // Create destination directory if it doesn't exist
    if (!is_dir($destination_dir)) {
        mkdir($destination_dir, 0755, true);
    }
    
    // Generate unique filename
    $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
    $filename = uniqid() . '_' . time() . '.' . $extension;
    $destination = $destination_dir . $filename;
    
    // Move uploaded file
    if (move_uploaded_file($file['tmp_name'], $destination)) {
        return str_replace(UPLOAD_DIR, '', $destination);
    }
    
    if (function_exists('set_error_message')) {
        set_error_message("Failed to upload file. Please try again.");
    }
    return false;
}

/**
 * Render a setting field
 * 
 * @param string $group The settings group
 * @param string $key The setting key
 * @param string $label The field label
 * @param string $type The field type
 * @param array $options Additional options for the field
 * @return string The HTML for the field
 */
function render_setting_field($group, $key, $label, $type = 'text', $options = []) {
    $current_value = get_setting($group, $key);
    $field_id = "setting_{$group}_{$key}";
    $field_name = "settings[$group][$key]";
    
    // Default options
    $default_options = [
        'placeholder' => '',
        'description' => '',
        'required' => false,
        'class' => '',
        'options' => [],
        'min' => null,
        'max' => null,
        'step' => null
    ];
    
    // Merge options
    $options = array_merge($default_options, $options);
    
    // Build HTML
    $html = '<div class="form-group mb-4">';
    $html .= '<label for="' . $field_id . '" class="form-label">' . $label;
    
    // Add required asterisk
    if ($options['required']) {
        $html .= ' <span class="text-danger">*</span>';
    }
    
    $html .= '</label>';
    
    // Strip cache parameter from current value for display
    if (($type === 'image' || $type === 'file') && $current_value) {
        if (strpos($current_value, '?v=') !== false) {
            $display_value = substr($current_value, 0, strpos($current_value, '?v='));
        } else {
            $display_value = $current_value;
        }
    } else {
        $display_value = $current_value;
    }
    
    // Different rendering based on field type
    switch ($type) {
        case 'textarea':
            $html .= '<textarea id="' . $field_id . '" name="' . $field_name . '" class="form-control ' . $options['class'] . '" ' .
                    'placeholder="' . $options['placeholder'] . '" ' .
                    ($options['required'] ? 'required' : '') . '>' .
                    htmlspecialchars($display_value) . '</textarea>';
            break;
            
        case 'boolean':
            $checked = filter_var($display_value, FILTER_VALIDATE_BOOLEAN) ? 'checked' : '';
            $html .= '<div class="form-check form-switch">';
            $html .= '<input type="checkbox" id="' . $field_id . '" name="' . $field_name . '" class="form-check-input ' . $options['class'] . '" value="1" ' . $checked . '>';
            $html .= '</div>';
            break;
            
        case 'select':
            $html .= '<select id="' . $field_id . '" name="' . $field_name . '" class="form-select ' . $options['class'] . '" ' .
                    ($options['required'] ? 'required' : '') . '>';
            
            foreach ($options['options'] as $value => $option_label) {
                $selected = ($display_value == $value) ? 'selected' : '';
                $html .= '<option value="' . $value . '" ' . $selected . '>' . $option_label . '</option>';
            }
            
            $html .= '</select>';
            break;
            
        case 'number':
            $min = $options['min'] !== null ? 'min="' . $options['min'] . '"' : '';
            $max = $options['max'] !== null ? 'max="' . $options['max'] . '"' : '';
            $step = $options['step'] !== null ? 'step="' . $options['step'] . '"' : '';
            
            $html .= '<input type="number" id="' . $field_id . '" name="' . $field_name . '" value="' . $display_value . '" ' .
                    'class="form-control ' . $options['class'] . '" ' .
                    'placeholder="' . $options['placeholder'] . '" ' .
                    $min . ' ' . $max . ' ' . $step . ' ' .
                    ($options['required'] ? 'required' : '') . '>';
            break;
            
        case 'image':
        case 'file':
            $html .= render_upload_field($group, $key, $type, $options);
            break;
            
        case 'json':
            $html .= '<textarea id="' . $field_id . '" name="' . $field_name . '" class="form-control ' . $options['class'] . '" ' .
                    'placeholder="' . $options['placeholder'] . '" ' .
                    ($options['required'] ? 'required' : '') . '>' .
                    (is_array($display_value) ? json_encode($display_value, JSON_PRETTY_PRINT) : $display_value) . '</textarea>';
            break;
            
        case 'readonly':
            $html .= '<input type="text" id="' . $field_id . '" value="' . $display_value . '" ' .
                    'class="form-control ' . $options['class'] . '" readonly>';
            $html .= '<input type="hidden" name="' . $field_name . '" value="' . $display_value . '">';
            break;
            
        default: // text
            $html .= '<input type="text" id="' . $field_id . '" name="' . $field_name . '" value="' . $display_value . '" ' .
                    'class="form-control ' . $options['class'] . '" ' .
                    'placeholder="' . $options['placeholder'] . '" ' .
                    ($options['required'] ? 'required' : '') . '>';
            break;
    }
    
    // Add description if provided
    if (!empty($options['description'])) {
        $html .= '<div class="form-text text-muted">' . $options['description'] . '</div>';
    }
    
    // Show last updated info if available and the function exists
    if (function_exists('get_setting_meta')) {
        $last_updated = get_setting_meta($group, $key);
        if ($last_updated) {
            $html .= '<div class="setting-meta small text-muted mt-1">';
            $html .= 'Last updated: ' . date('M j, Y g:i A', strtotime($last_updated['updated_at']));
            
            if ($last_updated['updated_by'] && function_exists('get_user_by_id')) {
                $user = get_user_by_id($last_updated['updated_by']);
                if ($user) {
                    $html .= ' by ' . htmlspecialchars($user['name']);
                }
            }
            
            $html .= '</div>';
        }
    }
    
    $html .= '</div>';
    
    return $html;
}

/**
 * Get setting metadata (last updated, updated by)
 * 
 * @param string $group The settings group
 * @param string $key The setting key
 * @return array|null The setting metadata or null if not found
 */
function get_setting_meta($group, $key) {
    global $db;
    
    try {
        // Check if settings table exists
        $table_check = $db->query("SHOW TABLES LIKE 'settings'");
        
        if ($table_check && $table_check->num_rows > 0) {
            $stmt = $db->prepare("SELECT updated_at, updated_by FROM settings WHERE setting_group = ? AND setting_key = ? LIMIT 1");
            $stmt->bind_param("ss", $group, $key);
            $stmt->execute();
            $result = $stmt->get_result();
            
            if ($result && $result->num_rows > 0) {
                return $result->fetch_assoc();
            }
        }
    } catch (Exception $e) {
        // Log error if needed
        error_log("Error getting setting meta: " . $e->getMessage());
    }
    
    return null;
}

/**
 * Render an upload field for image or file
 * 
 * @param string $group The settings group
 * @param string $key The setting key
 * @param string $type The field type ('image' or 'file')
 * @param array $options Additional options for the field
 * @return string The HTML for the upload field
 */
function render_upload_field($group, $key, $type = 'image', $options = []) {
    $current_value = get_setting($group, $key);
    $field_id = "setting_{$group}_{$key}";
    $field_name = "settings[$group][$key]";
    $file_input_name = "settings_files[{$group}][{$key}]";
    
    // Strip cache parameter for display
    if ($current_value && strpos($current_value, '?v=') !== false) {
        $display_value = substr($current_value, 0, strpos($current_value, '?v='));
    } else {
        $display_value = $current_value;
    }
    
    // Build HTML
    $html = '<div class="upload-field-container">';
    
    // Hidden field to store the file path
    $html .= '<input type="hidden" id="' . $field_id . '" name="' . $field_name . '" value="' . $display_value . '">';
    
    // File input
    $html .= '<div class="upload-controls d-flex gap-2 mb-2">';
    
    // Device upload button
    $html .= '<div class="device-upload">';
    $html .= '<input type="file" id="file_' . $field_id . '" name="' . $file_input_name . '" class="d-none" ' .
            'onchange="previewUploadedFile(\'' . $field_id . '\', this)">';
    $html .= '<button type="button" class="btn btn-outline-primary" onclick="document.getElementById(\'file_' . $field_id . '\').click();">';
    $html .= '<i class="fas fa-upload me-1"></i> Upload from Device</button>';
    $html .= '</div>';
    
    // Media library button
    $html .= '<button type="button" class="btn btn-outline-secondary" onclick="openMediaLibrary(\'' . $field_id . '\', \'' . $type . '\');">';
    $html .= '<i class="fas fa-photo-video me-1"></i> Choose from Media Library</button>';
    
    // Remove current button (visible only when a file is selected)
    $visibility = !empty($display_value) ? '' : 'd-none';
    $html .= '<button type="button" id="remove_' . $field_id . '" class="btn btn-outline-danger ' . $visibility . '" onclick="removeCurrentFile(\'' . $field_id . '\');">';
    $html .= '<i class="fas fa-trash-alt me-1"></i> Remove Current File</button>';
    
    $html .= '</div>';
    
    // Preview area
    if ($type === 'image') {
        $visibility = !empty($display_value) ? '' : 'd-none';
        $src = !empty($display_value) ? UPLOAD_URL . $display_value : '';
        $html .= '<div id="preview_' . $field_id . '" class="file-preview image-preview ' . $visibility . '">';
        $html .= '<img src="' . $src . '" alt="Preview" class="img-thumbnail mb-2" style="max-height: 150px;">';
        $html .= '<div class="file-name">' . basename($display_value) . '</div>';
        $html .= '</div>';
    } else {
        $visibility = !empty($display_value) ? '' : 'd-none';
        $html .= '<div id="preview_' . $field_id . '" class="file-preview ' . $visibility . '">';
        $html .= '<div class="file-icon"><i class="fas fa-file me-2"></i></div>';
        $html .= '<div class="file-name">' . basename($display_value) . '</div>';
        $html .= '</div>';
    }
    
    $html .= '</div>';
    
    // Add JavaScript for file preview
    $html .= '
    <script>
    function previewUploadedFile(fieldId, fileInput) {
        if (fileInput.files && fileInput.files[0]) {
            const file = fileInput.files[0];
            const reader = new FileReader();
            const preview = document.getElementById("preview_" + fieldId);
            const fileField = document.getElementById(fieldId);
            const removeBtn = document.getElementById("remove_" + fieldId);
            
            reader.onload = function(e) {
                if (preview) {
                    preview.classList.remove("d-none");
                    
                    // Handle image preview
                    const img = preview.querySelector("img");
                    if (img && file.type.startsWith("image/")) {
                        img.src = e.target.result;
                    }
                    
                    // Update file name
                    const fileName = preview.querySelector(".file-name");
                    if (fileName) {
                        fileName.textContent = file.name;
                    }
                    
                    // Show remove button
                    if (removeBtn) {
                        removeBtn.classList.remove("d-none");
                    }
                }
            };
            
            reader.readAsDataURL(file);
        }
    }
    
    function openMediaLibrary(fieldId, type) {
        // Open media library in a modal or popup
        window.open("media-library.php?target=" + fieldId + "&type=" + type, "mediaLibrary", "width=800,height=600");
    }
    
    function removeCurrentFile(fieldId) {
        const fileField = document.getElementById(fieldId);
        const preview = document.getElementById("preview_" + fieldId);
        const removeBtn = document.getElementById("remove_" + fieldId);
        const fileInput = document.getElementById("file_" + fieldId);
        
        if (fileField) {
            fileField.value = "";
        }
        
        if (preview) {
            preview.classList.add("d-none");
            const img = preview.querySelector("img");
            if (img) {
                img.src = "";
            }
        }
        
        if (removeBtn) {
            removeBtn.classList.add("d-none");
        }
        
        if (fileInput) {
            fileInput.value = "";
        }
    }
    
    // Function to be called from media library popup
    function setMediaFile(fieldId, filePath, fileUrl) {
        const fileField = document.getElementById(fieldId);
        const preview = document.getElementById("preview_" + fieldId);
        const removeBtn = document.getElementById("remove_" + fieldId);
        
        if (fileField) {
            fileField.value = filePath;
        }
        
        if (preview) {
            preview.classList.remove("d-none");
            
            // Handle image preview
            const img = preview.querySelector("img");
            if (img && fileUrl.match(/\.(jpeg|jpg|gif|png)$/i)) {
                img.src = fileUrl;
            }
            
            // Update file name
            const fileName = preview.querySelector(".file-name");
            if (fileName) {
                fileName.textContent = filePath.split("/").pop();
            }
        }
        
        if (removeBtn) {
            removeBtn.classList.remove("d-none");
        }
    }
    </script>';
    
    return $html;
}

/**
 * Get all settings by group
 * 
 * @param string $group The settings group
 * @return array Array of settings
 */
function get_settings_by_group($group) {
    global $db;
    
    $settings = [];
    
    try {
        // Check if settings table exists
        $table_check = $db->query("SHOW TABLES LIKE 'settings'");
        
        if ($table_check && $table_check->num_rows > 0) {
            $stmt = $db->prepare("SELECT setting_key, setting_value, type FROM settings WHERE setting_group = ?");
            $stmt->bind_param("s", $group);
            $stmt->execute();
            $result = $stmt->get_result();
            
            while ($row = $result->fetch_assoc()) {
                $settings[$row['setting_key']] = format_setting_value($row['setting_value'], $row['type']);
            }
        } else {
            // Settings table doesn't exist, try to get from other tables
            // Implement your compatibility logic here
        }
    } catch (Exception $e) {
        // Log error if needed
        error_log("Error getting settings by group: " . $e->getMessage());
    }
    
    return $settings;
}

/**
 * Get setting type
 * 
 * @param string $group The settings group
 * @param string $key The setting key
 * @return string The setting type or 'text' if not found
 */
function get_setting_type($group, $key) {
    global $db;
    
    try {
        // Check if settings table exists
        $table_check = $db->query("SHOW TABLES LIKE 'settings'");
        
        if ($table_check && $table_check->num_rows > 0) {
            $stmt = $db->prepare("SELECT type FROM settings WHERE setting_group = ? AND setting_key = ? LIMIT 1");
            $stmt->bind_param("ss", $group, $key);
            $stmt->execute();
            $result = $stmt->get_result();
            
            if ($result && $result->num_rows > 0) {
                $row = $result->fetch_assoc();
                return $row['type'];
            }
        }
    } catch (Exception $e) {
        // Log error if needed
        error_log("Error getting setting type: " . $e->getMessage());
    }
    
    return 'text';
}

/**
 * Handle settings form submission
 * 
 * @param array $post_data The $_POST data
 * @param array $files The $_FILES data
 * @return int Number of settings updated
 */
function process_settings_form($post_data, $files) {
    $updated = 0;
    
    if (isset($post_data['settings']) && is_array($post_data['settings'])) {
        foreach ($post_data['settings'] as $group => $settings) {
            foreach ($settings as $key => $value) {
                // Get the field type
                $type = get_setting_type($group, $key);
                
                // Handle file uploads if needed
                if (($type == 'image' || $type == 'file') && isset($files['settings_files']['name'][$group][$key]) && !empty($files['settings_files']['name'][$group][$key])) {
                    // Create custom file array for the specific field
                    $file = [
                        'name' => $files['settings_files']['name'][$group][$key],
                        'type' => $files['settings_files']['type'][$group][$key],
                        'tmp_name' => $files['settings_files']['tmp_name'][$group][$key],
                        'error' => $files['settings_files']['error'][$group][$key],
                        'size' => $files['settings_files']['size'][$group][$key]
                    ];
                    
                    // Define allowed types based on field type
                    $allowed_types = ($type == 'image') 
                        ? ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'] 
                        : ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
                    
                    // Create custom file array with proper structure
                    $_FILES[$group . '_' . $key] = $file;
                    
                    // Handle the upload - use a custom function
                    $upload_result = handle_file_upload($group . '_' . $key, UPLOAD_DIR, $allowed_types);
                    
                    if ($upload_result) {
                        $value = $upload_result;
                    }
                }
                
                // Update the setting
                if (set_setting($group, $key, $value, $type)) {
                    $updated++;
                }
            }
        }
    }
    
    return $updated;
}

/**
 * Create settings table if it doesn't exist
 * Use this function to ensure the settings table exists
 */
function create_settings_table_if_needed() {
    global $db;
    
    try {
        // Check if settings table exists
        $table_check = $db->query("SHOW TABLES LIKE 'settings'");
        
        if (!$table_check || $table_check->num_rows == 0) {
            // Create settings table
            $create_table_sql = "CREATE TABLE IF NOT EXISTS settings (
                id INT AUTO_INCREMENT PRIMARY KEY,
                setting_group VARCHAR(100) NOT NULL,
                setting_key VARCHAR(100) NOT NULL,
                setting_value TEXT,
                type ENUM('text','textarea','boolean','image','json','file') DEFAULT 'text',
                autoload BOOLEAN DEFAULT 1,
                updated_by INT NULL,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                UNIQUE KEY group_key (setting_group, setting_key)
            )";
            
            $db->query($create_table_sql);
            
            return $db->error ? false : true;
        }
        
        return true;
    } catch (Exception $e) {
        // Log error if needed
        error_log("Error creating settings table: " . $e->getMessage());
        return false;
    }
}

/**
 * Create chatbot tables if they don't exist
 * Use this function to ensure the chatbot tables exist
 */
function create_chatbot_tables_if_needed() {
    global $db;
    
    try {
        // Check if chat_sessions table exists
        $table_check = $db->query("SHOW TABLES LIKE 'chat_sessions'");
        
        if (!$table_check || $table_check->num_rows == 0) {
            // Create chat_sessions table
            $create_table_sql = "CREATE TABLE IF NOT EXISTS chat_sessions (
                id INT AUTO_INCREMENT PRIMARY KEY,
                session_id VARCHAR(50) NOT NULL,
                visitor_ip VARCHAR(45),
                visitor_info TEXT,
                started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                last_activity DATETIME DEFAULT CURRENT_TIMESTAMP,
                status ENUM('active', 'closed', 'transferred') DEFAULT 'active',
                INDEX (session_id)
            )";
            
            $db->query($create_table_sql);
            
            if ($db->error) {
                return false;
            }
        }
        
        // Check if chat_logs table exists
        $table_check = $db->query("SHOW TABLES LIKE 'chat_logs'");
        
        if (!$table_check || $table_check->num_rows == 0) {
            // Create chat_logs table
            $create_table_sql = "CREATE TABLE IF NOT EXISTS chat_logs (
                id INT AUTO_INCREMENT PRIMARY KEY,
                session_id VARCHAR(50) NOT NULL,
                message TEXT NOT NULL,
                sender ENUM('visitor', 'bot', 'agent') NOT NULL,
                agent_id INT NULL,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                INDEX (session_id)
            )";
            
            $db->query($create_table_sql);
            
            return $db->error ? false : true;
        }
        
        return true;
    } catch (Exception $e) {
        // Log error if needed
        error_log("Error creating chatbot tables: " . $e->getMessage());
        return false;
    }
}

/**
 * Insert default settings
 * Use this function to insert default settings if they don't exist
 */
function insert_default_settings() {
    // SEO Homepage Settings
    set_setting('seo_homepage', 'meta_title', 'Welcome to Our Website', 'text');
    set_setting('seo_homepage', 'meta_description', 'Your comprehensive solution for all your needs.', 'textarea');
    set_setting('seo_homepage', 'meta_keywords', 'website, services, solutions', 'textarea');
    
    // Default Meta Tags
    set_setting('seo_default', 'default_title', '{page_title} | {site_name}', 'text');
    set_setting('seo_default', 'default_description', 'Learn more about our services and solutions.', 'textarea');
    set_setting('seo_default', 'robots_tag', 'index, follow', 'text');
    
    // Social Sharing
    set_setting('social_sharing', 'facebook_app_id', '', 'text');
    set_setting('social_sharing', 'twitter_card_type', 'summary_large_image', 'text');
    set_setting('social_sharing', 'og_default_title', '', 'text');
    set_setting('social_sharing', 'og_default_description', '', 'textarea');
    
    // Sitemap & Robots
    set_setting('sitemap_config', 'sitemap_url', 'sitemap.xml', 'text');
    set_setting('sitemap_config', 'robots_txt', 'User-agent: *\nDisallow: /admin/\nSitemap: https://example.com/sitemap.xml', 'textarea');
    set_setting('sitemap_config', 'ping_engines', '1', 'boolean');
    
    // Google Tools
    set_setting('google_tools', 'ga_id', '', 'text');
    set_setting('google_tools', 'gtm_id', '', 'text');
    set_setting('google_tools', 'search_console_code', '', 'text');
    
    // Chatbot Settings
    set_setting('chatbot', 'enabled', '0', 'boolean');
    set_setting('chatbot', 'chatbot_type', 'basic', 'text');
    set_setting('chatbot', 'default_message', 'Hello! How can I help you today?', 'textarea');
    set_setting('chatbot', 'notify_admin', '1', 'boolean');
    set_setting('chatbot', 'interface_position', 'bottom-right', 'text');
    set_setting('chatbot', 'show_on_all_pages', '1', 'boolean');
    
    // Site General Settings
    set_setting('site_general', 'site_name', 'Your Website', 'text');
    set_setting('site_general', 'site_tagline', 'Your Comprehensive Solution', 'text');
    set_setting('site_general', 'site_url', 'https://example.com', 'text');
    set_setting('site_general', 'admin_email', 'admin@example.com', 'text');
    set_setting('site_general', 'maintenance_mode', '0', 'boolean');
    
    // Notification Settings
    set_setting('notification_config', 'default_popup_duration', '5000', 'text');
    set_setting('notification_config', 'position', 'top-right', 'text');
    
    return true;
}

// Create temporary notification functions if they don't exist
if (!function_exists('set_success_message')) {
    function set_success_message($message) {
        if (session_status() == PHP_SESSION_NONE) {
            session_start();
        }
        $_SESSION['success_message'] = $message;
    }
}

if (!function_exists('set_error_message')) {
    function set_error_message($message) {
        if (session_status() == PHP_SESSION_NONE) {
            session_start();
        }
        $_SESSION['error_message'] = $message;
    }
}

if (!function_exists('set_info_message')) {
    function set_info_message($message) {
        if (session_status() == PHP_SESSION_NONE) {
            session_start();
        }
        $_SESSION['info_message'] = $message;
    }
}

if (!function_exists('display_notifications')) {
    function display_notifications() {
        if (session_status() == PHP_SESSION_NONE) {
            session_start();
        }
        
        $types = ['success', 'error', 'info', 'warning'];
        
        foreach ($types as $type) {
            $key = "{$type}_message";
            if (isset($_SESSION[$key])) {
                $class = $type;
                if ($type == 'error') {
                    $class = 'danger';
                }
                
                echo '<div class="alert alert-' . $class . ' alert-dismissible fade show" role="alert">';
                echo $_SESSION[$key];
                echo '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>';
                echo '</div>';
                
                unset($_SESSION[$key]);
            }
        }
    }
}

// Create logging function if it doesn't exist
if (!function_exists('log_admin_activity')) {
    function log_admin_activity($action_type, $resource, $resource_id = null, $details = '') {
        // Empty function for compatibility
    }
}

// Initialize the settings system - create tables if needed
create_settings_table_if_needed();
create_chatbot_tables_if_needed();

// Check if any settings exist, if not, insert defaults
$settings_count = 0;
try {
    global $db;
    $result = $db->query("SELECT COUNT(*) as count FROM settings");
    if ($result && $row = $result->fetch_assoc()) {
        $settings_count = $row['count'];
    }
} catch (Exception $e) {
    // Ignore errors
}

if ($settings_count == 0) {
    insert_default_settings();
}
