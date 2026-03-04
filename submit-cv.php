<?php
/**
 * Resume/CV Submission Handler
 * 
 * Processes form submissions from careers.html:
 * - Validates form data
 * - Uploads resume file
 * - Saves candidate data to database
 * - Sends confirmation email to candidate
 * - Sends notification email to HR
 */

// Prevent direct access
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('HTTP/1.1 403 Forbidden');
    echo "Direct access not allowed.";
    exit;
}

// Include database configuration
require_once 'db_config.php';

// Initialize response
$response = [
    'success' => false,
    'message' => '',
    'errors' => []
];

// Validate inputs
$required_fields = ['firstName', 'lastName', 'email', 'phone', 'position'];
$errors = [];

foreach ($required_fields as $field) {
    if (empty($_POST[$field])) {
        $errors[] = ucfirst($field) . " is required.";
    }
}

// Validate email
if (!empty($_POST['email']) && !filter_var($_POST['email'], FILTER_VALIDATE_EMAIL)) {
    $errors[] = "Please enter a valid email address.";
}

// Check for file upload
if (!isset($_FILES['resume']) || $_FILES['resume']['error'] === UPLOAD_ERR_NO_FILE) {
    $errors[] = "Resume file is required.";
}

// File validation if uploaded
if (isset($_FILES['resume']) && $_FILES['resume']['error'] === UPLOAD_ERR_OK) {
    $file = $_FILES['resume'];
    $file_size = $file['size'];
    $file_name = $file['name'];
    $file_tmp = $file['tmp_name'];
    $file_ext = strtolower(pathinfo($file_name, PATHINFO_EXTENSION));
    
    // Valid file extensions
    $allowed_extensions = ['pdf', 'doc', 'docx'];
    
    // Check extension
    if (!in_array($file_ext, $allowed_extensions)) {
        $errors[] = "Only PDF, DOC, and DOCX files are allowed.";
    }
    
    // Validate MIME type
    $allowed_mime_types = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mime_type = finfo_file($finfo, $file_tmp);
    finfo_close($finfo);
    
    if (!in_array($mime_type, $allowed_mime_types)) {
        $errors[] = "Invalid file type. Only PDF, DOC, and DOCX files are allowed.";
    }
    
    // Check file size (5MB limit)
    $max_size = 5 * 1024 * 1024; // 5MB in bytes
    if ($file_size > $max_size) {
        $errors[] = "File size must be less than 5MB.";
    }
}

// If validation errors exist, return them
if (!empty($errors)) {
    $response['errors'] = $errors;
    echo json_encode($response);
    exit;
}

// Process the form if there are no errors
try {
    // 1. Upload file
    $upload_dir = '../uploads/resumes/';
    
    // Create directory if it doesn't exist
    if (!file_exists($upload_dir)) {
        mkdir($upload_dir, 0755, true);
    }
    
    // Generate unique filename
    $unique_id = uniqid();
    $timestamp = date('Ymd_His');
    $sanitized_name = preg_replace('/[^a-zA-Z0-9]/', '_', $_POST['lastName'] . '_' . $_POST['firstName']);
    $new_filename = $sanitized_name . '_' . $timestamp . '_' . $unique_id . '.' . $file_ext;
    $file_path = $upload_dir . $new_filename;
    
    // Move uploaded file
    if (!move_uploaded_file($file_tmp, $file_path)) {
        throw new Exception("Failed to upload file.");
    }
    
    // 2. Save to database
    $full_name = $_POST['firstName'] . ' ' . $_POST['lastName'];
    
    // Get database connection
    $db = get_db_connection();
    
    $sql = "INSERT INTO candidates 
            (name, email, phone, position, resume_path, status, submitted_at) 
            VALUES 
            (:name, :email, :phone, :position, :resume_path, :status, NOW())";
    
    $stmt = $db->prepare($sql);
    $stmt->execute([
        ':name' => $full_name,
        ':email' => $_POST['email'],
        ':phone' => $_POST['phone'],
        ':position' => $_POST['position'],
        ':resume_path' => $file_path,
        ':status' => 'New'
    ]);
    
    $candidate_id = $db->lastInsertId();
    
    // 3. Send confirmation email to candidate
    $to_candidate = $_POST['email'];
    $subject_candidate = "Your application for " . $_POST['position'] . " at Backsure Global Support";
    
    $message_candidate = "Dear " . $full_name . ",\n\n";
    $message_candidate .= "Thank you for your interest in a career at Backsure Global Support. ";
    $message_candidate .= "We have received your application for the " . $_POST['position'] . " role.\n\n";
    $message_candidate .= "What happens now?\n";
    $message_candidate .= "We will review your application and will contact you if there is a good match.\n\n";
    $message_candidate .= "Sincerely,\n";
    $message_candidate .= "Backsure Global Support Talent Acquisition Team";
    
    $headers_candidate = "From: Backsure Global Support <hr@backsureglobalsupport.com>\r\n";
    $headers_candidate .= "Reply-To: hr@backsureglobalsupport.com\r\n";
    
    // 4. Send notification email to HR
    $to_hr = "hr@backsureglobalsupport.com";
    $subject_hr = "New Job Application: " . $_POST['position'];
    
    $message_hr = "A new job application has been received.\n\n";
    $message_hr .= "Candidate Details:\n";
    $message_hr .= "Name: " . $full_name . "\n";
    $message_hr .= "Email: " . $_POST['email'] . "\n";
    $message_hr .= "Phone: " . $_POST['phone'] . "\n";
    $message_hr .= "Position: " . $_POST['position'] . "\n";
    $message_hr .= "Application Date: " . date('Y-m-d H:i:s') . "\n\n";
    $message_hr .= "The resume can be accessed in the admin panel or at: " . $_SERVER['HTTP_HOST'] . "/" . $file_path . "\n\n";
    $message_hr .= "Please log in to the admin panel to review this application.";
    
    $headers_hr = "From: BSG Job Application <no-reply@backsureglobalsupport.com>\r\n";
    
    // Send emails
    $mail_candidate = mail($to_candidate, $subject_candidate, $message_candidate, $headers_candidate);
    $mail_hr = mail($to_hr, $subject_hr, $message_hr, $headers_hr);
    
    // 5. Return success response
    $response['success'] = true;
    $response['message'] = "Your application has been submitted successfully! We'll be in touch soon.";
    
} catch (Exception $e) {
    error_log("Error in form submission: " . $e->getMessage());
    $response['message'] = "There was an error processing your application. Please try again later.";
}

// Output JSON response
header('Content-Type: application/json');
echo json_encode($response);
exit;
?>