<?php
/**
 * Admin Dashboard
 * Overview page with statistics, charts, activities and quick actions
 */

// Authentication and permissions
require_once 'admin-auth.php';
require_admin_auth();

// Include notifications system
require_once 'admin-notifications.php';

// Track page view for analytics
require_once 'admin-analytics.php';
log_page_view(basename($_SERVER['PHP_SELF']));

// Page variables
$page_title = 'Dashboard';
$current_page = 'dashboard';
$breadcrumbs = [
    ['title' => 'Dashboard', 'url' => '#']
];

// Get admin info
$admin_user = get_admin_user();
$admin_username = $admin_user['username'];
$admin_role = $admin_user['role'];

// Get analytics data
$traffic_data = get_page_view_stats('weekly', 7);
$chart_data = format_chart_data($traffic_data, 'Website Traffic');
$traffic_sources = get_traffic_sources();
$top_pages = get_top_pages(5);
$recent_activities = get_recent_activities(4);
$unread_inquiries = 3; // Placeholder value, should be fetched from database

// Base URL for assets
$scriptPath = $_SERVER['SCRIPT_NAME'];
$parentDir = dirname($scriptPath);
$baseUrl = rtrim($parentDir, '/') . '/';

// Include templates
include 'admin-head.php';
include 'admin-sidebar.php';
?>

