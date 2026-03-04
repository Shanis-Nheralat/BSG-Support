<?php
/**
 * Blog Image Upload API
 * 
 * Handles secure image upload for blog posts
 * - Validates file types (jpg, png, webp, gif)
 * - Checks file size (max 5MB)
 * - Generates unique filenames
 * - Optimizes images
 * - Returns upload path for database storage
 * 
 * Usage: POST with multipart/form-data
 * Field name: "blog_image"
 * 
 * Response format:
 * Success: {"success": true, "image_path": "/uploads/blog/images/filename.jpg", "message": "Image uploaded successfully"}
 * Error: {"success": false, "error": "Error message"}
 */

// Start session for authentication check
session_start();

// Set headers
header("Access-Control-Allow-Origin: https://backsureglobalsupport.com"); // Must match BASE_URL in config.php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Only POST method is allowed']);
    exit;
}

// Check if user is authenticated (admin only)
if (!isset($_SESSION['user_id']) || empty($_SESSION['user_role'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'error' => 'Unauthorized access']);
    exit;
}

// Configuration
$upload_dir = '../uploads/blog/images/';
$max_file_size = 5 * 1024 * 1024; // 5MB
$allowed_types = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
$allowed_extensions = ['jpg', 'jpeg', 'png', 'webp', 'gif'];

// Check if file was uploaded
if (!isset($_FILES['blog_image']) || $_FILES['blog_image']['error'] === UPLOAD_ERR_NO_FILE) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'No file uploaded']);
    exit;
}

$file = $_FILES['blog_image'];

// Check for upload errors
if ($file['error'] !== UPLOAD_ERR_OK) {
    $error_messages = [
        UPLOAD_ERR_INI_SIZE => 'File exceeds upload_max_filesize in php.ini',
        UPLOAD_ERR_FORM_SIZE => 'File exceeds MAX_FILE_SIZE in HTML form',
        UPLOAD_ERR_PARTIAL => 'File was only partially uploaded',
        UPLOAD_ERR_NO_TMP_DIR => 'Missing temporary folder',
        UPLOAD_ERR_CANT_WRITE => 'Failed to write file to disk',
        UPLOAD_ERR_EXTENSION => 'Upload stopped by PHP extension'
    ];
    
    $error = $error_messages[$file['error']] ?? 'Unknown upload error';
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $error]);
    exit;
}

// Validate file size
if ($file['size'] > $max_file_size) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'File size exceeds 5MB limit']);
    exit;
}

// Validate file type (MIME type)
$finfo = finfo_open(FILEINFO_MIME_TYPE);
$mime_type = finfo_file($finfo, $file['tmp_name']);
finfo_close($finfo);

if (!in_array($mime_type, $allowed_types)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid file type. Only JPG, PNG, WEBP, and GIF are allowed']);
    exit;
}

// Validate file extension
$file_extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
if (!in_array($file_extension, $allowed_extensions)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid file extension']);
    exit;
}

// Create upload directory if it doesn't exist
if (!file_exists($upload_dir)) {
    if (!mkdir($upload_dir, 0755, true)) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Failed to create upload directory']);
        exit;
    }
}

// Generate unique filename
$unique_id = uniqid('blog_', true);
$timestamp = time();
$new_filename = $unique_id . '_' . $timestamp . '.' . $file_extension;
$upload_path = $upload_dir . $new_filename;

// Move uploaded file
if (!move_uploaded_file($file['tmp_name'], $upload_path)) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Failed to save uploaded file']);
    exit;
}

// Optimize image (if GD library is available)
if (extension_loaded('gd')) {
    try {
        optimizeImage($upload_path, $mime_type);
    } catch (Exception $e) {
        // Log error but don't fail the upload
        error_log('Image optimization failed: ' . $e->getMessage());
    }
}

// Return success response with relative path for database
$relative_path = '/uploads/blog/images/' . $new_filename;

http_response_code(200);
echo json_encode([
    'success' => true,
    'image_path' => $relative_path,
    'filename' => $new_filename,
    'message' => 'Image uploaded successfully'
]);

/**
 * Optimize image quality and size
 * Reduces file size while maintaining acceptable quality
 */
function optimizeImage($file_path, $mime_type) {
    $max_width = 1200;
    $max_height = 800;
    $quality = 85;
    
    // Load image based on type
    switch ($mime_type) {
        case 'image/jpeg':
        case 'image/jpg':
            $image = imagecreatefromjpeg($file_path);
            break;
        case 'image/png':
            $image = imagecreatefrompng($file_path);
            break;
        case 'image/webp':
            $image = imagecreatefromwebp($file_path);
            break;
        case 'image/gif':
            $image = imagecreatefromgif($file_path);
            break;
        default:
            return; // Skip optimization for unsupported types
    }
    
    if (!$image) {
        return; // Skip if image creation failed
    }
    
    // Get original dimensions
    $orig_width = imagesx($image);
    $orig_height = imagesy($image);
    
    // Calculate new dimensions (maintain aspect ratio)
    if ($orig_width > $max_width || $orig_height > $max_height) {
        $ratio = min($max_width / $orig_width, $max_height / $orig_height);
        $new_width = round($orig_width * $ratio);
        $new_height = round($orig_height * $ratio);
        
        // Create new image with new dimensions
        $new_image = imagecreatetruecolor($new_width, $new_height);
        
        // Preserve transparency for PNG and GIF
        if ($mime_type === 'image/png' || $mime_type === 'image/gif') {
            imagealphablending($new_image, false);
            imagesavealpha($new_image, true);
            $transparent = imagecolorallocatealpha($new_image, 255, 255, 255, 127);
            imagefilledrectangle($new_image, 0, 0, $new_width, $new_height, $transparent);
        }
        
        // Resample image
        imagecopyresampled($new_image, $image, 0, 0, 0, 0, $new_width, $new_height, $orig_width, $orig_height);
        
        // Save optimized image
        switch ($mime_type) {
            case 'image/jpeg':
            case 'image/jpg':
                imagejpeg($new_image, $file_path, $quality);
                break;
            case 'image/png':
                imagepng($new_image, $file_path, 8); // Compression level 8
                break;
            case 'image/webp':
                imagewebp($new_image, $file_path, $quality);
                break;
            case 'image/gif':
                imagegif($new_image, $file_path);
                break;
        }
        
        imagedestroy($new_image);
    } else {
        // Just optimize quality without resizing
        switch ($mime_type) {
            case 'image/jpeg':
            case 'image/jpg':
                imagejpeg($image, $file_path, $quality);
                break;
            case 'image/webp':
                imagewebp($image, $file_path, $quality);
                break;
        }
    }
    
    imagedestroy($image);
}
?>
