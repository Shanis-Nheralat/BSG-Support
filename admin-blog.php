<?php
session_start();

// ✅ Block unauthorized users
if (!isset($_SESSION['user_id']) || empty($_SESSION['user_role'])) {
    header("Location: admin-login.html");
    exit();
}

// ✅ Allow Super Admin and Content Admin only
if (!in_array($_SESSION['user_role'], ['superadmin', 'content'])) {
    header("Location: unauthorized.html");
    exit();
}

// ✅ In future: check for specific permissions like blog_add, blog_delete
// if (empty($_SESSION['permissions']['blog_add'])) { ... }
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <meta name="robots" content="noindex, nofollow">
  <title>Blog Management | Backsure Global Support</title>
  <link rel="stylesheet" href="admin/css/admin-style.css" />
  <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&display=swap" rel="stylesheet">
  <link rel="icon" href="favicon.ico" type="image/x-icon">
  <!-- Font Awesome for icons -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css">
  <!-- Quill editor CSS -->
  <link href="https://cdn.quilljs.com/1.3.6/quill.snow.css" rel="stylesheet">
</head>
<body class="admin-body">
  <div class="admin-container">
    <!-- Sidebar Navigation - Same as dashboard.html -->
    <aside class="admin-sidebar">
      <!-- Sidebar content will be loaded via JavaScript -->
    </aside>
    
    <!-- Main Content Area -->
    <main class="admin-main">
      <!-- Top Navigation Bar -->
      <header class="admin-header">
        <div class="header-left">
          <button id="sidebar-toggle" class="sidebar-toggle">
            <i class="fas fa-bars"></i>
          </button>
          <div class="breadcrumbs">
            <a href="admin-dashboard.html">Dashboard</a> &gt;
            <span>Blog Management</span>
          </div>
        </div>
        
        <div class="header-right">
          <div class="admin-search">
            <input type="text" placeholder="Search...">
            <button type="submit">
              <i class="fas fa-search"></i>
            </button>
          </div>
          
          <div class="header-actions">
            <button class="action-btn notification-btn">
              <i class="fas fa-bell"></i>
              <span class="badge">5</span>
            </button>
            
            <button class="action-btn task-btn">
              <i class="fas fa-check-circle"></i>
              <span class="badge">2</span>
            </button>
            
            <button class="action-btn help-btn">
              <i class="fas fa-question-circle"></i>
            </button>
          </div>
        </div>
      </header>
      
      <!-- Blog Management Content -->
      <div class="admin-content">
        <div class="page-header">
          <h1>Blog Management</h1>
          <a href="admin-blog-add.html" class="btn-primary">
            <i class="fas fa-plus"></i> Add New Post
          </a>
        </div>
        
        <!-- Blog Control Panel -->
        <div class="control-panel">
          <div class="panel-section filters">
            <div class="filter-group">
              <label for="category-filter">Category:</label>
              <select id="category-filter">
                <option value="all">All Categories</option>
                <option value="business-growth">Business Growth</option>
                <option value="outsourcing">Outsourcing Tips</option>
                <option value="hr-management">HR Management</option>
                <option value="finance">Finance & Accounting</option>
                <option value="insurance">Insurance Updates</option>
                <option value="compliance">Compliance & Admin</option>
              </select>
            </div>
            
            <div class="filter-group">
              <label for="status-filter">Status:</label>
              <select id="status-filter">
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="scheduled">Scheduled</option>
              </select>
            </div>
            
            <div class="filter-group">
              <label for="date-filter">Date:</label>
              <select id="date-filter">
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="this-week">This Week</option>
                <option value="this-month">This Month</option>
                <option value="last-month">Last Month</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>
            
            <div class="filter-group search-filter">
              <input type="text" placeholder="Search posts..." id="post-search">
              <button type="button" class="search-btn">
                <i class="fas fa-search"></i>
              </button>
            </div>
          </div>
          
          <div class="panel-section actions">
            <div class="bulk-actions">
              <select id="bulk-action">
                <option value="">Bulk Actions</option>
                <option value="publish">Publish</option>
                <option value="draft">Move to Draft</option>
                <option value="delete">Delete</option>
              </select>
              <button type="button" class="apply-btn">Apply</button>
            </div>
            
            <div class="view-options">
              <button type="button" class="view-btn active" data-view="grid">
                <i class="fas fa-th-large"></i>
              </button>
              <button type="button" class="view-btn" data-view="list">
                <i class="fas fa-list"></i>
              </button>
            </div>
          </div>
        </div>
        
        <!-- Blog Posts Grid View -->
        <div class="post-container grid-view active">
          <!-- Example Posts -->
          <div class="post-card">
            <div class="card-header">
              <div class="post-featured-image">
                <img src="images/blog/placeholder-1.jpg" alt="Blog Post">
              </div>
              <div class="post-status published">
                <i class="fas fa-check-circle"></i> Published
              </div>
            </div>
            <div class="card-body">
              <h3 class="post-title">5 Ways Outsourcing Can Accelerate Your Business Growth</h3>
              <div class="post-meta">
                <span class="post-date"><i class="far fa-calendar-alt"></i> Apr 15, 2025</span>
                <span class="post-category"><i class="fas fa-folder"></i> Business Growth</span>
              </div>
              <p class="post-excerpt">Learn how strategic outsourcing can help you scale faster, reduce costs, and focus on your core business strengths.</p>
              <div class="post-stats">
                <span class="views"><i class="fas fa-eye"></i> 245 views</span>
                <span class="comments"><i class="fas fa-comment"></i> 8 comments</span>
              </div>
            </div>
            <div class="card-footer">
              <div class="post-actions">
                <a href="#" class="edit-btn" title="Edit"><i class="fas fa-edit"></i> Edit</a>
                <a href="#" class="view-btn" title="View"><i class="fas fa-eye"></i> View</a>
                <a href="#" class="delete-btn" title="Delete"><i class="fas fa-trash-alt"></i> Delete</a>
              </div>
            </div>
          </div>
          
          <div class="post-card">
            <div class="card-header">
              <div class="post-featured-image">
                <img src="images/blog/placeholder-2.jpg" alt="Blog Post">
              </div>
              <div class="post-status draft">
                <i class="fas fa-pencil-alt"></i> Draft
              </div>
            </div>
            <div class="card-body">
              <h3 class="post-title">Building Effective Remote Teams: Best Practices</h3>
              <div class="post-meta">
                <span class="post-date"><i class="far fa-calendar-alt"></i> Not published</span>
                <span class="post-category"><i class="fas fa-folder"></i> HR Management</span>
              </div>
              <p class="post-excerpt">Discover proven strategies for managing remote teams effectively and maintaining strong team culture across borders.</p>
              <div class="post-stats">
                <span class="views"><i class="fas fa-eye"></i> 0 views</span>
                <span class="comments"><i class="fas fa-comment"></i> 0 comments</span>
              </div>
            </div>
            <div class="card-footer">
              <div class="post-actions">
                <a href="#" class="edit-btn" title="Edit"><i class="fas fa-edit"></i> Edit</a>
                <a href="#" class="view-btn" title="View"><i class="fas fa-eye"></i> Preview</a>
                <a href="#" class="delete-btn" title="Delete"><i class="fas fa-trash-alt"></i> Delete</a>
              </div>
            </div>
          </div>
          
          <div class="post-card">
            <div class="card-header">
              <div class="post-featured-image">
                <img src="images/blog/placeholder-3.jpg" alt="Blog Post">
              </div>
              <div class="post-status scheduled">
                <i class="fas fa-clock"></i> Scheduled
              </div>
            </div>
            <div class="card-body">
              <h3 class="post-title">Streamlining Financial Operations: Key Strategies for SMEs</h3>
              <div class="post-meta">
                <span class="post-date"><i class="far fa-calendar-alt"></i> Scheduled for Apr 25, 2025</span>
                <span class="post-category"><i class="fas fa-folder"></i> Finance & Accounting</span>
              </div>
              <p class="post-excerpt">Learn practical approaches to optimize your financial processes, reduce costs, and improve financial visibility.</p>
              <div class="post-stats">
                <span class="views"><i class="fas fa-eye"></i> 0 views</span>
                <span class="comments"><i class="fas fa-comment"></i> 0 comments</span>
              </div>
            </div>
            <div class="card-footer">
              <div class="post-actions">
                <a href="#" class="edit-btn" title="Edit"><i class="fas fa-edit"></i> Edit</a>
                <a href="#" class="view-btn" title="View"><i class="fas fa-eye"></i> Preview</a>
                <a href="#" class="delete-btn" title="Delete"><i class="fas fa-trash-alt"></i> Delete</a>
              </div>
            </div>
          </div>
          
          <div class="post-card">
            <div class="card-header">
              <div class="post-featured-image">
                <img src="images/blog/placeholder-4.jpg" alt="Blog Post">
              </div>
              <div class="post-status published">
                <i class="fas fa-check-circle"></i> Published
              </div>
            </div>
            <div class="card-body">
              <h3 class="post-title">Understanding UAE Corporate Tax: A Guide for Businesses</h3>
              <div class="post-meta">
                <span class="post-date"><i class="far fa-calendar-alt"></i> Apr 10, 2025</span>
                <span class="post-category"><i class="fas fa-folder"></i> Compliance & Admin</span>
              </div>
              <p class="post-excerpt">Navigate the complexities of UAE's corporate tax system with this comprehensive guide for business owners and finance teams.</p>
              <div class="post-stats">
                <span class="views"><i class="fas fa-eye"></i> 189 views</span>
                <span class="comments"><i class="fas fa-comment"></i> 5 comments</span>
              </div>
            </div>
            <div class="card-footer">
              <div class="post-actions">
                <a href="#" class="edit-btn" title="Edit"><i class="fas fa-edit"></i> Edit</a>
                <a href="#" class="view-btn" title="View"><i class="fas fa-eye"></i> View</a>
                <a href="#" class="delete-btn" title="Delete"><i class="fas fa-trash-alt"></i> Delete</a>
              </div>
            </div>
          </div>
          
          <div class="post-card">
            <div class="card-header">
              <div class="post-featured-image">
                <img src="images/blog/placeholder-5.jpg" alt="Blog Post">
              </div>
              <div class="post-status published">
                <i class="fas fa-check-circle"></i> Published
              </div>
            </div>
            <div class="card-body">
              <h3 class="post-title">How to Choose the Right Insurance Partner for Your Business</h3>
              <div class="post-meta">
                <span class="post-date"><i class="far fa-calendar-alt"></i> Apr 5, 2025</span>
                <span class="post-category"><i class="fas fa-folder"></i> Insurance Updates</span>
              </div>
              <p class="post-excerpt">Explore the key factors to consider when selecting an insurance partner to protect your business assets and operations.</p>
              <div class="post-stats">
                <span class="views"><i class="fas fa-eye"></i> 156 views</span>
                <span class="comments"><i class="fas fa-comment"></i> 3 comments</span>
              </div>
            </div>
            <div class="card-footer">
              <div class="post-actions">
                <a href="#" class="edit-btn" title="Edit"><i class="fas fa-edit"></i> Edit</a>
                <a href="#" class="view-btn" title="View"><i class="fas fa-eye"></i> View</a>
                <a href="#" class="delete-btn" title="Delete"><i class="fas fa-trash-alt"></i> Delete</a>
              </div>
            </div>
          </div>
          
          <div class="post-card">
            <div class="card-header">
              <div class="post-featured-image">
                <img src="images/blog/placeholder-6.jpg" alt="Blog Post">
              </div>
              <div class="post-status published">
                <i class="fas fa-check-circle"></i> Published
              </div>
            </div>
            <div class="card-body">
              <h3 class="post-title">5 Signs Your Business Needs Dedicated Outsourcing Support</h3>
              <div class="post-meta">
                <span class="post-date"><i class="far fa-calendar-alt"></i> Mar 28, 2025</span>
                <span class="post-category"><i class="fas fa-folder"></i> Outsourcing Tips</span>
              </div>
              <p class="post-excerpt">Recognize the warning signs that your business could benefit from professional outsourcing solutions for back-office operations.</p>
              <div class="post-stats">
                <span class="views"><i class="fas fa-eye"></i> 212 views</span>
                <span class="comments"><i class="fas fa-comment"></i> 7 comments</span>
              </div>
            </div>
            <div class="card-footer">
              <div class="post-actions">
                <a href="#" class="edit-btn" title="Edit"><i class="fas fa-edit"></i> Edit</a>
                <a href="#" class="view-btn" title="View"><i class="fas fa-eye"></i> View</a>
                <a href="#" class="delete-btn" title="Delete"><i class="fas fa-trash-alt"></i> Delete</a>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Blog Posts List View -->
        <div class="post-container list-view">
          <table class="admin-table posts-table">
            <thead>
              <tr>
                <th class="checkbox-column">
                  <input type="checkbox" id="select-all">
                </th>
                <th class="title-column">Title</th>
                <th>Author</th>
                <th>Category</th>
                <th>Tags</th>
                <th>Date</th>
                <th>Status</th>
                <th>Views</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <input type="checkbox" class="post-select">
                </td>
                <td class="title-column">
                  <div class="post-title-info">
                    <div class="post-image-thumb">
                      <img src="images/blog/placeholder-1-thumb.jpg" alt="">
                    </div>
                    <div class="post-title-meta">
                      <a href="#" class="post-title-link">5 Ways Outsourcing Can Accelerate Your Business Growth</a>
                      <span class="post-excerpt">Learn how strategic outsourcing can help you scale faster...</span>
                    </div>
                  </div>
                </td>
                <td>Admin User</td>
                <td>Business Growth</td>
                <td>outsourcing, growth, scaling</td>
                <td>Apr 15, 2025</td>
                <td><span class="status-badge published">Published</span></td>
                <td>245</td>
                <td>
                  <div class="table-actions">
                    <a href="#" class="edit-btn" title="Edit"><i class="fas fa-edit"></i></a>
                    <a href="#" class="view-btn" title="View"><i class="fas fa-eye"></i></a>
                    <a href="#" class="delete-btn" title="Delete"><i class="fas fa-trash-alt"></i></a>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <input type="checkbox" class="post-select">
                </td>
                <td class="title-column">
                  <div class="post-title-info">
                    <div class="post-image-thumb">
                      <img src="images/blog/placeholder-2-thumb.jpg" alt="">
                    </div>
                    <div class="post-title-meta">
                      <a href="#" class="post-title-link">Building Effective Remote Teams: Best Practices</a>
                      <span class="post-excerpt">Discover proven strategies for managing remote teams...</span>
                    </div>
                  </div>
                </td>
                <td>Admin User</td>
                <td>HR Management</td>
                <td>remote teams, management</td>
                <td>—</td>
                <td><span class="status-badge draft">Draft</span></td>
                <td>0</td>
                <td>
                  <div class="table-actions">
                    <a href="#" class="edit-btn" title="Edit"><i class="fas fa-edit"></i></a>
                    <a href="#" class="view-btn" title="View"><i class="fas fa-eye"></i></a>
                    <a href="#" class="delete-btn" title="Delete"><i class="fas fa-trash-alt"></i></a>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <input type="checkbox" class="post-select">
                </td>
                <td class="title-column">
                  <div class="post-title-info">
                    <div class="post-image-thumb">
                      <img src="images/blog/placeholder-3-thumb.jpg" alt="">
                    </div>
                    <div class="post-title-meta">
                      <a href="#" class="post-title-link">Streamlining Financial Operations: Key Strategies for SMEs</a>
                      <span class="post-excerpt">Learn practical approaches to optimize your financial processes...</span>
                    </div>
                  </div>
                </td>
                <td>Admin User</td>
                <td>Finance & Accounting</td>
                <td>finance, operations, SME</td>
                <td>Apr 25, 2025</td>
                <td><span class="status-badge scheduled">Scheduled</span></td>
                <td>0</td>
                <td>
                  <div class="table-actions">
                    <a href="#" class="edit-btn" title="Edit"><i class="fas fa-edit"></i></a>
                    <a href="#" class="view-btn" title="View"><i class="fas fa-eye"></i></a>
                    <a href="#" class="delete-btn" title="Delete"><i class="fas fa-trash-alt"></i></a>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <input type="checkbox" class="post-select">
                </td>
                <td class="title-column">
                  <div class="post-title-info">
                    <div class="post-image-thumb">
                      <img src="images/blog/placeholder-4-thumb.jpg" alt="">
                    </div>
                    <div class="post-title-meta">
                      <a href="#" class="post-title-link">Understanding UAE Corporate Tax: A Guide for Businesses</a>
                      <span class="post-excerpt">Navigate the complexities of UAE's corporate tax system...</span>
                    </div>
                  </div>
                </td>
                <td>Admin User</td>
                <td>Compliance & Admin</td>
                <td>tax, UAE, compliance</td>
                <td>Apr 10, 2025</td>
                <td><span class="status-badge published">Published</span></td>
                <td>189</td>
                <td>
                  <div class="table-actions">
                    <a href="#" class="edit-btn" title="Edit"><i class="fas fa-edit"></i></a>
                    <a href="#" class="view-btn" title="View"><i class="fas fa-eye"></i></a>
                    <a href="#" class="delete-btn" title="Delete"><i class="fas fa-trash-alt"></i></a>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <input type="checkbox" class="post-select">
                </td>
                <td class="title-column">
                  <div class="post-title-info">
                    <div class="post-image-thumb">
                      <img src="images/blog/placeholder-5-thumb.jpg" alt="">
                    </div>
                    <div class="post-title-meta">
                      <a href="#" class="post-title-link">How to Choose the Right Insurance Partner for Your Business</a>
                      <span class="post-excerpt">Explore the key factors to consider when selecting an insurance partner...</span>
                    </div>
                  </div>
                </td>
                <td>Admin User</td>
                <td>Insurance Updates</td>
                <td>insurance, risk management</td>
                <td>Apr 5, 2025</td>
                <td><span class="status-badge published">Published</span></td>
                <td>156</td>
                <td>
                  <div class="table-actions">
                    <a href="#" class="edit-btn" title="Edit"><i class="fas fa-edit"></i></a>
                    <a href="#" class="view-btn" title="View"><i class="fas fa-eye"></i></a>
                    <a href="#" class="delete-btn" title="Delete"><i class="fas fa-trash-alt"></i></a>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <input type="checkbox" class="post-select">
                </td>
                <td class="title-column">
                  <div class="post-title-info">
                    <div class="post-image-thumb">
                      <img src="images/blog/placeholder-6-thumb.jpg" alt="">
                    </div>
                    <div class="post-title-meta">
                      <a href="#" class="post-title-link">5 Signs Your Business Needs Dedicated Outsourcing Support</a>
                      <span class="post-excerpt">Recognize the warning signs that your business could benefit from professional outsourcing...</span>
                    </div>
                  </div>
                </td>
                <td>Admin User</td>
                <td>Outsourcing Tips</td>
                <td>outsourcing, efficiency, operations</td>
                <td>Mar 28, 2025</td>
                <td><span class="status-badge published">Published</span></td>
                <td>212</td>
                <td>
                  <div class="table-actions">
                    <a href="#" class="edit-btn" title="Edit"><i class="fas fa-edit"></i></a>
                    <a href="#" class="view-btn" title="View"><i class="fas fa-eye"></i></a>
                    <a href="#" class="delete-btn" title="Delete"><i class="fas fa-trash-alt"></i></a>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- Pagination -->
        <div class="pagination">
          <span class="pagination-info">Showing 1-6 of 6 posts</span>
          <div class="pagination-links">
            <a href="#" class="pagination-link disabled">&laquo; Previous</a>
            <a href="#" class="pagination-link active">1</a>
            <a href="#" class="pagination-link disabled">Next &raquo;</a>
          </div>
        </div>
      </div>
      
      <!-- Admin Footer -->
      <footer class="admin-footer">
        <div class="footer-left">
          <p>&copy; 2025 Backsure Global Support. All rights reserved.</p>
        </div>
        <div class="footer-right">
          <span>Admin Panel v1.0</span>
        </div>
      </footer>
    </main>
  </div>
  
  <!-- JavaScript for Admin Dashboard -->
  <script src="admin/js/admin.js"></script>
  <script>
    document.addEventListener('DOMContentLoaded', function() {
      // Load sidebar content
      const sidebar = document.querySelector('.admin-sidebar');
      fetch('admin-sidebar.html')
        .then(response => response.text())
        .then(data => {
          sidebar.innerHTML = data;
          
          // Highlight active menu item
          const blogMenuItem = document.querySelector('.sidebar-nav a[href="admin-blog.html"]');
          if (blogMenuItem) {
            blogMenuItem.parentElement.classList.add('active');
            
            // If in submenu, open parent menu
            const parentMenu = blogMenuItem.closest('.has-submenu');
            if (parentMenu) {
              parentMenu.classList.add('open');
              const submenu = parentMenu.querySelector('.submenu');
              submenu.style.maxHeight = submenu.scrollHeight + 'px';
            }
          }
          
          // Initialize sidebar toggle
          const sidebarToggle = document.getElementById('sidebar-toggle');
          const adminContainer = document.querySelector('.admin-container');
          
          sidebarToggle.addEventListener('click', function() {
            adminContainer.classList.toggle('sidebar-collapsed');
          });
          
          // Initialize submenu toggles
          initializeSubmenus();
        })
        .catch(error => console.error('Error loading sidebar:', error));
      
      // Initialize view toggle
      const viewButtons = document.querySelectorAll('.view-btn');
      const gridView = document.querySelector('.grid-view');
      const listView = document.querySelector('.list-view');
      
      viewButtons.forEach(button => {
        button.addEventListener('click', function() {
          viewButtons.forEach(btn => btn.classList.remove('active'));
          this.classList.add('active');
          
          const viewType = this.getAttribute('data-view');
          
          if (viewType === 'grid') {
            gridView.classList.add('active');
            listView.classList.remove('active');
          } else {
            gridView.classList.remove('active');
            listView.classList.add('active');
          }
        });
      });
      
      // Initialize select all functionality
      const selectAll = document.getElementById('select-all');
      const postCheckboxes = document.querySelectorAll('.post-select');
      
      if (selectAll) {
        selectAll.addEventListener('change', function() {
          postCheckboxes.forEach(checkbox => {
            checkbox.checked = this.checked;
          });
        });
      }
      
      function initializeSubmenus() {
        const submenuItems = document.querySelectorAll('.has-submenu > a');
        
        submenuItems.forEach(item => {
          item.addEventListener('click', function(e) {
            e.preventDefault();
            const parent = this.parentElement;
            
            // Close other open submenus
            const openItems = document.querySelectorAll('.has-submenu.open');
            openItems.forEach(openItem => {
              if (openItem !== parent) {
                openItem.classList.remove('open');
                const submenu = openItem.querySelector('.submenu');
                submenu.style.maxHeight = null;
              }
            });
            
            // Toggle current submenu
            parent.classList.toggle('open');
            const submenu = parent.querySelector('.submenu');
            
            if (parent.classList.contains('open')) {
              submenu.style.maxHeight = submenu.scrollHeight + 'px';
            } else {
              submenu.style.maxHeight = null;
            }
          });
        });
      }
    });
  </script>
</body>
</html>