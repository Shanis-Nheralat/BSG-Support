<?php
/**
 * Create Missing Directories
 * Sets up required asset directories that were identified as missing
 */

// Define directories to create
$directories = [
    'assets/images',
    'assets/lib'
];

echo "<h2>Creating Required Directories</h2>";
echo "<ul>";

foreach ($directories as $dir) {
    if (!file_exists($dir)) {
        if (mkdir($dir, 0755, true)) {
            echo "<li>✅ Created directory: $dir</li>";
        } else {
            echo "<li>❌ Failed to create directory: $dir</li>";
        }
    } else {
        echo "<li>✓ Directory already exists: $dir</li>";
    }
}

echo "</ul>";
echo "<p><a href='check-db.php'>Back to Diagnostics</a></p>";
