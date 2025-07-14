/**
 * Connectivity and Database Utilities for ANRS
 * Handles internet connectivity checks and database verification
 */

class ConnectivityUtils {
  constructor() {
    this.isOnline = navigator.onLine;
    this.setupNetworkListeners();
  }

  setupNetworkListeners() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      console.log('Network connection restored');
      notifications.success('Connection Restored', 'Internet connection is back online');
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      console.log('Network connection lost');
      notifications.warning('Connection Lost', 'You are now offline. Some features may be limited.');
    });
  }

  /**
   * Check if the user is connected to the internet
   * @returns {Promise<boolean>} True if online, false if offline
   */
  async checkInternetConnection() {
    // First check navigator.onLine
    if (!navigator.onLine) {
      return false;
    }

    try {
      // Try to fetch a reliable external resource to verify actual connectivity
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

      const response = await fetch('https://www.google.com/favicon.ico', {
        method: 'HEAD',
        cache: 'no-cache',
        signal: controller.signal,
        mode: 'no-cors' // Avoid CORS issues
      });

      clearTimeout(timeoutId);
      return true; // If we reach here, we have internet
    } catch (error) {
      console.warn('Internet connectivity check failed:', error);

      // Fallback: try a different approach
      try {
        const img = new Image();
        return new Promise((resolve) => {
          img.onload = () => resolve(true);
          img.onerror = () => resolve(false);
          img.src = 'https://www.google.com/favicon.ico?' + Date.now();
          setTimeout(() => resolve(false), 3000); // 3 second timeout
        });
      } catch (fallbackError) {
        return false;
      }
    }
  }

  /**
   * Check if the backend server is reachable
   * @returns {Promise<boolean>} True if server is reachable, false otherwise
   */
  async checkServerConnection() {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch('http://localhost:3002/api/health', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        mode: 'cors',
        credentials: 'include',
        cache: 'no-cache',
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      return response.ok;
    } catch (error) {
      console.warn('Server connectivity check failed:', error);
      console.warn('Error details:', error.message);
      return false;
    }
  }

  /**
   * Verify that user data was successfully inserted in the database
   * @param {string} email - User email to verify
   * @param {string} token - Authentication token
   * @returns {Promise<boolean>} True if user exists in database, false otherwise
   */
  async verifyDatabaseInsertion(email, token) {
    try {
      const response = await fetch('http://localhost:3002/api/auth/verify', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        mode: 'cors',
        credentials: 'include'
      });

      if (!response.ok) {
        return false;
      }

      const data = await response.json();
      return data.valid === true && data.user && data.user.email === email;
    } catch (error) {
      console.error('Database verification failed:', error);
      console.error('Error details:', error.message);
      return false;
    }
  }

  /**
   * Comprehensive connectivity check with notifications
   * @returns {Promise<Object>} Object containing connectivity status
   */
  async performConnectivityCheck() {
    const loadingNotification = notifications.loading(
      'Checking Connection',
      'Verifying internet and server connectivity...',
      { id: 'connectivity-check' }
    );

    const result = {
      internet: false,
      server: false,
      timestamp: new Date().toISOString()
    };

    try {
      // Check internet connectivity
      result.internet = await this.checkInternetConnection();
      
      if (result.internet) {
        notifications.success(
          'Internet Connected',
          'Internet connection verified successfully',
          { duration: 3000 }
        );

        // Check server connectivity
        result.server = await this.checkServerConnection();
        
        if (result.server) {
          notifications.success(
            'Server Connected',
            'Backend server is reachable and healthy',
            { duration: 3000 }
          );
        } else {
          notifications.error(
            'Server Unreachable',
            'Cannot connect to the backend server. Registration will use offline mode.',
            { duration: 6000 }
          );
        }
      } else {
        notifications.error(
          'No Internet Connection',
          'Please check your internet connection and try again.',
          { duration: 6000 }
        );
      }
    } catch (error) {
      console.error('Connectivity check failed:', error);
      notifications.error(
        'Connectivity Check Failed',
        'Unable to verify connection status',
        { duration: 5000 }
      );
    } finally {
      notifications.remove('connectivity-check');
    }

    return result;
  }

  /**
   * Store user data in localStorage (only for offline users, not database users)
   * @param {Object} userData - User data to store
   * @param {string} source - Source of the data ('database' or 'offline')
   */
  storeUserDataLocally(userData, source = 'offline') {
    try {
      // Only store in users array if it's offline data that needs to be synced later
      if (source === 'offline') {
        const users = JSON.parse(localStorage.getItem('users') || '[]');

        // Remove existing user with same email
        const filteredUsers = users.filter(user => user.email !== userData.email);

        // Add new user data with metadata for offline sync
        const userWithMetadata = {
          ...userData,
          source: 'offline',
          lastSync: new Date().toISOString(),
          needsSync: true
        };

        filteredUsers.push(userWithMetadata);
        localStorage.setItem('users', JSON.stringify(filteredUsers));

        // Store as current user (excluding password)
        const { password, password_hash, ...safeUserData } = userWithMetadata;
        localStorage.setItem('currentUser', JSON.stringify(safeUserData));

        notifications.success(
          'Offline Data Saved',
          'User data saved locally and will be synced when online',
          { duration: 3000 }
        );
      } else {
        // For database users, don't store in users array - data is already in database
        // Just store minimal current user info for session management
        const { password, password_hash, ...safeUserData } = userData;
        const sessionData = {
          ...safeUserData,
          source: 'database',
          isAuthenticated: true,
          loginTime: new Date().toISOString()
        };
        localStorage.setItem('currentUser', JSON.stringify(sessionData));

        console.log('Database user session established - data not duplicated in localStorage');
      }

      return true;
    } catch (error) {
      console.error('Failed to store user data locally:', error);
      notifications.error(
        'Local Storage Failed',
        'Unable to save data locally: ' + error.message,
        { duration: 5000 }
      );
      return false;
    }
  }

  /**
   * Sync offline user data to the database when connection is restored
   */
  async syncOfflineData() {
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const offlineUsers = users.filter(user => user.needsSync);

      if (offlineUsers.length === 0) {
        return;
      }

      notifications.info(
        'Syncing Data',
        `Syncing ${offlineUsers.length} offline user(s) to database...`,
        { id: 'sync-data' }
      );

      for (const user of offlineUsers) {
        try {
          // Attempt to register the user with the backend
          const response = await apiService.register({
            name: user.name,
            email: user.email,
            password: user.password
          });

          if (response.success) {
            // Update user record to mark as synced
            user.needsSync = false;
            user.source = 'database';
            user.lastSync = new Date().toISOString();
            
            console.log(`Successfully synced user: ${user.email}`);
          }
        } catch (error) {
          console.warn(`Failed to sync user ${user.email}:`, error);
        }
      }

      // Update localStorage with synced data
      localStorage.setItem('users', JSON.stringify(users));
      
      notifications.remove('sync-data');
      notifications.success(
        'Sync Complete',
        'Offline data has been synchronized with the database',
        { duration: 4000 }
      );

    } catch (error) {
      console.error('Failed to sync offline data:', error);
      notifications.error(
        'Sync Failed',
        'Unable to sync offline data to database',
        { duration: 5000 }
      );
    }
  }
}

// Create global instance
const connectivityUtils = new ConnectivityUtils();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ConnectivityUtils;
}