<main class="admin-main">
  <?php include 'admin-header.php'; ?>
  
  <!-- Dashboard Content -->
  <div class="admin-content container-fluid py-4">
    <div class="row mb-4">
      <div class="col-12">
        <div class="d-flex justify-content-between align-items-center">
          <h1 class="h3 mb-0 text-gray-800">Dashboard Overview</h1>
          <div class="date-display">
            <i class="far fa-calendar-alt"></i>
            <span id="current-date"><?php echo date('l, F j, Y'); ?></span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Stats Overview -->
    <div class="row mb-4">
      <div class="col-xl-6 col-md-6 mb-4">
        <div class="card border-left-primary shadow h-100 py-2">
          <div class="card-body">
            <div class="row no-gutters align-items-center">
              <div class="col mr-2">
                <div class="text-xs font-weight-bold text-primary text-uppercase mb-1">Website Visitors</div>
                <div class="h5 mb-0 font-weight-bold text-gray-800">2,478</div>
                <div class="mt-2 small">
                  <span class="text-success">
                    <i class="fas fa-arrow-up"></i>
                    12.3%
                  </span>
                  <span class="ml-1">vs last month</span>
                </div>
              </div>
              <div class="col-auto">
                <i class="fas fa-eye fa-2x text-gray-300"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="col-xl-6 col-md-6 mb-4">
        <div class="card border-left-info shadow h-100 py-2">
          <div class="card-body">
            <div class="row no-gutters align-items-center">
              <div class="col mr-2">
                <div class="text-xs font-weight-bold text-info text-uppercase mb-1">Blog Articles</div>
                <div class="h5 mb-0 font-weight-bold text-gray-800">-11</div>
                <div class="mt-2 small">
                  <span class="text-danger">
                    <i class="fas fa-arrow-down"></i>
                    3.7%
                  </span>
                  <span class="ml-1">vs last month</span>
                </div>
              </div>
              <div class="col-auto">
                <i class="fas fa-file-alt fa-2x text-gray-300"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Charts & Analytics -->
    <div class="row mb-4">
      <div class="col-lg-8">
        <div class="card shadow mb-4">
          <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
            <h6 class="m-0 font-weight-bold text-primary">Website Traffic</h6>
            <div class="dropdown no-arrow">
              <div class="btn-group" role="group">
                <button type="button" class="btn btn-sm btn-primary active" data-period="daily">Daily</button>
                <button type="button" class="btn btn-sm btn-outline-primary" data-period="weekly">Weekly</button>
                <button type="button" class="btn btn-sm btn-outline-primary" data-period="monthly">Monthly</button>
              </div>
            </div>
          </div>
          <div class="card-body">
            <div class="chart-area">
              <canvas id="traffic-chart"></canvas>
            </div>
          </div>
        </div>
      </div>
      
      <div class="col-lg-4">
        <div class="card shadow mb-4">
          <div class="card-header py-3">
            <h6 class="m-0 font-weight-bold text-primary">Traffic Sources</h6>
          </div>
          <div class="card-body">
            <div class="chart-pie mb-4">
              <canvas id="traffic-sources-chart"></canvas>
            </div>
            <div class="mt-4">
              <div class="mb-2">
                <div class="d-flex justify-content-between mb-1">
                  <span>Direct</span>
                  <span>40%</span>
                </div>
                <div class="progress" style="height: 6px;">
                  <div class="progress-bar" style="width: 40%; background-color: #4e73df;"></div>
                </div>
              </div>
              <div class="mb-2">
                <div class="d-flex justify-content-between mb-1">
                  <span>Organic Search</span>
                  <span>30%</span>
                </div>
                <div class="progress" style="height: 6px;">
                  <div class="progress-bar" style="width: 30%; background-color: #1cc88a;"></div>
                </div>
              </div>
              <div class="mb-2">
                <div class="d-flex justify-content-between mb-1">
                  <span>Social Media</span>
                  <span>15%</span>
                </div>
                <div class="progress" style="height: 6px;">
                  <div class="progress-bar" style="width: 15%; background-color: #36b9cc;"></div>
                </div>
              </div>
              <div class="mb-2">
                <div class="d-flex justify-content-between mb-1">
                  <span>Referral</span>
                  <span>10%</span>
                </div>
                <div class="progress" style="height: 6px;">
                  <div class="progress-bar" style="width: 10%; background-color: #f6c23e;"></div>
                </div>
              </div>
              <div class="mb-2">
                <div class="d-flex justify-content-between mb-1">
                  <span>Others</span>
                  <span>5%</span>
                </div>
                <div class="progress" style="height: 6px;">
                  <div class="progress-bar" style="width: 5%; background-color: #e74a3b;"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="card shadow">
          <div class="card-header py-3">
            <h6 class="m-0 font-weight-bold text-primary">Top Pages</h6>
          </div>
          <div class="card-body p-0">
            <div class="list-group list-group-flush">
              <div class="list-group-item px-3 py-2 d-flex justify-content-between align-items-center">
                <span>Homepage</span>
                <span class="badge bg-primary rounded-pill">1,245</span>
              </div>
              <div class="list-group-item px-3 py-2 d-flex justify-content-between align-items-center">
                <span>Services</span>
                <span class="badge bg-primary rounded-pill">856</span>
              </div>
              <div class="list-group-item px-3 py-2 d-flex justify-content-between align-items-center">
                <span>About Us</span>
                <span class="badge bg-primary rounded-pill">621</span>
              </div>
              <div class="list-group-item px-3 py-2 d-flex justify-content-between align-items-center">
                <span>Blog</span>
                <span class="badge bg-primary rounded-pill">487</span>
              </div>
              <div class="list-group-item px-3 py-2 d-flex justify-content-between align-items-center">
                <span>Contact</span>
                <span class="badge bg-primary rounded-pill">329</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="row">
      <!-- Recent Activities Section -->
      <div class="col-lg-7 mb-4">
        <div class="card shadow mb-4">
          <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
            <h6 class="m-0 font-weight-bold text-primary">Recent Activities</h6>
            <a href="admin-activities.php" class="btn btn-sm btn-primary">View All</a>
          </div>
          <div class="card-body">
            <div class="activity-item">
              <div class="d-flex">
                <div class="mr-3">
                  <div class="icon-circle bg-info">
                    <i class="fas fa-file-alt text-white"></i>
                  </div>
                </div>
                <div class="flex-grow-1">
                  <div class="small text-gray-500">Apr 15, 2025</div>
                  <h5 class="mb-1">Article Published</h5>
                  <p class="mb-1">New blog post "Top 10 IT Security Practices" was published by Admin.</p>
                  <a href="admin-blog.php" class="btn btn-sm btn-primary">View Post</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Quick Actions Section -->
      <div class="col-lg-5 mb-4">
        <div class="card shadow mb-4">
          <div class="card-header py-3">
            <h6 class="m-0 font-weight-bold text-primary">Quick Actions</h6>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-6 mb-3">
                <a href="admin-blog-add.php" class="btn btn-primary btn-block d-flex align-items-center justify-content-center">
                  <i class="fas fa-plus mr-2"></i> New Blog Post
                </a>
              </div>
              <div class="col-md-6 mb-3">
                <a href="admin-media.php" class="btn btn-primary btn-block d-flex align-items-center justify-content-center">
                  <i class="fas fa-upload mr-2"></i> Upload Media
                </a>
              </div>
              <div class="col-md-6 mb-3">
                <a href="admin-settings.php" class="btn btn-primary btn-block d-flex align-items-center justify-content-center">
                  <i class="fas fa-cog mr-2"></i> Settings
                </a>
              </div>
              <div class="col-md-6 mb-3">
                <a href="admin-backup.php" class="btn btn-primary btn-block d-flex align-items-center justify-content-center">
                  <i class="fas fa-download mr-2"></i> Backup
                </a>
              </div>
            </div>
          </div>
        </div>
    </div>
  </div>
  
  <?php include 'admin-footer.php'; ?>
</main>

