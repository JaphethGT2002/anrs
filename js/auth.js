/**
 * Balanced Diet Recommendation System for Rwandan Parents
 * Authentication JavaScript File
 */

/**
 * Handle user login with database integration when online
 * @param {Event} e - Form submit event
 */
async function handleLogin(e) {
  e.preventDefault();
  console.log("Login form submitted");

  const emailInput = document.getElementById("login-email");
  const passwordInput = document.getElementById("login-password");
  const errorContainer = document.getElementById("login-error");
  const submitButton = e.target.querySelector('button[type="submit"]');

  console.log("Login form elements:", {
    emailInput,
    passwordInput,
    errorContainer,
  });

  if (!emailInput || !passwordInput) {
    console.error("Login form elements not found");
    return;
  }

  const email = emailInput.value.trim();
  const password = passwordInput.value;

  // Basic validation
  if (!email || !password) {
    if (errorContainer) {
      errorContainer.textContent = "Please enter both email and password.";
      errorContainer.classList.remove("hidden");
    }
    return;
  }

  // Disable submit button to prevent double submission
  if (submitButton) {
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
  }

  try {
    console.log("Starting login process...");

    // Step 1: Check internet connectivity
    let connectivity = { internet: false, server: false };

    if (typeof connectivityUtils !== 'undefined') {
      console.log("Checking connectivity...");
      connectivity = await connectivityUtils.performConnectivityCheck();
    } else {
      console.warn("connectivityUtils not available, assuming offline");
    }

    let loginSuccessful = false;
    let userInfo = null;

    // Step 2: Try database authentication if online
    if (connectivity.internet && connectivity.server) {
      console.log("Attempting database authentication...");

      try {
        if (typeof apiService === 'undefined') {
          throw new Error("API service not available");
        }

        const loginResult = await apiService.login(email, password);

        if (loginResult.success && loginResult.token) {
          console.log("Database authentication successful");

          // Store authentication token
          if (typeof apiService !== 'undefined') {
            apiService.setToken(loginResult.token);
          }
          localStorage.setItem('authToken', loginResult.token);

          // Store user info from database response
          userInfo = {
            id: loginResult.user?.id,
            name: loginResult.user?.name || email.split('@')[0],
            email: email,
            isAuthenticated: true,
            source: 'database',
            loginTime: new Date().toISOString()
          };

          loginSuccessful = true;
          console.log("Database login successful:", userInfo);

        } else {
          console.log("Database authentication failed, trying offline mode");
        }

      } catch (error) {
        console.error("Database authentication error:", error);
        console.log("Falling back to offline authentication");
      }
    }

    // Step 3: Fallback to localStorage authentication if database failed or offline
    if (!loginSuccessful) {
      console.log("Attempting offline authentication...");

      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const user = users.find((u) => u.email === email);

      if (user && user.password === password) {
        console.log("Offline authentication successful");

        // Store user info from localStorage
        const { password: _, ...userWithoutPassword } = user;
        userInfo = {
          ...userWithoutPassword,
          isAuthenticated: true,
          source: 'localStorage',
          loginTime: new Date().toISOString()
        };

        loginSuccessful = true;
        console.log("Offline login successful:", userInfo);
      }
    }

    // Step 4: Handle login result
    if (loginSuccessful && userInfo) {
      // Store current user info
      localStorage.setItem("currentUser", JSON.stringify(userInfo));
      console.log("Current user saved to localStorage:", userInfo);

      // Show success message
      if (errorContainer) {
        const sourceText = userInfo.source === 'database' ? '(Online)' : '(Offline)';
        errorContainer.textContent = `Login successful! ${sourceText} Redirecting to dashboard...`;
        errorContainer.classList.remove("hidden");
        errorContainer.style.backgroundColor = "#e8f5e9";
        errorContainer.style.color = "#2e7d32";
      }

      console.log("Login successful, redirecting to dashboard...");

      // Redirect to dashboard after a short delay
      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 1500);

    } else {
      // Login failed
      if (errorContainer) {
        let errorMessage = "Invalid email or password.";
        if (connectivity.internet && connectivity.server) {
          errorMessage += " Please check your credentials and try again.";
        } else {
          errorMessage += " Please check your credentials or ensure you have an internet connection for database authentication.";
        }
        errorContainer.textContent = errorMessage;
        errorContainer.classList.remove("hidden");
        errorContainer.style.backgroundColor = "#ffebee";
        errorContainer.style.color = "#c62828";
      }
    }

  } catch (error) {
    console.error("Login process failed:", error);

    if (errorContainer) {
      errorContainer.textContent = "An unexpected error occurred during login. Please try again.";
      errorContainer.classList.remove("hidden");
      errorContainer.style.backgroundColor = "#ffebee";
      errorContainer.style.color = "#c62828";
    }

  } finally {
    // Re-enable submit button
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.innerHTML = '<i class="fas fa-sign-in-alt"></i> Login';
    }
  }
}

