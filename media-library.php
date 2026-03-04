<?php
/**
 * Media Library
 * File upload and media management system
 */

// Define constants for this page
define('ADMIN_PANEL', true);
$page_title = 'Media Library';
$current_page = 'media_library';

// Authentication and permissions
require_once 'admin-auth.php';
require_admin_auth();

// Include notifications system
require_once 'admin-notifications.php';

// Include settings functions
require_once 'settings-functions.php';

// Track page view for analytics
require_once 'admin-analytics.php';
log_page_view(basename($_SERVER['PHP_SELF']));

// Define media upload directory
define('MEDIA_DIR', UPLOAD_DIR . 'media/');
define('MEDIA_URL', UPLOAD_URL . 'media/');

// Create media directory if it doesn't exist
if (!is_dir(MEDIA_DIR)) {
    mkdir(MEDIA_DIR, 0755, true);
}

// Get admin info
$admin_user = get_admin_user();
$admin_username = $admin_user['username'];
$admin_role = $admin_user['role'];

// Ensure CSRF token exists for delete forms
if (!isset($_SESSION['csrf_token'])) {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}

// Handle file deletion - requires POST + CSRF token
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'delete' && isset($_POST['file'])) {
    // Verify CSRF token
    if (!isset($_POST['csrf_token']) || !isset($_SESSION['csrf_token']) || $_POST['csrf_token'] !== $_SESSION['csrf_token']) {
        set_error_message("Invalid security token. Please try again.");
        header('Location: ' . $_SERVER['PHP_SELF'] . (isset($_GET['target']) ? '?target=' . $_GET['target'] : ''));
        exit;
    }
    
    $file = base64_decode($_POST['file']);
    $file_path = MEDIA_DIR . basename($file);
    
    // Security check - ensure file is within media directory
    if (file_exists($file_path) && strpos(realpath($file_path), realpath(MEDIA_DIR)) === 0) {
        // Check if the file is used in any settings
        global $db;
        $file_name = basename($file);
        $stmt = $db->prepare("SELECT COUNT(*) as count FROM settings WHERE setting_value LIKE ?");
        $file_name_pattern = '%' . $file_name . '%';
        $stmt->bind_param("s", $file_name_pattern);
        $stmt->execute();
        $result = $stmt->get_result();
        $row = $result->fetch_assoc();
        
        if ($row['count'] > 0) {
            // File is in use
            set_error_message("File cannot be deleted because it is in use by {$row['count']} setting(s).");
        } else {
            // Safe to delete
            if (unlink($file_path)) {
                set_success_message("File deleted successfully.");
                
                // Log the activity
                log_admin_activity('file_deleted', 'media', null, "Deleted file: $file_name");
            } else {
                set_error_message("Failed to delete file. Please check permissions.");
            }
        }
    } else {
        set_error_message("Invalid file specified.");
    }
    
    // Redirect to clear the action from URL
    header('Location: ' . $_SERVER['PHP_SELF'] . (isset($_POST['target']) ? '?target=' . urlencode($_POST['target']) : ''));
    exit;
}

// Process file upload
$upload_success = false;
$uploaded_file = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['media_file']) && $_FILES['media_file']['error'] === UPLOAD_ERR_OK) {
    $file = $_FILES['media_file'];
    
    // Check file size (5MB max by default)
    $max_size = 5 * 1024 * 1024; // 5MB
    if ($file['size'] > $max_size) {
        set_error_message("File is too large. Maximum size is 5MB.");
    } else {
        // Check file type
        $allowed_types = [
            'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml',
            'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'text/plain', 'application/zip', 'application/x-zip-compressed'
        ];
        
        $finfo = new finfo(FILEINFO_MIME_TYPE);
        $file_type = $finfo->file($file['tmp_name']);
        
        if (!in_array($file_type, $allowed_types)) {
            set_error_message("File type not allowed. Allowed types: JPG, PNG, GIF, WEBP, SVG, PDF, DOC, DOCX, TXT, ZIP");
        } else {
            // Sanitize filename
            $original_name = pathinfo($file['name'], PATHINFO_FILENAME);
            $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
            
            // Clean filename
            $clean_name = preg_replace('/[^a-zA-Z0-9_-]/', '', $original_name);
            if (empty($clean_name)) {
                $clean_name = 'file';
            }
            
            // Generate unique filename
            $filename = $clean_name . '_' . time() . '.' . $extension;
            $destination = MEDIA_DIR . $filename;
            
            // Move uploaded file
            if (move_uploaded_file($file['tmp_name'], $destination)) {
                set_success_message("File uploaded successfully.");
                $upload_success = true;
                $uploaded_file = 'media/' . $filename;
                
                // Log the activity
                log_admin_activity('file_uploaded', 'media', null, "Uploaded file: $filename");
                
                // If this is a modal upload (has target field), return the file info for the parent window
                if (isset($_GET['target']) && !empty($_GET['target'])) {
                    $target_field = $_GET['target'];
                    $file_url = MEDIA_URL . $filename;
                    $file_path = 'media/' . $filename;
                    
                    // Instead of immediate redirect, we'll set a flag to show success and allow selection
                }
            } else {
                set_error_message("Failed to move uploaded file. Please check directory permissions.");
            }
        }
    }
}

