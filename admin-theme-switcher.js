/**
 * Admin Theme Switcher
 * Handles theme selection, localStorage persistence, and auto dark mode.
 */
(function () {
  'use strict';

  var STORAGE_THEME = 'adminTheme';
  var STORAGE_AUTO_DARK = 'adminAutoDark';
  var darkMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

  var themeSelector = null;
  var autoDarkCheckbox = null;

  // ──────────────────────────────────────────────
  // Apply theme to the document
  // ──────────────────────────────────────────────

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme || 'default');
  }

  // ──────────────────────────────────────────────
  // Determine and apply the correct theme
  // ──────────────────────────────────────────────

  function resolveTheme() {
    var autoDark = localStorage.getItem(STORAGE_AUTO_DARK) === 'true';
    var savedTheme = localStorage.getItem(STORAGE_THEME) || 'default';

    if (autoDark && darkMediaQuery.matches) {
      applyTheme('dark');
      if (themeSelector) {
        themeSelector.value = 'dark';
        themeSelector.disabled = true;
      }
    } else {
      applyTheme(autoDark ? savedTheme : savedTheme);
      if (themeSelector) {
        themeSelector.value = savedTheme;
        themeSelector.disabled = false;
      }
    }
  }

  // ──────────────────────────────────────────────
  // Theme selector change
  // ──────────────────────────────────────────────

  function initThemeSelector() {
    themeSelector = document.getElementById('theme-selector');
    if (!themeSelector) return;

    themeSelector.addEventListener('change', function () {
      var chosen = themeSelector.value;
      applyTheme(chosen);
      localStorage.setItem(STORAGE_THEME, chosen);
    });
  }

  // ──────────────────────────────────────────────
  // Auto dark mode checkbox
  // ──────────────────────────────────────────────

  function initAutoDarkMode() {
    autoDarkCheckbox = document.getElementById('auto-dark-mode');
    if (!autoDarkCheckbox) return;

    // Restore saved state
    var savedAutoDark = localStorage.getItem(STORAGE_AUTO_DARK) === 'true';
    autoDarkCheckbox.checked = savedAutoDark;

    autoDarkCheckbox.addEventListener('change', function () {
      localStorage.setItem(STORAGE_AUTO_DARK, autoDarkCheckbox.checked);
      resolveTheme();
    });

    // Listen for OS theme changes
    if (darkMediaQuery.addEventListener) {
      darkMediaQuery.addEventListener('change', function () {
        if (autoDarkCheckbox.checked) {
          resolveTheme();
        }
      });
    } else if (darkMediaQuery.addListener) {
      darkMediaQuery.addListener(function () {
        if (autoDarkCheckbox.checked) {
          resolveTheme();
        }
      });
    }
  }

  // ──────────────────────────────────────────────
  // Init
  // ──────────────────────────────────────────────

  document.addEventListener('DOMContentLoaded', function () {
    initThemeSelector();
    initAutoDarkMode();
    resolveTheme();
  });
})();