/**
 * Handle user registration with backend integration and comprehensive notifications
 * @param {Event} e - Form submit event
 */
async function handleRegister(e) {
  e.preventDefault();
  console.log("Registration form submitted");

  const nameInput = document.getElementById("register-name");
  const emailInput = document.getElementById("register-email");
  const passwordInput = document.getElementById("register-password");
  const confirmPasswordInput = document.getElementById("register-confirm-password");
  const errorContainer = document.getElementById("register-error");
  const successContainer = document.getElementById("register-success");
  const submitButton = e.target.querySelector('button[type="submit"]');

  // Hide any existing messages
  if (errorContainer) {
    errorContainer.classList.add("hidden");
    errorContainer.textContent = "";
  }
  if (successContainer) {
    successContainer.classList.add("hidden");
    successContainer.textContent = "";
  }

  // Validate form elements exist
  if (!nameInput || !emailInput || !passwordInput || !confirmPasswordInput) {
    const errorMsg = "Required form elements not found";
    console.error(errorMsg);
    if (typeof notifications !== 'undefined') {
      notifications.error("Form Error", errorMsg);
    }
    if (errorContainer) {
      errorContainer.textContent = errorMsg;
      errorContainer.classList.remove("hidden");
    }
    return;
  }

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const password = passwordInput.value;
  const confirmPassword = confirmPasswordInput.value;

  console.log("Form data:", { name, email, passwordLength: password.length });

  // Basic validation
  if (!name || !email || !password || !confirmPassword) {
    const errorMsg = "Please fill in all fields";
    console.error(errorMsg);
    if (typeof notifications !== 'undefined') {
      notifications.error("Validation Error", errorMsg);
    }
    if (errorContainer) {
      errorContainer.textContent = errorMsg;
      errorContainer.classList.remove("hidden");
    }
    return;
  }

  if (password !== confirmPassword) {
    const errorMsg = "Passwords do not match";
    console.error(errorMsg);
    if (typeof notifications !== 'undefined') {
      notifications.error("Validation Error", errorMsg);
    }
    if (errorContainer) {
      errorContainer.textContent = errorMsg;
      errorContainer.classList.remove("hidden");
    }
    return;
  }

  // Additional password validation
  if (password.length < 6) {
    const errorMsg = "Password must be at least 6 characters long";
    console.error(errorMsg);
    if (typeof notifications !== 'undefined') {
      notifications.error("Validation Error", errorMsg);
    }
    if (errorContainer) {
      errorContainer.textContent = errorMsg;
      errorContainer.classList.remove("hidden");
    }
    return;
  }

  // Disable submit button to prevent double submission
  if (submitButton) {
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...';
  }

  try {
    console.log("Starting registration process...");

    // Step 1: Check internet connectivity
    if (typeof notifications !== 'undefined') {
      notifications.info("Step 1/4", "Checking internet connectivity...", { id: 'step-1' });
    }

    let connectivity = { internet: true, server: true };

    if (typeof connectivityUtils !== 'undefined') {
      connectivity = await connectivityUtils.performConnectivityCheck();
      if (typeof notifications !== 'undefined') {
        notifications.remove('step-1');
      }
    } else {
      console.warn("connectivityUtils not available, assuming online");
      if (typeof notifications !== 'undefined') {
        notifications.remove('step-1');
      }
    }

    if (!connectivity.internet) {
      console.log("No internet connection, using offline registration");
      // Handle offline registration
      await handleOfflineRegistration({ name, email, password });
      return;
    }

    // Step 2: Attempt database registration
    console.log("Step 2: Attempting database registration");
    if (typeof notifications !== 'undefined') {
      notifications.info("Step 2/4", "Creating account in database...", { id: 'step-2' });
    }

    let registrationResult;
    let isOnlineRegistration = false;

    try {
      if (typeof apiService === 'undefined') {
        throw new Error("API service not available");
      }

      console.log("Calling apiService.register with:", { name, email });
      registrationResult = await apiService.register({ name, email, password });
      isOnlineRegistration = true;

      console.log("Registration successful:", registrationResult);

      if (typeof notifications !== 'undefined') {
        notifications.remove('step-2');
        notifications.success("Database Registration", "Account created successfully in database");
      }

      if (successContainer) {
        successContainer.textContent = "Account created successfully!";
        successContainer.classList.remove("hidden");
      }

    } catch (error) {
      console.error("Database registration failed:", error);

      if (typeof notifications !== 'undefined') {
        notifications.remove('step-2');
      }

      if (error.message.includes('already exists') || error.message.includes('409')) {
        const errorMsg = "An account with this email already exists";
        console.error(errorMsg);

        if (typeof notifications !== 'undefined') {
          notifications.error("Registration Failed", errorMsg);
        }
        if (errorContainer) {
          errorContainer.textContent = errorMsg;
          errorContainer.classList.remove("hidden");
        }
        return;
      }

      // For other errors, try offline registration
      console.log("Falling back to offline registration");
      if (typeof notifications !== 'undefined') {
        notifications.warning("Database Unavailable", "Falling back to offline registration");
      }
      await handleOfflineRegistration({ name, email, password });
      return;
    }
    // } else {
    //   notifications.remove('step-2');
    //   notifications.warning("Server Unavailable", "Registering in offline mode");
    //   await handleOfflineRegistration({ name, email, password });
    //   return;
    // }

    // Step 3: Verify database insertion (only for online registration)
    if (isOnlineRegistration && registrationResult.token) {
      console.log("Step 3: Verifying database insertion");
      if (typeof notifications !== 'undefined') {
        notifications.info("Step 3/4", "Verifying database insertion...", { id: 'step-3' });
      }

      let isVerified = false;
      if (typeof connectivityUtils !== 'undefined') {
        isVerified = await connectivityUtils.verifyDatabaseInsertion(email, registrationResult.token);
      } else {
        // Assume verified if we got a token
        isVerified = true;
        console.log("connectivityUtils not available, assuming verification successful");
      }

      if (typeof notifications !== 'undefined') {
        notifications.remove('step-3');

        if (isVerified) {
          notifications.success("Database Verified", "Account successfully verified in database");
        } else {
          notifications.warning("Verification Failed", "Could not verify database insertion, but registration may have succeeded");
        }
      }
    }

    // Step 4: Store authentication token only (not user data since it's in database)
    console.log("Step 4: Setting up authentication");
    if (typeof notifications !== 'undefined') {
      notifications.info("Step 4/4", "Setting up authentication...", { id: 'step-4' });
    }

    // Store authentication token for API requests
    if (registrationResult.token) {
      if (typeof apiService !== 'undefined') {
        apiService.setToken(registrationResult.token);
      }
      localStorage.setItem('authToken', registrationResult.token);
      console.log("Auth token stored");
    }

    // Store minimal current user info for UI purposes (without duplicating database data)
    const currentUserInfo = {
      id: registrationResult.user?.id,
      name,
      email,
      isAuthenticated: true,
      source: 'database',
      loginTime: new Date().toISOString()
    };
    localStorage.setItem('currentUser', JSON.stringify(currentUserInfo));
    console.log("Current user info stored:", currentUserInfo);

    if (typeof notifications !== 'undefined') {
      notifications.remove('step-4');
      notifications.success("Authentication Setup", "User session established successfully");

      // Final success notification
      notifications.success(
        "Registration Complete!",
        "Your account has been created successfully. Redirecting to dashboard...",
        { duration: 3000 }
      );
    }

    if (successContainer) {
      successContainer.textContent = "Registration successful! Redirecting to dashboard...";
      successContainer.classList.remove("hidden");
    }

    console.log("Registration completed successfully, redirecting to dashboard");

    // Redirect to dashboard
    setTimeout(() => {
      window.location.href = "dashboard.html";
    }, 2000);

  } catch (error) {
    console.error("Registration process failed:", error);

    const errorMsg = error.message || "An unexpected error occurred during registration";

    if (typeof notifications !== 'undefined') {
      notifications.error(
        "Registration Failed",
        "An unexpected error occurred: " + errorMsg,
        { duration: 8000 }
      );
    }

    if (errorContainer) {
      errorContainer.textContent = errorMsg;
      errorContainer.classList.remove("hidden");
    }

  } finally {
    // Re-enable submit button
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.innerHTML = '<i class="fas fa-user-plus"></i> Sign Up';
    }
  }
}

