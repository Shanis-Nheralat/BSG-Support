<?php
/**
 * Site Settings
 * Manages general website configuration
 */

// Define constants for this page
define('ADMIN_PANEL', true);
$page_title = 'Site Settings';
$current_page = 'site_settings';

// Authentication and permissions
require_once 'admin-auth.php';
require_admin_auth();
require_admin_role(['admin']);

// Include notifications system
require_once 'admin-notifications.php';

// Include settings functions
require_once 'settings-functions.php';

// Track page view for analytics
require_once 'admin-analytics.php';
log_page_view(basename($_SERVER['PHP_SELF']));

// Process form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['settings'])) {
    $updated = process_settings_form($_POST, $_FILES);
    
    if ($updated > 0) {
        set_success_message("Site settings updated successfully.");
    } else {
        set_info_message("No changes were made to site settings.");
    }
    
    // Redirect to prevent form resubmission
    header('Location: ' . $_SERVER['PHP_SELF']);
    exit;
}

// Page variables
$breadcrumbs = [
    ['title' => 'Dashboard', 'url' => 'admin-dashboard.php'],
    ['title' => 'Site Settings', 'url' => '#']
];

// Get admin info
$admin_user = get_admin_user();
$admin_username = $admin_user['username'];
$admin_role = $admin_user['role'];

// Get available timezones
$timezones = timezone_identifiers_list();
$timezone_options = [];
foreach ($timezones as $timezone) {
    $timezone_options[$timezone] = $timezone;
}

