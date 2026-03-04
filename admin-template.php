<?php
/**
 * Admin Page Template
 * Template for creating or updating admin pages
 */

// Include authentication component
require_once 'admin-auth.php';

// Set required permissions for this page (optional)
// For pages that everyone with admin access can view, you can use just require_admin_auth()
// For pages with specific role requirements, use require_admin_role(['admin', 'superadmin'])
require_admin_role(['admin', 'superadmin', 'editor']); // Example roles

// Set page variables
$page_title = 'Page Title'; // Change to your page title
$current_page = 'page_identifier'; // Change to match sidebar navigation identifier (e.g., 'users', 'blog', etc.)

// Set breadcrumbs
$breadcrumbs = [
    ['title' => 'Dashboard', 'url' => 'admin-dashboard.php'],
    ['title' => 'Page Title', 'url' => '#'] // Change to your page title and URL
];

// Extra CSS/JS files needed for this page (optional)
$extra_css = [
    'assets/css/page-specific.css' // Add any page-specific CSS files
];
$extra_js = [
    'assets/js/page-specific.js' // Add any page-specific JS files
];

// Get admin info
$admin_user = get_admin_user();
$admin_username = $admin_user['username'];
$admin_role = $admin_user['role'];

// Process form submissions or other actions specific to this page
$message = '';
$messageType = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Handle form submissions
    if (isset($_POST['action'])) {
        switch ($_POST['action']) {
            case 'add':
                // Handle add action
                $message = "Item added successfully.";
                $messageType = "success";
                break;
                
            case 'edit':
                // Handle edit action
                $message = "Item updated successfully.";
                $messageType = "success";
                break;
                
            case 'delete':
                // Handle delete action
                $message = "Item deleted successfully.";
                $messageType = "success";
                break;
                
            default:
                // Handle unknown action
                $message = "Unknown action.";
                $messageType = "error";
                break;
        }
    }
}

// Database operations and business logic goes here
// Example: Fetch items from database
$items = [
    // Sample data - replace with actual data from your database
    ['id' => 1, 'name' => 'Item 1', 'status' => 'active'],
    ['id' => 2, 'name' => 'Item 2', 'status' => 'inactive'],
    ['id' => 3, 'name' => 'Item 3', 'status' => 'active'],
];

// Include header template
include 'admin-head.php';
include 'admin-sidebar.php';
?>

