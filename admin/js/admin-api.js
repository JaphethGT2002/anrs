/**
 * ANRS Admin API Service
 * Handles all API communications for the admin dashboard
 */

class AdminAPI {
  constructor() {
    // Auto-detect the correct API base URL
    this.baseURL = this.detectBaseURL();
    this.token = localStorage.getItem("adminToken");
  }

  /**
   * Detect the correct API base URL based on current location
   */
  detectBaseURL() {
    const currentHost = window.location.origin;
    const currentPath = window.location.pathname;

    // If we're on XAMPP (localhost without port), use the backend server
    if (
      currentHost === "http://localhost" &&
      currentPath.includes("/clone/anrs")
    ) {
      return "http://localhost:3002/api";
    }

    // If we're on the backend server directly
    if (currentHost === "http://localhost:3002") {
      return "http://localhost:3002/api";
    }

    // Default fallback
    return "http://localhost:3002/api";
  }

  /**
   * Set authentication token
   */
  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem("adminToken", token);
    } else {
      localStorage.removeItem("adminToken");
    }
  }

  /**
   * Get authentication token
   */
  getToken() {
    return this.token || localStorage.getItem("adminToken");
  }

  /**
   * Make authenticated API request
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getToken();

    const config = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      mode: 'cors',
      credentials: 'include',
      ...options,
    };

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    try {
      console.log(`🌐 AdminAPI Base URL: ${this.baseURL}`);
      console.log(`📡 Making API request to: ${url}`, config);

      const response = await fetch(url, config);

      // Check if response is ok before trying to parse JSON
      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (parseError) {
          console.warn("Could not parse error response as JSON:", parseError);
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log(`API response from ${url}:`, data);
      return data;
    } catch (error) {
      console.error("API Request Error:", error);
      console.error("Request details:", { url, config });

      // Handle network errors
      if (error.name === "TypeError" && error.message.includes("fetch")) {
        throw new Error(
          "Network error: Unable to connect to server. Please check if the backend server is running on http://localhost:3002"
        );
      }

      // Handle CORS errors
      if (error.message.includes("CORS") || error.message.includes("blocked")) {
        throw new Error(
          "CORS error: Cross-origin request blocked. Please ensure the backend server is configured correctly."
        );
      }

      // Handle token expiration
      if (
        error.message.includes("token") ||
        error.message.includes("unauthorized") ||
        error.message.includes("401")
      ) {
        this.setToken(null);
        if (
          window.location.pathname.includes("admin") &&
          !window.location.pathname.includes("index.html")
        ) {
          window.location.href = "../index.html";
        }
      }

      throw error;
    }
  }

  // ===== AUTHENTICATION METHODS =====

  /**
   * Admin login
   */
  async login(email, password) {
    const response = await this.request("/admin/auth/admin-login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    if (response.token) {
      this.setToken(response.token);
    }

    return response;
  }

  /**
   * Admin registration
   */
  async register(userData) {
    const response = await this.request("/admin/auth/admin-register", {
      method: "POST",
      body: JSON.stringify(userData),
    });

    if (response.token) {
      this.setToken(response.token);
    }

    return response;
  }

  /**
   * Verify admin token
   */
  async verifyAdminToken() {
    try {
      const response = await this.request("/admin/auth/verify-admin");
      return response.valid === true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Admin logout
   */
  async logout() {
    try {
      await this.request("/admin/auth/admin-logout", { method: "POST" });
    } finally {
      this.setToken(null);
    }
  }

  // ===== USER MANAGEMENT METHODS =====

  /**
   * Get all users with pagination
   */
  async getUsers(page = 1, limit = 20, search = "") {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (search) {
      params.append("search", search);
    }

    return await this.request(`/admin/users?${params}`);
  }

  /**
   * Get user by ID
   */
  async getUser(userId) {
    return await this.request(`/admin/users/${userId}`);
  }

  /**
   * Update user
   */
  async updateUser(userId, userData) {
    return await this.request(`/admin/users/${userId}`, {
      method: "PUT",
      body: JSON.stringify(userData),
    });
  }

  /**
   * Delete user
   */
  async deleteUser(userId) {
    return await this.request(`/admin/users/${userId}`, {
      method: "DELETE",
    });
  }

  /**
   * Toggle user active status
   */
  async toggleUserStatus(userId) {
    return await this.request(`/admin/users/${userId}/toggle-status`, {
      method: "PATCH",
    });
  }

  // ===== FOOD MANAGEMENT METHODS =====

  /**
   * Get all foods
   */
  async getFoods(page = 1, limit = 20, category = "", search = "") {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      category,
      search,
    });

    return await this.request(`/admin/foods?${params}`);
  }

  /**
   * Create new food item
   */
  async createFood(foodData) {
    return await this.request("/admin/foods", {
      method: "POST",
      body: JSON.stringify(foodData),
    });
  }

  /**
   * Update food item
   */
  async updateFood(foodId, foodData) {
    return await this.request(`/admin/foods/${foodId}`, {
      method: "PUT",
      body: JSON.stringify(foodData),
    });
  }

  /**
   * Delete food item
   */
  async deleteFood(foodId) {
    return await this.request(`/admin/foods/${foodId}`, {
      method: "DELETE",
    });
  }

  // ===== ANALYTICS METHODS =====

  /**
   * Get dashboard statistics
   */
  async getDashboardStats() {
    return await this.request("/admin/stats/dashboard");
  }

  /**
   * Get user analytics
   */
  async getUserAnalytics(period = "30d") {
    return await this.request(`/admin/analytics/users?period=${period}`);
  }

  /**
   * Get meal analytics
   */
  async getMealAnalytics(period = "30d") {
    return await this.request(`/admin/analytics/meals?period=${period}`);
  }

  /**
   * Get system health
   */
  async getSystemHealth() {
    return await this.request("/admin/system/health");
  }

  // ===== MEAL MANAGEMENT METHODS =====

  /**
   * Get all saved meals
   */
  async getAllMeals(page = 1, limit = 20, search = "") {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      search,
    });

    return await this.request(`/admin/meals?${params}`);
  }

  /**
   * Delete meal
   */
  async deleteMeal(mealId) {
    return await this.request(`/admin/meals/${mealId}`, {
      method: "DELETE",
    });
  }

  // ===== SETTINGS METHODS =====

  /**
   * Get admin settings
   */
  async getSettings() {
    return await this.request("/admin/settings");
  }

  /**
   * Update admin settings
   */
  async updateSettings(settings) {
    return await this.request("/admin/settings", {
      method: "PUT",
      body: JSON.stringify(settings),
    });
  }

  // ===== EXPORT METHODS =====

  /**
   * Export users data
   */
  async exportUsers(format = "csv") {
    const response = await fetch(
      `${this.baseURL}/admin/export/users?format=${format}`,
      {
        headers: {
          Authorization: `Bearer ${this.getToken()}`,
        },
        mode: 'cors',
        credentials: 'include',
      }
    );

    if (!response.ok) {
      let errorMessage = "Export failed";
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        // If response is not JSON, use status text
        errorMessage = response.statusText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    return response.blob();
  }

  /**
   * Export meals data
   */
  async exportMeals(format = "csv") {
    const response = await fetch(
      `${this.baseURL}/admin/export/meals?format=${format}`,
      {
        headers: {
          Authorization: `Bearer ${this.getToken()}`,
        },
        mode: 'cors',
        credentials: 'include',
      }
    );

    if (!response.ok) {
      let errorMessage = "Export failed";
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        // If response is not JSON, use status text
        errorMessage = response.statusText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    return response.blob();
  }

  /**
   * Export foods data
   */
  async exportFoods(format = "csv") {
    const response = await fetch(
      `${this.baseURL}/admin/export/foods?format=${format}`,
      {
        headers: {
          Authorization: `Bearer ${this.getToken()}`,
        },
        mode: 'cors',
        credentials: 'include',
      }
    );

    if (!response.ok) {
      let errorMessage = "Export failed";
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        // If response is not JSON, use status text
        errorMessage = response.statusText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    return response.blob();
  }
}

// Create global instance
window.AdminAPI = new AdminAPI();
