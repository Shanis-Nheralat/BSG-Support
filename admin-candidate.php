// Include admin header
include('admin-header.php');
?>

<!-- Filters -->
<div class="filter-panel">
    <form method="GET" action="" class="filter-form">
        <div class="filter-row">
            <div class="filter-group">
                <label for="status">Status:</label>
                <select name="status" id="status">
                    <option value="">All Statuses</option>
                    <option value="New" <?php echo $status_filter === 'New' ? 'selected' : ''; ?>>New</option>
                    <option value="Under Review" <?php echo $status_filter === 'Under Review' ? 'selected' : ''; ?>>Under Review</option>
                    <option value="Shortlisted" <?php echo $status_filter === 'Shortlisted' ? 'selected' : ''; ?>>Shortlisted</option>
                    <option value="Interviewed" <?php echo $status_filter === 'Interviewed' ? 'selected' : ''; ?>>Interviewed</option>
                    <option value="Offered" <?php echo $status_filter === 'Offered' ? 'selected' : ''; ?>>Offered</option>
                    <option value="Hired" <?php echo $status_filter === 'Hired' ? 'selected' : ''; ?>>Hired</option>
                    <option value="Rejected" <?php echo $status_filter === 'Rejected' ? 'selected' : ''; ?>>Rejected</option>
                </select>
            </div>
            
            <div class="filter-group">
                <label for="position">Position:</label>
                <select name="position" id="position">
                    <option value="">All Positions</option>
                    <?php foreach ($positions as $position): ?>
                    <option value="<?php echo htmlspecialchars($position); ?>" <?php echo $position_filter === $position ? 'selected' : ''; ?>>
                        <?php echo htmlspecialchars($position); ?>
                    </option>
                    <?php endforeach; ?>
                </select>
            </div>
            
            <div class="filter-group">
                <label for="date_from">Date From:</label>
                <input type="date" name="date_from" id="date_from" value="<?php echo $date_from; ?>">
            </div>
            
            <div class="filter-group">
                <label for="date_to">Date To:</label>
                <input type="date" name="date_to" id="date_to" value="<?php echo $date_to; ?>">
            </div>
            
            <div class="filter-group search-group">
                <label for="search">Search:</label>
                <input type="text" name="search" id="search" placeholder="Name, Email, Phone" value="<?php echo htmlspecialchars($search); ?>">
            </div>
            
            <div class="filter-actions">
                <button type="submit" class="btn btn-primary">Apply Filters</button>
                <a href="admin-candidates.php" class="btn btn-secondary">Reset</a>
            </div>
        </div>
    </form>
</div>