// Get available languages
$available_languages = [
    'en' => 'English',
    'es' => 'Spanish',
    'fr' => 'French',
    'de' => 'German',
    'it' => 'Italian',
    'pt' => 'Portuguese',
    'ru' => 'Russian',
    'zh' => 'Chinese',
    'ja' => 'Japanese',
    'ar' => 'Arabic'
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
    
    <?php display_notifications(); ?>
    
    <div class="card shadow mb-4">
      <div class="card-header py-3">
        <ul class="nav nav-tabs card-header-tabs" id="settingsTabs" role="tablist">
          <li class="nav-item">
            <a class="nav-link active" id="general-tab" data-bs-toggle="tab" href="#general" role="tab">
              <i class="fas fa-cog me-1"></i> General
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link" id="branding-tab" data-bs-toggle="tab" href="#branding" role="tab">
              <i class="fas fa-image me-1"></i> Branding
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link" id="contact-tab" data-bs-toggle="tab" href="#contact" role="tab">
              <i class="fas fa-envelope me-1"></i> Contact
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link" id="regional-tab" data-bs-toggle="tab" href="#regional" role="tab">
              <i class="fas fa-globe me-1"></i> Regional
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link" id="advanced-tab" data-bs-toggle="tab" href="#advanced" role="tab">
              <i class="fas fa-tools me-1"></i> Advanced
            </a>
          </li>
        </ul>
      </div>
      <div class="card-body">
        <form action="<?php echo $_SERVER['PHP_SELF']; ?>" method="post" enctype="multipart/form-data">
          <div class="tab-content" id="settingsTabsContent">
            <!-- General Tab -->
            <div class="tab-pane fade show active" id="general" role="tabpanel">
              <h4 class="mb-4">General Settings</h4>
              
              <?php echo render_setting_field('site_general', 'site_name', 'Site Name', 'text', [
                'placeholder' => 'Enter site name',
                'description' => 'The name of your website.',
                'required' => true
              ]); ?>
              
              <?php echo render_setting_field('site_general', 'site_tagline', 'Site Tagline', 'text', [
                'placeholder' => 'Enter site tagline',
                'description' => 'A short description of your website.'
              ]); ?>
              
              <?php echo render_setting_field('site_general', 'site_url', 'Site URL', 'text', [
                'placeholder' => 'https://example.com',
                'description' => 'The URL of your website including http:// or https://.',
                'required' => true
              ]); ?>
              
              <?php echo render_setting_field('site_general', 'copyright_text', 'Copyright Text', 'text', [
                'placeholder' => '© 2025 Your Company',
                'description' => 'Copyright text displayed in the footer. Use {{year}} for dynamic year.'
              ]); ?>
            </div>
            
            <!-- Branding Tab -->
            <div class="tab-pane fade" id="branding" role="tabpanel">
              <h4 class="mb-4">Branding Settings</h4>
              
              <div class="row">
                <div class="col-md-6">
                  <?php echo render_setting_field('site_general', 'site_logo', 'Site Logo', 'image', [
                    'description' => 'The main logo of your website. Recommended size: 200x50px.'
                  ]); ?>
                </div>
                
                <div class="col-md-6">
                  <?php echo render_setting_field('site_general', 'site_logo_dark', 'Dark Mode Logo', 'image', [
                    'description' => 'Logo for dark mode/dark backgrounds. Recommended size: 200x50px.'
                  ]); ?>
                </div>
              </div>
              
              <div class="row">
                <div class="col-md-6">
                  <?php echo render_setting_field('site_general', 'favicon', 'Favicon', 'image', [
                    'description' => 'Icon shown in browser tabs. Recommended size: 32x32px or 64x64px.'
                  ]); ?>
                </div>
                
                <div class="col-md-6">
                  <?php echo render_setting_field('site_general', 'touch_icon', 'Touch Icon', 'image', [
                    'description' => 'Icon for mobile devices when added to home screen. Recommended size: 180x180px.'
                  ]); ?>
                </div>
              </div>
              
              <?php echo render_setting_field('site_general', 'primary_color', 'Primary Color', 'text', [
                'placeholder' => '#007bff',
                'description' => 'Main brand color (hex code).'
              ]); ?>
              
              <?php echo render_setting_field('site_general', 'secondary_color', 'Secondary Color', 'text', [
                'placeholder' => '#6c757d',
                'description' => 'Secondary brand color (hex code).'
              ]); ?>
            </div>
            
            <!-- Contact Tab -->
            <div class="tab-pane fade" id="contact" role="tabpanel">
              <h4 class="mb-4">Contact Information</h4>
              
              <?php echo render_setting_field('site_general', 'admin_email', 'Admin Email', 'text', [
                'placeholder' => 'admin@example.com',
                'description' => 'Primary email for admin notifications.',
                'required' => true
              ]); ?>
              
              <?php echo render_setting_field('site_general', 'contact_email', 'Contact Email', 'text', [
                'placeholder' => 'contact@example.com',
                'description' => 'Email address displayed on contact pages.'
              ]); ?>
              
              <?php echo render_setting_field('site_general', 'phone', 'Phone Number', 'text', [
                'placeholder' => '+1 (123) 456-7890',
                'description' => 'Main contact phone number.'
              ]); ?>
              
              <?php echo render_setting_field('site_general', 'address', 'Address', 'textarea', [
                'placeholder' => 'Enter physical address',
                'description' => 'Physical address information.'
              ]); ?>
              
              <?php echo render_setting_field('site_general', 'google_maps_embed', 'Google Maps Embed', 'textarea', [
                'placeholder' => '<iframe src="https://maps.google.com/..."></iframe>',
                'description' => 'Embed code for Google Maps (iframe).'
              ]); ?>
            </div>
            
            <!-- Regional Tab -->
            <div class="tab-pane fade" id="regional" role="tabpanel">
              <h4 class="mb-4">Regional Settings</h4>
              
              <?php echo render_setting_field('site_general', 'timezone', 'Timezone', 'select', [
                'options' => $timezone_options,
                'description' => 'Default timezone for the website.',
                'required' => true
              ]); ?>
              
              <?php echo render_setting_field('site_general', 'date_format', 'Date Format', 'select', [
                'options' => [
                  'F j, Y' => date('F j, Y'), // January 1, 2025
                  'Y-m-d' => date('Y-m-d'),   // 2025-01-01
                  'm/d/Y' => date('m/d/Y'),   // 01/01/2025
                  'd/m/Y' => date('d/m/Y'),   // 01/01/2025
                  'd.m.Y' => date('d.m.Y')    // 01.01.2025
                ],
                'description' => 'Default date format for the website.'
              ]); ?>
              
              <?php echo render_setting_field('site_general', 'time_format', 'Time Format', 'select', [
                'options' => [
                  'g:i a' => date('g:i a'), // 1:30 pm
                  'g:i A' => date('g:i A'), // 1:30 PM
                  'H:i' => date('H:i')      // 13:30
                ],
                'description' => 'Default time format for the website.'
              ]); ?>
              
              <?php echo render_setting_field('site_general', 'default_language', 'Default Language', 'select', [
                'options' => $available_languages,
                'description' => 'Default language for the website.'
              ]); ?>
              
              <?php echo render_setting_field('site_general', 'currency', 'Currency', 'select', [
                'options' => [
                  'USD' => 'US Dollar ($)',
                  'EUR' => 'Euro (€)',
                  'GBP' => 'British Pound (£)',
                  'JPY' => 'Japanese Yen (¥)',
                  'CAD' => 'Canadian Dollar (C$)',
                  'AUD' => 'Australian Dollar (A$)',
                  'INR' => 'Indian Rupee (₹)',
                  'CNY' => 'Chinese Yuan (¥)',
                  'BRL' => 'Brazilian Real (R$)'
                ],
                'description' => 'Default currency for prices and transactions.'
              ]); ?>
            </div>
            
            <!-- Advanced Tab -->
            <div class="tab-pane fade" id="advanced" role="tabpanel">
              <h4 class="mb-4">Advanced Settings</h4>
              
              <?php echo render_setting_field('site_general', 'maintenance_mode', 'Maintenance Mode', 'boolean', [
                'description' => 'Enable maintenance mode to show a maintenance page to visitors.'
              ]); ?>
              
              <div class="settings-dependent" data-depends-on="maintenance_mode" data-depends-value="1">
                <?php echo render_setting_field('site_general', 'maintenance_message', 'Maintenance Message', 'textarea', [
                  'placeholder' => 'We are currently performing scheduled maintenance. Please check back soon.',
                  'description' => 'Message to display during maintenance mode.'
                ]); ?>
                
                <?php echo render_setting_field('site_general', 'maintenance_end_time', 'Expected Completion', 'text', [
                  'placeholder' => 'e.g. April 30, 2025 12:00 PM',
                  'description' => 'When maintenance is expected to be completed (optional).'
                ]); ?>
              </div>
              
              <?php echo render_setting_field('site_general', 'registration_enabled', 'User Registration', 'boolean', [
                'description' => 'Allow new users to register on the website.'
              ]); ?>
              
              <?php echo render_setting_field('site_general', 'comments_enabled', 'Comments', 'boolean', [
                'description' => 'Enable comments on posts and pages.'
              ]); ?>
              
              <?php echo render_setting_field('site_general', 'custom_header_code', 'Custom Header Code', 'textarea', [
                'placeholder' => '<!-- Custom code to be inserted in the <head> section -->',
                'description' => 'Custom HTML, JS, or CSS code to be inserted in the <head> section.'
              ]); ?>
              
              <?php echo render_setting_field('site_general', 'custom_footer_code', 'Custom Footer Code', 'textarea', [
                'placeholder' => '<!-- Custom code to be inserted before </body> -->',
                'description' => 'Custom HTML or JS code to be inserted just before the closing </body> tag.'
              ]); ?>
            </div>
          </div>
          
          <div class="form-actions mt-4">
            <button type="submit" class="btn btn-primary">
              <i class="fas fa-save me-2"></i> Save Site Settings
            </button>
            <button type="reset" class="btn btn-secondary ms-2">
              <i class="fas fa-undo me-2"></i> Reset Changes
            </button>
          </div>
        </form>
      </div>
    </div>
    
    <!-- Environment Information -->
    <div class="card shadow mb-4">
      <div class="card-header py-3">
        <h6 class="m-0 font-weight-bold text-primary">Environment Information</h6>
      </div>
      <div class="card-body">
        <div class="row">
          <div class="col-md-4 mb-3">
            <div class="card h-100">
              <div class="card-body">
                <h6 class="card-title text-muted mb-3">Server</h6>
                <ul class="list-unstyled">
                  <li><strong>PHP Version:</strong> <?php echo phpversion(); ?></li>
                  <li><strong>Server:</strong> <?php echo $_SERVER['SERVER_SOFTWARE']; ?></li>
                  <li><strong>MySQL Version:</strong> <?php echo $db->get_server_info(); ?></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div class="col-md-4 mb-3">
            <div class="card h-100">
              <div class="card-body">
                <h6 class="card-title text-muted mb-3">PHP Extensions</h6>
                <ul class="list-unstyled">
                  <li><span class="badge <?php echo extension_loaded('gd') ? 'bg-success' : 'bg-danger'; ?>">
                    <?php echo extension_loaded('gd') ? 'Enabled' : 'Disabled'; ?>
                  </span> GD Library</li>
                  <li><span class="badge <?php echo extension_loaded('curl') ? 'bg-success' : 'bg-danger'; ?>">
                    <?php echo extension_loaded('curl') ? 'Enabled' : 'Disabled'; ?>
                  </span> cURL</li>
                  <li><span class="badge <?php echo extension_loaded('mbstring') ? 'bg-success' : 'bg-danger'; ?>">
                    <?php echo extension_loaded('mbstring') ? 'Enabled' : 'Disabled'; ?>
                  </span> Multibyte String</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div class="col-md-4 mb-3">
            <div class="card h-100">
              <div class="card-body">
                <h6 class="card-title text-muted mb-3">File System</h6>
                <ul class="list-unstyled">
                  <li><strong>Upload Max Size:</strong> <?php echo ini_get('upload_max_filesize'); ?></li>
                  <li><strong>Post Max Size:</strong> <?php echo ini_get('post_max_size'); ?></li>
                  <li>
                    <strong>Uploads Directory:</strong>
                    <span class="badge <?php echo is_writable(UPLOAD_DIR) ? 'bg-success' : 'bg-danger'; ?>">
                      <?php echo is_writable(UPLOAD_DIR) ? 'Writable' : 'Not Writable'; ?>
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <?php include 'admin-footer.php'; ?>
</main>

<script>
document.addEventListener('DOMContentLoaded', function() {
    // Handle dependent settings visibility
    const maintenanceMode = document.querySelector('input[name="settings[site_general][maintenance_mode]"]');
    const dependentSettings = document.querySelectorAll('.settings-dependent');
    
    function updateDependentSettings() {
        dependentSettings.forEach(section => {
            const dependsOn = section.dataset.dependsOn;
            const dependsValue = section.dataset.dependsValue;
            
            if (dependsOn === 'maintenance_mode') {
                if ((maintenanceMode.checked && dependsValue === '1') || 
                    (!maintenanceMode.checked && dependsValue === '0')) {
                    section.style.display = 'block';
                } else {
                    section.style.display = 'none';
                }
            }
        });
    }
    
    // Initial update
    updateDependentSettings();
    
    // Update on change
    maintenanceMode.addEventListener('change', updateDependentSettings);
    
    // Preserve active tab after form submission
    const hash = window.location.hash;
    if (hash) {
        const tab = document.querySelector(`a[href="${hash}"]`);
        if (tab) {
            tab.click();
        }
    }
});
</script>
</div><!-- .admin-container -->
</body>
</html>
