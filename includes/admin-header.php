<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="robots" content="noindex, nofollow">
    <title><?php echo $page_title; ?> - Backsure Global Support</title>
    
    <!-- Stylesheets -->
    <link rel="stylesheet" href="assets/css/bootstrap.min.css">
    <link rel="stylesheet" href="assets/css/admin-style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&display=swap" rel="stylesheet">
    
    <!-- Favicon -->
    <link rel="icon" href="assets/images/favicon.ico" type="image/x-icon">
</head>
<body>
    <div class="admin-container">
        <!-- Main Content Area will be after the sidebar -->
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
                    <div class="user-profile dropdown">
                        <img src="<?php echo $admin_avatar; ?>" alt="<?php echo $admin_username; ?>">
                        <span><?php echo $admin_username; ?></span>
                        <button id="user-dropdown-toggle" class="dropdown-toggle">
                            <i class="fas fa-chevron-down"></i>
                        </button>
                        <ul id="user-dropdown" class="dropdown-menu">
                            <li><a href="admin-profile.php"><i class="fas fa-user"></i> My Profile</a></li>
                            <li><a href="admin-general.php"><i class="fas fa-cog"></i> Settings</a></li>
                            <li><a href="admin-logout.php"><i class="fas fa-sign-out-alt"></i> Logout</a></li>
                        </ul>
                    </div>
                </div>
            </div>