<!-- Candidates Table -->
<div class="table-responsive">
    <table class="data-table">
        <thead>
            <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Position</th>
                <th>Date Applied</th>
                <th>Status</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            <?php if (count($candidates) > 0): ?>
                <?php foreach ($candidates as $candidate): ?>
                <tr>
                    <td><?php echo $candidate['id']; ?></td>
                    <td><?php echo htmlspecialchars($candidate['name']); ?></td>
                    <td>
                        <a href="mailto:<?php echo htmlspecialchars($candidate['email']); ?>">
                            <?php echo htmlspecialchars($candidate['email']); ?>
                        </a>
                    </td>
                    <td><?php echo htmlspecialchars($candidate['phone']); ?></td>
                    <td><?php echo htmlspecialchars($candidate['position']); ?></td>
                    <td><?php echo date('M d, Y', strtotime($candidate['submitted_at'])); ?></td>
                    <td>
                        <span class="status-badge status-<?php echo strtolower(str_replace(' ', '-', $candidate['status'])); ?>">
                            <?php echo $candidate['status']; ?>
                        </span>
                    </td>
                    <td class="actions-cell">
                        <!-- View Resume -->
                        <a href="<?php echo htmlspecialchars(str_replace('../', '', $candidate['resume_path'])); ?>" 
                           target="_blank" class="btn btn-small btn-secondary">
                            <i class="fas fa-file"></i> View Resume
                        </a>
                        
                        <!-- Update Status -->
                        <form method="POST" action="" class="inline-form status-form">
                            <input type="hidden" name="candidate_id" value="<?php echo $candidate['id']; ?>">
                            <input type="hidden" name="update_status" value="1">
                            <select name="new_status" class="status-select">
                                <option value="">Change Status</option>
                                <option value="New" <?php echo $candidate['status'] === 'New' ? 'disabled' : ''; ?>>New</option>
                                <option value="Under Review" <?php echo $candidate['status'] === 'Under Review' ? 'disabled' : ''; ?>>Under Review</option>
                                <option value="Shortlisted" <?php echo $candidate['status'] === 'Shortlisted' ? 'disabled' : ''; ?>>Shortlisted</option>
                                <option value="Interviewed" <?php echo $candidate['status'] === 'Interviewed' ? 'disabled' : ''; ?>>Interviewed</option>
                                <option value="Offered" <?php echo $candidate['status'] === 'Offered' ? 'disabled' : ''; ?>>Offered</option>
                                <option value="Hired" <?php echo $candidate['status'] === 'Hired' ? 'disabled' : ''; ?>>Hired</option>
                                <option value="Rejected" <?php echo $candidate['status'] === 'Rejected' ? 'disabled' : ''; ?>>Rejected</option>
                            </select>
                            <button type="submit" class="btn btn-small btn-primary">Update</button>
                        </form>
                        
                        <!-- Send Rejection (only if not already rejected) -->
                        <?php if ($candidate['status'] !== 'Rejected'): ?>
                        <form method="POST" action="" class="inline-form rejection-form"
                              onsubmit="return confirm('Are you sure you want to send a rejection email to this candidate?');">
                            <input type="hidden" name="candidate_id" value="<?php echo $candidate['id']; ?>">
                            <input type="hidden" name="send_rejection" value="1">
                            <button type="submit" class="btn btn-small btn-danger">
                                <i class="fas fa-times"></i> Reject
                            </button>
                        </form>
                        <?php endif; ?>
                        
                        <!-- View Full Details (modal trigger) -->
                        <button class="btn btn-small btn-info view-details-btn" 
                                data-candidate-id="<?php echo $candidate['id']; ?>">
                            <i class="fas fa-eye"></i> Details
                        </button>
                    </td>
                </tr>
                <?php endforeach; ?>
            <?php else: ?>
                <tr>
                    <td colspan="8" class="no-results">No candidates found matching your criteria.</td>
                </tr>
            <?php endif; ?>
        </tbody>
    </table>
</div>

<!-- Candidate Details Modal -->
<div id="candidate-details-modal" class="modal">
    <div class="modal-content">
        <span class="modal-close">&times;</span>
        <h2>Candidate Details</h2>
        <div id="modal-content">
            <!-- Content loaded via AJAX -->
            <div class="loading">Loading...</div>
        </div>
    </div>
</div>

<script>
    // Handle status form submission
    document.querySelectorAll('.status-select').forEach(select => {
        select.addEventListener('change', function() {
            if (this.value) {
                this.closest('form').querySelector('button[type="submit"]').style.display = 'inline-block';
            } else {
                this.closest('form').querySelector('button[type="submit"]').style.display = 'none';
            }
        });
    });
    
    // Hide update buttons initially
    document.querySelectorAll('.status-form button[type="submit"]').forEach(btn => {
        btn.style.display = 'none';
    });
    
    // Modal functionality
    const modal = document.getElementById('candidate-details-modal');
    const modalContent = document.getElementById('modal-content');
    const closeBtn = document.querySelector('.modal-close');
    
    // Open modal with candidate details
    document.querySelectorAll('.view-details-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const candidateId = this.getAttribute('data-candidate-id');
            modalContent.innerHTML = '<div class="loading">Loading...</div>';
            modal.style.display = 'block';
            
            // Fetch candidate details via AJAX
            fetch('admin-candidate-details.php?id=' + candidateId)
                .then(response => response.text())
                .then(data => {
                    modalContent.innerHTML = data;
                })
                .catch(error => {
                    modalContent.innerHTML = '<div class="error">Error loading candidate details.</div>';
                });
        });
    });
    
    // Close modal
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
</script>

