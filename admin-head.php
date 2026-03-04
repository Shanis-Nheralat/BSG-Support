<!DOCTYPE html>
<html lang="en" data-theme="default">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="robots" content="noindex, nofollow">
  <title><?php echo isset($page_title) ? htmlspecialchars($page_title) : 'Admin Panel'; ?> | Backsure Global Support</title>
  
  <!-- Get the base URL dynamically -->
  <?php
  // Base URL construction
  $scriptPath = $_SERVER['SCRIPT_NAME'];
  $parentDir = dirname($scriptPath);
  $baseUrl = rtrim($parentDir, '/') . '/';
  ?>
  
  <!-- Favicon -->
  <link rel="shortcut icon" href="<?php echo $baseUrl; ?>assets/images/favicon.ico" type="image/x-icon">
  
  <!-- Font Awesome -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
  
  <!-- Bootstrap -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
  
  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&display=swap" rel="stylesheet">
  
  <!-- Core styles -->
  <link rel="stylesheet" href="<?php echo $baseUrl; ?>admin-core.css">
  <link rel="stylesheet" href="<?php echo $baseUrl; ?>admin-themes.css">
  
  <!-- Chart.js -->
  <script src="https://cdn.jsdelivr.net/npm/chart.js@3.7.1/dist/chart.min.js"></script>
  
  <!-- Extra CSS files -->
  <?php if (isset($extra_css) && is_array($extra_css)): ?>
    <?php foreach ($extra_css as $css_file): ?>
      <link rel="stylesheet" href="<?php echo $baseUrl . ltrim($css_file, '/'); ?>">
    <?php endforeach; ?>
  <?php endif; ?>
  
  <!-- Core JavaScript -->
  <script src="<?php echo $baseUrl; ?>admin-core.js" defer></script>
  <script src="<?php echo $baseUrl; ?>admin-theme-switcher.js" defer></script>
  
  <!-- Extra JavaScript files -->
  <?php if (isset($extra_js) && is_array($extra_js)): ?>
    <?php foreach ($extra_js as $js_file): ?>
      <script src="<?php echo $baseUrl . ltrim($js_file, '/'); ?>" defer></script>
    <?php endforeach; ?>
  <?php endif; ?>
  
  <!-- Page-specific CSS -->
  <?php if (isset($page_specific_css) && !empty($page_specific_css)): ?>
    <link rel="stylesheet" href="<?php echo $baseUrl . ltrim($page_specific_css, '/'); ?>">
  <?php endif; ?>
  
  <!-- Page-specific JavaScript -->
  <?php if (isset($page_specific_js) && !empty($page_specific_js)): ?>
    <script src="<?php echo $baseUrl . ltrim($page_specific_js, '/'); ?>" defer></script>
  <?php endif; ?>
</head>
<body class="admin-body">
<div class="admin-container">
