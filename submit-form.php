<?php
// submit-form.php - Handles form submissions and sends email notifications

// Rate limiting via session
session_start();
$rate_limit_max = 5;
$rate_limit_window = 600; // 10 minutes in seconds

if (!isset($_SESSION['form_submit_count']) || !isset($_SESSION['form_submit_window'])) {
    $_SESSION['form_submit_count'] = 0;
    $_SESSION['form_submit_window'] = time();
}

// Reset counter if window has expired
if (time() - $_SESSION['form_submit_window'] > $rate_limit_window) {
    $_SESSION['form_submit_count'] = 0;
    $_SESSION['form_submit_window'] = time();
}

// Check rate limit
if ($_SESSION['form_submit_count'] >= $rate_limit_max) {
    http_response_code(429);
    echo json_encode(['success' => false, 'message' => 'Too many requests. Please wait before submitting again.']);
    exit;
}

$_SESSION['form_submit_count']++;

// Get the raw POST data
$jsonData = file_get_contents('php://input');
$data = json_decode($jsonData, true);

// Check if data was received
if (!$data) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'No data received']);
    exit;
}

// Get form type
$formType = $data['form_type'] ?? '';

// Validate required fields based on form type
$isValid = true;
$errorMessage = '';

switch ($formType) {
    case 'general_inquiry':
        if (empty($data['name']) || empty($data['email']) || empty($data['message'])) {
            $isValid = false;
            $errorMessage = 'Name, email and message are required';
        }
        break;
        
    case 'meeting_request':
        if (empty($data['name']) || empty($data['email']) || empty($data['phone']) || 
            empty($data['date']) || empty($data['time']) || empty($data['purpose'])) {
            $isValid = false;
            $errorMessage = 'All required fields must be filled out';
        }
        break;
        
    case 'service_intake':
        if (empty($data['name']) || empty($data['email']) || empty($data['service_type']) || 
            empty($data['requirements'])) {
            $isValid = false;
            $errorMessage = 'All required fields must be filled out';
        }
        break;
        
    default:
        $isValid = false;
        $errorMessage = 'Invalid form type';
        break;
}

if (!$isValid) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => $errorMessage]);
    exit;
}

// Sanitize data to prevent email header injection
function sanitize($data) {
    return str_replace(["\r", "\n"], [" ", " "], strip_tags(trim($data)));
}

$clientName = sanitize($data['name']);
$clientEmail = sanitize($data['email']);

// Set up email variables
$businessEmail = 'info@backsureglobalsupport.com';
$headers = "MIME-Version: 1.0" . "\r\n";
$headers .= "Content-type:text/plain;charset=UTF-8" . "\r\n";
$headers .= "From: BackSure Global Support <$businessEmail>" . "\r\n";

// Email templates
$templates = [
    // Client confirmation emails
    'client' => [
        'general_inquiry' => [
            'subject' => 'Your Enquiry Has Been Received - BackSure Global Support',
            'body' => "Dear $clientName,

Thank you for contacting BackSure Global Support. We have received your general enquiry.

Our team will review your request and respond to you immediately.

For urgent matters, please contact us at +971524419445.

Best regards,
BackSure Global Support Team"
        ],
        'meeting_request' => [
            'subject' => 'Meeting Request Confirmation - BackSure Global Support',
            'body' => "Dear $clientName,

Thank you for scheduling a meeting with BackSure Global Support.

We have received your meeting request for " . ($data['date'] ?? '') . " at " . ($data['formatted_time'] ?? $data['time']) . ". Our team will confirm this appointment shortly.

For any changes to your appointment, please contact us at +971524419445.

Best regards,
BackSure Global Support Team"
        ],
        'service_intake' => [
            'subject' => 'Service Request Confirmation - BackSure Global Support',
            'body' => "Dear $clientName,

Thank you for submitting your service request to BackSure Global Support.

Our team has received your service requirements and will begin processing your request immediately.

If we need additional information, we will contact you at the earliest.

For urgent matters, please contact us at +971524419445.

Best regards,
BackSure Global Support Team"
        ]
    ],
    
    // Team notification emails
    'team' => [
        'general_inquiry' => [
            'subject' => "New General Enquiry from $clientName",
            'body' => "A new general enquiry has been submitted:

Client Details:
- Name: " . ($data['name'] ?? 'Not provided') . "
- Email: " . ($data['email'] ?? 'Not provided') . "
- Phone: " . ($data['phone'] ?? 'Not provided') . "
- Company: " . ($data['company'] ?? 'Not provided') . "

Enquiry Details:
" . ($data['message'] ?? '') . "

This enquiry was submitted on " . date('Y-m-d H:i:s') . ".

Please respond immediately."
        ],
        'meeting_request' => [
            'subject' => "New Meeting Request from $clientName",
            'body' => "A new meeting request has been submitted:

Client Details:
- Name: " . ($data['name'] ?? 'Not provided') . "
- Email: " . ($data['email'] ?? 'Not provided') . "
- Phone: " . ($data['phone'] ?? 'Not provided') . "

Meeting Details:
- Requested Date: " . ($data['date'] ?? 'Not provided') . "
- Requested Time (UAE): " . ($data['formatted_time'] ?? $data['time'] ?? 'Not provided') . "
- Equivalent Time (India): " . ($data['indian_time'] ?? 'Not provided') . "
- Purpose: " . ($data['purpose'] ?? 'Not provided') . "
- Services Interested: " . (isset($data['services']) ? implode(', ', $data['services']) : 'None specified') . "

This request was submitted on " . date('Y-m-d H:i:s') . ".

Please confirm this appointment immediately."
        ],
        'service_intake' => [
            'subject' => "New Service Request from $clientName",
            'body' => "A new service request has been submitted:

Client Details:
- Name: " . ($data['name'] ?? 'Not provided') . "
- Email: " . ($data['email'] ?? 'Not provided') . "
- Phone: " . ($data['phone'] ?? 'Not provided') . "

Service Details:
- Service Type: " . ($data['service_type'] ?? 'Not provided') . "
- Business Industry: " . ($data['business-industry'] ?? 'Not provided') . "
- Implementation Timeline: " . ($data['timeline'] ?? 'Not provided') . "
- Requirements: " . ($data['requirements'] ?? 'Not provided') . "
- Additional Comments: " . ($data['additional_comments'] ?? 'Not provided') . "

This service request was submitted on " . date('Y-m-d H:i:s') . ".

Please begin processing this request immediately."
        ]
    ]
];