// Get file type filter
$type_filter = isset($_GET['type']) ? $_GET['type'] : 'all';

// Get search query
$search_query = isset($_GET['search']) ? $_GET['search'] : '';

// Get all files from the media directory
$files = [];
if (is_dir(MEDIA_DIR) && $handle = opendir(MEDIA_DIR)) {
    while (false !== ($entry = readdir($handle))) {
        if ($entry != "." && $entry != "..") {
            $file_path = MEDIA_DIR . $entry;
            
            // Skip if it's a directory
            if (is_dir($file_path)) {
                continue;
            }
            
            // Get file information
            $file_info = [
                'name' => $entry,
                'path' => 'media/' . $entry,
                'url' => MEDIA_URL . $entry,
                'size' => filesize($file_path),
                'modified' => filemtime($file_path),
                'type' => mime_content_type($file_path)
            ];
            
            // Apply type filter
            if ($type_filter !== 'all') {
                if ($type_filter === 'image' && !strstr($file_info['type'], 'image/')) {
                    continue;
                } elseif ($type_filter === 'document' && strstr($file_info['type'], 'image/')) {
                    continue;
                }
            }
            
            // Apply search filter
            if (!empty($search_query) && stripos($file_info['name'], $search_query) === false) {
                continue;
            }
            
            $files[] = $file_info;
        }
    }
    closedir($handle);
}

// Sort files by modified date (newest first)
usort($files, function($a, $b) {
    return $b['modified'] - $a['modified'];
});

// Format file size for display
function format_file_size($size) {
    $units = ['B', 'KB', 'MB', 'GB', 'TB'];
    $i = 0;
    while ($size >= 1024 && $i < count($units) - 1) {
        $size /= 1024;
        $i++;
    }
    return round($size, 2) . ' ' . $units[$i];
}

// Is this being loaded in a modal/popup?
$is_modal = isset($_GET['target']) && !empty($_GET['target']);

// Page variables
$breadcrumbs = [
    ['title' => 'Dashboard', 'url' => 'admin-dashboard.php'],
    ['title' => 'Media Library', 'url' => '#']
];