<!-- Custom styles for this page -->
<style>
    /* Candidate Management Styles */
    .data-table {
        width: 100%;
        border-collapse: collapse;
    }
    
    .data-table th,
    .data-table td {
        padding: 12px 15px;
        border-bottom: 1px solid #e9ecef;
    }
    
    .data-table th {
        background-color: var(--primary-color);
        color: white;
        text-align: left;
        font-weight: 600;
    }
    
    .data-table tr:nth-child(even) {
        background-color: #f8f9fa;
    }
    
    .data-table tr:hover {
        background-color: #e9ecef;
    }
    
    /* Status Badges */
    .status-badge {
        display: inline-block;
        padding: 5px 10px;
        border-radius: 3px;
        font-size: 0.85rem;
        font-weight: 600;
    }
    
    .status-new {
        background-color: #cfe2ff;
        color: #084298;
    }
    
    .status-under-review {
        background-color: #fff3cd;
        color: #856404;
    }
    
    .status-shortlisted {
        background-color: #d1e7dd;
        color: #0f5132;
    }
    
    .status-interviewed {
        background-color: #f8d7da;
        color: #842029;
    }
    
    .status-offered {
        background-color: #d1e7dd;
        color: #0f5132;
    }
    
    .status-hired {
        background-color: #d1e7dd;
        color: #0f5132;
    }
    
    .status-rejected {
        background-color: #f8d7da;
        color: #842029;
    }
    
    /* Filter Panel */
    .filter-panel {
        background-color: #f8f9fa;
        border-radius: 8px;
        padding: 15px;
        margin-bottom: 20px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }
    
    .filter-row {
        display: flex;
        flex-wrap: wrap;
        gap: 15px;
        align-items: flex-end;
    }
    
    .filter-group {
        flex: 1;
        min-width: 150px;
        margin-bottom: 10px;
    }
    
    .search-group {
        flex: 2;
    }
    
    /* Modal Styles */
    .modal {
        display: none;
        position: fixed;
        z-index: 1000;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,0.5);
        overflow: auto;
    }
    
    .modal-content {
        background-color: white;
        margin: 5% auto;
        padding: 20px;
        border-radius: 8px;
        width: 80%;
        max-width: 800px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        position: relative;
    }
    
    .modal-close {
        position: absolute;
        top: 10px;
        right: 15px;
        font-size: 24px;
        font-weight: bold;
        color: #aaa;
        cursor: pointer;
    }
    
    .modal-close:hover {
        color: #000;
    }
    
    .loading {
        text-align: center;
        padding: 20px;
        color: #6c757d;
    }
    
    /* Action Buttons */
    .actions-cell {
        display: flex;
        flex-wrap: wrap;
        gap: 5px;
        min-width: 300px;
    }
    
    /* No Results */
    .no-results {
        text-align: center;
        color: #6c757d;
        padding: 20px;
    }
    
    /* Inline Forms */
    .inline-form {
        display: inline-block;
    }
    
    .status-form {
        display: flex;
        align-items: center;
        gap: 5px;
    }
    
    .status-select {
        padding: 5px 8px;
        border-radius: 4px;
        border: 1px solid #ced4da;
    }
</style>

<?php
// Include admin footer
include('admin-footer.php');
?><?php
/**
 * Admin Candidates Panel
 * 
 * Handles viewing and managing job applicants:
 * - Display candidate list with filtering
 * - Update application status
 * - View resume files
 * - (Future) Send rejection emails
 */

// Include authentication
require_once 'admin-auth.php';

// Set page title for header
$page_title = "Candidate Management";