/**
 * Handle offline registration when internet/server is unavailable
 * @param {Object} userData - User registration data
 */
async function handleOfflineRegistration(userData) {
  const { name, email, password } = userData;

  try {
    // Check if email already exists in localStorage
    const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");
    if (existingUsers.some(user => user.email === email)) {
      notifications.error("Registration Failed", "An account with this email already exists locally");
      return;
    }

    notifications.info("Offline Mode", "Creating account in offline mode...", { id: 'offline-reg' });

    // Create user data for offline storage
    const offlineUserData = {
      id: Date.now().toString(),
      name,
      email,
      password, // Store password for later sync (in production, consider encryption)
      createdAt: new Date().toISOString()
    };

    // Store in localStorage with offline flag
    const success = connectivityUtils.storeUserDataLocally(offlineUserData, 'offline');
    notifications.remove('offline-reg');

    if (success) {
      notifications.success(
        "Offline Registration Complete",
        "Account created locally. It will be synced when internet connection is restored.",
        { duration: 5000 }
      );

      // Redirect to dashboard
      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 2000);
    } else {
      notifications.error("Offline Registration Failed", "Unable to create account locally");
    }

  } catch (error) {
    console.error("Offline registration failed:", error);
    notifications.error("Offline Registration Failed", "Unable to create account: " + error.message);
  }
}

