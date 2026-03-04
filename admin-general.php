<?php
// Initialize session if not already started
session_start();

// TODO: Add authentication check here
// if(!isset($_SESSION['admin_id']) || empty($_SESSION['admin_id'])) {
//     header("Location: admin-login.php");
//     exit;
// }

// TODO: Check if user has permission to access this page
// if($_SESSION['admin_role'] != 'Super Admin') {
//     header("Location: admin-dashboard.php?error=unauthorized");
//     exit;
// }

// Mock data for general settings
$general_settings = [
    // Company Information
    'company_name' => 'Backsure Global Support',
    'company_tagline' => 'Insurance & Risk Management Solutions',
    'company_email' => 'info@backsure.com',
    'company_phone' => '+1 (555) 123-4567',
    'company_address' => '123 Corporate Plaza, Suite 500, New York, NY 10001, USA',
    'company_logo' => 'assets/images/logo.png',
    'company_favicon' => 'assets/images/favicon.ico',
    'company_registration_number' => 'REG12345678',
    'company_vat_number' => 'VAT87654321',
    
    // Contact Information
    'contact_email' => 'contact@backsure.com',
    'support_email' => 'support@backsure.com',
    'sales_email' => 'sales@backsure.com',
    'billing_email' => 'billing@backsure.com',
    'contact_phone' => '+1 (555) 987-6543',
    'support_phone' => '+1 (555) 876-5432',
    'office_hours' => 'Monday - Friday: 9:00 AM - 5:00 PM EST',
    
    // Social Media
    'facebook_url' => 'https://facebook.com/backsure',
    'twitter_url' => 'https://twitter.com/backsure',
    'linkedin_url' => 'https://linkedin.com/company/backsure',
    'instagram_url' => 'https://instagram.com/backsure',
    'youtube_url' => '',
    
    // Regional Settings
    'timezone' => 'America/New_York',
    'date_format' => 'F j, Y',
    'time_format' => 'g:i a',
    'currency' => 'USD',
    'currency_symbol' => '$',
    'currency_position' => 'before', // 'before' or 'after'
    'decimal_separator' => '.',
    'thousand_separator' => ',',
    'decimal_places' => 2,
    
    // Email Settings
    'email_sender_name' => 'Backsure Global Support',
    'email_sender_address' => 'noreply@backsure.com',
    'email_footer_text' => 'Backsure Global Support | Insurance & Risk Management Solutions',
    'email_signature' => '<p>Best Regards,<br>The Backsure Team<br>www.backsure.com</p>',
    'smtp_host' => 'smtp.example.com',
    'smtp_port' => '587',
    'smtp_encryption' => 'tls', // 'tls' or 'ssl'
    'smtp_username' => 'smtp_user',
    'smtp_password' => '********',
    
    // System Settings
    'enable_maintenance_mode' => false,
    'maintenance_message' => 'We are performing scheduled maintenance. Please check back soon.',
    'enable_debug_mode' => false,
    'session_lifetime' => 120, // minutes
    'pagination_limit' => 10,
    'enable_registration' => true,
    'enable_user_activation' => true,
    'activation_method' => 'email', // 'email' or 'admin'
    'default_user_role' => 'subscriber',
    
    // Cache Settings
    'enable_page_cache' => true,
    'cache_lifetime' => 3600, // seconds
    'enable_database_cache' => true,
    'enable_api_cache' => true,
    
    // Privacy & Legal
    'privacy_policy_last_updated' => '2023-10-01',
    'terms_last_updated' => '2023-10-01',
    'cookie_notice_text' => 'This website uses cookies to ensure you get the best experience on our website.',
    'enable_cookie_consent' => true,
    'enable_gdpr_compliance' => true,
    'data_retention_period' => 730, // days
    
    // System Info (read-only)
    'php_version' => PHP_VERSION,
    'mysql_version' => '8.0.28',
    'server_info' => $_SERVER['SERVER_SOFTWARE'] ?? 'Unknown',
    'max_upload_size' => ini_get('upload_max_filesize'),
    'max_post_size' => ini_get('post_max_size'),
    'memory_limit' => ini_get('memory_limit'),
    'max_execution_time' => ini_get('max_execution_time')
];

// Handle form submissions
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = isset($_POST['action']) ? $_POST['action'] : '';
    
    // Process company info update
    if ($action === 'update_company_info') {
        // In a real implementation, validate and save to database
        // For now, just redirect with success message
        header('Location: admin-general.php?success=company_updated&tab=company');
        exit;
    }
    
    // Process contact info update
    if ($action === 'update_contact_info') {
        // In a real implementation, validate and save to database
        // For now, just redirect with success message
        header('Location: admin-general.php?success=contact_updated&tab=contact');
        exit;
    }
    
    // Process social media update
    if ($action === 'update_social_media') {
        // In a real implementation, validate and save to database
        // For now, just redirect with success message
        header('Location: admin-general.php?success=social_updated&tab=social');
        exit;
    }
    
    // Process regional settings update
    if ($action === 'update_regional') {
        // In a real implementation, validate and save to database
        // For now, just redirect with success message
        header('Location: admin-general.php?success=regional_updated&tab=regional');
        exit;
    }
    
    // Process email settings update
    if ($action === 'update_email') {
        // In a real implementation, validate and save to database
        // For now, just redirect with success message
        header('Location: admin-general.php?success=email_updated&tab=email');
        exit;
    }
    
    // Process system settings update
    if ($action === 'update_system') {
        // In a real implementation, validate and save to database
        // For now, just redirect with success message
        header('Location: admin-general.php?success=system_updated&tab=system');
        exit;
    }
    
    // Process cache settings update
    if ($action === 'update_cache') {
        // In a real implementation, validate and save to database
        // For now, just redirect with success message
        header('Location: admin-general.php?success=cache_updated&tab=cache');
        exit;
    }
    
    // Process privacy settings update
    if ($action === 'update_privacy') {
        // In a real implementation, validate and save to database
        // For now, just redirect with success message
        header('Location: admin-general.php?success=privacy_updated&tab=privacy');
        exit;
    }
    
    // Process clear cache action
    if ($action === 'clear_cache') {
        // In a real implementation, clear cache files/data
        // For now, just redirect with success message
        header('Location: admin-general.php?success=cache_cleared&tab=cache');
        exit;
    }
    
    // Process test email action
    if ($action === 'test_email') {
        // In a real implementation, send a test email
        // For now, just redirect with success message
        header('Location: admin-general.php?success=email_sent&tab=email');
        exit;
    }
}

// Get active tab from URL
$active_tab = isset($_GET['tab']) ? $_GET['tab'] : 'company';
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>General Settings - Backsure Global Support</title>
    <!-- Include your CSS files -->
    <link rel="stylesheet" href="assets/css/bootstrap.min.css">
    <link rel="stylesheet" href="assets/css/admin-style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>
