<?php
/**
 * Settings Migration Script
 * One-time script to migrate existing settings to the new settings system
 */

// Include database connection and settings functions
require_once 'admin-auth.php';
require_once 'settings-functions.php';

// Require admin authentication with superadmin role
require_admin_auth();
require_admin_role(['superadmin', 'admin']);

// Migration status tracking
$migrated = [];
$errors = [];

// Start migration
$migration_started = isset($_POST['start_migration']) && $_POST['start_migration'] === '1';

// Function to log migration status
function log_migration($message, $is_error = false) {
    global $migrated, $errors;
    
    if ($is_error) {
        $errors[] = $message;
    } else {
        $migrated[] = $message;
    }
    
    // Also write to log file
    $log_file = '../logs/settings_migration_' . date('Y-m-d') . '.log';
    $timestamp = date('Y-m-d H:i:s');
    file_put_contents($log_file, "[$timestamp] " . ($is_error ? 'ERROR: ' : '') . "$message\n", FILE_APPEND);
}

// Perform migration
if ($migration_started) {
    try {
        global $db;
        
        // 1. Migrate SEO settings
        $seo_settings = [
            // Homepage SEO
            ['seo_homepage', 'meta_title', get_old_setting('site_meta_title', 'Our Website'), 'text'],
            ['seo_homepage', 'meta_description', get_old_setting('site_meta_description', ''), 'textarea'],
            ['seo_homepage', 'meta_keywords', get_old_setting('site_meta_keywords', ''), 'textarea'],
            ['seo_homepage', 'og_image', get_old_setting('site_og_image', ''), 'image'],
            
            // Default Meta Tags
            ['seo_default', 'default_title', get_old_setting('default_page_title', '%page_title% | %site_name%'), 'text'],
            ['seo_default', 'default_description', get_old_setting('default_meta_description', ''), 'textarea'],
            ['seo_default', 'robots_tag', get_old_setting('robots_meta', 'index, follow'), 'text'],
            
            // Social Sharing
            ['social_sharing', 'facebook_app_id', get_old_setting('facebook_app_id', ''), 'text'],
            ['social_sharing', 'twitter_card_type', get_old_setting('twitter_card_type', 'summary'), 'text'],
            ['social_sharing', 'og_default_title', get_old_setting('og_title', ''), 'text'],
            ['social_sharing', 'og_default_description', get_old_setting('og_description', ''), 'textarea'],
            
            // Sitemap & Robots
            ['sitemap_config', 'sitemap_url', get_old_setting('sitemap_url', site_url() . '/sitemap.xml'), 'text'],
            ['sitemap_config', 'robots_txt', get_old_setting('robots_txt', ''), 'textarea'],
            ['sitemap_config', 'ping_engines', get_old_setting('ping_search_engines', '1'), 'boolean'],
            
            // Google Tools
            ['google_tools', 'ga_id', get_old_setting('google_analytics_id', ''), 'text'],
            ['google_tools', 'gtm_id', get_old_setting('google_tag_manager', ''), 'text'],
            ['google_tools', 'search_console_code', get_old_setting('google_verification', ''), 'text'],
            
            // Advanced
            ['seo_advanced', 'canonical_url', get_old_setting('canonical_url_format', ''), 'text'],
            ['seo_advanced', '['seo_advanced', 'canonical_url', get_old_setting('canonical_url_format', ''), 'text'],
            ['seo_advanced', 'enable_breadcrumb_schema', get_old_setting('breadcrumb_schema', '1'), 'boolean'],
            ['seo_advanced', 'structured_data_json', get_old_setting('structured_data', ''), 'textarea']
        ];
        
        foreach ($seo_settings as $setting) {
            list($group, $key, $value, $type) = $setting;
            if (set_setting($group, $key, $value, $type)) {
                log_migration("Migrated SEO setting: $group.$key");
            } else {
                log_migration("Failed to migrate SEO setting: $group.$key", true);
            }
        }
        
        // 2. Migrate Site General Settings
        $general_settings = [
            ['site_general', 'site_name', get_old_setting('site_name', 'My Website'), 'text'],
            ['site_general', 'site_tagline', get_old_setting('site_tagline', ''), 'text'],
            ['site_general', 'admin_email', get_old_setting('admin_email', 'admin@example.com'), 'text'],
            ['site_general', 'timezone', get_old_setting('timezone', 'UTC'), 'text'],
            ['site_general', 'site_logo', get_old_setting('logo_path', ''), 'image'],
            ['site_general', 'favicon', get_old_setting('favicon_path', ''), 'image'],
            ['site_general', 'maintenance_mode', get_old_setting('maintenance_mode', '0'), 'boolean'],
            ['site_general', 'registration_enabled', get_old_setting('allow_registration', '1'), 'boolean'],
            ['site_general', 'default_language', get_old_setting('default_language', 'en-US'), 'text']
        ];
        
        foreach ($general_settings as $setting) {
            list($group, $key, $value, $type) = $setting;
            if (set_setting($group, $key, $value, $type)) {
                log_migration("Migrated general setting: $group.$key");
            } else {
                log_migration("Failed to migrate general setting: $group.$key", true);
            }
        }
        
        // 3. Migrate Chatbot Settings
        $chatbot_settings = [
            ['chatbot', 'enabled', get_old_setting('chatbot_enabled', '0'), 'boolean'],
            ['chatbot', 'chatbot_type', get_old_setting('chatbot_type', 'basic'), 'text'],
            ['chatbot', 'default_message', get_old_setting('chatbot_welcome', 'Hi there! How can I help you?'), 'textarea'],
            ['chatbot', 'notify_admin', get_old_setting('chatbot_notify', '1'), 'boolean'],
            ['chatbot', 'gpt_api_key', get_old_setting('openai_api_key', ''), 'text'],
            ['chatbot', 'embed_script', get_old_setting('chat_embed_code', ''), 'textarea'],
            ['chatbot', 'interface_position', get_old_setting('chatbot_position', 'bottom-right'), 'text'],
            ['chatbot', 'show_on_all_pages', get_old_setting('chatbot_all_pages', '1'), 'boolean']
        ];
        
        foreach ($chatbot_settings as $setting) {
            list($group, $key, $value, $type) = $setting;
            if (set_setting($group, $key, $value, $type)) {
                log_migration("Migrated chatbot setting: $group.$key");
            } else {
                log_migration("Failed to migrate chatbot setting: $group.$key", true);
            }
        }
        
        // 4. Migrate Notification Settings
        $notification_settings = [
            ['notification_config', 'enable_email', get_old_setting('notify_by_email', '1'), 'boolean'],
            ['notification_config', 'default_email_subject', get_old_setting('notification_subject', 'New Notification'), 'text'],
            ['notification_config', 'default_popup_duration', get_old_setting('popup_duration', '3000'), 'text'],
            ['notification_config', 'allow_user_opt_out', get_old_setting('allow_notification_optout', '1'), 'boolean'],
            ['notification_config', 'sender_name', get_old_setting('notification_sender', 'System Notifications'), 'text'],
            
            // Notification Types
            ['notification_types', 'success_title', get_old_setting('success_title', 'Success'), 'text'],
            ['notification_types', 'success_duration', get_old_setting('success_duration', '3000'), 'text'],
            ['notification_types', 'error_title', get_old_setting('error_title', 'Error'), 'text'],
            ['notification_types', 'error_duration', get_old_setting('error_duration', '5000'), 'text'],
            ['notification_types', 'warning_title', get_old_setting('warning_title', 'Warning'), 'text'],
            ['notification_types', 'warning_duration', get_old_setting('warning_duration', '4000'), 'text'],
            ['notification_types', 'info_title', get_old_setting('info_title', 'Information'), 'text'],
            ['notification_types', 'info_duration', get_old_setting('info_duration', '4000'), 'text']
        ];
        
        foreach ($notification_settings as $setting) {
            list($group, $key, $value, $type) = $setting;
            if (set_setting($group, $key, $value, $type)) {
                log_migration("Migrated notification setting: $group.$key");
            } else {
                log_migration("Failed to migrate notification setting: $group.$key", true);
            }
        }
        
        // 5. Migrate Integrations
        // Get list of all existing integrations
        $old_integrations = get_old_integrations();
        
        foreach ($old_integrations as $integration) {
            $slug = $integration['slug'];
            
            // Map integrations fields
            $integration_settings = [
                ['integration_' . $slug, 'display_name', $integration['name'], 'text'],
                ['integration_' . $slug, 'description', $integration['description'], 'textarea'],
                ['integration_' . $slug, 'is_active', $integration['active'], 'boolean'],
                ['integration_' . $slug, 'logo', $integration['logo'], 'image'],
                ['integration_' . $slug, 'api_key', $integration['api_key'], 'text'],
                ['integration_' . $slug, 'secret_key', $integration['secret_key'], 'text'],
                ['integration_' . $slug, 'doc_url', $integration['doc_url'], 'text'],
                ['integration_' . $slug, 'category', $integration['category'], 'text']
            ];
            
            foreach ($integration_settings as $setting) {
                list($group, $key, $value, $type) = $setting;
                if (set_setting($group, $key, $value, $type)) {
                    log_migration("Migrated integration setting: $group.$key");
                } else {
                    log_migration("Failed to migrate integration setting: $group.$key", true);
                }
            }
        }
        
        // Final success message
        log_migration("Migration completed. Total settings migrated: " . count($migrated) . ", Errors: " . count($errors));
        
    } catch (Exception $e) {
        log_migration("Migration failed with error: " . $e->getMessage(), true);
    }
}

// Helper function to get settings from old system
function get_old_setting($key, $default = '') {
    global $db;
    
    // This function should be adapted to your old settings storage system
    // Example for a simple key-value table:
    try {
        if ($db) {
            $stmt = $db->prepare("SELECT setting_value FROM old_settings WHERE setting_key = ? LIMIT 1");
            $stmt->execute([$key]);
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if ($result && isset($result['setting_value'])) {
                return $result['setting_value'];
            }
        }
    } catch (PDOException $e) {
        error_log("Error getting old setting: " . $e->getMessage());
    }
    
    return $default;
}

// Helper function to get old integrations
function get_old_integrations() {
    global $db;
    
    $integrations = [];
    
    // This function should be adapted to your old integrations storage system
    // Example for a dedicated integrations table:
    try {
        if ($db) {
            $stmt = $db->prepare("SELECT * FROM old_integrations");
            $stmt->execute();
            $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            foreach ($results as $row) {
                $integrations[] = [
                    'slug' => strtolower(preg_replace('/[^a-zA-Z0-9_]/', '_', $row['name'])),
                    'name' => $row['name'],
                    'description' => $row['description'],
                    'active' => $row['is_active'],
                    'logo' => $row['logo_path'],
                    'api_key' => $row['api_key'],
                    'secret_key' => $row['api_secret'],
                    'doc_url' => $row['documentation_url'],
                    'category' => $row['category']
                ];
            }
        }
    } catch (PDOException $e) {
        error_log("Error getting old integrations: " . $e->getMessage());
    }
    
    return $integrations;
}

// Set page variables
$page_title = 'Settings Migration';
$current_page = 'settings_migration';
$breadcrumbs = [
    ['title' => 'Dashboard', 'url' => 'admin-dashboard.php'],
    ['title' => 'Settings Migration', 'url' => '#']
];

// Include templates
include 'admin-head.php';
include 'admin-sidebar.php';
include 'admin-header.php';
?>

<main class="admin-main">
    <div class="admin-content container-fluid py-4">
        <div class="page-header d-flex justify-content-between align-items-center mb-4">
            <h1><?php echo $page_title; ?></h1>
        </div>
        
        <?php if (!empty($migrated) || !empty($errors)): ?>
        <div class="alert alert-<?php echo empty($errors) ? 'success' : 'warning'; ?> alert-dismissible fade show" role="alert">
            <strong><?php echo empty($errors) ? 'Migration Successful!' : 'Migration Completed with Warnings'; ?></strong>
            <p><?php echo count($migrated); ?> settings migrated. <?php echo count($errors); ?> errors encountered.</p>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
        <?php endif; ?>
        
        <div class="card shadow mb-4">
            <div class="card-header py-3">
                <h6 class="m-0 font-weight-bold text-primary">Settings Migration Tool</h6>
            </div>
            <div class="card-body">
                <?php if (!$migration_started): ?>
                <div class="alert alert-info">
                    <p>This tool will migrate your existing settings to the new settings system. Please make sure you have a backup of your database before proceeding.</p>
                    <p><strong>Settings that will be migrated:</strong></p>
                    <ul>
                        <li>SEO Settings</li>
                        <li>General Site Settings</li>
                        <li>Chatbot Configuration</li>
                        <li>Notification Settings</li>
                        <li>Integrations</li>
                    </ul>
                </div>
                
                <form action="settings-migrate.php" method="post" class="mt-4">
                    <input type="hidden" name="start_migration" value="1">
                    <div class="form-check mb-3">
                        <input class="form-check-input" type="checkbox" id="confirmBackup" required>
                        <label class="form-check-label" for="confirmBackup">
                            I confirm that I have backed up my database
                        </label>
                    </div>
                    <button type="submit" class="btn btn-primary" id="startMigration">
                        <i class="fas fa-sync me-2"></i> Start Migration
                    </button>
                </form>
                <?php else: ?>
                <div class="migration-results">
                    <?php if (!empty($migrated)): ?>
                    <h5 class="text-success mb-3">Successfully Migrated Settings</h5>
                    <div class="table-responsive mb-4">
                        <table class="table table-bordered table-striped">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Setting</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php foreach ($migrated as $i => $message): ?>
                                <tr>
                                    <td><?php echo $i + 1; ?></td>
                                    <td><?php echo $message; ?></td>
                                </tr>
                                <?php endforeach; ?>
                            </tbody>
                        </table>
                    </div>
                    <?php endif; ?>
                    
                    <?php if (!empty($errors)): ?>
                    <h5 class="text-danger mb-3">Errors During Migration</h5>
                    <div class="table-responsive mb-4">
                        <table class="table table-bordered table-striped">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Error</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php foreach ($errors as $i => $error): ?>
                                <tr>
                                    <td><?php echo $i + 1; ?></td>
                                    <td class="text-danger"><?php echo $error; ?></td>
                                </tr>
                                <?php endforeach; ?>
                            </tbody>
                        </table>
                    </div>
                    <?php endif; ?>
                    
                    <div class="alert alert-info">
                        <p>Migration complete. A detailed log has been saved to <code>../logs/settings_migration_<?php echo date('Y-m-d'); ?>.log</code></p>
                    </div>
                    
                    <a href="admin-settings.php" class="btn btn-primary">
                        <i class="fas fa-cog me-2"></i> Go to Settings
                    </a>
                </div>
                <?php endif; ?>
            </div>
        </div>
    </div>
</main>

<?php include 'admin-footer.php'; ?>