// If it's a modal, use a minimal layout
if ($is_modal) {
    // Simplified header for modal view
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Media Library</title>
    <link rel="stylesheet" href="assets/css/bootstrap.min.css">
    <link rel="stylesheet" href="assets/css/admin-core.css">
    <link rel="stylesheet" href="assets/fonts/fontawesome/css/all.min.css">
    <style>
        body {
            padding: 15px;
            background-color: #f8f9fc;
        }
        .file-item {
            cursor: pointer;
            transition: all 0.2s ease;
            border: 2px solid transparent;
        }
        .file-item:hover {
            background-color: #f0f0f0;
        }
        .file-item.selected {
            border-color: #4e73df;
            background-color: rgba(78, 115, 223, 0.1);
        }
        .file-thumb {
            height: 120px;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
        }
        .file-thumb img {
            max-height: 100%;
            max-width: 100%;
            object-fit: contain;
        }
        .file-icon {
            font-size: 48px;
            color: #5a5c69;
        }
        .file-name {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .modal-actions {
            position: sticky;
            bottom: 0;
            background-color: #fff;
            padding: 10px 0;
            border-top: 1px solid #e3e6f0;
            margin: 0 -15px -15px -15px;
            padding: 15px;
        }
    </style>
</head>
<body>
    <div class="container-fluid p-0">
        <h4 class="mb-3">Select Media</h4>
        
        <?php display_notifications(); ?>
        
        <div class="row mb-3">
            <div class="col-md-8">
                <form action="<?php echo $_SERVER['PHP_SELF']; ?>?target=<?php echo $_GET['target']; ?><?php echo $type_filter !== 'all' ? '&type=' . $type_filter : ''; ?>" method="get" class="d-flex">
                    <input type="hidden" name="target" value="<?php echo $_GET['target']; ?>">
                    <?php if ($type_filter !== 'all'): ?>
                    <input type="hidden" name="type" value="<?php echo $type_filter; ?>">
                    <?php endif; ?>
                    <input type="text" name="search" class="form-control" placeholder="Search files..." value="<?php echo htmlspecialchars($search_query); ?>">
                    <button type="submit" class="btn btn-primary ms-2">
                        <i class="fas fa-search"></i>
                    </button>
                </form>
            </div>
            <div class="col-md-4">
                <div class="d-flex justify-content-end">
                    <div class="btn-group">
                        <a href="<?php echo $_SERVER['PHP_SELF']; ?>?target=<?php echo $_GET['target']; ?>&type=all<?php echo !empty($search_query) ? '&search=' . urlencode($search_query) : ''; ?>" class="btn btn-outline-secondary <?php echo $type_filter === 'all' ? 'active' : ''; ?>">
                            All
                        </a>
                        <a href="<?php echo $_SERVER['PHP_SELF']; ?>?target=<?php echo $_GET['target']; ?>&type=image<?php echo !empty($search_query) ? '&search=' . urlencode($search_query) : ''; ?>" class="btn btn-outline-secondary <?php echo $type_filter === 'image' ? 'active' : ''; ?>">
                            Images
                        </a>
                        <a href="<?php echo $_SERVER['PHP_SELF']; ?>?target=<?php echo $_GET['target']; ?>&type=document<?php echo !empty($search_query) ? '&search=' . urlencode($search_query) : ''; ?>" class="btn btn-outline-secondary <?php echo $type_filter === 'document' ? 'active' : ''; ?>">
                            Documents
                        </a>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="mb-3">
            <form action="<?php echo $_SERVER['PHP_SELF']; ?>?target=<?php echo $_GET['target']; ?><?php echo $type_filter !== 'all' ? '&type=' . $type_filter : ''; ?>" method="post" enctype="multipart/form-data" class="dropzone-form p-3 border rounded bg-white">
                <div class="text-center mb-3">
                    <i class="fas fa-cloud-upload-alt fa-3x text-primary mb-2"></i>
                    <p class="mb-2">Drag & drop files here or click to upload</p>
                    <p class="text-muted small">Max file size: 5MB. Allowed types: JPG, PNG, GIF, WEBP, SVG, PDF, DOC, DOCX, TXT, ZIP</p>
                </div>
                <div class="input-group">
                    <input type="file" name="media_file" class="form-control" id="media_file" accept=".jpg,.jpeg,.png,.gif,.webp,.svg,.pdf,.doc,.docx,.txt,.zip">
                    <button type="submit" class="btn btn-primary">Upload</button>
                </div>
            </form>
        </div>
        
        <?php if ($upload_success && isset($_GET['target'])): ?>
        <div class="alert alert-success alert-dismissible fade show" role="alert">
            <strong>Success!</strong> File uploaded successfully. Click on it below to select it.
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
        <?php endif; ?>
        
        <div class="row files-container">
            <?php if (empty($files)): ?>
            <div class="col-12">
                <div class="alert alert-info">
                    No files found. Upload some files to get started.
                </div>
            </div>
            <?php else: ?>
            <?php foreach ($files as $file): ?>
            <div class="col-md-3 col-sm-4 col-6 mb-4">
                <div class="file-item card h-100" data-path="<?php echo $file['path']; ?>" data-url="<?php echo $file['url']; ?>" onclick="selectFile(this)">
                    <div class="card-body p-2">
                        <div class="file-thumb mb-2">
                            <?php if (strstr($file['type'], 'image/')): ?>
                            <img src="<?php echo $file['url']; ?>" alt="<?php echo $file['name']; ?>">
                            <?php else: ?>
                            <div class="file-icon">
                                <?php if (strstr($file['type'], 'pdf')): ?>
                                <i class="far fa-file-pdf"></i>
                                <?php elseif (strstr($file['type'], 'word') || strstr($file['type'], 'doc')): ?>
                                <i class="far fa-file-word"></i>
                                <?php elseif (strstr($file['type'], 'zip') || strstr($file['type'], 'compressed')): ?>
                                <i class="far fa-file-archive"></i>
                                <?php elseif (strstr($file['type'], 'text')): ?>
                                <i class="far fa-file-alt"></i>
                                <?php else: ?>
                                <i class="far fa-file"></i>
                                <?php endif; ?>
                            </div>
                            <?php endif; ?>
                        </div>
                        <div class="file-name small text-center">
                            <?php echo $file['name']; ?>
                        </div>
                        <div class="file-meta d-flex justify-content-between small text-muted mt-1">
                            <span><?php echo format_file_size($file['size']); ?></span>
                            <span title="<?php echo date('Y-m-d H:i:s', $file['modified']); ?>"><?php echo date('m/d/Y', $file['modified']); ?></span>
                        </div>
                    </div>
                </div>
            </div>
            <?php endforeach; ?>
            <?php endif; ?>
        </div>
        
        <div class="modal-actions">
            <div class="d-flex justify-content-between">
                <button type="button" class="btn btn-secondary" onclick="window.close()">Cancel</button>
                <button type="button" class="btn btn-primary" id="select-btn" onclick="useSelected()" disabled>Select File</button>
            </div>
        </div>
    </div>
    
    <script>
        let selectedFile = null;
        
        function selectFile(element) {
            // Remove selected class from all items
            const items = document.querySelectorAll('.file-item');
            items.forEach(item => item.classList.remove('selected'));
            
            // Add selected class to clicked item
            element.classList.add('selected');
            
            // Store selected file info
            selectedFile = {
                path: element.dataset.path,
                url: element.dataset.url
            };
            
            // Enable select button
            document.getElementById('select-btn').disabled = false;
        }
        
        function useSelected() {
            if (selectedFile) {
                // Pass the selected file info back to the opener window
                window.opener.setMediaFile(
                    '<?php echo $_GET['target']; ?>', 
                    selectedFile.path,
                    selectedFile.url
                );
                window.close();
            }
        }
    </script>
    
    <script src="assets/js/bootstrap.bundle.min.js"></script>
</body>
</html>
<?php
} else {
    // Regular admin panel layout
    include 'admin-head.php';
    include 'admin-sidebar.php';
    include 'admin-header.php';
?>

<main class="admin-main">
  <div class="admin-content container-fluid py-4">
    <div class="page-header d-flex justify-content-between align-items-center mb-4">
      <h1><?php echo $page_title; ?></h1>
      
      <div class="page-actions">
        <!-- No specific actions needed for media library -->
      </div>
    </div>
    
    <?php display_notifications(); ?>
    
    <div class="card shadow mb-4">
      <div class="card-header py-3">
        <h6 class="m-0 font-weight-bold text-primary">Media Files</h6>
      </div>
      <div class="card-body">
        <div class="row mb-4">
          <div class="col-md-8">
            <form action="<?php echo $_SERVER['PHP_SELF']; ?>" method="get" class="d-flex">
              <?php if ($type_filter !== 'all'): ?>
              <input type="hidden" name="type" value="<?php echo $type_filter; ?>">
              <?php endif; ?>
              <input type="text" name="search" class="form-control" placeholder="Search files..." value="<?php echo htmlspecialchars($search_query); ?>">
              <button type="submit" class="btn btn-primary ms-2">
                <i class="fas fa-search"></i>
              </button>
            </form>
          </div>
          <div class="col-md-4">
            <div class="d-flex justify-content-end">
              <div class="btn-group">
                <a href="<?php echo $_SERVER['PHP_SELF']; ?>?type=all<?php echo !empty($search_query) ? '&search=' . urlencode($search_query) : ''; ?>" class="btn btn-outline-secondary <?php echo $type_filter === 'all' ? 'active' : ''; ?>">
                  All
                </a>
                <a href="<?php echo $_SERVER['PHP_SELF']; ?>?type=image<?php echo !empty($search_query) ? '&search=' . urlencode($search_query) : ''; ?>" class="btn btn-outline-secondary <?php echo $type_filter === 'image' ? 'active' : ''; ?>">
                  Images
                </a>
                <a href="<?php echo $_SERVER['PHP_SELF']; ?>?type=document<?php echo !empty($search_query) ? '&search=' . urlencode($search_query) : ''; ?>" class="btn btn-outline-secondary <?php echo $type_filter === 'document' ? 'active' : ''; ?>">
                  Documents
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <div class="mb-4">
          <form action="<?php echo $_SERVER['PHP_SELF']; ?>" method="post" enctype="multipart/form-data" class="dropzone-form p-4 border rounded bg-light">
            <div class="text-center mb-3">
              <i class="fas fa-cloud-upload-alt fa-3x text-primary mb-2"></i>
              <p class="mb-2">Drag & drop files here or click to upload</p>
              <p class="text-muted small">Max file size: 5MB. Allowed types: JPG, PNG, GIF, WEBP, SVG, PDF, DOC, DOCX, TXT, ZIP</p>
            </div>
            <div class="input-group">
              <input type="file" name="media_file" class="form-control" id="media_file" accept=".jpg,.jpeg,.png,.gif,.webp,.svg,.pdf,.doc,.docx,.txt,.zip">
              <button type="submit" class="btn btn-primary">Upload</button>
            </div>
          </form>
        </div>
        
        <div class="table-responsive">
          <table class="table table-bordered table-hover">
            <thead>
              <tr>
                <th width="10%">Preview</th>
                <th>File Name</th>
                <th width="10%">Type</th>
                <th width="10%">Size</th>
                <th width="15%">Date</th>
                <th width="15%">Actions</th>
              </tr>
            </thead>
            <tbody>
              <?php if (empty($files)): ?>
              <tr>
                <td colspan="6" class="text-center">No files found. Upload some files to get started.</td>
              </tr>
              <?php else: ?>
              <?php foreach ($files as $file): ?>
              <tr>
                <td class="text-center">
                  <?php if (strstr($file['type'], 'image/')): ?>
                  <img src="<?php echo $file['url']; ?>" alt="<?php echo $file['name']; ?>" class="img-thumbnail" style="max-height: 50px;">
                  <?php else: ?>
                  <div class="file-icon">
                    <?php if (strstr($file['type'], 'pdf')): ?>
                    <i class="far fa-file-pdf fa-2x text-danger"></i>
                    <?php elseif (strstr($file['type'], 'word') || strstr($file['type'], 'doc')): ?>
                    <i class="far fa-file-word fa-2x text-primary"></i>
                    <?php elseif (strstr($file['type'], 'zip') || strstr($file['type'], 'compressed')): ?>
                    <i class="far fa-file-archive fa-2x text-warning"></i>
                    <?php elseif (strstr($file['type'], 'text')): ?>
                    <i class="far fa-file-alt fa-2x text-secondary"></i>
                    <?php else: ?>
                    <i class="far fa-file fa-2x text-secondary"></i>
                    <?php endif; ?>
                  </div>
                  <?php endif; ?>
                </td>
                <td><?php echo $file['name']; ?></td>
                <td><?php echo str_replace('application/', '', str_replace('image/', '', $file['type'])); ?></td>
                <td><?php echo format_file_size($file['size']); ?></td>
                <td><?php echo date('M j, Y g:i A', $file['modified']); ?></td>
                <td>
                  <div class="btn-group btn-group-sm">
                    <a href="<?php echo $file['url']; ?>" target="_blank" class="btn btn-outline-primary" title="View">
                      <i class="fas fa-eye"></i>
                    </a>
                    <form method="POST" action="<?php echo $_SERVER['PHP_SELF']; ?>" style="display:inline;" onsubmit="return confirm('Are you sure you want to delete this file?');">
                      <input type="hidden" name="action" value="delete">
                      <input type="hidden" name="file" value="<?php echo base64_encode($file['name']); ?>">
                      <input type="hidden" name="csrf_token" value="<?php echo isset($_SESSION['csrf_token']) ? $_SESSION['csrf_token'] : ''; ?>">
                      <button type="submit" class="btn btn-outline-danger btn-sm" title="Delete">
                        <i class="fas fa-trash"></i>
                      </button>
                    </form>
                    <button type="button" class="btn btn-outline-secondary" title="Copy URL" onclick="copyFileUrl('<?php echo $file['url']; ?>')">
                      <i class="fas fa-copy"></i>
                    </button>
                  </div>
                </td>
              </tr>
              <?php endforeach; ?>
              <?php endif; ?>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
  
  <?php include 'admin-footer.php'; ?>
</main>

<script>
function copyFileUrl(url) {
    // Create a temporary input element
    const tempInput = document.createElement('input');
    tempInput.value = url;
    document.body.appendChild(tempInput);
    
    // Select and copy the text
    tempInput.select();
    document.execCommand('copy');
    
    // Remove the temporary element
    document.body.removeChild(tempInput);
    
    // Show a notification
    alert('File URL copied to clipboard');
}
</script>

<?php
}
?>
