/**
 * Balanced Diet Recommendation System for Rwandan Parents
 * Main JavaScript File
 */

// Global variables
let foodData = null;
let selectedFoods = [];
let currentUser = null;

// DOM Elements
document.addEventListener("DOMContentLoaded", async () => {
  // Check if user is logged in (now async to verify database authentication)
  await checkAuthStatus();

  // Initialize page-specific functionality
  initPageFunctionality();

  // Register service worker for offline functionality
  registerServiceWorker();

  // Listen for food data loaded event from api.js
  document.addEventListener('foodDataLoaded', handleFoodDataLoaded);
  document.addEventListener('foodDataLoadError', handleFoodDataLoadError);

  // If foodDataManager is already available and data is loaded, handle it immediately
  if (window.foodDataManager && window.foodData) {
    handleFoodDataLoaded({ detail: { foodData: window.foodData } });
  }
});

/**
 * Check if user is logged in and update UI accordingly
 * Also verifies database authentication if online
 */
async function checkAuthStatus() {
  const userDataString = localStorage.getItem("currentUser");
  const authToken = localStorage.getItem("authToken");

  if (userDataString) {
    currentUser = JSON.parse(userDataString);

    // If user has database authentication, verify token is still valid
    if (currentUser.source === 'database' && authToken) {
      await verifyDatabaseAuthentication(authToken);
    }

    updateUIForLoggedInUser();
  } else {
    updateUIForGuestUser();
  }
}

/**
 * Verify database authentication token is still valid
 * @param {string} token - Authentication token
 */
async function verifyDatabaseAuthentication(token) {
  try {
    // Only verify if we have connectivity utilities and are online
    if (typeof connectivityUtils !== 'undefined') {
      const connectivity = await connectivityUtils.checkInternetConnection();

      if (connectivity && typeof apiService !== 'undefined') {
        // Try to verify the token with the backend
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
          console.log("Database authentication token invalid, clearing session");
          // Clear invalid authentication
          localStorage.removeItem("currentUser");
          localStorage.removeItem("authToken");
          if (typeof apiService !== 'undefined') {
            apiService.setToken(null);
          }
          currentUser = null;
          updateUIForGuestUser();
        } else {
          console.log("Database authentication verified successfully");
        }
      }
    }
  } catch (error) {
    console.warn("Could not verify database authentication:", error);
    // Don't clear session on network errors, just log the warning
  }
}

/**
 * Update UI elements for logged in users
 */
function updateUIForLoggedInUser() {
  const authElements = document.querySelectorAll(".auth-dependent");
  const guestElements = document.querySelectorAll(".guest-only");
  const userNameElements = document.querySelectorAll(".user-name");

  authElements.forEach((el) => el.classList.remove("hidden"));
  guestElements.forEach((el) => el.classList.add("hidden"));

  if (userNameElements) {
    userNameElements.forEach((el) => {
      el.textContent = currentUser.name;
    });
  }
}

/**
 * Update UI elements for guest users
 */
function updateUIForGuestUser() {
  const authElements = document.querySelectorAll(".auth-dependent");
  const guestElements = document.querySelectorAll(".guest-only");

  authElements.forEach((el) => el.classList.add("hidden"));
  guestElements.forEach((el) => el.classList.remove("hidden"));
}

/**
 * Handle food data loaded event from api.js
 */
function handleFoodDataLoaded(event) {
  try {
    foodData = event.detail.foodData;
    console.log("✅ Food data received from api.js");

    // Initialize food selection UI if on dashboard page
    const foodSelectionContainer = document.getElementById("food-selection");
    if (foodSelectionContainer) {
      populateFoodSelection(foodSelectionContainer);
    }

  } catch (error) {
    console.error("Error handling food data loaded event:", error);
    handleFoodDataLoadError({ detail: { error: error.message } });
  }
}

/**
 * Handle food data load error event from api.js
 */
