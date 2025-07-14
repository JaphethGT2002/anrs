/**
 * ANRS Admin Notification System
 * Centralized notification management for the admin interface
 */

class AdminNotificationSystem {
    constructor() {
        this.notifications = [];
        this.container = null;
        this.maxNotifications = 5;
        this.defaultDuration = 5000;
        this.init();
    }

    init() {
        // Create notification container if it doesn't exist
        this.createContainer();
        
        // Add CSS styles if not already present
        this.addStyles();
    }

    createContainer() {
        // Remove existing container if present
        const existing = document.getElementById('admin-notification-container');
        if (existing) {
            existing.remove();
        }

        // Create new container
        this.container = document.createElement('div');
        this.container.id = 'admin-notification-container';
        this.container.className = 'admin-notification-container';
        document.body.appendChild(this.container);
    }

    addStyles() {
        // Check if styles already exist
        if (document.getElementById('admin-notification-styles')) {
            return;
        }

        const styles = document.createElement('style');
        styles.id = 'admin-notification-styles';
        styles.textContent = `
            .admin-notification-container {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                pointer-events: none;
                max-width: 400px;
            }

            .admin-notification {
                background: white;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                margin-bottom: 12px;
                overflow: hidden;
                pointer-events: auto;
                transform: translateX(100%);
                opacity: 0;
                transition: all 0.3s ease;
                border-left: 4px solid #2196f3;
            }

            .admin-notification.show {
                transform: translateX(0);
                opacity: 1;
            }

            .admin-notification.hide {
                transform: translateX(100%);
                opacity: 0;
            }

            .admin-notification-content {
                display: flex;
                align-items: flex-start;
                padding: 16px;
                gap: 12px;
            }

            .admin-notification-icon {
                flex-shrink: 0;
                width: 20px;
                height: 20px;
                margin-top: 2px;
            }

            .admin-notification-body {
                flex: 1;
                min-width: 0;
            }

            .admin-notification-title {
                font-weight: 600;
                color: #1f2937;
                margin-bottom: 4px;
                font-size: 14px;
            }

            .admin-notification-message {
                color: #6b7280;
                font-size: 13px;
                line-height: 1.4;
            }

            .admin-notification-close {
                flex-shrink: 0;
                background: none;
                border: none;
                color: #9ca3af;
                cursor: pointer;
                padding: 4px;
                border-radius: 4px;
                transition: all 0.2s ease;
                margin-top: -2px;
            }

            .admin-notification-close:hover {
                background-color: #f3f4f6;
                color: #6b7280;
            }

            .admin-notification-progress {
                position: absolute;
                bottom: 0;
                left: 0;
                height: 3px;
                background-color: rgba(255, 255, 255, 0.3);
                transition: width linear;
            }

            /* Notification types */
            .admin-notification-success {
                border-left-color: #10b981;
            }

            .admin-notification-success .admin-notification-icon {
                color: #10b981;
            }

            .admin-notification-error {
                border-left-color: #ef4444;
            }

            .admin-notification-error .admin-notification-icon {
                color: #ef4444;
            }

            .admin-notification-warning {
                border-left-color: #f59e0b;
            }

            .admin-notification-warning .admin-notification-icon {
                color: #f59e0b;
            }

            .admin-notification-info {
                border-left-color: #3b82f6;
            }

            .admin-notification-info .admin-notification-icon {
                color: #3b82f6;
            }

            /* Responsive design */
            @media (max-width: 768px) {
                .admin-notification-container {
                    top: 10px;
                    right: 10px;
                    left: 10px;
                    max-width: none;
                }

                .admin-notification {
                    transform: translateY(-100%);
                }

                .admin-notification.show {
                    transform: translateY(0);
                }

                .admin-notification.hide {
                    transform: translateY(-100%);
                }
            }
        `;
        document.head.appendChild(styles);
    }

    show(options) {
        // Normalize options
        if (typeof options === 'string') {
            options = { message: options };
        }

        const notification = {
            id: Date.now() + Math.random(),
            type: options.type || 'info',
            title: options.title || this.getDefaultTitle(options.type || 'info'),
            message: options.message || '',
            duration: options.duration !== undefined ? options.duration : this.defaultDuration,
            persistent: options.persistent || false,
            actions: options.actions || []
        };

        // Remove oldest notification if we have too many
        if (this.notifications.length >= this.maxNotifications) {
            this.hide(this.notifications[0].id);
        }

        this.notifications.push(notification);
        this.render(notification);

        // Auto-hide if not persistent
        if (!notification.persistent && notification.duration > 0) {
            setTimeout(() => {
                this.hide(notification.id);
            }, notification.duration);
        }

        return notification.id;
    }

    hide(id) {
        const notification = this.notifications.find(n => n.id === id);
        if (!notification) return;

        const element = document.getElementById(`admin-notification-${id}`);
        if (element) {
            element.classList.add('hide');
            setTimeout(() => {
                element.remove();
                this.notifications = this.notifications.filter(n => n.id !== id);
            }, 300);
        }
    }

    render(notification) {
        const element = document.createElement('div');
        element.id = `admin-notification-${notification.id}`;
        element.className = `admin-notification admin-notification-${notification.type}`;

        const icon = this.getIcon(notification.type);
        
        element.innerHTML = `
            <div class="admin-notification-content">
                <i class="admin-notification-icon fas ${icon}"></i>
                <div class="admin-notification-body">
                    <div class="admin-notification-title">${this.escapeHtml(notification.title)}</div>
                    <div class="admin-notification-message">${this.escapeHtml(notification.message)}</div>
                </div>
                <button class="admin-notification-close" onclick="adminNotifications.hide(${notification.id})">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            ${!notification.persistent && notification.duration > 0 ? 
                `<div class="admin-notification-progress" style="width: 100%; transition-duration: ${notification.duration}ms;"></div>` : 
                ''
            }
        `;

        this.container.appendChild(element);

        // Trigger animation
        setTimeout(() => {
            element.classList.add('show');
            
            // Start progress bar animation
            if (!notification.persistent && notification.duration > 0) {
                const progressBar = element.querySelector('.admin-notification-progress');
                if (progressBar) {
                    setTimeout(() => {
                        progressBar.style.width = '0%';
                    }, 100);
                }
            }
        }, 100);
    }

    getIcon(type) {
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };
        return icons[type] || icons.info;
    }

    getDefaultTitle(type) {
        const titles = {
            success: 'Success',
            error: 'Error',
            warning: 'Warning',
            info: 'Information'
        };
        return titles[type] || titles.info;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Convenience methods
    success(message, options = {}) {
        return this.show({ ...options, type: 'success', message });
    }

    error(message, options = {}) {
        return this.show({ ...options, type: 'error', message });
    }

    warning(message, options = {}) {
        return this.show({ ...options, type: 'warning', message });
    }

    info(message, options = {}) {
        return this.show({ ...options, type: 'info', message });
    }

    clear() {
        this.notifications.forEach(notification => {
            this.hide(notification.id);
        });
    }
}

// Create global instance
window.adminNotifications = new AdminNotificationSystem();

// Backward compatibility function
window.showNotification = function(message, type = 'info', options = {}) {
    return window.adminNotifications.show({
        message,
        type,
        ...options
    });
};
