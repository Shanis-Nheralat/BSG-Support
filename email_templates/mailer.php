<?php
/**
 * Mailer System for BSG Support Admin
 * Provides centralized email functionality using PHPMailer with Zoho SMTP
 */

// Use Composer autoloader if available
if (file_exists(__DIR__ . '/vendor/autoload.php')) {
    require_once __DIR__ . '/vendor/autoload.php';
} else {
    // Manual PHPMailer includes if Composer not used
    require_once __DIR__ . '/PHPMailer/src/Exception.php';
    require_once __DIR__ . '/PHPMailer/src/PHPMailer.php';
    require_once __DIR__ . '/PHPMailer/src/SMTP.php';
}

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\SMTP;

/**
 * Send email using PHPMailer
 * 
 * @param string $to Recipient email
 * @param string $subject Email subject
 * @param string $body Email body (HTML)
 * @param string $altBody Plain text alternative
 * @param array $attachments Optional array of attachments
 * @param array $cc Optional array of CC recipients
 * @param array $bcc Optional array of BCC recipients
 * @param string $replyTo Optional reply-to email
 * @param string $fromName Optional sender name
 * @return array Result with success status and message
 */
function send_email($to, $subject, $body, $altBody = '', $attachments = [], $cc = [], $bcc = [], $replyTo = '', $fromName = 'BSG Support') {
    // Create a new PHPMailer instance
    $mail = new PHPMailer(true);
    
    try {
        // Server settings
        $mail->isSMTP();
        $mail->Host = 'smtp.zoho.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'shanis@backsureglobalsupport.com';
        $mail->Password = 'your_zoho_app_password'; // Use App Password from Zoho
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
        $mail->Port = 465;
        
        // Debugging (remove in production)
        // $mail->SMTPDebug = SMTP::DEBUG_SERVER;
        
        // Recipients
        $mail->setFrom('shanis@backsureglobalsupport.com', $fromName);
        $mail->addAddress($to);
        
        // Set reply-to if provided
        if (!empty($replyTo)) {
            $mail->addReplyTo($replyTo);
        }
        
        // Add CC recipients if provided
        if (!empty($cc)) {
            foreach ($cc as $ccEmail) {
                $mail->addCC($ccEmail);
            }
        }
        
        // Add BCC recipients if provided
        if (!empty($bcc)) {
            foreach ($bcc as $bccEmail) {
                $mail->addBCC($bccEmail);
            }
        }
        
        // Add attachments if provided
        if (!empty($attachments)) {
            foreach ($attachments as $attachment) {
                if (is_array($attachment) && isset($attachment['path']) && isset($attachment['name'])) {
                    $mail->addAttachment($attachment['path'], $attachment['name']);
                } elseif (is_string($attachment) && file_exists($attachment)) {
                    $mail->addAttachment($attachment);
                }
            }
        }
        
        // Content
        $mail->isHTML(true);
        $mail->Subject = $subject;
        $mail->Body = $body;
        $mail->AltBody = !empty($altBody) ? $altBody : strip_tags($body);
        
        // Send email
        $mail->send();
        
        // Log email sent
        if (function_exists('log_admin_action')) {
            log_admin_action('email_sent', "Email sent to: $to, Subject: $subject");
        }
        
        return [
            'success' => true,
            'message' => 'Email sent successfully'
        ];
    } catch (Exception $e) {
        // Log error
        error_log("Email Error: " . $mail->ErrorInfo);
        
        return [
            'success' => false,
            'message' => $mail->ErrorInfo
        ];
    }
}

/**
 * Load email template and replace placeholders
 * 
 * @param string $template Template name
 * @param array $replacements Associative array of placeholders and values
 * @return string Processed template
 */
function load_email_template($template, $replacements = []) {
    $templatePath = __DIR__ . '/email_templates/' . $template . '.html';
    
    if (!file_exists($templatePath)) {
        error_log("Email template not found: $templatePath");
        return '';
    }
    
    $content = file_get_contents($templatePath);
    
    // Replace placeholders
    foreach ($replacements as $placeholder => $value) {
        $content = str_replace('{{' . $placeholder . '}}', $value, $content);
    }
    
    return $content;
}

/**
 * Send password reset email
 * 
 * @param string $email Recipient email
 * @param string $name Recipient name
 * @param string $resetLink Password reset link
 * @return array Result with success status and message
 */
