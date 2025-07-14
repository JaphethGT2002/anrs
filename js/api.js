/**
 * API Client for ANRS Backend
 * Handles all API calls to the backend server
 */

class APIClient {
  constructor() {
    this.baseURL = 'http://localhost:3002/api';
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
  }

  /**
   * Make a GET request to the API
   */
  async get(endpoint, useCache = true) {
    const url = `${this.baseURL}${endpoint}`;
    const cacheKey = `GET:${endpoint}`;

    // Check cache first
    if (useCache && this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.data;
      }
    }

    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Cache successful responses
      if (useCache && data.success) {
        this.cache.set(cacheKey, {
          data: data,
          timestamp: Date.now()
        });
      }

      return data;
    } catch (error) {
      console.error(`API GET error for ${endpoint}:`, error);
      throw error;
    }
  }

  /**
   * Make a POST request to the API
   */
  async post(endpoint, data) {
    const url = `${this.baseURL}${endpoint}`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API POST error for ${endpoint}:`, error);
      throw error;
    }
  }

  /**
   * Get all foods and categories
   */
  async getFoods() {
    return await this.get('/foods');
  }

  /**
   * Get a specific food by ID
   */
  async getFood(id) {
    return await this.get(`/foods/${id}`);
  }

  /**
   * Get foods by category
   */
  async getFoodsByCategory(categoryId) {
    return await this.get(`/foods/category/${categoryId}`);
  }

  /**
   * Search foods by name
   */
  async searchFoods(query) {
    return await this.get(`/foods/search/${encodeURIComponent(query)}`);
  }

  /**
   * Clear cache
   */
  clearCache() {
    this.cache.clear();
  }

  /**
   * Check if API is available
   */
  async healthCheck() {
    try {
      const response = await fetch(`${this.baseURL}/health`);
      return response.ok;
    } catch (error) {
      console.error('API health check failed:', error);
      return false;
    }
  }
}

/**
 * Food Data Manager
 * Manages food data loading and caching from backend API exclusively
 */
class FoodDataManager {
  constructor() {
    this.api = new APIClient();
    this.foodData = null;
    this.isLoaded = false;
    this.loadingPromise = null;
  }

  /**
   * Load food data from backend API exclusively
   */
  async loadFoodData() {
    if (this.loadingPromise) {
      return this.loadingPromise;
    }

    this.loadingPromise = this._loadFoodDataInternal();
    return this.loadingPromise;
  }

  async _loadFoodDataInternal() {
    if (this.isLoaded && this.foodData) {
      return this.foodData;
    }

    try {
      console.log('🔄 Loading food data from backend API...');

      // First, check if the API is available
      const isHealthy = await this.api.healthCheck();
      if (!isHealthy) {
        throw new Error('Backend server is not responding. Please ensure the server is running on http://localhost:3002');
      }

      // Load from backend API exclusively
      const response = await this.api.getFoods();

      if (response.success && response.data) {
        this.foodData = response.data;
        this.isLoaded = true;
        console.log('✅ Food data loaded from backend API successfully');

        // Make data globally available
        window.foodData = this.foodData;

        return this.foodData;
      } else {
        throw new Error(`Invalid API response: ${response.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('❌ Failed to load food data from backend API:', error);

      // Provide detailed error information based on error type
      let errorMessage = 'Failed to load food data from backend API';
      let troubleshootingTips = [];

      if (error.message.includes('Backend server is not responding')) {
        errorMessage = error.message;
        troubleshootingTips = [
          'Make sure XAMPP is running',
          'Start the backend server with: npm start',
          'Check if port 3002 is available',
          'Verify the server is running at http://localhost:3002'
        ];
      } else if (error.message.includes('fetch') || error.name === 'TypeError') {
        errorMessage += ' - Network connection failed';
        troubleshootingTips = [
          'Check your internet connection',
          'Ensure the backend server is running',
          'Verify the API endpoint is accessible'
        ];
      } else if (error.message.includes('HTTP 500')) {
        errorMessage += ' - Internal server error';
        troubleshootingTips = [
          'Check server logs for errors',
          'Verify database connection',
          'Ensure all required tables exist'
        ];
      } else if (error.message.includes('HTTP 404')) {
        errorMessage += ' - API endpoint not found';
        troubleshootingTips = [
          'Verify the foods API route is properly configured',
          'Check if /api/foods endpoint exists'
        ];
      } else {
        errorMessage += ` - ${error.message}`;
        troubleshootingTips = [
          'Check browser console for more details',
          'Verify backend server configuration'
        ];
      }

      // Log troubleshooting tips for developers
      if (troubleshootingTips.length > 0) {
        console.error('💡 Troubleshooting tips:');
        troubleshootingTips.forEach(tip => console.error(`   - ${tip}`));
      }

      throw new Error(errorMessage);
    }
  }

  /**
   * Get food data (loads if not already loaded)
   */
  async getFoodData() {
    if (!this.isLoaded) {
      await this.loadFoodData();
    }
    return this.foodData;
  }

  /**
   * Get a specific food by ID
   */
  async getFood(id) {
    const data = await this.getFoodData();
    return data.foods.find(food => food.id === id);
  }

  /**
   * Get foods by category
   */
  async getFoodsByCategory(categoryId) {
    const data = await this.getFoodData();
    return data.foods.filter(food => food.category === categoryId);
  }

  /**
   * Search foods by name
   */
  async searchFoods(query) {
    const data = await this.getFoodData();
    const searchTerm = query.toLowerCase();
    
    return data.foods.filter(food => 
      food.name.en.toLowerCase().includes(searchTerm) ||
      food.name.rw.toLowerCase().includes(searchTerm)
    );
  }

  /**
   * Get categories
   */
  async getCategories() {
    const data = await this.getFoodData();
    return data.categories;
  }

  /**
   * Refresh data from API
   */
  async refresh() {
    this.isLoaded = false;
    this.foodData = null;
    this.loadingPromise = null;
    this.api.clearCache();
    return await this.loadFoodData();
  }
}

// Create global instances
window.apiClient = new APIClient();
window.foodDataManager = new FoodDataManager();

// Auto-load food data when the page loads
document.addEventListener('DOMContentLoaded', async () => {
  try {
    await window.foodDataManager.loadFoodData();
    
    // Trigger custom event to notify other scripts
    const event = new CustomEvent('foodDataLoaded', {
      detail: { foodData: window.foodData }
    });
    document.dispatchEvent(event);
  } catch (error) {
    console.error('Failed to load food data on page load:', error);
    
    // Show user-friendly error message
    const errorEvent = new CustomEvent('foodDataLoadError', {
      detail: { error: error.message }
    });
    document.dispatchEvent(errorEvent);
  }
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { APIClient, FoodDataManager };
}