// Set breadcrumbs
$breadcrumbs = [
    [
        'title' => 'Candidates',
        'active' => true
    ]
];

// Process status update if submitted
if (isset($_POST['update_status']) && isset($_POST['candidate_id']) && isset($_POST['new_status'])) {
    $candidate_id = intval($_POST['candidate_id']);
    $new_status = $_POST['new_status'];
    
    // Validate status
    $valid_statuses = ['New', 'Under Review', 'Shortlisted', 'Interviewed', 'Offered', 'Hired', 'Rejected'];
    if (in_array($new_status, $valid_statuses)) {
        try {
            $db = get_db_connection();
            $stmt = $db->prepare("UPDATE candidates SET status = :status WHERE id = :id");
            $stmt->execute([':status' => $new_status, ':id' => $candidate_id]);
            
            $_SESSION['admin_message'] = [
                'type' => 'success',
                'text' => "Status updated successfully!"
            ];
        } catch (Exception $e) {
            $_SESSION['admin_message'] = [
                'type' => 'error',
                'text' => "Error updating status: " . $e->getMessage()
            ];
        }
        
        // Redirect to refresh page and prevent form resubmission
        header('Location: ' . $_SERVER['PHP_SELF'] . (!empty($_SERVER['QUERY_STRING']) ? '?' . $_SERVER['QUERY_STRING'] : ''));
        exit;
    }
}

// Process sending rejection email if requested
if (isset($_POST['send_rejection']) && isset($_POST['candidate_id'])) {
    $candidate_id = intval($_POST['candidate_id']);
    
    // Get candidate info
    try {
        $db = get_db_connection();
        $stmt = $db->prepare("SELECT * FROM candidates WHERE id = :id");
        $stmt->execute([':id' => $candidate_id]);
        $candidate = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($candidate) {
            // Send rejection email
            $to = $candidate['email'];
            $subject = "Your application with Backsure Global Support";
            
            $message = "Dear " . $candidate['name'] . ",\n\n";
            $message .= "Thank you for your interest in joining Backsure Global Support. ";
            $message .= "After careful consideration, we regret to inform you that we have decided not to proceed with your application at this time.\n\n";
            $message .= "While we were impressed by your qualifications, we received a high volume of applications and had to make difficult choices. ";
            $message .= "Your application will be kept on file for future opportunities, and we encourage you to stay connected with Backsure Global Support.\n\n";
            $message .= "We appreciate your time and effort in applying and wish you the best in your job search.\n\n";
            $message .= "Sincerely,\n";
            $message .= "Backsure Global Support Talent Acquisition Team";
            
            $headers = "From: Backsure Global Support <hr@backsureglobalsupport.com>\r\n";
            
            // Send email
            if (mail($to, $subject, $message, $headers)) {
                // Update status
                $stmt = $db->prepare("UPDATE candidates SET status = 'Rejected' WHERE id = :id");
                $stmt->execute([':id' => $candidate_id]);
                
                $_SESSION['admin_message'] = [
                    'type' => 'success',
                    'text' => "Rejection email sent successfully and status updated."
                ];
            } else {
                $_SESSION['admin_message'] = [
                    'type' => 'error',
                    'text' => "Error sending rejection email."
                ];
            }
            
            // Redirect to refresh page and prevent form resubmission
            header('Location: ' . $_SERVER['PHP_SELF'] . (!empty($_SERVER['QUERY_STRING']) ? '?' . $_SERVER['QUERY_STRING'] : ''));
            exit;
        }
    } catch (Exception $e) {
        $_SESSION['admin_message'] = [
            'type' => 'error',
            'text' => "Error processing rejection: " . $e->getMessage()
        ];
        
        // Redirect to refresh page and prevent form resubmission
        header('Location: ' . $_SERVER['PHP_SELF'] . (!empty($_SERVER['QUERY_STRING']) ? '?' . $_SERVER['QUERY_STRING'] : ''));
        exit;
    }
}