function handleFoodDataLoadError(event) {
  console.error("Food data load error:", event.detail.error);

  // Try to load from localStorage if available (for offline use)
  const cachedData = localStorage.getItem("foodData");
  if (cachedData) {
    try {
      foodData = JSON.parse(cachedData);
      window.foodData = foodData;
      console.log("✅ Loaded food data from cache (offline mode)");

      // Initialize food selection UI if on dashboard page
      const foodSelectionContainer = document.getElementById("food-selection");
      if (foodSelectionContainer) {
        populateFoodSelection(foodSelectionContainer);
      }

      // Show contextual warning
      let warningMessage = "Using cached food data (offline mode).";
      if (event.detail.error.includes('Backend server is not responding')) {
        warningMessage += " Please start the backend server to get the latest data.";
      } else if (event.detail.error.includes('Network connection failed')) {
        warningMessage += " Please check your internet connection to get the latest data.";
      } else {
        warningMessage += " Please resolve the server issue to get the latest data.";
      }
      showError(warningMessage);

    } catch (parseError) {
      console.error("Error parsing cached food data:", parseError);

      // Provide specific error message based on the original error
      let errorMessage = "Failed to load food data.";
      if (event.detail.error.includes('Backend server is not responding')) {
        errorMessage += " Please start the backend server (npm start) and refresh the page.";
      } else if (event.detail.error.includes('Network connection failed')) {
        errorMessage += " Please check your internet connection and ensure the backend server is running.";
      } else {
        errorMessage += " Please check the server status and try again.";
      }
      showError(errorMessage);
    }
  } else {
    // No cached data available - provide specific guidance
    let errorMessage = "Failed to load food data and no cached data available.";
    if (event.detail.error.includes('Backend server is not responding')) {
      errorMessage += " Please start the backend server with 'npm start' and refresh the page.";
    } else if (event.detail.error.includes('Network connection failed')) {
      errorMessage += " Please check your internet connection and ensure the backend server is running.";
    } else if (event.detail.error.includes('Food data manager is not available')) {
      errorMessage += " Please ensure api.js is properly loaded before main.js.";
    } else {
      errorMessage += " Please check the server status and try again.";
    }
    showError(errorMessage);
  }
}

/**
 * Load food data from API or localStorage (legacy function - now handled by api.js)
 * This function is kept for backward compatibility but should not be called directly
 */
async function loadFoodData() {
  console.warn("loadFoodData() called directly - this should be handled by api.js events");

  // If foodDataManager is available, try to get data
  if (window.foodDataManager) {
    try {
      foodData = await window.foodDataManager.getFoodData();
      handleFoodDataLoaded({ detail: { foodData: foodData } });
    } catch (error) {
      handleFoodDataLoadError({ detail: { error: error.message } });
    }
  } else {
    // Wait a bit for api.js to load and try again
    setTimeout(() => {
      if (window.foodDataManager) {
        loadFoodData();
      } else {
        handleFoodDataLoadError({ detail: { error: "Food data manager is not available. Please ensure api.js is loaded." } });
      }
    }, 100);
  }
}

/**
 * Initialize page-specific functionality based on current page
 */
function initPageFunctionality() {
  const currentPage = window.location.pathname.split("/").pop();

  // Check if dashboard page and redirect if not logged in
  if (currentPage === "dashboard.html" && !currentUser) {
    window.location.href = "login.html";
    return;
  }

  switch (currentPage) {
    case "home.html":
    case "":
      initLoginPage();
      break;
    case "login.html":
      initLoginPage();
      break;
    case "signup.html":
      initLoginPage(); // This initializes the registration form
      break;
    case "index.html":
      initDashboardPage();
      break;
    case "dashboard.html":
      // Dashboard.js handles initialization
      break;
    case "budget.html":
      initBudgetPage();
      break;
    default:
      // Default initialization
      break;
  }
}

/**
 * Initialize login page functionality
 */
function initLoginPage() {
  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");
  const guestButton = document.getElementById("guest-access");

  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin);
  }

  if (registerForm) {
    registerForm.addEventListener("submit", handleRegister);
  }

  if (guestButton) {
    guestButton.addEventListener("click", () => {
      window.location.href = "index.html";
    });
  }
}

/**
 * Initialize dashboard page functionality
 */
function initDashboardPage() {
  const groceryForm = document.getElementById("grocery-form");

  if (groceryForm) {
    groceryForm.addEventListener("submit", (e) => {
      e.preventDefault();
      // Check if analyzeDiet function exists (from diet-analysis.js)
      if (typeof analyzeDiet === "function") {
        analyzeDiet();
      } else {
        showError("Diet analysis functionality is not available.");
      }
    });
  }

  // Load saved groceries for logged in users
  if (
    currentUser &&
    currentUser.savedGroceries &&
    typeof loadSavedGroceries === "function"
  ) {
    loadSavedGroceries();
  }
}

/**
 * Initialize budget page functionality
 */
function initBudgetPage() {
  const budgetForm = document.getElementById("budget-form");

  if (budgetForm) {
    budgetForm.addEventListener("submit", (e) => {
      e.preventDefault();
      generateBudgetRecommendations();
    });
  }

  // Load budget history for logged in users
  if (currentUser && typeof loadBudgetHistory === "function") {
    loadBudgetHistory();
  }
}

/**
 * Populate food selection UI with food items from data
 */
