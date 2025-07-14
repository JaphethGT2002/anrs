/**
 * ANRS Admin Authentication Guard
 * Simple script to protect admin pages and provide common functionality
 */

(function() {
    'use strict';

    /**
     * Initialize admin page protection and common functionality
     */
    function initAdminGuard() {
        // Check authentication on protected pages
        if (isProtectedPage()) {
            if (!checkAdminAuth()) {
                return; // Will redirect to login
            }
        }

        // Initialize common admin functionality
        initCommonAdminFeatures();
    }

    /**
     * Check if current page is a protected admin page
     */
    function isProtectedPage() {
        const path = window.location.pathname;
        return path.includes('/pages/') && 
               !path.includes('register.html') && 
               !path.includes('index.html');
    }

    /**
     * Check admin authentication
     */
    function checkAdminAuth() {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            // Redirect to login if not on login page
            if (!window.location.pathname.includes('index.html') && 
                !window.location.pathname.includes('register.html')) {
                window.location.href = '../index.html';
            }
            return false;
        }
        return true;
    }

    /**
     * Initialize common admin features
     */
    function initCommonAdminFeatures() {
        // Set up sidebar toggle
        setupSidebarToggle();
        
        // Set up user dropdown
        setupUserDropdown();
        
        // Set up logout handlers
        setupLogoutHandlers();
        
        // Display admin info
        displayAdminInfo();
        
        // Set active navigation
        setActiveNavigation();
    }

    /**
     * Set up sidebar toggle functionality
     */
    function setupSidebarToggle() {
        const sidebarToggle = document.getElementById('sidebarToggle');
        const sidebar = document.getElementById('adminSidebar');
        const mainContent = document.getElementById('adminMainContent');

        if (sidebarToggle && sidebar && mainContent) {
            sidebarToggle.addEventListener('click', function() {
                sidebar.classList.toggle('collapsed');
                mainContent.classList.toggle('sidebar-collapsed');
            });
        }
    }

    /**
     * Set up user dropdown functionality
     */
    function setupUserDropdown() {
        const userAvatar = document.getElementById('userAvatar');
        const userDropdown = document.getElementById('userDropdown');

        if (userAvatar && userDropdown) {
            userAvatar.addEventListener('click', function() {
                userDropdown.classList.toggle('show');
            });

            // Close dropdown when clicking outside
            document.addEventListener('click', function(e) {
                if (!userAvatar.contains(e.target) && !userDropdown.contains(e.target)) {
                    userDropdown.classList.remove('show');
                }
            });
        }
    }

    /**
     * Set up logout handlers
     */
    function setupLogoutHandlers() {
        const logoutBtns = document.querySelectorAll('.admin-logout-btn');
        logoutBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                if (confirm('Are you sure you want to logout?')) {
                    handleAdminLogout();
                }
            });
        });
    }

    /**
     * Handle admin logout
     */
    function handleAdminLogout() {
        try {
            if (window.AdminAPI && typeof window.AdminAPI.logout === 'function') {
                AdminAPI.logout();
            }
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            // Clear local storage
            localStorage.removeItem('adminToken');
            localStorage.removeItem('adminInfo');

            // Redirect to login
            window.location.href = '../index.html';
        }
    }

    /**
     * Display admin info
     */
    function displayAdminInfo() {
        const adminInfo = getCurrentAdmin();
        const userAvatar = document.getElementById('userAvatar');
        
        if (userAvatar && adminInfo) {
            // Set user initials or icon
            const initials = adminInfo.name ? 
                adminInfo.name.split(' ').map(n => n[0]).join('').toUpperCase() : 
                'A';
            
            // Replace icon with initials
            userAvatar.innerHTML = initials;
            userAvatar.title = `${adminInfo.name} (${adminInfo.email})`;
        }
    }

    /**
     * Get current admin info
     */
    function getCurrentAdmin() {
        const adminInfo = localStorage.getItem('adminInfo');
        return adminInfo ? JSON.parse(adminInfo) : null;
    }

    /**
     * Set active navigation item
     */
    function setActiveNavigation() {
        const currentPage = window.location.pathname.split('/').pop();
        const navLinks = document.querySelectorAll('.admin-nav-link');
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === currentPage) {
                link.classList.add('active');
            }
        });
    }

    /**
     * Utility function to show notifications
     */
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `admin-notification admin-notification-${type}`;
        notification.textContent = message;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            border-radius: 6px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
        `;
        
        if (type === 'success') notification.style.backgroundColor = '#4caf50';
        else if (type === 'error') notification.style.backgroundColor = '#f44336';
        else if (type === 'warning') notification.style.backgroundColor = '#ff9800';
        else notification.style.backgroundColor = '#2196f3';
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    /**
     * Utility functions for common operations
     */
    window.AdminGuard = {
        checkAuth: checkAdminAuth,
        getCurrentAdmin: getCurrentAdmin,
        showNotification: showNotification,
        logout: handleAdminLogout
    };

    // Initialize when DOM is loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAdminGuard);
    } else {
        initAdminGuard();
    }

})();