<body>
    <div class="admin-container">
        <!-- Sidebar Navigation -->
        <div class="admin-sidebar">
            <div class="sidebar-header">
                <img src="assets/images/logo.png" alt="Backsure Global Logo" class="sidebar-logo">
                <h3>Backsure Global</h3>
            </div>
            <div class="sidebar-menu">
                <ul>
                    <li><a href="admin-dashboard.php"><i class="fas fa-tachometer-alt"></i> Dashboard</a></li>
                    <li class="has-submenu">
                        <a href="#"><i class="fas fa-newspaper"></i> Content</a>
                        <ul class="submenu">
                            <li><a href="admin-blog.php">Blog Posts</a></li>
                        </ul>
                    </li>
                    <li class="has-submenu">
                        <a href="#"><i class="fas fa-user-tie"></i> HR Tools</a>
                        <ul class="submenu">
                            <li><a href="admin-candidate.php">Candidates</a></li>
                            <li><a href="admin-candidate-notes.php">Candidate Notes</a></li>
                        </ul>
                    </li>
                    <li class="has-submenu">
                        <a href="#"><i class="fas fa-cog"></i> Settings</a>
                        <ul class="submenu">
                            <li><a href="admin-general.php" class="active"><i class="fas fa-sliders-h"></i> General Settings</a></li>
                            <li><a href="admin-appearance.php"><i class="fas fa-palette"></i> Appearance</a></li>
                            <li><a href="admin-backup.php"><i class="fas fa-database"></i> Backup & Restore</a></li>
                        </ul>
                    </li>
                    <li><a href="admin-profile.php"><i class="fas fa-user-circle"></i> My Profile</a></li>
                    <li><a href="admin-logout.php"><i class="fas fa-sign-out-alt"></i> Logout</a></li>
                </ul>
            </div>
        </div>

        <!-- Main Content Area -->
        <div class="admin-content">
            <!-- Top Navigation Bar -->
            <div class="admin-topbar">
                <div class="toggle-sidebar">
                    <i class="fas fa-bars"></i>
                </div>
                <div class="search-box">
                    <input type="text" placeholder="Search...">
                    <button><i class="fas fa-search"></i></button>
                </div>
                <div class="user-info">
                    <div class="notifications">
                        <i class="fas fa-bell"></i>
                        <span class="badge">3</span>
                    </div>
                    <div class="user-profile">
                        <img src="assets/images/admin-avatar.jpg" alt="Admin User">
                        <span>Admin User</span>
                    </div>
                </div>
            </div>

            <!-- Page Content -->
            <div class="content-wrapper">
                <!-- Page Header -->
                <div class="content-header">
                    <h1>General Settings</h1>
                    <div class="breadcrumb">
                        <a href="admin-dashboard.php">Dashboard</a> / <span>General Settings</span>
                    </div>
                </div>

                <!-- Flash Messages -->
                <?php if(isset($_GET['success'])): ?>
                <div class="alert alert-success alert-dismissible fade show" role="alert">
                    <?php if($_GET['success'] == 'company_updated'): ?>
                    <strong>Success!</strong> Company information has been updated.
                    <?php elseif($_GET['success'] == 'contact_updated'): ?>
                    <strong>Success!</strong> Contact information has been updated.
                    <?php elseif($_GET['success'] == 'social_updated'): ?>
                    <strong>Success!</strong> Social media links have been updated.
                    <?php elseif($_GET['success'] == 'regional_updated'): ?>
                    <strong>Success!</strong> Regional settings have been updated.
                    <?php elseif($_GET['success'] == 'email_updated'): ?>
                    <strong>Success!</strong> Email settings have been updated.
                    <?php elseif($_GET['success'] == 'system_updated'): ?>
                    <strong>Success!</strong> System settings have been updated.
                    <?php elseif($_GET['success'] == 'cache_updated'): ?>
                    <strong>Success!</strong> Cache settings have been updated.
                    <?php elseif($_GET['success'] == 'privacy_updated'): ?>
                    <strong>Success!</strong> Privacy settings have been updated.
                    <?php elseif($_GET['success'] == 'cache_cleared'): ?>
                    <strong>Success!</strong> All caches have been cleared.
                    <?php elseif($_GET['success'] == 'email_sent'): ?>
                    <strong>Success!</strong> Test email has been sent successfully.
                    <?php endif; ?>
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
                <?php endif; ?>

                <?php if(isset($_GET['error'])): ?>
                <div class="alert alert-danger alert-dismissible fade show" role="alert">
                    <strong>Error!</strong> There was a problem processing your request.
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
                <?php endif; ?>

                <!-- Main Content -->
                <div class="content-body">
                    <div class="row">
                        <div class="col-md-3">
                            <!-- Settings Navigation -->
                            <div class="card">
                                <div class="card-header">
                                    <h3>Settings</h3>
                                </div>
                                <div class="card-body p-0">
                                    <div class="settings-nav">
                                        <ul class="nav flex-column nav-pills">
                                            <li class="nav-item">
                                                <a class="nav-link <?php echo ($active_tab == 'company') ? 'active' : ''; ?>" href="#company" data-bs-toggle="tab">
                                                    <i class="fas fa-building"></i> Company Information
                                                </a>
                                            </li>
                                            <li class="nav-item">
                                                <a class="nav-link <?php echo ($active_tab == 'contact') ? 'active' : ''; ?>" href="#contact" data-bs-toggle="tab">
                                                    <i class="fas fa-address-card"></i> Contact Information
                                                </a>
                                            </li>
                                            <li class="nav-item">
                                                <a class="nav-link <?php echo ($active_tab == 'social') ? 'active' : ''; ?>" href="#social" data-bs-toggle="tab">
                                                    <i class="fas fa-share-alt"></i> Social Media
                                                </a>
                                            </li>
                                            <li class="nav-item">
                                                <a class="nav-link <?php echo ($active_tab == 'regional') ? 'active' : ''; ?>" href="#regional" data-bs-toggle="tab">
                                                    <i class="fas fa-globe"></i> Regional Settings
                                                </a>
                                            </li>
                                            <li class="nav-item">
                                                <a class="nav-link <?php echo ($active_tab == 'email') ? 'active' : ''; ?>" href="#email" data-bs-toggle="tab">
                                                    <i class="fas fa-envelope"></i> Email Settings
                                                </a>
                                            </li>
                                            <li class="nav-item">
                                                <a class="nav-link <?php echo ($active_tab == 'system') ? 'active' : ''; ?>" href="#system" data-bs-toggle="tab">
                                                    <i class="fas fa-cogs"></i> System Settings
                                                </a>
                                            </li>
                                            <li class="nav-item">
                                                <a class="nav-link <?php echo ($active_tab == 'cache') ? 'active' : ''; ?>" href="#cache" data-bs-toggle="tab">
                                                    <i class="fas fa-bolt"></i> Cache Settings
                                                </a>
                                            </li>
                                            <li class="nav-item">
                                                <a class="nav-link <?php echo ($active_tab == 'privacy') ? 'active' : ''; ?>" href="#privacy" data-bs-toggle="tab">
                                                    <i class="fas fa-shield-alt"></i> Privacy & Legal
                                                </a>
                                            </li>
                                            <li class="nav-item">
                                                <a class="nav-link <?php echo ($active_tab == 'system_info') ? 'active' : ''; ?>" href="#system_info" data-bs-toggle="tab">
                                                    <i class="fas fa-info-circle"></i> System Information
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="col-md-9">
                            <!-- Settings Content -->
                            <div class="card">
                                <div class="card-body">
                                    <div class="tab-content">
                                        <!-- Company Information Tab -->
                                        <div class="tab-pane fade <?php echo ($active_tab == 'company') ? 'show active' : ''; ?>" id="company">
                                            <h3 class="mb-4">Company Information</h3>
                                            <form action="admin-general.php" method="post">
                                                <input type="hidden" name="action" value="update_company_info">
                                                
                                                <div class="row mb-3">
                                                    <div class="col-md-6">
                                                        <label for="companyName" class="form-label">Company Name</label>
                                                        <input type="text" class="form-control" id="companyName" name="company_name" value="<?php echo $general_settings['company_name']; ?>" required>
                                                    </div>
                                                    <div class="col-md-6">
                                                        <label for="companyTagline" class="form-label">Tagline</label>
                                                        <input type="text" class="form-control" id="companyTagline" name="company_tagline" value="<?php echo $general_settings['company_tagline']; ?>">
                                                    </div>
                                                </div>
                                                
                                                <div class="row mb-3">
                                                    <div class="col-md-6">
                                                        <label for="companyEmail" class="form-label">Company Email</label>
                                                        <input type="email" class="form-control" id="companyEmail" name="company_email" value="<?php echo $general_settings['company_email']; ?>" required>
                                                    </div>
                                                    <div class="col-md-6">
                                                        <label for="companyPhone" class="form-label">Company Phone</label>
                                                        <input type="text" class="form-control" id="companyPhone" name="company_phone" value="<?php echo $general_settings['company_phone']; ?>">
                                                    </div>
                                                </div>
                                                
                                                <div class="mb-3">
                                                    <label for="companyAddress" class="form-label">Company Address</label>
                                                    <textarea class="form-control" id="companyAddress" name="company_address" rows="3"><?php echo $general_settings['company_address']; ?></textarea>
                                                </div>
                                                
                                                <div class="row mb-3">
                                                    <div class="col-md-6">
                                                        <label for="companyLogo" class="form-label">Company Logo</label>
                                                        <div class="input-group mb-2">
                                                            <input type="text" class="form-control" id="companyLogo" name="company_logo" value="<?php echo $general_settings['company_logo']; ?>">
                                                            <button class="btn btn-outline-secondary" type="button">
                                                                <i class="fas fa-upload"></i>
                                                            </button>
                                                        </div>
                                                        <div class="logo-preview mb-2">
                                                            <img src="<?php echo $general_settings['company_logo']; ?>" alt="Company Logo" height="50">
                                                        </div>
                                                        <div class="form-text">Recommended size: 200 x 80 pixels</div>
                                                    </div>
                                                    <div class="col-md-6">
                                                        <label for="companyFavicon" class="form-label">Favicon</label>
                                                        <div class="input-group mb-2">
                                                            <input type="text" class="form-control" id="companyFavicon" name="company_favicon" value="<?php echo $general_settings['company_favicon']; ?>">
                                                            <button class="btn btn-outline-secondary" type="button">
                                                                <i class="fas fa-upload"></i>
                                                            </button>
                                                        </div>
                                                        <div class="logo-preview mb-2">
                                                            <img src="<?php echo $general_settings['company_favicon']; ?>" alt="Favicon" height="32">
                                                        </div>
                                                        <div class="form-text">Recommended size: 32 x 32 pixels</div>
                                                    </div>
                                                </div>
                                                
                                                <div class="row mb-3">
                                                    <div class="col-md-6">
                                                        <label for="companyRegNumber" class="form-label">Registration Number</label>
                                                        <input type="text" class="form-control" id="companyRegNumber" name="company_registration_number" value="<?php echo $general_settings['company_registration_number']; ?>">
                                                    </div>
                                                    <div class="col-md-6">
                                                        <label for="companyVatNumber" class="form-label">VAT/Tax Number</label>
                                                        <input type="text" class="form-control" id="companyVatNumber" name="company_vat_number" value="<?php echo $general_settings['company_vat_number']; ?>">
                                                    </div>
                                                </div>
                                                
                                                <div class="text-end">
                                                    <button type="submit" class="btn btn-primary">
                                                        <i class="fas fa-save"></i> Save Changes
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                        
                                        <!-- Contact Information Tab -->
                                        <div class="tab-pane fade <?php echo ($active_tab == 'contact') ? 'show active' : ''; ?>" id="contact">
                                            <h3 class="mb-4">Contact Information</h3>
                                            <form action="admin-general.php" method="post">
                                                <input type="hidden" name="action" value="update_contact_info">
                                                
                                                <div class="row mb-3">
                                                    <div class="col-md-6">
                                                        <label for="contactEmail" class="form-label">General Contact Email</label>
                                                        <input type="email" class="form-control" id="contactEmail" name="contact_email" value="<?php echo $general_settings['contact_email']; ?>">
                                                        <div class="form-text">Primary email shown on contact page</div>
                                                    </div>
                                                    <div class="col-md-6">
                                                        <label for="supportEmail" class="form-label">Support Email</label>
                                                        <input type="email" class="form-control" id="supportEmail" name="support_email" value="<?php echo $general_settings['support_email']; ?>">
                                                    </div>
                                                </div>
                                                
                                                <div class="row mb-3">
                                                    <div class="col-md-6">
                                                        <label for="salesEmail" class="form-label">Sales Email</label>
                                                        <input type="email" class="form-control" id="salesEmail" name="sales_email" value="<?php echo $general_settings['sales_email']; ?>">
                                                    </div>
                                                    <div class="col-md-6">
                                                        <label for="billingEmail" class="form-label">Billing Email</label>
                                                        <input type="email" class="form-control" id="billingEmail" name="billing_email" value="<?php echo $general_settings['billing_email']; ?>">
                                                    </div>
                                                </div>
                                                
                                                <div class="row mb-3">
                                                    <div class="col-md-6">
                                                        <label for="contactPhone" class="form-label">Main Contact Phone</label>
                                                        <input type="text" class="form-control" id="contactPhone" name="contact_phone" value="<?php echo $general_settings['contact_phone']; ?>">
                                                        <div class="form-text">Primary phone shown on contact page</div>
                                                    </div>
                                                    <div class="col-md-6">
                                                        <label for="supportPhone" class="form-label">Support Phone</label>
                                                        <input type="text" class="form-control" id="supportPhone" name="support_phone" value="<?php echo $general_settings['support_phone']; ?>">
                                                    </div>
                                                </div>
                                                
                                                <div class="mb-3">
                                                    <label for="officeHours" class="form-label">Office Hours</label>
                                                    <input type="text" class="form-control" id="officeHours" name="office_hours" value="<?php echo $general_settings['office_hours']; ?>">
                                                </div>
                                                
                                                <div class="text-end">
                                                    <button type="submit" class="btn btn-primary">
                                                        <i class="fas fa-save"></i> Save Changes
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                        
                                        <!-- Social Media Tab -->
                                        <div class="tab-pane fade <?php echo ($active_tab == 'social') ? 'show active' : ''; ?>" id="social">
                                            <h3 class="mb-4">Social Media Links</h3>
                                            <form action="admin-general.php" method="post">
                                                <input type="hidden" name="action" value="update_social_media">
                                                
                                                <div class="mb-3">
                                                    <label for="facebookUrl" class="form-label">
                                                        <i class="fab fa-facebook"></i> Facebook
                                                    </label>
                                                    <input type="url" class="form-control" id="facebookUrl" name="facebook_url" value="<?php echo $general_settings['facebook_url']; ?>" placeholder="https://facebook.com/yourpage">
                                                </div>
                                                
                                                <div class="mb-3">
                                                    <label for="twitterUrl" class="form-label">
                                                        <i class="fab fa-twitter"></i> Twitter
                                                    </label>
                                                    <input type="url" class="form-control" id="twitterUrl" name="twitter_url" value="<?php echo $general_settings['twitter_url']; ?>" placeholder="https://twitter.com/youraccount">
                                                </div>
                                                
                                                <div class="mb-3">
                                                    <label for="linkedinUrl" class="form-label">
                                                        <i class="fab fa-linkedin"></i> LinkedIn
                                                    </label>
                                                    <input type="url" class="form-control" id="linkedinUrl" name="linkedin_url" value="<?php echo $general_settings['linkedin_url']; ?>" placeholder="https://linkedin.com/company/yourcompany">
                                                </div>
                                                
                                                <div class="mb-3">
                                                    <label for="instagramUrl" class="form-label">
                                                        <i class="fab fa-instagram"></i> Instagram
                                                    </label>
                                                    <input type="url" class="form-control" id="instagramUrl" name="instagram_url" value="<?php echo $general_settings['instagram_url']; ?>" placeholder="https://instagram.com/youraccount">
                                                </div>
                                                
                                                <div class="mb-3">
                                                    <label for="youtubeUrl" class="form-label">
                                                        <i class="fab fa-youtube"></i> YouTube
                                                    </label>
                                                    <input type="url" class="form-control" id="youtubeUrl" name="youtube_url" value="<?php echo $general_settings['youtube_url']; ?>" placeholder="https://youtube.com/c/yourchannel">
                                                </div>
                                                
                                                <div class="form-text mb-3">
                                                    <i class="fas fa-info-circle"></i> Leave fields blank to hide social media links from the website.
                                                </div>
                                                
                                                <div class="text-end">
                                                    <button type="submit" class="btn btn-primary">
                                                        <i class="fas fa-save"></i> Save Changes
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                        
                                        <!-- Regional Settings Tab -->
                                        <div class="tab-pane fade <?php echo ($active_tab == 'regional') ? 'show active' : ''; ?>" id="regional">
                                            <h3 class="mb-4">Regional Settings</h3>
                                            <form action="admin-general.php" method="post">
                                                <input type="hidden" name="action" value="update_regional">
                                                
                                                <div class="row mb-3">
                                                    <div class="col-md-6">
                                                        <label for="timezone" class="form-label">Timezone</label>
                                                        <select class="form-select" id="timezone" name="timezone">
                                                            <option value="America/New_York" <?php echo ($general_settings['timezone'] == 'America/New_York') ? 'selected' : ''; ?>>Eastern Time (US & Canada)</option>
                                                            <option value="America/Chicago" <?php echo ($general_settings['timezone'] == 'America/Chicago') ? 'selected' : ''; ?>>Central Time (US & Canada)</option>
                                                            <option value="America/Denver" <?php echo ($general_settings['timezone'] == 'America/Denver') ? 'selected' : ''; ?>>Mountain Time (US & Canada)</option>
                                                            <option value="America/Los_Angeles" <?php echo ($general_settings['timezone'] == 'America/Los_Angeles') ? 'selected' : ''; ?>>Pacific Time (US & Canada)</option>
                                                            <option value="Europe/London" <?php echo ($general_settings['timezone'] == 'Europe/London') ? 'selected' : ''; ?>>London</option>
                                                            <option value="Europe/Paris" <?php echo ($general_settings['timezone'] == 'Europe/Paris') ? 'selected' : ''; ?>>Paris</option>
                                                            <!-- Add more timezone options as needed -->
                                                        </select>
                                                    </div>
                                                    <div class="col-md-6">
                                                        <label for="dateFormat" class="form-label">Date Format</label>
                                                        <select class="form-select" id="dateFormat" name="date_format">
                                                            <option value="F j, Y" <?php echo ($general_settings['date_format'] == 'F j, Y') ? 'selected' : ''; ?>>January 1, 2023</option>
                                                            <option value="j F Y" <?php echo ($general_settings['date_format'] == 'j F Y') ? 'selected' : ''; ?>>1 January 2023</option>
                                                            <option value="m/d/Y" <?php echo ($general_settings['date_format'] == 'm/d/Y') ? 'selected' : ''; ?>>01/01/2023</option>
                                                            <option value="d/m/Y" <?php echo ($general_settings['date_format'] == 'd/m/Y') ? 'selected' : ''; ?>>01/01/2023</option>
                                                            <option value="Y-m-d" <?php echo ($general_settings['date_format'] == 'Y-m-d') ? 'selected' : ''; ?>>2023-01-01</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                
                                                <div class="row mb-3">
                                                    <div class="col-md-6">
                                                        <label for="timeFormat" class="form-label">Time Format</label>
                                                        <select class="form-select" id="timeFormat" name="time_format">
                                                            <option value="g:i a" <?php echo ($general_settings['time_format'] == 'g:i a') ? 'selected' : ''; ?>>1:30 pm</option>
                                                            <option value="g:i A" <?php echo ($general_settings['time_format'] == 'g:i A') ? 'selected' : ''; ?>>1:30 PM</option>
                                                            <option value="H:i" <?php echo ($general_settings['time_format'] == 'H:i') ? 'selected' : ''; ?>>13:30</option>
                                                        </select>
                                                    </div>
                                                    <div class="col-md-6">
                                                        <label for="currency" class="form-label">Currency</label>
                                                        <select class="form-select" id="currency" name="currency">
                                                            <option value="USD" <?php echo ($general_settings['currency'] == 'USD') ? 'selected' : ''; ?>>US Dollar ($)</option>
                                                            <option value="EUR" <?php echo ($general_settings['currency'] == 'EUR') ? 'selected' : ''; ?>>Euro (€)</option>
                                                            <option value="GBP" <?php echo ($general_settings['currency'] == 'GBP') ? 'selected' : ''; ?>>British Pound (£)</option>
                                                            <option value="CAD" <?php echo ($general_settings['currency'] == 'CAD') ? 'selected' : ''; ?>>Canadian Dollar (C$)</option>
                                                            <option value="AUD" <?php echo ($general_settings['currency'] == 'AUD') ? 'selected' : ''; ?>>Australian Dollar (A$)</option>
                                                            <!-- Add more currency options as needed -->
                                                        </select>
                                                    </div>
                                                </div>
                                                
                                                <div class="row mb-3">
                                                    <div class="col-md-6">
                                                        <label for="currencyPosition" class="form-label">Currency Position</label>
                                                        <select class="form-select" id="currencyPosition" name="currency_position">
                                                            <option value="before" <?php echo ($general_settings['currency_position'] == 'before') ? 'selected' : ''; ?>>Before - $100</option>
                                                            <option value="after" <?php echo ($general_settings['currency_position'] == 'after') ? 'selected' : ''; ?>>After - 100$</option>
                                                        </select>
                                                    </div>
                                                    <div class="col-md-6">
                                                        <label for="decimalPlaces" class="form-label">Decimal Places</label>
                                                        <select class="form-select" id="decimalPlaces" name="decimal_places">
                                                            <option value="0" <?php echo ($general_settings['decimal_places'] == '0') ? 'selected' : ''; ?>>0</option>
                                                            <option value="1" <?php echo ($general_settings['decimal_places'] == '1') ? 'selected' : ''; ?>>1</option>
                                                            <option value="2" <?php echo ($general_settings['decimal_places'] == '2') ? 'selected' : ''; ?>>2</option>
                                                            <option value="3" <?php echo ($general_settings['decimal_places'] == '3') ? 'selected' : ''; ?>>3</option>
                                                            <option value="4" <?php echo ($general_settings['decimal_places'] == '4') ? 'selected' : ''; ?>>4</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                
                                                <div class="row mb-3">
                                                    <div class="col-md-6">
                                                        <label for="thousandSeparator" class="form-label">Thousand Separator</label>
                                                        <select class="form-select" id="thousandSeparator" name="thousand_separator">
                                                            <option value="," <?php echo ($general_settings['thousand_separator'] == ',') ? 'selected' : ''; ?>>Comma (,)</option>
                                                            <option value="." <?php echo ($general_settings['thousand_separator'] == '.') ? 'selected' : ''; ?>>Dot (.)</option>
                                                            <option value=" " <?php echo ($general_settings['thousand_separator'] == ' ') ? 'selected' : ''; ?>>Space</option>
                                                            <option value="'" <?php echo ($general_settings['thousand_separator'] == "'") ? 'selected' : ''; ?>>Apostrophe (')</option>
                                                        </select>
                                                    </div>
                                                    <div class="col-md-6">
                                                        <label for="decimalSeparator" class="form-label">Decimal Separator</label>
                                                        <select class="form-select" id="decimalSeparator" name="decimal_separator">
                                                            <option value="." <?php echo ($general_settings['decimal_separator'] == '.') ? 'selected' : ''; ?>>Dot (.)</option>
                                                            <option value="," <?php echo ($general_settings['decimal_separator'] == ',') ? 'selected' : ''; ?>>Comma (,)</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                
                                                <div class="row mb-3">
                                                    <div class="col-md-12">
                                                        <div class="number-format-preview p-3 bg-light rounded">
                                                            <h6>Preview:</h6>
                                                            <div id="currencyPreview">$1,234.56</div>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                <div class="text-end">
                                                    <button type="submit" class="btn btn-primary">
                                                        <i class="fas fa-save"></i> Save Changes
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                        
                                        <!-- Email Settings Tab -->
                                        <div class="tab-pane fade <?php echo ($active_tab == 'email') ? 'show active' : ''; ?>" id="email">
                                            <h3 class="mb-4">Email Settings</h3>
                                            <form action="admin-general.php" method="post">
                                                <input type="hidden" name="action" value="update_email">
                                                
                                                <div class="row mb-3">
                                                    <div class="col-md-6">
                                                        <label for="emailSenderName" class="form-label">Sender Name</label>
                                                        <input type="text" class="form-control" id="emailSenderName" name="email_sender_name" value="<?php echo $general_settings['email_sender_name']; ?>">
                                                    </div>
                                                    <div class="col-md-6">
                                                        <label for="emailSenderAddress" class="form-label">Sender Email Address</label>
                                                        <input type="email" class="form-control" id="emailSenderAddress" name="email_sender_address" value="<?php echo $general_settings['email_sender_address']; ?>">
                                                    </div>
                                                </div>
                                                
                                                <div class="mb-3">
                                                    <label for="emailFooterText" class="form-label">Email Footer Text</label>
                                                    <input type="text" class="form-control" id="emailFooterText" name="email_footer_text" value="<?php echo $general_settings['email_footer_text']; ?>">
                                                </div>
                                                
                                                <div class="mb-3">
                                                    <label for="emailSignature" class="form-label">Email Signature</label>
                                                    <textarea class="form-control" id="emailSignature" name="email_signature" rows="3"><?php echo $general_settings['email_signature']; ?></textarea>
                                                    <div class="form-text">HTML is allowed</div>
                                                </div>
                                                
                                                <h5 class="mt-4 mb-3">SMTP Settings</h5>
                                                
                                                <div class="row mb-3">
                                                    <div class="col-md-6">
                                                        <label for="smtpHost" class="form-label">SMTP Host</label>
                                                        <input type="text" class="form-control" id="smtpHost" name="smtp_host" value="<?php echo $general_settings['smtp_host']; ?>">
                                                    </div>
                                                    <div class="col-md-6">
                                                        <label for="smtpPort" class="form-label">SMTP Port</label>
                                                        <input type="text" class="form-control" id="smtpPort" name="smtp_port" value="<?php echo $general_settings['smtp_port']; ?>">
                                                    </div>
                                                </div>
                                                
                                                <div class="row mb-3">
                                                    <div class="col-md-6">
                                                        <label for="smtpEncryption" class="form-label">Encryption</label>
                                                        <select class="form-select" id="smtpEncryption" name="smtp_encryption">
                                                            <option value="none" <?php echo ($general_settings['smtp_encryption'] == 'none') ? 'selected' : ''; ?>>None</option>
                                                            <option value="ssl" <?php echo ($general_settings['smtp_encryption'] == 'ssl') ? 'selected' : ''; ?>>SSL</option>
                                                            <option value="tls" <?php echo ($general_settings['smtp_encryption'] == 'tls') ? 'selected' : ''; ?>>TLS</option>
                                                        </select>
                                                    </div>
                                                    <div class="col-md-6">
                                                        <label for="smtpAuth" class="form-label">Authentication</label>
                                                        <div class="form-check form-switch mt-2">
                                                            <input class="form-check-input" type="checkbox" role="switch" id="smtpAuth" name="smtp_auth" value="1" checked>
                                                            <label class="form-check-label" for="smtpAuth">Use SMTP Authentication</label>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                <div class="row mb-3">
                                                    <div class="col-md-6">
                                                        <label for="smtpUsername" class="form-label">SMTP Username</label>
                                                        <input type="text" class="form-control" id="smtpUsername" name="smtp_username" value="<?php echo $general_settings['smtp_username']; ?>">
                                                    </div>
                                                    <div class="col-md-6">
                                                        <label for="smtpPassword" class="form-label">SMTP Password</label>
                                                        <input type="password" class="form-control" id="smtpPassword" name="smtp_password" value="<?php echo $general_settings['smtp_password']; ?>">
                                                    </div>
                                                </div>
                                                
                                                <div class="row mb-3">
                                                    <div class="col-md-12 text-end">
                                                        <button type="button" class="btn btn-info me-2" id="testEmailBtn">
                                                            <i class="fas fa-paper-plane"></i> Send Test Email
                                                        </button>
                                                        <button type="submit" class="btn btn-primary">
                                                            <i class="fas fa-save"></i> Save Changes
                                                        </button>
                                                    </div>
                                                </div>
                                            </form>
                                            
                                            <!-- Test Email Modal -->
                                            <div class="modal fade" id="testEmailModal" tabindex="-1" aria-labelledby="testEmailModalLabel" aria-hidden="true">
                                                <div class="modal-dialog">
                                                    <div class="modal-content">
                                                        <div class="modal-header">
                                                            <h5 class="modal-title" id="testEmailModalLabel">Send Test Email</h5>
                                                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                        </div>
                                                        <form action="admin-general.php" method="post">
                                                            <input type="hidden" name="action" value="test_email">
                                                            <div class="modal-body">
                                                                <div class="mb-3">
                                                                    <label for="testEmailAddress" class="form-label">Recipient Email</label>
                                                                    <input type="email" class="form-control" id="testEmailAddress" name="test_email_address" required>
                                                                </div>
                                                                <div class="mb-3">
                                                                    <label for="testEmailSubject" class="form-label">Subject</label>
                                                                    <input type="text" class="form-control" id="testEmailSubject" name="test_email_subject" value="Test Email from Backsure Global Support">
                                                                </div>
                                                                <div class="mb-3">
                                                                    <label for="testEmailMessage" class="form-label">Message</label>
                                                                    <textarea class="form-control" id="testEmailMessage" name="test_email_message" rows="3">This is a test email to verify your email settings are working correctly.</textarea>
                                                                </div>
                                                            </div>
                                                            <div class="modal-footer">
                                                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                                                                <button type="submit" class="btn btn-primary">Send Email</button>
                                                            </div>
                                                        </form>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <!-- System Settings Tab -->
                                        <div class="tab-pane fade <?php echo ($active_tab == 'system') ? 'show active' : ''; ?>" id="system">
                                            <h3 class="mb-4">System Settings</h3>
                                            <form action="admin-general.php" method="post">
                                                <input type="hidden" name="action" value="update_system">
                                                
                                                <div class="row mb-3">
                                                    <div class="col-md-6">
                                                        <div class="form-check form-switch">
                                                            <input class="form-check-input" type="checkbox" role="switch" id="maintenanceMode" name="enable_maintenance_mode" value="1" <?php echo $general_settings['enable_maintenance_mode'] ? 'checked' : ''; ?>>
                                                            <label class="form-check-label" for="maintenanceMode">
                                                                <span class="fw-bold">Maintenance Mode</span>
                                                            </label>
                                                        </div>
                                                        <div class="form-text mb-3">Temporarily disable the website for maintenance</div>
                                                        
                                                        <div class="mb-3">
                                                            <label for="maintenanceMessage" class="form-label">Maintenance Message</label>
                                                            <textarea class="form-control" id="maintenanceMessage" name="maintenance_message" rows="2"><?php echo $general_settings['maintenance_message']; ?></textarea>
                                                        </div>
                                                    </div>
                                                    <div class="col-md-6">
                                                        <div class="form-check form-switch">
                                                            <input class="form-check-input" type="checkbox" role="switch" id="debugMode" name="enable_debug_mode" value="1" <?php echo $general_settings['enable_debug_mode'] ? 'checked' : ''; ?>>
                                                            <label class="form-check-label" for="debugMode">
                                                                <span class="fw-bold">Debug Mode</span>
                                                            </label>
                                                        </div>
                                                        <div class="form-text mb-3">Display detailed error messages (not recommended for production)</div>
                                                        
                                                        <div class="mb-3">
                                                            <label for="sessionLifetime" class="form-label">Session Lifetime (minutes)</label>
                                                            <input type="number" class="form-control" id="sessionLifetime" name="session_lifetime" value="<?php echo $general_settings['session_lifetime']; ?>" min="5">
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                <div class="row mb-3">
                                                    <div class="col-md-6">
                                                        <label for="paginationLimit" class="form-label">Default Pagination Limit</label>
                                                        <select class="form-select" id="paginationLimit" name="pagination_limit">
                                                            <option value="10" <?php echo ($general_settings['pagination_limit'] == 10) ? 'selected' : ''; ?>>10 items</option>
                                                            <option value="15" <?php echo ($general_settings['pagination_limit'] == 15) ? 'selected' : ''; ?>>15 items</option>
                                                            <option value="20" <?php echo ($general_settings['pagination_limit'] == 20) ? 'selected' : ''; ?>>20 items</option>
                                                            <option value="25" <?php echo ($general_settings['pagination_limit'] == 25) ? 'selected' : ''; ?>>25 items</option>
                                                            <option value="50" <?php echo ($general_settings['pagination_limit'] == 50) ? 'selected' : ''; ?>>50 items</option>
                                                            <option value="100" <?php echo ($general_settings['pagination_limit'] == 100) ? 'selected' : ''; ?>>100 items</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                
                                                <h5 class="mt-4 mb-3">User Registration Settings</h5>
                                                
                                                <div class="row mb-3">
                                                    <div class="col-md-6">
                                                        <div class="form-check form-switch">
                                                            <input class="form-check-input" type="checkbox" role="switch" id="enableRegistration" name="enable_registration" value="1" <?php echo $general_settings['enable_registration'] ? 'checked' : ''; ?>>
                                                            <label class="form-check-label" for="enableRegistration">
                                                                Allow User Registration
                                                            </label>
                                                        </div>
                                                    </div>
                                                    <div class="col-md-6">
                                                        <div class="form-check form-switch">
                                                            <input class="form-check-input" type="checkbox" role="switch" id="enableUserActivation" name="enable_user_activation" value="1" <?php echo $general_settings['enable_user_activation'] ? 'checked' : ''; ?>>
                                                            <label class="form-check-label" for="enableUserActivation">
                                                                Require Account Activation
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                <div class="row mb-3">
                                                    <div class="col-md-6">
                                                        <label for="activationMethod" class="form-label">Activation Method</label>
                                                        <select class="form-select" id="activationMethod" name="activation_method">
                                                            <option value="email" <?php echo ($general_settings['activation_method'] == 'email') ? 'selected' : ''; ?>>Email Confirmation</option>
                                                            <option value="admin" <?php echo ($general_settings['activation_method'] == 'admin') ? 'selected' : ''; ?>>Admin Approval</option>
                                                        </select>
                                                    </div>
                                                    <div class="col-md-6">
                                                        <label for="defaultUserRole" class="form-label">Default User Role</label>
                                                        <select class="form-select" id="defaultUserRole" name="default_user_role">
                                                            <option value="subscriber" <?php echo ($general_settings['default_user_role'] == 'subscriber') ? 'selected' : ''; ?>>Subscriber</option>
                                                            <option value="client" <?php echo ($general_settings['default_user_role'] == 'client') ? 'selected' : ''; ?>>Client</option>
                                                            <option value="contributor" <?php echo ($general_settings['default_user_role'] == 'contributor') ? 'selected' : ''; ?>>Contributor</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                
                                                <div class="text-end">
                                                    <button type="submit" class="btn btn-primary">
                                                        <i class="fas fa-save"></i> Save Changes
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                        
                                        <!-- Cache Settings Tab -->
                                        <div class="tab-pane fade <?php echo ($active_tab == 'cache') ? 'show active' : ''; ?>" id="cache">
                                            <h3 class="mb-4">Cache Settings</h3>
                                            <form action="admin-general.php" method="post">
                                                <input type="hidden" name="action" value="update_cache">
                                                
                                                <div class="row mb-3">
                                                    <div class="col-md-6">
                                                        <div class="form-check form-switch">
                                                            <input class="form-check-input" type="checkbox" role="switch" id="pageCache" name="enable_page_cache" value="1" <?php echo $general_settings['enable_page_cache'] ? 'checked' : ''; ?>>
                                                            <label class="form-check-label" for="pageCache">
                                                                <span class="fw-bold">Enable Page Cache</span>
                                                            </label>
                                                        </div>
                                                        <div class="form-text mb-3">Cache rendered pages to reduce server load</div>
                                                    </div>
                                                    <div class="col-md-6">
                                                        <label for="cacheLifetime" class="form-label">Cache Lifetime (seconds)</label>
                                                        <input type="number" class="form-control" id="cacheLifetime" name="cache_lifetime" value="<?php echo $general_settings['cache_lifetime']; ?>" min="60">
                                                        <div class="form-text">3600 = 1 hour, 86400 = 1 day</div>
                                                    </div>
                                                </div>
                                                
                                                <div class="row mb-3">
                                                    <div class="col-md-6">
                                                        <div class="form-check form-switch">
                                                            <input class="form-check-input" type="checkbox" role="switch" id="databaseCache" name="enable_database_cache" value="1" <?php echo $general_settings['enable_database_cache'] ? 'checked' : ''; ?>>
                                                            <label class="form-check-label" for="databaseCache">
                                                                Enable Database Query Cache
                                                            </label>
                                                        </div>
                                                    </div>
                                                    <div class="col-md-6">
                                                        <div class="form-check form-switch">
                                                            <input class="form-check-input" type="checkbox" role="switch" id="apiCache" name="enable_api_cache" value="1" <?php echo $general_settings['enable_api_cache'] ? 'checked' : ''; ?>>
                                                            <label class="form-check-label" for="apiCache">
                                                                Enable API Response Cache
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                <div class="row mb-4">
                                                    <div class="col-md-12">
                                                        <div class="cache-stats p-3 bg-light rounded">
                                                            <h6>Cache Statistics:</h6>
                                                            <div class="row">
                                                                <div class="col-md-4">
                                                                    <p><strong>Page Cache Size:</strong> 12.4 MB</p>
                                                                </div>
                                                                <div class="col-md-4">
                                                                    <p><strong>Database Cache Size:</strong> 8.7 MB</p>
                                                                </div>
                                                                <div class="col-md-4">
                                                                    <p><strong>Cache Hit Rate:</strong> 89%</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                <div class="text-end">
                                                    <form action="admin-general.php" method="post" class="d-inline">
                                                        <input type="hidden" name="action" value="clear_cache">
                                                        <button type="submit" class="btn btn-warning me-2">
                                <?php
// Initialize session if not already started
session_start();

// TODO: Add authentication check here
// if(!isset($_SESSION['admin_id']) || empty($_SESSION['admin_id'])) {
//     header("Location: admin-login.php");
//     exit;
// }

// TODO: Check if user has permission to access this page
// if($_SESSION['admin_role'] != 'Super Admin') {
//     header("Location: admin-dashboard.php?error=unauthorized");
//     exit;
// }

// Mock data for general settings
$general_settings = [
    // Company Information
    'company_name' => 'Backsure Global Support',
    'company_tagline' => 'Insurance & Risk Management Solutions',
    'company_email' => 'info@backsure.com',
    'company_phone' => '+1 (555) 123-4567',
    'company_address' => '123 Corporate Plaza, Suite 500, New York, NY 10001, USA',
    'company_logo' => 'assets/images/logo.png',
    'company_favicon' => 'assets/images/favicon.ico',
    'company_registration_number' => 'REG12345678',
    'company_vat_number' => 'VAT87654321',
    
    // Contact Information
    'contact_email' => 'contact@backsure.com',
    'support_email' => 'support@backsure.com',
    'sales_email' => 'sales@backsure.com',
    'billing_email' => 'billing@backsure.com',
    'contact_phone' => '+1 (555) 987-6543',
    'support_phone' => '+1 (555) 876-5432',
    'office_hours' => 'Monday - Friday: 9:00 AM - 5:00 PM EST',
    
    // Social Media
    'facebook_url' => 'https://facebook.com/backsure',
    'twitter_url' => 'https://twitter.com/backsure',
    'linkedin_url' => 'https://linkedin.com/company/backsure',
    'instagram_url' => 'https://instagram.com/backsure',
    'youtube_url' => '',
    
    // Regional Settings
    'timezone' => 'America/New_York',
    'date_format' => 'F j, Y',
    'time_format' => 'g:i a',
    'currency' => 'USD',
    'currency_symbol' => '$',
    'currency_position' => 'before', // 'before' or 'after'
    'decimal_separator' => '.',
    'thousand_separator' => ',',
    'decimal_places' => 2,
    
    // Email Settings
    'email_sender_name' => 'Backsure Global Support',
    'email_sender_address' => 'noreply@backsure.com',
    'email_footer_text' => 'Backsure Global Support | Insurance & Risk Management Solutions',
    'email_signature' => '<p>Best Regards,<br>The Backsure Team<br>www.backsure.com</p>',
    'smtp_host' => 'smtp.example.com',
    'smtp_port' => '587',
    'smtp_encryption' => 'tls', // 'tls' or 'ssl'
    'smtp_username' => 'smtp_user',
    'smtp_password' => '********',
    
    // System Settings
    'enable_maintenance_mode' => false,
    'maintenance_message' => 'We are performing scheduled maintenance. Please check back soon.',
    'enable_debug_mode' => false,
    'session_lifetime' => 120, // minutes
    'pagination_limit' => 10,
    'enable_registration' => true,
    'enable_user_activation' => true,
    'activation_method' => 'email', // 'email' or 'admin'
    'default_user_role' => 'subscriber',
    
    // Cache Settings
    'enable_page_cache' => true,
    'cache_lifetime' => 3600, // seconds
    'enable_database_cache' => true,
    'enable_api_cache' => true,
    
    // Privacy & Legal
    'privacy_policy_last_updated' => '2023-10-01',
    'terms_last_updated' => '2023-10-01',
    'cookie_notice_text' => 'This website uses cookies to ensure you get the best experience on our website.',
    'enable_cookie_consent' => true,
    'enable_gdpr_compliance' => true,
    'data_retention_period' => 730, // days
    
    // System Info (read-only)
    'php_version' => PHP_VERSION,
    'mysql_version' => '8.0.28',
    'server_info' => $_SERVER['SERVER_SOFTWARE'] ?? 'Unknown',
    'max_upload_size' => ini_get('upload_max_filesize'),
    'max_post_size' => ini_get('post_max_size'),
    'memory_limit' => ini_get('memory_limit'),
    'max_execution_time' => ini_get('max_execution_time')
];

// Handle form submissions
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = isset($_POST['action']) ? $_POST['action'] : '';
    
    // Process company info update
    if ($action === 'update_company_info') {
        // In a real implementation, validate and save to database
        // For now, just redirect with success message
        header('Location: admin-general.php?success=company_updated&tab=company');
        exit;
    }
    
    // Process contact info update
    if ($action === 'update_contact_info') {
        // In a real implementation, validate and save to database
        // For now, just redirect with success message
        header('Location: admin-general.php?success=contact_updated&tab=contact');
        exit;
    }
    
    // Process social media update
    if ($action === 'update_social_media') {
        // In a real implementation, validate and save to database
        // For now, just redirect with success message
        header('Location: admin-general.php?success=social_updated&tab=social');
        exit;
    }
    
    // Process regional settings update
    if ($action === 'update_regional') {
        // In a real implementation, validate and save to database
        // For now, just redirect with success message
        header('Location: admin-general.php?success=regional_updated&tab=regional');
        exit;
    }
    
    // Process email settings update
    if ($action === 'update_email') {
        // In a real implementation, validate and save to database
        // For now, just redirect with success message
        header('Location: admin-general.php?success=email_updated&tab=email');
        exit;
    }
    
    // Process system settings update
    if ($action === 'update_system') {
        // In a real implementation, validate and save to database
        // For now, just redirect with success message
        header('Location: admin-general.php?success=system_updated&tab=system');
        exit;
    }
    
    // Process cache settings update
    if ($action === 'update_cache') {
        // In a real implementation, validate and save to database
        // For now, just redirect with success message
        header('Location: admin-general.php?success=cache_updated&tab=cache');
        exit;
    }
    
    // Process privacy settings update
    if ($action === 'update_privacy') {
        // In a real implementation, validate and save to database
        // For now, just redirect with success message
        header('Location: admin-general.php?success=privacy_updated&tab=privacy');
        exit;
    }
    
    // Process clear cache action
    if ($action === 'clear_cache') {
        // In a real implementation, clear cache files/data
        // For now, just redirect with success message
        header('Location: admin-general.php?success=cache_cleared&tab=cache');
        exit;
    }
    
    // Process test email action
    if ($action === 'test_email') {
        // In a real implementation, send a test email
        // For now, just redirect with success message
        header('Location: admin-general.php?success=email_sent&tab=email');
        exit;
    }
}

