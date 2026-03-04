/**
 * Admin Core JavaScript
 * Handles sidebar toggle, submenu expand/collapse, user dropdown, and mobile sidebar.
 */
(function () {
  'use strict';

  var container = null;
  var sidebar = null;
  var backdrop = null;
  var mobileQuery = window.matchMedia('(max-width: 991.98px)');

  function isMobile() {
    return mobileQuery.matches;
  }

  // ──────────────────────────────────────────────
  // 1. Sidebar Collapse Toggle
  // ──────────────────────────────────────────────

  function initSidebarToggle() {
    var toggle = document.getElementById('sidebar-toggle');
    if (!toggle || !container) return;

    // Restore saved state on desktop only
    if (!isMobile()) {
      var saved = localStorage.getItem('adminSidebarCollapsed');
      if (saved === 'true') {
        container.classList.add('sidebar-collapsed');
      }
    }

    toggle.addEventListener('click', function (e) {
      e.preventDefault();

      if (isMobile()) {
        // Mobile: slide sidebar in/out
        var isExpanded = container.classList.toggle('sidebar-expanded');
        if (backdrop) {
          backdrop.classList.toggle('show', isExpanded);
        }
      } else {
        // Desktop: collapse/expand sidebar
        var isCollapsed = container.classList.toggle('sidebar-collapsed');
        // Remove mobile state if present
        container.classList.remove('sidebar-expanded');
        if (backdrop) backdrop.classList.remove('show');
        localStorage.setItem('adminSidebarCollapsed', isCollapsed);
      }
    });
  }

  // ──────────────────────────────────────────────
  // 2. Sidebar Backdrop (mobile close)
  // ──────────────────────────────────────────────

  function initBackdrop() {
    backdrop = document.querySelector('.sidebar-backdrop');
    if (!backdrop || !container) return;

    backdrop.addEventListener('click', function () {
      container.classList.remove('sidebar-expanded');
      backdrop.classList.remove('show');
    });
  }

  // ──────────────────────────────────────────────
  // 3. Clean up classes on breakpoint cross
  // ──────────────────────────────────────────────

  function initResponsiveCleanup() {
    function handleResize() {
      if (!container) return;

      if (isMobile()) {
        // Entering mobile: remove desktop collapsed, hide sidebar
        container.classList.remove('sidebar-collapsed');
      } else {
        // Entering desktop: remove mobile expanded + backdrop
        container.classList.remove('sidebar-expanded');
        if (backdrop) backdrop.classList.remove('show');

        // Restore desktop collapsed state
        var saved = localStorage.getItem('adminSidebarCollapsed');
        if (saved === 'true') {
          container.classList.add('sidebar-collapsed');
        }
      }
    }

    // Use addEventListener on the MediaQueryList for modern browsers
    if (mobileQuery.addEventListener) {
      mobileQuery.addEventListener('change', handleResize);
    } else if (mobileQuery.addListener) {
      mobileQuery.addListener(handleResize);
    }
  }

  // ──────────────────────────────────────────────
  // 4. Submenu Expand / Collapse
  // ──────────────────────────────────────────────

  function initSubmenuToggle() {
    var nav = document.querySelector('.sidebar-nav');
    if (!nav) return;

    nav.addEventListener('click', function (e) {
      // Find the closest parent <a> inside a .has-submenu
      var link = e.target.closest('.has-submenu > a');
      if (!link) return;

      e.preventDefault();

      var parentLi = link.parentElement;

      // In collapsed desktop mode, submenus show on hover via CSS — skip JS toggle
      if (!isMobile() && container && container.classList.contains('sidebar-collapsed')) {
        return;
      }

      parentLi.classList.toggle('open');
    });
  }

  // ──────────────────────────────────────────────
  // 5. Sidebar User Dropdown
  // ──────────────────────────────────────────────

  function initUserDropdown() {
    var toggleBtn = document.getElementById('user-dropdown-toggle');
    if (!toggleBtn) return;

    var menu = toggleBtn.closest('.admin-user')
      ? toggleBtn.closest('.admin-user').querySelector('.dropdown-menu')
      : null;
    if (!menu) return;

    toggleBtn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      menu.classList.toggle('show');
    });

    // Close on outside click
    document.addEventListener('click', function (e) {
      if (!e.target.closest('.admin-user')) {
        menu.classList.remove('show');
      }
    });
  }

  // ──────────────────────────────────────────────
  // Init
  // ──────────────────────────────────────────────

  document.addEventListener('DOMContentLoaded', function () {
    container = document.querySelector('.admin-container');
    sidebar = document.querySelector('.admin-sidebar');

    initBackdrop();
    initSidebarToggle();
    initResponsiveCleanup();
    initSubmenuToggle();
    initUserDropdown();
  });
})();