// Prepare filters
$status_filter = isset($_GET['status']) ? $_GET['status'] : '';
$position_filter = isset($_GET['position']) ? $_GET['position'] : '';
$date_from = isset($_GET['date_from']) ? $_GET['date_from'] : '';
$date_to = isset($_GET['date_to']) ? $_GET['date_to'] : '';
$search = isset($_GET['search']) ? $_GET['search'] : '';

// Build query with filters
$query = "SELECT * FROM candidates WHERE 1=1";
$params = [];

if (!empty($status_filter)) {
    $query .= " AND status = :status";
    $params[':status'] = $status_filter;
}

if (!empty($position_filter)) {
    $query .= " AND position = :position";
    $params[':position'] = $position_filter;
}

if (!empty($date_from)) {
    $query .= " AND submitted_at >= :date_from";
    $params[':date_from'] = $date_from . ' 00:00:00';
}

if (!empty($date_to)) {
    $query .= " AND submitted_at <= :date_to";
    $params[':date_to'] = $date_to . ' 23:59:59';
}

if (!empty($search)) {
    $query .= " AND (name LIKE :search OR email LIKE :search OR phone LIKE :search)";
    $params[':search'] = "%{$search}%";
}

// Default sorting
$query .= " ORDER BY submitted_at DESC";

// Get database connection
$db = get_db_connection();

// Get all unique positions for filter dropdown
$stmt_positions = $db->query("SELECT DISTINCT position FROM candidates ORDER BY position");
$positions = $stmt_positions->fetchAll(PDO::FETCH_COLUMN);

// Execute the main query
$stmt = $db->prepare($query);
$stmt->execute($params);
$candidates = $stmt->fetchAll(PDO::FETCH_ASSOC);

// HTML header
$page_title = "Candidate Management | BSG Admin";
include('admin-header.php'); // Adjust path as needed
?>