// Get active tab from URL
$active_tab = isset($_GET['tab']) ? $_GET['tab'] : 'company';
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>General Settings - Backsure Global Support</title>
    <!-- Include your CSS files -->
    <link rel="stylesheet" href="assets/css/bootstrap.min.css">
    <link rel="stylesheet" href="assets/css/admin-style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>
<body>
    <div class="admin-container">
        <!-- Sidebar Navigation -->
        <div class="admin-sidebar">
            <div class="sidebar-header">
                <img src="assets/images/logo.png" alt="Backsure Global Logo" class="sidebar-logo">
                <h3>Backsure Global</h3>
            </div>
            <div class="sidebar-menu">
                <ul>
                    <li><a href="admin-dashboard.php"><i class="fas fa-tachometer-alt"></i> Dashboard</a></li>
                    <li class="has-submenu">
                        <a href="#"><i class="fas fa-newspaper"></i> Content</a>
                        <ul class="submenu">
                            <li><a href="admin-blog.php">Blog Posts</a></li>
                        </ul>
                    </li>
                    <li class="has-submenu">
                        <a href="#"><i class="fas fa-user-tie"></i> HR Tools</a>
                        <ul class="submenu">
                            <li><a href="admin-candidate.php">Candidates</a></li>
                            <li><a href="admin-candidate-notes.php">Candidate Notes</a></li>
                        </ul>
                    </li>
                    <li class="has-submenu">
                        <a href="#"><i class="fas fa-cog"></i> Settings</a>
                        <ul class="submenu">
                            <li><a href="admin-general.php" class="active"><i class="fas fa-sliders-h"></i> General Settings</a></li>
                            <li><a href="admin-appearance.php"><i class="fas fa-palette"></i> Appearance</a></li>
                            <li><a href="admin-backup.php"><i class="fas fa-database"></i> Backup & Restore</a></li>
                        </ul>
                    </li>
                    <li><a href="admin-profile.php"><i class="fas fa-user-circle"></i> My Profile</a></li>
                    <li><a href="admin-logout.php"><i class="fas fa-sign-out-alt"></i> Logout</a></li>
                </ul>
            </div>
        </div>

        <!-- Main Content Area -->
        <div class="admin-content">
            <!-- Top Navigation Bar -->
            <div class="admin-topbar">
                <div class="toggle-sidebar">
                    <i class="fas fa-bars"></i>
                </div>
                <div class="search-box">
                    <input type="text" placeholder="Search...">
                    <button><i class="fas fa-search"></i></button>
                </div>
                <div class="user-info">
                    <div class="notifications">
                        <i class="fas fa-bell"></i>
                        <span class="badge">3</span>
                    </div>
                    <div class="user-profile">
                        <img src="assets/images/admin-avatar.jpg" alt="Admin User">
                        <span>Admin User</span>
                    </div>
                </div>
            </div>

            <!-- Page Content -->
            <div class="content-wrapper">
                <!-- Page Header -->
                <div class="content-header">
                    <h1>General Settings</h1>
                    <div class="breadcrumb">
                        <a href="admin-dashboard.php">Dashboard</a> / <span>General Settings</span>
                    </div>
                </div>

                <!-- Flash Messages -->
                <?php if(isset($_GET['success'])): ?>
                <div class="alert alert-success alert-dismissible fade show" role="alert">
                    <?php if($_GET['success'] == 'company_updated'): ?>
                    <strong>Success!</strong> Company information has been updated.
                    <?php elseif($_GET['success'] == 'contact_updated'): ?>
                    <strong>Success!</strong> Contact information has been updated.
                    <?php elseif($_GET['success'] == 'social_updated'): ?>
                    <strong>Success!</strong> Social media links have been updated.
                    <?php elseif($_GET['success'] == 'regional_updated'): ?>
                    <strong>Success!</strong> Regional settings have been updated.
                    <?php elseif($_GET['success'] == 'email_updated'): ?>
                    <strong>Success!</strong> Email settings have been updated.
                    <?php elseif($_GET['success'] == 'system_updated'): ?>
                    <strong>Success!</strong> System settings have been updated.
                    <?php elseif($_GET['success'] == 'cache_updated'): ?>
                    <strong>Success!</strong> Cache settings have been updated.
                    <?php elseif($_GET['success'] == 'privacy_updated'): ?>
                    <strong>Success!</strong> Privacy settings have been updated.
                    <?php elseif($_GET['success'] == 'cache_cleared'): ?>
                    <strong>Success!</strong> All caches have been cleared.
                    <?php elseif($_GET['success'] == 'email_sent'): ?>
                    <strong>Success!</strong> Test email has been sent successfully.
                    <?php endif; ?>
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
                <?php endif; ?>

                <?php if(isset($_GET['error'])): ?>
                <div class="alert alert-danger alert-dismissible fade show" role="alert">
                    <strong>Error!</strong> There was a problem processing your request.
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
                <?php endif; ?>

                <!-- Main Content -->
                <div class="content-body">
                    <div class="row">
                        <div class="col-md-3">
                            <!-- Settings Navigation -->
                            <div class="card">
                                <div class="card-header">
                                    <h3>Settings</h3>
                                </div>
                                <div class="card-body p-0">
                                    <div class="settings-nav">
                                        <ul class="nav flex-column nav-pills">
                                            <li class="nav-item">
                                                <a class="nav-link <?php echo ($active_tab == 'company') ? 'active' : ''; ?>" href="#company" data-bs-toggle="tab">
                                                    <i class="fas fa-building"></i> Company Information
                                                </a>
                                            </li>
                                            <li class="nav-item">
                                                <a class="nav-link <?php echo ($active_tab == 'contact') ? 'active' : ''; ?>" href="#contact" data-bs-toggle="tab">
                                                    <i class="fas fa-address-card"></i> Contact Information
                                                </a>
                                            </li>
                                            <li class="nav-item">
                                                <a class="nav-link <?php echo ($active_tab == 'social') ? 'active' : ''; ?>" href="#social" data-bs-toggle="tab">
                                                    <i class="fas fa-share-alt"></i> Social Media
                                                </a>
                                            </li>
                                            <li class="nav-item">
                                                <a class="nav-link <?php echo ($active_tab == 'regional') ? 'active' : ''; ?>" href="#regional" data-bs-toggle="tab">
                                                    <i class="fas fa-globe"></i> Regional Settings
                                                </a>
                                            </li>
                                            <li class="nav-item">
                                                <a class="nav-link <?php echo ($active_tab == 'email') ? 'active' : ''; ?>" href="#email" data-bs-toggle="tab">
                                                    <i class="fas fa-envelope"></i> Email Settings
                                                </a>
                                            </li>
                                            <li class="nav-item">
                                                <a class="nav-link <?php echo ($active_tab == 'system') ? 'active' : ''; ?>" href="#system" data-bs-toggle="tab">
                                                    <i class="fas fa-cogs"></i> System Settings
                                                </a>
                                            </li>
                                            <li class="nav-item">
                                                <a class="nav-link <?php echo ($active_tab == 'cache') ? 'active' : ''; ?>" href="#cache" data-bs-toggle="tab">
                                                    <i class="fas fa-bolt"></i> Cache Settings
                                                </a>
                                            </li>
                                            <li class="nav-item">
                                                <a class="nav-link <?php echo ($active_tab == 'privacy') ? 'active' : ''; ?>" href="#privacy" data-bs-toggle="tab">
                                                    <i class="fas fa-shield-alt"></i> Privacy & Legal
                                                </a>
                                            </li>
                                            <li class="nav-item">
                                                <a class="nav-link <?php echo ($active_tab == 'system_info') ? 'active' : ''; ?>" href="#system_info" data-bs-toggle="tab">
                                                    <i class="fas fa-info-circle"></i> System Information
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="col-md-9">
                            <!-- Settings Content -->
                            <div class="card">
                                <div class="card-body">
                                    <div class="tab-content">
                                        <!-- Company Information Tab -->
                                        <div class="tab-pane fade <?php echo ($active_tab == 'company') ? 'show active' : ''; ?>" id="company">
                                            <h3 class="mb-4">Company Information</h3>
                                            <form action="admin-general.php" method="post">
                                                <input type="hidden" name="action" value="update_company_info">
                                                
                                                <div class="row mb-3">
                                                    <div class="col-md-6">
                                                        <label for="companyName" class="form-label">Company Name</label>
                                                        <input type="text" class="form-control" id="companyName" name="company_name" value="<?php echo $general_settings['company_name']; ?>" required>
                                                    </div>
                                                    <div class="col-md-6">
                                                        <label for="companyTagline" class="form-label">Tagline</label>
                                                        <input type="text" class="form-control" id="companyTagline" name="company_tagline" value="<?php echo $general_settings['company_tagline']; ?>">
                                                    </div>
                                                </div>
                                                
                                                <div class="row mb-3">
                                                    <div class="col-md-6">
                                                        <label for="companyEmail" class="form-label">Company Email</label>
                                                        <input type="email" class="form-control" id="companyEmail" name="company_email" value="<?php echo $general_settings['company_email']; ?>" required>
                                                    </div>
                                                    <div class="col-md-6">
                                                        <label for="companyPhone" class="form-label">Company Phone</label>
                                                        <input type="text" class="form-control" id="companyPhone" name="company_phone" value="<?php echo $general_settings['company_phone']; ?>">
                                                    </div>
                                                </div>
                                                
                                                <div class="mb-3">
                                                    <label for="companyAddress" class="form-label">Company Address</label>
                                                    <textarea class="form-control" id="companyAddress" name="company_address" rows="3"><?php echo $general_settings['company_address']; ?></textarea>
                                                </div>
                                                
                                                <div class="row mb-3">
                                                    <div class="col-md-6">
                                                        <label for="companyLogo" class="form-label">Company Logo</label>
                                                        <div class="input-group mb-2">
                                                            <input type="text" class="form-control" id="companyLogo" name="company_logo" value="<?php echo $general_settings['company_logo']; ?>">
                                                            <button class="btn btn-outline-secondary" type="button">
                                                                <i class="fas fa-upload"></i>
                                                            </button>
                                                        </div>
                                                        <div class="logo-preview mb-2">
                                                            <img src="<?php echo $general_settings['company_logo']; ?>" alt="Company Logo" height="50">
                                                        </div>
                                                        <div class="form-text">Recommended size: 200 x 80 pixels</div>
                                                    </div>
                                                    <div class="col-md-6">
                                                        <label for="companyFavicon" class="form-label">Favicon</label>
                                                        <div class="input-group mb-2">
                                                            <input type="text" class="form-control" id="companyFavicon" name="company_favicon" value="<?php echo $general_settings['company_favicon']; ?>">
                                                            <button class="btn btn-outline-secondary" type="button">
                                                                <i class="fas fa-upload"></i>
                                                            </button>
                                                        </div>
                                                        <div class="logo-preview mb-2">
                                                            <img src="<?php echo $general_settings['company_favicon']; ?>" alt="Favicon" height="32">
                                                        </div>
                                                        <div class="form-text">Recommended size: 32 x 32 pixels</div>
                                                    </div>
                                                </div>
                                                
                                                <div class="row mb-3">
                                                    <div class="col-md-6">
                                                        <label for="companyRegNumber" class="form-label">Registration Number</label>
                                                        <input type="text" class="form-control" id="companyRegNumber" name="company_registration_number" value="<?php echo $general_settings['company_registration_number']; ?>">
                                                    </div>
                                                    <div class="col-md-6">
                                                        <label for="companyVatNumber" class="form-label">VAT/Tax Number</label>
                                                        <input type="text" class="form-control" id="companyVatNumber" name="company_vat_number" value="<?php echo $general_settings['company_vat_number']; ?>">
                                                    </div>
                                                </div>
                                                
                                                <div class="text-end">
                                                    <button type="submit" class="btn btn-primary">
                                                        <i class="fas fa-save"></i> Save Changes
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                        
                                        <!-- Contact Information Tab -->
                                        <div class="tab-pane fade <?php echo ($active_tab == 'contact') ? 'show active' : ''; ?>" id="contact">
                                            <h3 class="mb-4">Contact Information</h3>
                                            <form action="admin-general.php" method="post">
                                                <input type="hidden" name="action" value="update_contact_info">
                                                
                                                <div class="row mb-3">
                                                    <div class="col-md-6">
                                                        <label for="contactEmail" class="form-label">General Contact Email</label>
                                                        <input type="email" class="form-control" id="contactEmail" name="contact_email" value="<?php echo $general_settings['contact_email']; ?>">
                                                        <div class="form-text">Primary email shown on contact page</div>
                                                    </div>
                                                    <div class="col-md-6">
                                                        <label for="supportEmail" class="form-label">Support Email</label>
                                                        <input type="email" class="form-control" id="supportEmail" name="support_email" value="<?php echo $general_settings['support_email']; ?>">
                                                    </div>
                                                </div>
                                                
                                                <div class="row mb-3">
                                                    <div class="col-md-6">
                                                        <label for="salesEmail" class="form-label">Sales Email</label>
                                                        <input type="email" class="form-control" id="salesEmail" name="sales_email" value="<?php echo $general_settings['sales_email']; ?>">
                                                    </div>
                                                    <div class="col-md-6">
                                                        <label for="billingEmail" class="form-label">Billing Email</label>
                                                        <input type="email" class="form-control" id="billingEmail" name="billing_email" value="<?php echo $general_settings['billing_email']; ?>">
                                                    </div>
                                                </div>
                                                
                                                <div class="row mb-3">
                                                    <div class="col-md-6">
                                                        <label for="contactPhone" class="form-label">Main Contact Phone</label>
                                                        <input type="text" class="form-control" id="contactPhone" name="contact_phone" value="<?php echo $general_settings['contact_phone']; ?>">
                                                        <div class="form-text">Primary phone shown on contact page</div>
                                                    </div>
                                                    <div class="col-md-6">
                                                        <label for="supportPhone" class="form-label">Support Phone</label>
                                                        <input type="text" class="form-control" id="supportPhone" name="support_phone" value="<?php echo $general_settings['support_phone']; ?>">
                                                    </div>
                                                </div>
                                                
                                                <div class="mb-3">
                                                    <label for="officeHours" class="form-label">Office Hours</label>
                                                    <input type="text" class="form-control" id="officeHours" name="office_hours" value="<?php echo $general_settings['office_hours']; ?>">
                                                </div>
                                                
                                                <div class="text-end">
                                                    <button type="submit" class="btn btn-primary">
                                                        <i class="fas fa-save"></i> Save Changes
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                        
                                        <!-- Social Media Tab -->
                                        <div class="tab-pane fade <?php echo ($active_tab == 'social') ? 'show active' : ''; ?>" id="social">
                                            <h3 class="mb-4">Social Media Links</h3>
                                            <form action="admin-general.php" method="post">
                                                <input type="hidden" name="action" value="update_social_media">
                                                
                                                <div class="mb-3">
                                                    <label for="facebookUrl" class="form-label">
                                                        <i class="fab fa-facebook"></i> Facebook
                                                    </label>
                                                    <input type="url" class="form-control" id="facebookUrl" name="facebook_url" value="<?php echo $general_settings['facebook_url']; ?>" placeholder="https://facebook.com/yourpage">
                                                </div>
                                                
                                                <div class="mb-3">
                                                    <label for="twitterUrl" class="form-label">
                                                        <i class="fab fa-twitter"></i> Twitter
                                                    </label>
                                                    <input type="url" class="form-control" id="twitterUrl" name="twitter_url" value="<?php echo $general_settings['twitter_url']; ?>" placeholder="https://twitter.com/youraccount">
                                                </div>
                                                
                                                <div class="mb-3">
                                                    <label for="linkedinUrl" class="form-label">
                                                        <i class="fab fa-linkedin"></i> LinkedIn
                                                    </label>
                                                    <input type="url" class="form-control" id="linkedinUrl" name="linkedin_url" value="<?php echo $general_settings['linkedin_url']; ?>" placeholder="https://linkedin.com/company/yourcompany">
                                                </div>
                                                
                                                <div class="mb-3">
                                                    <label for="instagramUrl" class="form-label">
                                                        <i class="fab fa