function send_password_reset_email($email, $name, $resetLink) {
    $subject = 'Password Reset - BSG Support Admin';
    
    $replacements = [
        'name' => $name,
        'reset_link' => $resetLink,
        'expiry_time' => '1 hour',
        'current_year' => date('Y')
    ];
    
    $body = load_email_template('password_reset', $replacements);
    
    if (empty($body)) {
        return [
            'success' => false,
            'message' => 'Email template not found'
        ];
    }
    
    return send_email($email, $subject, $body);
}

/**
 * Send welcome email to new user
 * 
 * @param string $email Recipient email
 * @param string $name Recipient name
 * @param string $username Username
 * @param string $password Temporary password
 * @param string $role User role
 * @return array Result with success status and message
 */
function send_welcome_email($email, $name, $username, $password, $role) {
    $subject = 'Welcome to BSG Support Admin';
    
    $replacements = [
        'name' => $name,
        'username' => $username,
        'password' => $password,
        'role' => ucfirst($role),
        'login_url' => 'https://' . $_SERVER['HTTP_HOST'] . '/login.php',
        'current_year' => date('Y')
    ];
    
    $body = load_email_template('welcome_user', $replacements);
    
    if (empty($body)) {
        return [
            'success' => false,
            'message' => 'Email template not found'
        ];
    }
    
    return send_email($email, $subject, $body);
}

/**
 * Send inquiry confirmation email
 * 
 * @param string $email Recipient email
 * @param string $name Recipient name
 * @param string $subject Inquiry subject
 * @param string $message Inquiry message
 * @return array Result with success status and message
 */
function send_inquiry_confirmation_email($email, $name, $subject, $message) {
    $emailSubject = 'Thank you for your inquiry - BSG Support';
    
    $replacements = [
        'name' => $name,
        'subject' => $subject,
        'message' => $message,
        'date' => date('F j, Y'),
        'current_year' => date('Y')
    ];
    
    $body = load_email_template('inquiry_confirmation', $replacements);
    
    if (empty($body)) {
        return [
            'success' => false,
            'message' => 'Email template not found'
        ];
    }
    
    return send_email($email, $emailSubject, $body);
}

/**
 * Send inquiry notification to admin
 * 
 * @param string $name Customer name
 * @param string $email Customer email
 * @param string $subject Inquiry subject
 * @param string $message Inquiry message
 * @return array Result with success status and message
 */
function send_inquiry_notification_email($name, $email, $subject, $message) {
    $adminEmail = 'shanis@backsureglobalsupport.com'; // Admin email
    $emailSubject = 'New Inquiry Received - ' . $subject;
    
    $replacements = [
        'name' => $name,
        'email' => $email,
        'subject' => $subject,
        'message' => $message,
        'date' => date('F j, Y, g:i a'),
        'current_year' => date('Y')
    ];
    
    $body = load_email_template('inquiry_notification', $replacements);
    
    if (empty($body)) {
        return [
            'success' => false,
            'message' => 'Email template not found'
        ];
    }
    
    return send_email($adminEmail, $emailSubject, $body, '', [], [], [], $email);
}

/**
 * Send CV submission confirmation email
 * 
 * @param string $email Recipient email
 * @param string $name Recipient name
 * @param string $position Position applied for
 * @return array Result with success status and message
 */
function send_cv_confirmation_email($email, $name, $position) {
    $subject = 'Application Received - BSG Support';
    
    $replacements = [
        'name' => $name,
        'position' => $position,
        'date' => date('F j, Y'),
        'current_year' => date('Y')
    ];
    
    $body = load_email_template('cv_confirmation', $replacements);
    
    if (empty($body)) {
        return [
            'success' => false,
            'message' => 'Email template not found'
        ];
    }
    
    return send_email($email, $subject, $body);
}

/**
 * Send CV rejection email
 * 
 * @param string $email Recipient email
 * @param string $name Recipient name
 * @param string $position Position applied for
 * @return array Result with success status and message
 */
function send_cv_rejection_email($email, $name, $position) {
    $subject = 'Update on Your Application - BSG Support';
    
    $replacements = [
        'name' => $name,
        'position' => $position,
        'date' => date('F j, Y'),
        'current_year' => date('Y')
    ];
    
    $body = load_email_template('cv_rejection', $replacements);
    
    if (empty($body)) {
        return [
            'success' => false,
            'message' => 'Email template not found'
        ];
    }
    
    return send_email($email, $subject, $body);
}