<div class="admin-container">
    <h1>Candidate Management</h1>
    
    <?php if (isset($status_message)): ?>
    <div class="alert alert-<?php echo $status_type; ?>">
        <?php echo $status_message; ?>
    </div>
    <?php endif; ?>
    
    <!-- Filters -->
    <div class="filter-panel">
        <form method="GET" action="" class="filter-form">
            <div class="filter-row">
                <div class="filter-group">
                    <label for="status">Status:</label>
                    <select name="status" id="status">
                        <option value="">All Statuses</option>
                        <option value="New" <?php echo $status_filter === 'New' ? 'selected' : ''; ?>>New</option>
                        <option value="Under Review" <?php echo $status_filter === 'Under Review' ? 'selected' : ''; ?>>Under Review</option>
                        <option value="Shortlisted" <?php echo $status_filter === 'Shortlisted' ? 'selected' : ''; ?>>Shortlisted</option>
                        <option value="Interviewed" <?php echo $status_filter === 'Interviewed' ? 'selected' : ''; ?>>Interviewed</option>
                        <option value="Offered" <?php echo $status_filter === 'Offered' ? 'selected' : ''; ?>>Offered</option>
                        <option value="Hired" <?php echo $status_filter === 'Hired' ? 'selected' : ''; ?>>Hired</option>
                        <option value="Rejected" <?php echo $status_filter === 'Rejected' ? 'selected' : ''; ?>>Rejected</option>
                    </select>
                </div>
                
                <div class="filter-group">
                    <label for="position">Position:</label>
                    <select name="position" id="position">
                        <option value="">All Positions</option>
                        <?php foreach ($positions as $position): ?>
                        <option value="<?php echo htmlspecialchars($position); ?>" <?php echo $position_filter === $position ? 'selected' : ''; ?>>
                            <?php echo htmlspecialchars($position); ?>
                        </option>
                        <?php endforeach; ?>
                    </select>
                </div>
                
                <div class="filter-group">
                    <label for="date_from">Date From:</label>
                    <input type="date" name="date_from" id="date_from" value="<?php echo $date_from; ?>">
                </div>
                
                <div class="filter-group">
                    <label for="date_to">Date To:</label>
                    <input type="date" name="date_to" id="date_to" value="<?php echo $date_to; ?>">
                </div>
                
                <div class="filter-group search-group">
                    <label for="search">Search:</label>
                    <input type="text" name="search" id="search" placeholder="Name, Email, Phone" value="<?php echo htmlspecialchars($search); ?>">
                </div>
                
                <div class="filter-actions">
                    <button type="submit" class="btn btn-primary">Apply Filters</button>
                    <a href="admin-candidates.php" class="btn btn-secondary">Reset</a>
                </div>
            </div>
        </form>
    </div>
    
    <!-- Candidates Table -->
    <div class="table-responsive">
        <table class="data-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Position</th>
                    <th>Date Applied</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <?php if (count($candidates) > 0): ?>
                    <?php foreach ($candidates as $candidate): ?>
                    <tr>
                        <td><?php echo $candidate['id']; ?></td>
                        <td><?php echo htmlspecialchars($candidate['name']); ?></td>
                        <td>
                            <a href="mailto:<?php echo htmlspecialchars($candidate['email']); ?>">
                                <?php echo htmlspecialchars($candidate['email']); ?>
                            </a>
                        </td>
                        <td><?php echo htmlspecialchars($candidate['phone']); ?></td>
                        <td><?php echo htmlspecialchars($candidate['position']); ?></td>
                        <td><?php echo date('M d, Y', strtotime($candidate['submitted_at'])); ?></td>
                        <td>
                            <span class="status-badge status-<?php echo strtolower(str_replace(' ', '-', $candidate['status'])); ?>">
                                <?php echo $candidate['status']; ?>
                            </span>
                        </td>
                        <td class="actions-cell">
                            <!-- View Resume -->
                            <a href="<?php echo htmlspecialchars(str_replace('../', '', $candidate['resume_path'])); ?>" 
                               target="_blank" class="btn btn-small btn-secondary">
                                <i class="fas fa-file"></i> View Resume
                            </a>
                            
                            <!-- Update Status -->
                            <form method="POST" action="" class="inline-form status-form">
                                <input type="hidden" name="candidate_id" value="<?php echo $candidate['id']; ?>">
                                <input type="hidden" name="update_status" value="1">
                                <select name="new_status" class="status-select">
                                    <option value="">Change Status</option>
                                    <option value="New" <?php echo $candidate['status'] === 'New' ? 'disabled' : ''; ?>>New</option>
                                    <option value="Under Review" <?php echo $candidate['status'] === 'Under Review' ? 'disabled' : ''; ?>>Under Review</option>
                                    <option value="Shortlisted" <?php echo $candidate['status'] === 'Shortlisted' ? 'disabled' : ''; ?>>Shortlisted</option>
                                    <option value="Interviewed" <?php echo $candidate['status'] === 'Interviewed' ? 'disabled' : ''; ?>>Interviewed</option>
                                    <option value="Offered" <?php echo $candidate['status'] === 'Offered' ? 'disabled' : ''; ?>>Offered</option>
                                    <option value="Hired" <?php echo $candidate['status'] === 'Hired' ? 'disabled' : ''; ?>>Hired</option>
                                    <option value="Rejected" <?php echo $candidate['status'] === 'Rejected' ? 'disabled' : ''; ?>>Rejected</option>
                                </select>
                                <button type="submit" class="btn btn-small btn-primary">Update</button>
                            </form>
                            
                            <!-- Send Rejection (only if not already rejected) -->
                            <?php if ($candidate['status'] !== 'Rejected'): ?>
                            <form method="POST" action="" class="inline-form rejection-form"
                                  onsubmit="return confirm('Are you sure you want to send a rejection email to this candidate?');">
                                <input type="hidden" name="candidate_id" value="<?php echo $candidate['id']; ?>">
                                <input type="hidden" name="send_rejection" value="1">
                                <button type="submit" class="btn btn-small btn-danger">
                                    <i class="fas fa-times"></i> Reject
                                </button>
                            </form>
                            <?php endif; ?>
                            
                            <!-- View Full Details (modal trigger) -->
                            <button class="btn btn-small btn-info view-details-btn" 
                                    data-candidate-id="<?php echo $candidate['id']; ?>">
                                <i class="fas fa-eye"></i> Details
                            </button>
                        </td>
                    </tr>
                    <?php endforeach; ?>
                <?php else: ?>
                    <tr>
                        <td colspan="8" class="no-results">No candidates found matching your criteria.</td>
                    </tr>
                <?php endif; ?>
            </tbody>
        </table>
    </div>
    
    <!-- Candidate Details Modal -->
    <div id="candidate-details-modal" class="modal">
        <div class="modal-content">
            <span class="modal-close">&times;</span>
            <h2>Candidate Details</h2>
            <div id="modal-content">
                <!-- Content loaded via AJAX -->
                <div class="loading">Loading...</div>
            </div>
        </div>
    </div>
