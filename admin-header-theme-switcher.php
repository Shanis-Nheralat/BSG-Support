<?php
/**
 * Admin Header with Theme Switcher
 * This is a partial code snippet to add to admin-header.php
 */
?>

<!-- Add this inside the header-right div in admin-header.php -->
<div class="theme-switcher">
  <select id="theme-select" class="form-select form-select-sm">
    <option value="default">Default Theme</option>
    <option value="dark">Dark Theme</option>
    <option value="blue">Blue Theme</option>
    <option value="green">Green Theme</option>
    <option value="purple">Purple Theme</option>
  </select>
  <div class="auto-dark-mode">
    <input type="checkbox" id="auto-dark-mode">
    <label for="auto-dark-mode">Auto Dark Mode</label>
  </div>
</div>