<!-- Main Content Area -->
<main class="admin-main">
  <?php include 'admin-header.php'; ?>
  
  <!-- Page Content -->
  <div class="admin-content">
    <div class="page-header">
      <h1><?php echo htmlspecialchars($page_title); ?></h1>
      
      <div class="page-header-actions">
        <button id="add-item-btn" class="btn btn-primary" data-modal="add-modal">
          <i class="fas fa-plus"></i> Add New
        </button>
      </div>
    </div>
    
    <?php if (!empty($message)): ?>
    <div class="message message-<?php echo $messageType; ?>">
      <i class="fas <?php echo $messageType === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'; ?>"></i>
      <?php echo htmlspecialchars($message); ?>
    </div>
    <?php endif; ?>
    
    <!-- Main Content Section -->
    <div class="card">
      <div class="card-header">
        <h2>Items List</h2>
        
        <!-- Optional: Add filtering or search options here -->
        <div class="card-actions">
          <div class="admin-search">
            <input type="text" id="item-search" placeholder="Search items...">
            <button type="button">
              <i class="fas fa-search"></i>
            </button>
          </div>
        </div>
      </div>
      
      <div class="card-body">
        <div class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th width="5%">ID</th>
                <th width="70%">Name</th>
                <th width="15%">Status</th>
                <th width="10%">Actions</th>
              </tr>
            </thead>
            <tbody>
              <?php foreach ($items as $item): ?>
              <tr>
                <td><?php echo htmlspecialchars($item['id']); ?></td>
                <td><?php echo htmlspecialchars($item['name']); ?></td>
                <td>
                  <span class="status-badge <?php echo $item['status']; ?>">
                    <?php echo ucfirst($item['status']); ?>
                  </span>
                </td>
                <td>
                  <div class="actions">
                    <a href="#" class="btn btn-info btn-sm edit-btn" data-id="<?php echo $item['id']; ?>" data-modal="edit-modal">
                      <i class="fas fa-edit"></i>
                    </a>
                    
                    <a href="#" class="btn btn-danger btn-sm delete-btn" data-id="<?php echo $item['id']; ?>">
                      <i class="fas fa-trash"></i>
                    </a>
                  </div>
                </td>
              </tr>
              <?php endforeach; ?>
              
              <?php if (empty($items)): ?>
              <tr>
                <td colspan="4" class="text-center">No items found.</td>
              </tr>
              <?php endif; ?>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Add Modal -->
  <div id="add-modal" class="modal">
    <div class="modal-content">
      <div class="modal-header">
        <h3>Add New Item</h3>
        <button class="modal-close">&times;</button>
      </div>
      <div class="modal-body">
        <form id="add-form" method="post" action="">
          <input type="hidden" name="action" value="add">
          
          <div class="form-group">
            <label for="item-name" class="form-label required">Name</label>
            <input type="text" id="item-name" name="name" class="form-control" required>
          </div>
          
          <div class="form-group">
            <label for="item-status" class="form-label">Status</label>
            <select id="item-status" name="status" class="form-control">
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
            <button type="submit" class="btn btn-primary">Add Item</button>
          </div>
        </form>
      </div>
    </div>
  </div>
  
  <!-- Edit Modal -->
  <div id="edit-modal" class="modal">
    <div class="modal-content">
      <div class="modal-header">
        <h3>Edit Item</h3>
        <button class="modal-close">&times;</button>
      </div>
      <div class="modal-body">
        <form id="edit-form" method="post" action="">
          <input type="hidden" name="action" value="edit">
          <input type="hidden" name="item_id" id="edit-item-id">
          
          <div class="form-group">
            <label for="edit-item-name" class="form-label required">Name</label>
            <input type="text" id="edit-item-name" name="name" class="form-control" required>
          </div>
          
          <div class="form-group">
            <label for="edit-item-status" class="form-label">Status</label>
            <select id="edit-item-status" name="status" class="form-control">
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
            <button type="submit" class="btn btn-primary">Update Item</button>
          </div>
        </form>
      </div>
    </div>
  </div>
  
  <!-- Confirm Delete Modal -->
  <div id="confirm-modal" class="modal">
    <div class="modal-content">
      <div class="modal-header">
        <h3>Confirm Delete</h3>
        <button class="modal-close">&times;</button>
      </div>
      <div class="modal-body">
        <p class="confirm-message">Are you sure you want to delete this item?</p>
        
        <form id="delete-form" method="post" action="">
          <input type="hidden" name="action" value="delete">
          <input type="hidden" name="item_id" id="delete-item-id">
          
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
            <button type="submit" class="btn btn-danger confirm-action">Delete</button>
          </div>
        </form>
      </div>
    </div>
  </div>
  
  <!-- Page specific JavaScript -->
  <script>
    document.addEventListener('DOMContentLoaded', function() {
      // Edit button click handler
      const editButtons = document.querySelectorAll('.edit-btn');
      editButtons.forEach(button => {
        button.addEventListener('click', function(e) {
          e.preventDefault();
          const itemId = this.getAttribute('data-id');
          
          // In a real application, you would fetch the item data via AJAX
          // For this example, we're using the example items array
          const item = <?php echo json_encode($items); ?>.find(item => item.id == itemId);
          
          if (item) {
            document.getElementById('edit-item-id').value = item.id;
            document.getElementById('edit-item-name').value = item.name;
            document.getElementById('edit-item-status').value = item.status;
            
            // Show modal
            document.getElementById('edit-modal').style.display = 'block';
          }
        });
      });
      
      // Delete button click handler
      const deleteButtons = document.querySelectorAll('.delete-btn');
      deleteButtons.forEach(button => {
        button.addEventListener('click', function(e) {
          e.preventDefault();
          const itemId = this.getAttribute('data-id');
          
          // Set item ID in delete form
          document.getElementById('delete-item-id').value = itemId;
          
          // Show confirmation modal
          document.getElementById('confirm-modal').style.display = 'block';
        });
      });
      
      // Form validation
      const forms = document.querySelectorAll('form');
      forms.forEach(form => {
        form.addEventListener('submit', function(e) {
          const requiredFields = form.querySelectorAll('[required]');
          let isValid = true;
          
          requiredFields.forEach(field => {
            if (!field.value.trim()) {
              isValid = false;
              field.classList.add('is-invalid');
            } else {
              field.classList.remove('is-invalid');
            }
          });
          
          if (!isValid) {
            e.preventDefault();
          }
        });
      });
      
      // Search functionality
      const searchInput = document.getElementById('item-search');
      if (searchInput) {
        searchInput.addEventListener('keyup', function() {
          const searchTerm = this.value.toLowerCase();
          const tableRows = document.querySelectorAll('tbody tr');
          
          tableRows.forEach(row => {
            const text = row.textContent.toLowerCase();
            if (text.includes(searchTerm)) {
              row.style.display = '';
            } else {
              row.style.display = 'none';
            }
          });
        });
      }
    });
  </script>
  
  <?php include 'admin-footer.php'; ?>
</main>
</div>
</body>
</html>
