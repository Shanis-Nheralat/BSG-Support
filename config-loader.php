<?php
/**
 * Configuration Loader
 * This file loads your existing database configuration
 */

// Define a function to find and load existing DB configuration files
function find_and_load_db_config() {
    // Common locations for database configuration
    $possible_configs = [
        // Root config files
        dirname(__FILE__) . '/config.php',
        dirname(__FILE__) . '/configuration.php',
        dirname(__FILE__) . '/db-config.php',
        dirname(__FILE__) . '/db_config.php',
        dirname(__FILE__) . '/dbconfig.php',
        dirname(__FILE__) . '/database.php',
        
        // Config in includes folder
        dirname(__FILE__) . '/includes/config.php',
        dirname(__FILE__) . '/includes/configuration.php',
        dirname(__FILE__) . '/includes/db-config.php',
        
        // Config in parent directory
        dirname(dirname(__FILE__)) . '/config.php',
        dirname(dirname(__FILE__)) . '/configuration.php',
        
        // WordPress style config
        dirname(__FILE__) . '/wp-config.php',
        dirname(dirname(__FILE__)) . '/wp-config.php',
        
        // Config in admin folder
        dirname(__FILE__) . '/admin/config.php',
        dirname(dirname(__FILE__)) . '/admin/config.php',
    ];
    
    // Try to find existing configuration file
    foreach ($possible_configs as $config_file) {
        if (file_exists($config_file)) {
            // Load the config file
            include_once $config_file;
            return true;
        }
    }
    
    return false;
}

// Try to load existing database configuration
$config_loaded = find_and_load_db_config();

// Check if we can find the database connection or its variables
$db_connection_found = false;

// Check if $db or similar variable already exists
if (isset($db) && is_object($db) && method_exists($db, 'query')) {
    $db_connection_found = true;
}
// Check for mysqli connection 
else if (isset($mysqli) && is_object($mysqli) && method_exists($mysqli, 'query')) {
    $db = $mysqli;
    $db_connection_found = true;
}
// Check for PDO connection
else if (isset($pdo) && is_object($pdo) && method_exists($pdo, 'query')) {
    // We'll need to adapt our functions to work with PDO
    $db = $pdo;
    $db_connection_found = true;
}
// Check for common database variables
else if ((isset($db_host) || isset($dbhost) || isset($DB_HOST)) && 
         (isset($db_user) || isset($dbuser) || isset($DB_USER)) && 
         (isset($db_pass) || isset($dbpass) || isset($DB_PASS)) && 
         (isset($db_name) || isset($dbname) || isset($DB_NAME))) {
    
    // Extract database variables
    $host = isset($db_host) ? $db_host : (isset($dbhost) ? $dbhost : $DB_HOST);
    $user = isset($db_user) ? $db_user : (isset($dbuser) ? $dbuser : $DB_USER);
    $pass = isset($db_pass) ? $db_pass : (isset($dbpass) ? $dbpass : $DB_PASS);
    $name = isset($db_name) ? $db_name : (isset($dbname) ? $dbname : $DB_NAME);
    
    // Create new connection
    $db = new mysqli($host, $user, $pass, $name);
    
    if (!$db->connect_error) {
        $db_connection_found = true;
    }
}
// WordPress config
else if (defined('DB_HOST') && defined('DB_USER') && defined('DB_PASSWORD') && defined('DB_NAME')) {
    $db = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);
    
    if (!$db->connect_error) {
        $db_connection_found = true;
    }
}

// If we still don't have a database connection, create a temporary one for testing
if (!$db_connection_found) {
    // These will be filled by the user in the settings-test-adapter.php
    $db = null;
}

// Define upload directories
if (!defined('UPLOAD_DIR')) {
    define('UPLOAD_DIR', dirname(__FILE__) . '/uploads/');
}

if (!defined('UPLOAD_URL')) {
    // Calculate relative URL
    $current_dir = dirname($_SERVER['PHP_SELF']);
    $upload_url = $current_dir . '/uploads/';
    define('UPLOAD_URL', $upload_url);
}

// Define admin panel constant
if (!defined('ADMIN_PANEL')) {
    define('ADMIN_PANEL', true);
}
