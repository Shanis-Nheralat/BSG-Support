<?php
/**
 * Download Resume
 * 
 * Securely handles downloading candidate resume files
 */

// Include authentication
require_once 'admin-auth.php';

// Check if ID is provided
if (!isset($_GET['id']) || !is_numeric($_GET['id'])) {
    die("Invalid candidate ID.");
}

$candidate_id = intval($_GET['id']);

// Get candidate and resume info
try {
    $db = get_db_connection();
    $stmt = $db->prepare("SELECT name, position, resume_path FROM candidates WHERE id = :id");
    $stmt->execute([':id' => $candidate_id]);
    $candidate = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$candidate) {
        die("Candidate not found.");
    }
} catch (Exception $e) {
    die("Error retrieving candidate data: " . $e->getMessage());
}

// Check if file exists
$resume_path = $candidate['resume_path'];
if (!file_exists($resume_path)) {
    die("Resume file not found.");
}

// Sanitize filename for download
$file_name = pathinfo($resume_path, PATHINFO_BASENAME);
$sanitized_name = preg_replace('/[^a-zA-Z0-9_.-]/', '_', $candidate['name']);
$position = preg_replace('/[^a-zA-Z0-9_.-]/', '_', $candidate['position']);

// Create a meaningful download filename
$download_filename = $sanitized_name . "_" . $position . "_Resume." . pathinfo($file_name, PATHINFO_EXTENSION);

// Get file info
$file_size = filesize($resume_path);
$file_extension = strtolower(pathinfo($resume_path, PATHINFO_EXTENSION));

// Set appropriate content type based on file extension
switch ($file_extension) {
    case 'pdf':
        $content_type = 'application/pdf';
        break;
    case 'doc':
        $content_type = 'application/msword';
        break;
    case 'docx':
        $content_type = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        break;
    default:
        $content_type = 'application/octet-stream';
}

// Set headers for download
header('Content-Description: File Transfer');
header('Content-Type: ' . $content_type);
header('Content-Disposition: attachment; filename="' . $download_filename . '"');
header('Content-Transfer-Encoding: binary');
header('Content-Length: ' . $file_size);
header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
header('Expires: 0');
header('Pragma: public');

// Clear output buffer
ob_clean();
flush();

// Output file
readfile($resume_path);
exit;