// Send client confirmation email
$clientSubject = $templates['client'][$formType]['subject'];
$clientMessage = $templates['client'][$formType]['body'];
$clientSent = mail($clientEmail, $clientSubject, $clientMessage, $headers);

// Format the meeting time if it's a meeting request
if ($formType === 'meeting_request' && isset($data['time'])) {
    // Convert numerical time (like "10:00") to a display format (like "10:00-11:00 AM")
    $hour = (int)$data['time'];
    $nextHour = $hour + 1;
    
    // Format for AM/PM display
    $amPmStart = ($hour < 12) ? 'AM' : 'PM';
    $amPmEnd = ($nextHour < 12) ? 'AM' : 'PM';
    
    // Convert to 12-hour format
    $hour12 = ($hour > 12) ? $hour - 12 : $hour;
    $nextHour12 = ($nextHour > 12) ? $nextHour - 12 : $nextHour;
    
    // Special case for 12 PM
    if ($hour == 12) $hour12 = 12;
    if ($nextHour == 12) $nextHour12 = 12;
    
    $formattedTime = "{$hour12}:00-{$nextHour12}:00 {$amPmEnd}";
    $data['formatted_time'] = $formattedTime;
    
    // Calculate Indian time
    $indianHour = $hour + 1;
    $indianNextHour = $nextHour + 1;
    $indianMinutes = 30;
    
    $indianFormattedTime = "{$indianHour}:{$indianMinutes}-{$indianNextHour}:{$indianMinutes}";
    $data['indian_time'] = $indianFormattedTime;
}

// Send team notification email
$teamSubject = $templates['team'][$formType]['subject'];
$teamMessage = $templates['team'][$formType]['body'];
$teamSent = mail($businessEmail, $teamSubject, $teamMessage, $headers);

// Check if both emails were sent successfully
if ($clientSent && $teamSent) {
    // Optional: Save form submission to database
    // saveToDatabase($data);
    
    http_response_code(200);
    echo json_encode(['success' => true, 'message' => 'Form submitted successfully']);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Failed to send email']);
}

// Optional database function
function saveToDatabase($data) {
    // Database connection parameters
    $servername = "localhost";
    $username = "your_db_username";
    $password = "your_db_password";
    $dbname = "your_database";
    
    // Create connection
    $conn = new mysqli($servername, $username, $password, $dbname);
    
    // Check connection
    if ($conn->connect_error) {
        error_log("Database connection failed: " . $conn->connect_error);
        return false;
    }
    
    // Prepare data for insertion
    $formType = $conn->real_escape_string($data['form_type']);
    $name = $conn->real_escape_string($data['name']);
    $email = $conn->real_escape_string($data['email']);
    $phone = $conn->real_escape_string($data['phone'] ?? '');
    $submissionDate = date('Y-m-d H:i:s');
    
    // Additional fields based on form type
    $additionalFields = '';
    $additionalValues = '';
    
    switch ($formType) {
        case 'general_inquiry':
            $additionalFields = ", message, company";
            $additionalValues = ", '" . $conn->real_escape_string($data['message']) . "', '" . 
                               $conn->real_escape_string($data['company'] ?? '') . "'";
            break;
            
        case 'meeting_request':
            $additionalFields = ", meeting_date, meeting_time, indian_time, purpose";
            $additionalValues = ", '" . $conn->real_escape_string($data['date']) . "', '" . 
                               $conn->real_escape_string($data['time']) . "', '" . 
                               $conn->real_escape_string($data['indian_time'] ?? '') . "', '" . 
                               $conn->real_escape_string($data['purpose']) . "'";
            break;
            
        case 'service_intake':
            $additionalFields = ", service_type, requirements, timeline";
            $additionalValues = ", '" . $conn->real_escape_string($data['service_type']) . "', '" . 
                               $conn->real_escape_string($data['requirements']) . "', '" . 
                               $conn->real_escape_string($data['timeline'] ?? '') . "'";
            break;
    }
    
    // SQL query
    $sql = "INSERT INTO inquiries (form_type, name, email, phone, submission_date" . $additionalFields . ")
            VALUES ('$formType', '$name', '$email', '$phone', '$submissionDate'" . $additionalValues . ")";
    
    // Execute query
    if ($conn->query($sql) === TRUE) {
        $conn->close();
        return true;
    } else {
        error_log("Error saving to database: " . $conn->error);
        $conn->close();
        return false;
    }
}