<?php
/**
 * Update Candidate Notes
 * 
 * Handles updating notes for a specific candidate
 */

// Include authentication
require_once 'admin-auth.php';

// Check if form was submitted
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: admin-candidates.php');
    exit;
}

// Check required parameters
if (!isset($_POST['candidate_id']) || !is_numeric($_POST['candidate_id'])) {
    $_SESSION['admin_message'] = [
        'type' => 'error',
        'text' => 'Invalid candidate ID.'
    ];
    header('Location: admin-candidates.php');
    exit;
}

$candidate_id = intval($_POST['candidate_id']);
$notes = isset($_POST['notes']) ? trim($_POST['notes']) : '';

// Update notes in database
try {
    $db = get_db_connection();
    $stmt = $db->prepare("UPDATE candidates SET notes = :notes WHERE id = :id");
    $stmt->execute([
        ':notes' => $notes,
        ':id' => $candidate_id
    ]);
    
    $_SESSION['admin_message'] = [
        'type' => 'success',
        'text' => 'Candidate notes updated successfully.'
    ];
} catch (Exception $e) {
    $_SESSION['admin_message'] = [
        'type' => 'error',
        'text' => 'Error updating notes: ' . $e->getMessage()
    ];
}

// Redirect back to candidates page
header('Location: admin-candidates.php');
exit;
?>