</div>

<script>
    // Handle status form submission
    document.querySelectorAll('.status-select').forEach(select => {
        select.addEventListener('change', function() {
            if (this.value) {
                this.closest('form').querySelector('button[type="submit"]').style.display = 'inline-block';
            } else {
                this.closest('form').querySelector('button[type="submit"]').style.display = 'none';
            }
        });
    });
    
    // Hide update buttons initially
    document.querySelectorAll('.status-form button[type="submit"]').forEach(btn => {
        btn.style.display = 'none';
    });
    
    // Modal functionality
    const modal = document.getElementById('candidate-details-modal');
    const modalContent = document.getElementById('modal-content');
    const closeBtn = document.querySelector('.modal-close');
    
    // Open modal with candidate details
    document.querySelectorAll('.view-details-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const candidateId = this.getAttribute('data-candidate-id');
            modalContent.innerHTML = '<div class="loading">Loading...</div>';
            modal.style.display = 'block';
            
            // Fetch candidate details via AJAX
            fetch('admin-candidate-details.php?id=' + candidateId)
                .then(response => response.text())
                .then(data => {
                    modalContent.innerHTML = data;
                })
                .catch(error => {
                    modalContent.innerHTML = '<div class="error">Error loading candidate details.</div>';
                });
        });
    });
    
    // Close modal
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
</script>

