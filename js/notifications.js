/**
 * Notification System for ANRS
 * Provides user feedback for various operations
 */

class NotificationSystem {
  constructor() {
    this.container = null;
    this.notifications = [];
    this.init();
  }

  init() {
    // Create notification container if it doesn't exist
    this.container = document.getElementById('notification-container');
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.id = 'notification-container';
      this.container.className = 'notification-container';
      document.body.appendChild(this.container);
    }

    // Add CSS styles
    this.addStyles();
  }

  addStyles() {
    const styleId = 'notification-styles';
    if (document.getElementById(styleId)) return;

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      .notification-container {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        max-width: 400px;
      }

      .notification {
        background: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        margin-bottom: 10px;
        padding: 16px;
        border-left: 4px solid #ccc;
        animation: slideIn 0.3s ease-out;
        position: relative;
        overflow: hidden;
      }

      .notification.success {
        border-left-color: #4caf50;
        background-color: #f1f8e9;
      }

      .notification.error {
        border-left-color: #f44336;
        background-color: #ffebee;
      }

      .notification.warning {
        border-left-color: #ff9800;
        background-color: #fff3e0;
      }

      .notification.info {
        border-left-color: #2196f3;
        background-color: #e3f2fd;
      }

      .notification.loading {
        border-left-color: #9c27b0;
        background-color: #f3e5f5;
      }

      .notification-header {
        display: flex;
        align-items: center;
        margin-bottom: 8px;
      }

      .notification-icon {
        margin-right: 8px;
        font-size: 18px;
      }

      .notification-title {
        font-weight: 600;
        font-size: 14px;
        color: #333;
      }

      .notification-message {
        font-size: 13px;
        color: #666;
        line-height: 1.4;
      }

      .notification-close {
        position: absolute;
        top: 8px;
        right: 8px;
        background: none;
        border: none;
        font-size: 18px;
        cursor: pointer;
        color: #999;
        padding: 4px;
        line-height: 1;
      }

      .notification-close:hover {
        color: #666;
      }

      .notification-progress {
        position: absolute;
        bottom: 0;
        left: 0;
        height: 3px;
        background-color: rgba(0, 0, 0, 0.1);
        animation: progress linear;
      }

      .notification.success .notification-progress {
        background-color: #4caf50;
      }

      .notification.error .notification-progress {
        background-color: #f44336;
      }

      .notification.warning .notification-progress {
        background-color: #ff9800;
      }

      .notification.info .notification-progress {
        background-color: #2196f3;
      }

      .notification.loading .notification-progress {
        background-color: #9c27b0;
      }

      @keyframes slideIn {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }

      @keyframes slideOut {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(100%);
          opacity: 0;
        }
      }

      @keyframes progress {
        from {
          width: 100%;
        }
        to {
          width: 0%;
        }
      }

      .notification.slide-out {
        animation: slideOut 0.3s ease-in forwards;
      }

      .loading-spinner {
        display: inline-block;
        width: 16px;
        height: 16px;
        border: 2px solid #f3f3f3;
        border-top: 2px solid #9c27b0;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }

      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
  }

  show(options) {
    const {
      type = 'info',
      title = '',
      message = '',
      duration = 5000,
      persistent = false,
      id = null
    } = options;

    // Remove existing notification with same ID
    if (id) {
      this.remove(id);
    }

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    if (id) notification.id = `notification-${id}`;

    const icons = {
      success: '✓',
      error: '✕',
      warning: '⚠',
      info: 'ℹ',
      loading: '<div class="loading-spinner"></div>'
    };

    notification.innerHTML = `
      <div class="notification-header">
        <span class="notification-icon">${icons[type] || icons.info}</span>
        <span class="notification-title">${title}</span>
        ${!persistent ? '<button class="notification-close">&times;</button>' : ''}
      </div>
      ${message ? `<div class="notification-message">${message}</div>` : ''}
      ${!persistent && duration > 0 ? `<div class="notification-progress" style="animation-duration: ${duration}ms;"></div>` : ''}
    `;

    // Add close functionality
    const closeBtn = notification.querySelector('.notification-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.remove(notification));
    }

    this.container.appendChild(notification);
    this.notifications.push(notification);

    // Auto-remove after duration
    if (!persistent && duration > 0) {
      setTimeout(() => {
        this.remove(notification);
      }, duration);
    }

    return notification;
  }

  remove(notification) {
    if (typeof notification === 'string') {
      notification = document.getElementById(`notification-${notification}`);
    }

    if (notification && notification.parentNode) {
      notification.classList.add('slide-out');
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
          this.notifications = this.notifications.filter(n => n !== notification);
        }
      }, 300);
    }
  }

  success(title, message, options = {}) {
    return this.show({ type: 'success', title, message, ...options });
  }

  error(title, message, options = {}) {
    return this.show({ type: 'error', title, message, duration: 8000, ...options });
  }

  warning(title, message, options = {}) {
    return this.show({ type: 'warning', title, message, ...options });
  }

  info(title, message, options = {}) {
    return this.show({ type: 'info', title, message, ...options });
  }

  loading(title, message, options = {}) {
    return this.show({ type: 'loading', title, message, persistent: true, ...options });
  }

  clear() {
    this.notifications.forEach(notification => this.remove(notification));
  }
}

// Create global instance
const notifications = new NotificationSystem();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = NotificationSystem;
}