<script>
document.addEventListener('DOMContentLoaded', function() {
  // Traffic Chart
  const trafficChartCanvas = document.getElementById('traffic-chart');
  if (trafficChartCanvas) {
    const ctx = trafficChartCanvas.getContext('2d');
    
    // Sample data for daily traffic
    const dailyTrafficData = {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [{
        label: 'Daily Traffic',
        lineTension: 0.3,
        backgroundColor: "rgba(78, 115, 223, 0.05)",
        borderColor: "rgba(78, 115, 223, 1)",
        pointRadius: 3,
        pointBackgroundColor: "rgba(78, 115, 223, 1)",
        pointBorderColor: "rgba(78, 115, 223, 1)",
        pointHoverRadius: 3,
        pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
        pointHoverBorderColor: "rgba(78, 115, 223, 1)",
        pointHitRadius: 10,
        pointBorderWidth: 2,
        data: [305, 350, 320, 380, 350, 330, 390]
      }]
    };
    
    // Sample data for weekly traffic
    const weeklyTrafficData = {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      datasets: [{
        label: 'Weekly Traffic',
        lineTension: 0.3,
        backgroundColor: "rgba(78, 115, 223, 0.05)",
        borderColor: "rgba(78, 115, 223, 1)",
        pointRadius: 3,
        pointBackgroundColor: "rgba(78, 115, 223, 1)",
        pointBorderColor: "rgba(78, 115, 223, 1)",
        pointHoverRadius: 3,
        pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
        pointHoverBorderColor: "rgba(78, 115, 223, 1)",
        pointHitRadius: 10,
        pointBorderWidth: 2,
        data: [2100, 2400, 2200, 2500]
      }]
    };
    
    // Sample data for monthly traffic
    const monthlyTrafficData = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [{
        label: 'Monthly Traffic',
        lineTension: 0.3,
        backgroundColor: "rgba(78, 115, 223, 0.05)",
        borderColor: "rgba(78, 115, 223, 1)",
        pointRadius: 3,
        pointBackgroundColor: "rgba(78, 115, 223, 1)",
        pointBorderColor: "rgba(78, 115, 223, 1)",
        pointHoverRadius: 3,
        pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
        pointHoverBorderColor: "rgba(78, 115, 223, 1)",
        pointHitRadius: 10,
        pointBorderWidth: 2,
        data: [8500, 9200, 8700, 9500, 10200, 10800]
      }]
    };
    
    // Chart configuration
    const config = {
      type: 'line',
      data: dailyTrafficData,
      options: {
        maintainAspectRatio: false,
        layout: {
          padding: {
            left: 10,
            right: 25,
            top: 25,
            bottom: 0
          }
        },
        scales: {
          y: {
            ticks: {
              beginAtZero: true,
              maxTicksLimit: 5,
              padding: 10
            },
            grid: {
              color: "rgba(0, 0, 0, 0.05)"
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: "rgb(255,255,255)",
            bodyColor: "#858796",
            titleMarginBottom: 10,
            titleColor: '#6e707e',
            titleFont: {
              size: 14
            },
            borderColor: '#dddfeb',
            borderWidth: 1,
            xPadding: 15,
            yPadding: 15,
            displayColors: false,
            intersect: false,
            mode: 'index',
            caretPadding: 10
          }
        }
      }
    };
    
    // Create the chart
    const trafficChart = new Chart(trafficChartCanvas, config);
    
    // Period buttons
    document.querySelectorAll('[data-period]').forEach(button => {
      button.addEventListener('click', function() {
        // Remove active class from all buttons
        document.querySelectorAll('[data-period]').forEach(btn => {
          btn.classList.remove('active');
          btn.classList.remove('btn-primary');
          btn.classList.add('btn-outline-primary');
        });
        
        // Add active class to clicked button
        this.classList.add('active');
        this.classList.add('btn-primary');
        this.classList.remove('btn-outline-primary');
        
        // Get period
        const period = this.getAttribute('data-period');
        
        // Update chart data based on period
        let newData;
        switch(period) {
          case 'daily':
            newData = dailyTrafficData;
            break;
          case 'weekly':
            newData = weeklyTrafficData;
            break;
          case 'monthly':
            newData = monthlyTrafficData;
            break;
        }
        
        // Update chart
        trafficChart.data.labels = newData.labels;
        trafficChart.data.datasets[0].data = newData.datasets[0].data;
        trafficChart.data.datasets[0].label = newData.datasets[0].label;
        trafficChart.update();
      });
    });
  }
  
  // Traffic Sources Chart
  const trafficSourcesCanvas = document.getElementById('traffic-sources-chart');
  if (trafficSourcesCanvas) {
    const sourcesData = {
      labels: ['Direct', 'Organic Search', 'Social Media', 'Referral', 'Others'],
      datasets: [{
        data: [40, 30, 15, 10, 5],
        backgroundColor: ['#4e73df', '#1cc88a', '#36b9cc', '#f6c23e', '#e74a3b'],
        hoverBackgroundColor: ['#2e59d9', '#17a673', '#2c9faf', '#dda20a', '#be2617'],
        hoverBorderColor: "rgba(234, 236, 244, 1)",
      }]
    };
    
    const sourcesChart = new Chart(trafficSourcesCanvas, {
      type: 'doughnut',
      data: sourcesData,
      options: {
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: "rgb(255,255,255)",
            bodyColor: "#858796",
            borderColor: '#dddfeb',
            borderWidth: 1,
            xPadding: 15,
            yPadding: 15,
            displayColors: false,
            caretPadding: 10,
            callbacks: {
              label: function(context) {
                return context.label + ': ' + context.raw + '%';
              }
            }
          }
        }
      }
    });
  }
  
  // Update current date
  const currentDateElement = document.getElementById('current-date');
  if (currentDateElement) {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    currentDateElement.textContent = now.toLocaleDateString(undefined, options);
  }
});
</script>
</div><!-- .admin-container -->
</body>
</html>