<style>
    /* Candidate Management Styles */
    .admin-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 20px;
    }
    
    h1 {
        color: #062767;
        margin-bottom: 20px;
    }
    
    /* Alert Messages */
    .alert {
        padding: 12px 15px;
        border-radius: 5px;
        margin-bottom: 20px;
    }
    
    .alert-success {
        background-color: #d4edda;
        color: #155724;
        border: 1px solid #c3e6cb;
    }
    
    .alert-error {
        background-color: #f8d7da;
        color: #721c24;
        border: 1px solid #f5c6cb;
    }
    
    /* Filter Panel */
    .filter-panel {
        background-color: #f8f9fa;
        border-radius: 8px;
        padding: 15px;
        margin-bottom: 20px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }
    
    .filter-form {
        display: flex;
        flex-direction: column;
    }
    
    .filter-row {
        display: flex;
        flex-wrap: wrap;
        gap: 15px;
        align-items: flex-end;
    }
    
    .filter-group {
        flex: 1;
        min-width: 150px;
        margin-bottom: 10px;
    }
    
    .filter-group label {
        display: block;
        margin-bottom: 5px;
        font-weight: 600;
        color: #062767;
    }
    
    .filter-group select,
    .filter-group input {
        width: 100%;
        padding: 8px 10px;
        border: 1px solid #ced4da;
        border-radius: 4px;
    }
    
    .search-group {
        flex: 2;
    }
    
    .filter-actions {
        display: flex;
        gap: 10px;
        margin-top: 10px;
    }
    
    /* Table Styles */
    .table-responsive {
        overflow-x: auto;
    }
    
    .data-table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 20px;
    }
    
    .data-table th,
    .data-table td {
        padding: 12px 15px;
        border-bottom: 1px solid #e9ecef;
    }
    
    .data-table th {
        background-color: #062767;
        color: white;
        text-align: left;
        font-weight: 600;
    }
    
    .data-table tr:nth-child(even) {
        background-color: #f8f9fa;
    }
    
    .data-table tr:hover {
        background-color: #e9ecef;
    }
    
    /* Status Badges */
    .status-badge {
        display: inline-block;
        padding: 5px 10px;
        border-radius: 3px;
        font-size: 0.85rem;
        font-weight: 600;
    }
    
    .status-new {
        background-color: #cfe2ff;
        color: #084298;
    }
    
    .status-under-review {
        background-color: #fff3cd;
        color: #856404;
    }
    
    .status-shortlisted {
        background-color: #d1e7dd;
        color: #0f5132;
    }
    
    .status-interviewed {
        background-color: #f8d7da;
        color: #842029;
    }
    
    .status-offered {
        background-color: #d1e7dd;
        color: #0f5132;
    }
    
    .status-hired {
        background-color: #d1e7dd;
        color: #0f5132;
    }
    
    .status-rejected {
        background-color: #f8d7da;
        color: #842029;
    }
    
    /* Action Buttons */
    .actions-cell {
        display: flex;
        flex-wrap: wrap;
        gap: 5px;
        min-width: 300px;
    }
    
    .btn {
        display: inline-block;
        padding: 8px 12px;
        border-radius: 4px;
        border: none;
        cursor: pointer;
        font-weight: 600;
        text-decoration: none;
        text-align: center;
        white-space: nowrap;
    }
    
    .btn-small {
        padding: 5px 10px;
        font-size: 0.85rem;
    }
    
    .btn-primary {
        background-color: #062767;
        color: white;
    }
    
    .btn-primary:hover {
        background-color: #051d4d;
    }
    
    .btn-secondary {
        background-color: #6c757d;
        color: white;
    }
    
    .btn-secondary:hover {
        background-color: #5a6268;
    }
    
    .btn-danger {
        background-color: #dc3545;
        color: white;
    }
    
    .btn-danger:hover {
        background-color: #bb2d3b;
    }
    
    .btn-info {
        background-color: #0dcaf0;
        color: white;
    }
    
    .btn-info:hover {
        background-color: #31d2f2;
    }
    
    /* Inline Forms */
    .inline-form {
        display: inline-block;
    }
    
    .status-form {
        display: flex;
        align-items: center;
        gap: 5px;
    }
    
    .status-select {
        padding: 5px 8px;
        border-radius: 4px;
        border: 1px solid #ced4da;
    }
    
    /* No Results */
    .no-results {
        text-align: center;
        color: #6c757d;
        padding: 20px;
    }
    
    /* Modal Styles */
    .modal {
        display: none;
        position: fixed;
        z-index: 1000;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,0.5);
        overflow: auto;
    }
    
    .modal-content {
        background-color: white;
        margin: 5% auto;
        padding: 20px;
        border-radius: 8px;
        width: 80%;
        max-width: 800px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        position: relative;
    }
    
    .modal-close {
        position: absolute;
        top: 10px;
        right: 15px;
        font-size: 24px;
        font-weight: bold;
        color: #aaa;
        cursor: pointer;
    }
    
    .modal-close:hover {
        color: #000;
    }
    
    .loading {
        text-align: center;
        padding: 20px;
        color: #6c757d;
    }
    
    /* Responsive Adjustments */
    @media (max-width: 768px) {
        .filter-group {
            min-width: 100%;
        }
        
        .actions-cell {
            flex-direction: column;
            gap: 5px;
        }
    }
</style>

<?php
// Include footer
include('admin-footer.php'); // Adjust path as needed
?>