function populateFoodSelection(container) {
  if (!foodData || !foodData.foods) return;

  // Create a single food list container
  const foodList = document.createElement("div");
  foodList.className = "food-list";

  // Sort foods alphabetically by name
  const sortedFoods = [...foodData.foods].sort((a, b) =>
    a.name.en.localeCompare(b.name.en)
  );

  // Add all foods to the list without categorization
  sortedFoods.forEach((food) => {
    const foodItem = document.createElement("div");
    foodItem.className = "food-item";
    foodItem.dataset.foodId = food.id;
    foodItem.dataset.category = food.category; // Keep category data attribute for search filtering
    foodItem.dataset.nameEn = food.name.en;
    foodItem.dataset.nameRw = food.name.rw;

    // Get current language from language manager
    const currentLang = window.languageManager ? window.languageManager.getCurrentLanguage() : 'en';
    const displayName = currentLang === 'rw' ?
      `${food.name.rw} (${food.name.en})` :
      `${food.name.en} (${food.name.rw})`;

    const quantityLabel = currentLang === 'rw' ? 'Ingano:' : 'Quantity:';

    foodItem.innerHTML = `
      <div class="food-checkbox">
        <input type="checkbox" id="food-${food.id}" data-food-id="${food.id}">
        <label for="food-${food.id}" class="food-name-label">${displayName}</label>
      </div>
      <div class="food-quantity hidden">
        <label for="quantity-${food.id}" data-translate="food.quantity">${quantityLabel}</label>
        <input type="number" id="quantity-${food.id}" min="1" value="1">
        <select id="unit-${food.id}">
          ${food.quantityUnits
            .map((unit) => `<option value="${unit}">${unit}</option>`)
            .join("")}
        </select>
      </div>
    `;

    foodList.appendChild(foodItem);

    // Add event listener to checkbox
    setTimeout(() => {
      const checkbox = document.getElementById(`food-${food.id}`);
      if (checkbox) {
        checkbox.addEventListener("change", (e) => {
          const quantityDiv = e.target
            .closest(".food-item")
            .querySelector(".food-quantity");
          if (e.target.checked) {
            quantityDiv.classList.remove("hidden");
            // Check if addFoodToSelection function exists (from diet-analysis.js)
            if (typeof addFoodToSelection === "function") {
              addFoodToSelection(food.id);
            } else {
              console.error("addFoodToSelection function is not available");
            }
          } else {
            quantityDiv.classList.add("hidden");
            // Check if removeFoodFromSelection function exists (from diet-analysis.js)
            if (typeof removeFoodFromSelection === "function") {
              removeFoodFromSelection(food.id);
            } else {
              console.error(
                "removeFoodFromSelection function is not available"
              );
            }
          }
        });
      }
    }, 0);
  });

  // Add the food list to the container
  container.appendChild(foodList);

  // Listen for language changes to update food names
  document.addEventListener('languageChanged', (event) => {
    updateFoodNamesDisplay(event.detail.language);
  });
}

/**
 * Update food names display based on current language
 */
function updateFoodNamesDisplay(language) {
  const foodItems = document.querySelectorAll('.food-item');

  foodItems.forEach(item => {
    const nameEn = item.dataset.nameEn;
    const nameRw = item.dataset.nameRw;
    const label = item.querySelector('.food-name-label');

    if (label && nameEn && nameRw) {
      const displayName = language === 'rw' ?
        `${nameRw} (${nameEn})` :
        `${nameEn} (${nameRw})`;
      label.textContent = displayName;
    }

    // Update quantity label
    const quantityLabel = item.querySelector('.food-quantity label[data-translate="food.quantity"]');
    if (quantityLabel) {
      quantityLabel.textContent = language === 'rw' ? 'Ingano:' : 'Quantity:';
    }
  });
}

/**
 * Register service worker for offline functionality
 */
function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("./js/service-worker.js")
        .then((registration) => {
          console.log(
            "ServiceWorker registration successful with scope: ",
            registration.scope
          );

          // Check for updates
          registration.addEventListener('updatefound', () => {
            console.log('Service Worker update found');
          });

          // Force update if there's a waiting service worker
          if (registration.waiting) {
            registration.waiting.postMessage({ type: 'SKIP_WAITING' });
          }
        })
        .catch((err) => {
          console.log("ServiceWorker registration failed: ", err);
        });
    });

    // Listen for service worker updates
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      console.log('Service Worker updated, reloading page...');
      window.location.reload();
    });
  }
}

/**
 * Show error message to user
 */
function showError(message) {
  const errorContainer = document.getElementById("error-container");
  if (errorContainer) {
    errorContainer.textContent = message;
    errorContainer.classList.remove("hidden");

    // Hide after 5 seconds
    setTimeout(() => {
      errorContainer.classList.add("hidden");
    }, 5000);
  } else {
    alert(message);
  }
}

/**
 * Show success message to user
 */
function showSuccess(message) {
  const successContainer = document.getElementById("success-container");
  if (successContainer) {
    successContainer.textContent = message;
    successContainer.classList.remove("hidden");

    // Hide after 5 seconds
    setTimeout(() => {
      successContainer.classList.add("hidden");
    }, 5000);
  } else {
    alert(message);
  }
}
