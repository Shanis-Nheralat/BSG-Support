/**
 * Include.js - Dynamic Header and Footer Loader
 * Loads header.html and footer.html into placeholder elements
 */

document.addEventListener('DOMContentLoaded', function() {
    // Load Header
    const headerPlaceholder = document.getElementById('header-placeholder');
    if (headerPlaceholder) {
        fetch('header.html')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Header not found');
                }
                return response.text();
            })
            .then(data => {
                headerPlaceholder.innerHTML = data;
                // Execute any scripts in the header
                executeScripts(headerPlaceholder);
                // Highlight current page in navigation
                highlightCurrentPage();
            })
            .catch(error => {
                console.error('Error loading header:', error);
            });
    }

    // Load Footer
    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (footerPlaceholder) {
        fetch('footer.html')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Footer not found');
                }
                return response.text();
            })
            .then(data => {
                footerPlaceholder.innerHTML = data;
                // Execute any scripts in the footer
                executeScripts(footerPlaceholder);
            })
            .catch(error => {
                console.error('Error loading footer:', error);
            });
    }
});

/**
 * Execute scripts that are loaded dynamically
 */
function executeScripts(container) {
    const scripts = container.querySelectorAll('script');
    scripts.forEach(oldScript => {
        const newScript = document.createElement('script');
        
        // Copy all attributes
        Array.from(oldScript.attributes).forEach(attr => {
            newScript.setAttribute(attr.name, attr.value);
        });
        
        // Copy inline script content
        newScript.textContent = oldScript.textContent;
        
        // Replace old script with new one to execute it
        oldScript.parentNode.replaceChild(newScript, oldScript);
    });
}

/**
 * Highlight the current page in navigation
 */
function highlightCurrentPage() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.navbar a');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.classList.add('active');
            // Also highlight parent dropdown if exists
            const parentDropdown = link.closest('.dropdown');
            if (parentDropdown) {
                const dropdownToggle = parentDropdown.querySelector('.dropdown-toggle');
                if (dropdownToggle) {
                    dropdownToggle.classList.add('active');
                }
            }
        }
    });
}
