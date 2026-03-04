<!-- Admin Footer -->
            <div class="admin-footer">
                <div class="footer-left">
                    <p>&copy; <?php echo date('Y'); ?> Backsure Global Support. All rights reserved.</p>
                </div>
                <div class="footer-right">
                    <span>Admin Panel v1.0</span>
                </div>
            </div>
        </div><!-- End .admin-content -->
    </div><!-- End .admin-container -->

    <!-- JavaScript Files -->
    <script src="assets/js/jquery-3.6.0.min.js"></script>
    <script src="assets/js/bootstrap.bundle.min.js"></script>
    <script src="assets/js/admin-dashboard.js"></script>
    
    <script>
    // Common JavaScript functionality
    $(document).ready(function() {
        // Toggle sidebar on mobile
        $('.toggle-sidebar').click(function() {
            $('.admin-sidebar').toggleClass('active');
        });
        
        // Submenu toggle
        $('.has-submenu > a').click(function(e) {
            e.preventDefault();
            $(this).parent().toggleClass('open');
            $(this).next('.submenu').slideToggle(300);
        });
        
        // User dropdown
        $('#user-dropdown-toggle').click(function(e) {
            e.stopPropagation();
            $('#user-dropdown').toggleClass('show');
        });
        
        // Close dropdown when clicking outside
        $(document).click(function(e) {
            if (!$('#user-dropdown-toggle').is(e.target) && !$('#user-dropdown').is(e.target) && $('#user-dropdown').has(e.target).length === 0) {
                $('#user-dropdown').removeClass('show');
            }
        });
        
        // Auto-open current active submenu
        $('.has-submenu.active').addClass('open').find('.submenu').show();
    });
    </script>
    
    <?php if (isset($page_scripts)): ?>
    <!-- Page-specific scripts -->
    <script>
        <?php echo $page_scripts; ?>
    </script>
    <?php endif; ?>
</body>
</html>