/**
 * Handle user logout with database integration
 */
async function handleLogout() {
  try {
    // Log the logout activity if on dashboard
    if (
      window.location.pathname.includes("dashboard.html") &&
      typeof logUserActivity === "function"
    ) {
      logUserActivity("logout");
    }

    // Get current user info to check authentication source
    const currentUserString = localStorage.getItem("currentUser");
    const currentUser = currentUserString ? JSON.parse(currentUserString) : null;

    // If user was authenticated via database, notify the backend
    if (currentUser && currentUser.source === 'database' && typeof apiService !== 'undefined') {
      try {
        await apiService.logout();
        console.log("Database logout successful");
      } catch (error) {
        console.warn("Database logout failed:", error);
        // Continue with local logout even if database logout fails
      }
    }

    // Clear all authentication data
    localStorage.removeItem("currentUser");
    localStorage.removeItem("authToken");

    // Clear API service token
    if (typeof apiService !== 'undefined') {
      apiService.setToken(null);
    }

    console.log("Logout completed, redirecting to home page");

  } catch (error) {
    console.error("Logout process failed:", error);
    // Still clear local data even if there's an error
    localStorage.removeItem("currentUser");
    localStorage.removeItem("authToken");
    if (typeof apiService !== 'undefined') {
      apiService.setToken(null);
    }
  }

  // Redirect to home page
  window.location.href = "home.html";
}

/**
 * Toggle between login and register forms
 */
function toggleAuthForms() {
  const loginForm = document.getElementById("login-form-container");
  const registerForm = document.getElementById("register-form-container");
  const toggleBtn = document.getElementById("toggle-auth-btn");

  if (!loginForm || !registerForm || !toggleBtn) return;

  if (loginForm.classList.contains("hidden")) {
    // Show login form
    loginForm.classList.remove("hidden");
    registerForm.classList.add("hidden");
    toggleBtn.textContent = "Need an account? Register";
  } else {
    // Show register form
    loginForm.classList.add("hidden");
    registerForm.classList.remove("hidden");
    toggleBtn.textContent = "Already have an account? Login";
  }
}
