<?php
/**
 * Centralized Database Connection
 * Provides consistent database access across all admin files
 */

// Load environment variables from .env file
function load_env($path) {
    if (!file_exists($path)) {
        return false;
    }
    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        $line = trim($line);
        if ($line === '' || $line[0] === '#') {
            continue;
        }
        $pos = strpos($line, '=');
        if ($pos === false) {
            continue;
        }
        $key = trim(substr($line, 0, $pos));
        $value = trim(substr($line, $pos + 1));
        // Remove surrounding quotes if present
        if (strlen($value) >= 2 && (($value[0] === '"' && $value[strlen($value)-1] === '"') || ($value[0] === "'" && $value[strlen($value)-1] === "'"))) {
            $value = substr($value, 1, -1);
        }
        putenv("$key=$value");
        $_ENV[$key] = $value;
    }
    return true;
}

load_env(__DIR__ . '/.env');

// Database credentials loaded from .env
$db_host = getenv('DB_HOST');
$db_name = getenv('DB_NAME');
$db_user = getenv('DB_USER');
$db_pass = getenv('DB_PASS') !== false ? getenv('DB_PASS') : '';
$db_charset = 'utf8mb4';

// Verify required credentials are loaded (password can be empty for local dev)
if (!$db_host || !$db_name || !$db_user) {
    error_log('Database configuration error: Missing required .env values (DB_HOST, DB_NAME, DB_USER)');
    die('Database configuration error. Please contact the administrator.');
}

// Legacy variables for backward compatibility
global $conn, $db_connection, $connection, $database;

// Connection options for PDO
$options = [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES => false,
];

// DSN (Data Source Name)
$dsn = "mysql:host=$db_host;dbname=$db_name;charset=$db_charset";

// Establish PDO connection
try {
    $pdo = new PDO($dsn, $db_user, $db_pass, $options);
    
    // Create mysqli connection for backward compatibility
    $mysqli = new mysqli($db_host, $db_user, $db_pass, $db_name);
    
    // Map to common variable names for existing code
    $conn = $mysqli;
    $db_connection = $mysqli;
    $connection = $mysqli;
    $database = $mysqli;
    
} catch (PDOException $e) {
    // Log error and display user-friendly message
    error_log("Database Connection Error: " . $e->getMessage());
    die("Database connection failed. Please contact the administrator.");
}

/**
 * Helper function to execute a query and return a single value
 */
function db_get_value($query, $params = []) {
    global $pdo;
    try {
        $stmt = $pdo->prepare($query);
        $stmt->execute($params);
        return $stmt->fetchColumn();
    } catch (PDOException $e) {
        error_log("Database Query Error: " . $e->getMessage());
        return null;
    }
}

/**
 * Helper function to execute a query and return multiple rows
 */
function db_get_rows($query, $params = []) {
    global $pdo;
    try {
        $stmt = $pdo->prepare($query);
        $stmt->execute($params);
        return $stmt->fetchAll();
    } catch (PDOException $e) {
        error_log("Database Query Error: " . $e->getMessage());
        return [];
    }
}

/**
 * Helper function to execute a query and return a single row
 */
function db_get_row($query, $params = []) {
    global $pdo;
    try {
        $stmt = $pdo->prepare($query);
        $stmt->execute($params);
        return $stmt->fetch();
    } catch (PDOException $e) {
        error_log("Database Query Error: " . $e->getMessage());
        return null;
    }
}

/**
 * Helper function to execute an insert, update, or delete query
 */
function db_execute($query, $params = []) {
    global $pdo;
    try {
        $stmt = $pdo->prepare($query);
        $stmt->execute($params);
        return $stmt->rowCount();
    } catch (PDOException $e) {
        error_log("Database Query Error: " . $e->getMessage());
        return 0;
    }
}

/**
 * Helper function to get the last inserted ID
 */
function db_last_insert_id() {
    global $pdo;
    return $pdo->lastInsertId();
}

/**
 * Function for backwards compatibility with db_config.php
 * This will help transition code that used get_db_connection()
 */
function get_db_connection() {
    global $pdo;
    return $pdo;
}

/**
 * Function for backwards compatibility with db_config.php
 * This will help transition code that used get_mysqli_connection()
 */
function get_mysqli_connection() {
    global $mysqli;
    return $mysqli;
}

// Set additional compatibility variables used by db_config.php
// This helps with transitioning away from db_config.php
$db = $mysqli;  // $db uses MySQLi interface (used by settings-functions.php etc.)
$dbhost = $db_host;
$dbuser = $db_user;
$dbpass = $db_pass;
$dbname = $db_name;

// Define constants for backwards compatibility
if (!defined('DB_HOST')) define('DB_HOST', $db_host);
if (!defined('DB_NAME')) define('DB_NAME', $db_name);
if (!defined('DB_USER')) define('DB_USER', $db_user);
if (!defined('DB_PASSWORD')) define('DB_PASSWORD', $db_pass);
