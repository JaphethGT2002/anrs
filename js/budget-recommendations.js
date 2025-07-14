/**
 * Balanced Diet Recommendation System for Rwandan Parents
 * Budget Recommendations JavaScript File
 */

/**
 * Generate meal recommendations based on budget
 */
function generateBudgetRecommendations() {
  const budgetInput = document.getElementById('budget-amount');
  const resultsContainer = document.getElementById('budget-results');

  if (!budgetInput || !resultsContainer) {
    console.error('Budget form elements not found');
    return;
  }

  const budgetValue = budgetInput.value.trim();
  const budget = parseInt(budgetValue);

  // Enhanced input validation
  if (!budgetValue) {
    const errorMessage = window.languageManager ?
      window.languageManager.getTranslation('budget.error.empty.amount') || 'Please enter a budget amount.' :
      'Please enter a budget amount.';
    showError(errorMessage);
    budgetInput.focus();
    return;
  }

  if (isNaN(budget) || budget <= 0) {
    const errorMessage = window.languageManager ?
      window.languageManager.getTranslation('budget.error.invalid.amount') || 'Please enter a valid budget amount.' :
      'Please enter a valid budget amount.';
    showError(errorMessage);
    budgetInput.focus();
    return;
  }

  // Check minimum budget requirement
  const minBudget = 200;
  if (budget < minBudget) {
    const errorMessage = window.languageManager ?
      window.languageManager.getTranslation('budget.error.too.low') || `Budget must be at least ${minBudget} RWF for meal recommendations.` :
      `Budget must be at least ${minBudget} RWF for meal recommendations.`;
    showError(errorMessage);
    budgetInput.focus();
    return;
  }

  // Check maximum reasonable budget
  const maxBudget = 30000;
  if (budget > maxBudget) {
    const errorMessage = window.languageManager ?
      window.languageManager.getTranslation('budget.error.too.high') || `Budget seems unusually high. Please enter a reasonable amount under ${maxBudget} RWF.` :
      `Budget seems unusually high. Please enter a reasonable amount under ${maxBudget} RWF.`;
    showError(errorMessage);
    budgetInput.focus();
    return;
  }

  // Check if food data is available
  if (!window.foodData || !window.foodData.foods || !window.foodData.categories) {
    console.error('Food data not available');
    const errorMessage = window.languageManager ?
      window.languageManager.getTranslation('budget.error.no.data') || 'Food data is not available. Please try again later.' :
      'Food data is not available. Please try again later.';
    showError(errorMessage);
    return;
  }

  // Show loading state with better UX
  const loadingMessage = window.languageManager ?
    window.languageManager.getTranslation('budget.loading.message') || 'Generating meal recommendations...' :
    'Generating meal recommendations...';

  resultsContainer.innerHTML = `
    <div class="card loading-card slide-up">
      <div class="card-content">
        <div class="loading-spinner">
          <i class="fas fa-spinner fa-spin"></i>
          <p>${loadingMessage}</p>
          <div class="loading-progress">
            <div class="progress-bar">
              <div class="progress-fill"></div>
            </div>
            <small>Analyzing ${budget} RWF budget...</small>
          </div>
        </div>
      </div>
    </div>
  `;

  // Generate meal recommendations with a small delay to show loading
  setTimeout(() => {
    try {
      const recommendations = generateMealRecommendationsForBudget(budget);
      displayRecommendations(budget, recommendations, resultsContainer);
    } catch (error) {
      console.error('Error generating recommendations:', error);
      const errorMessage = 'An error occurred while generating recommendations. Please try again.';
      showError(errorMessage);
      resultsContainer.innerHTML = '';
    }
  }, 500);
}

/**
 * Display the generated recommendations
 */
function displayRecommendations(budget, recommendations, resultsContainer) {
  // Clear loading state
  resultsContainer.innerHTML = '';
  if (recommendations.length === 0) {
    const noRecommendationsTitle = window.languageManager ?
      window.languageManager.getTranslation('budget.error.no.recommendations') || 'No Recommendations Available' :
      'No Recommendations Available';
    const noRecommendationsDesc = window.languageManager ?
      window.languageManager.getTranslation('budget.error.no.recommendations.description') || 'We couldn\'t generate balanced meal recommendations for your budget of' :
      'We couldn\'t generate balanced meal recommendations for your budget of';
    const noRecommendationsSuggestion = window.languageManager ?
      window.languageManager.getTranslation('budget.error.no.recommendations.suggestion') || 'Try increasing your budget or check back later for more affordable options.' :
      'Try increasing your budget or check back later for more affordable options.';

    resultsContainer.innerHTML = `
      <div class="card error-card slide-up">
        <div class="card-header">
          <i class="fas fa-exclamation-circle"></i>
          <h3>${noRecommendationsTitle}</h3>
        </div>
        <div class="card-content">
          <p>${noRecommendationsDesc} ${budget} RWF.</p>
          <p>${noRecommendationsSuggestion}</p>
        </div>
      </div>
    `;
    return;
  }
  
  // Display recommendations
  const recommendationsCard = document.createElement('div');
  recommendationsCard.className = 'card recommendations-card slide-up';

  const recommendationsTitle = window.languageManager ?
    window.languageManager.getTranslation('budget.results.title') || 'Meal Recommendations for' :
    'Meal Recommendations for';
  const recommendationsDesc = window.languageManager ?
    window.languageManager.getTranslation('budget.results.description') || 'Here are balanced meal options within your budget:' :
    'Here are balanced meal options within your budget:';

  recommendationsCard.innerHTML = `
    <div class="card-header">
      <i class="fas fa-utensils"></i>
      <h3>${recommendationsTitle} ${budget} RWF</h3>
    </div>
    <div class="card-content">
      <p>${recommendationsDesc}</p>
      <div class="meal-options">
        ${recommendations.map((meal, index) => {
          // Get translations for static text
          const optionText = window.languageManager ?
            window.languageManager.getTranslation('budget.results.option') || 'Option' : 'Option';
          const ingredientsText = window.languageManager ?
            window.languageManager.getTranslation('budget.results.ingredients') || 'Ingredients:' : 'Ingredients:';
          const nutritionText = window.languageManager ?
            window.languageManager.getTranslation('budget.results.nutrition') || 'Nutrition:' : 'Nutrition:';
          const totalCostText = window.languageManager ?
            window.languageManager.getTranslation('budget.results.total.cost') || 'Total Cost:' : 'Total Cost:';
          const savingsText = window.languageManager ?
            window.languageManager.getTranslation('budget.results.savings') || 'Savings:' : 'Savings:';
          const preparationText = window.languageManager ?
            window.languageManager.getTranslation('budget.results.preparation') || 'Preparation Tip:' : 'Preparation Tip:';
          const saveMealText = window.languageManager ?
            window.languageManager.getTranslation('budget.results.save.meal') || 'Save This Meal' : 'Save This Meal';

          return `
            <div class="meal-option">
              <h4>${optionText} ${index + 1}: ${meal.name}</h4>
              <div class="meal-details">
                <div class="meal-ingredients">
                  <h5>${ingredientsText}</h5>
                <ul>
                  ${meal.foods.map(food => {
                    // Get current language for food name
                    const currentLang = window.languageManager ? window.languageManager.getCurrentLanguage() : 'en';
                    const primaryName = currentLang === 'rw' ? food.name.rw : food.name.en;
                    const secondaryName = currentLang === 'rw' ? food.name.en : food.name.rw;
                    const displayName = `${primaryName} (${secondaryName})`;

                    return `
                      <li>
                        <span class="food-name">${displayName}</span>
                        <span class="food-quantity">${food.quantity} ${food.unit}</span>
                        <span class="food-price">${food.price * food.quantity} RWF</span>
                      </li>
                    `;
                  }).join('')}
                </ul>
              </div>
              <div class="meal-nutrition">
                <h5>${nutritionText}</h5>
                <div class="nutrition-categories">
                  ${Object.keys(meal.nutritionBreakdown).map(categoryId => {
                    const category = window.foodData.categories.find(c => c.id === categoryId);
                    if (!category) {
                      console.warn('Category not found:', categoryId);
                      return '';
                    }

                    // Get current language for category name
                    const currentLang = window.languageManager ? window.languageManager.getCurrentLanguage() : 'en';
                    const categoryName = currentLang === 'rw' ? category.name.rw : category.name.en;

                    return `
                      <div class="nutrition-category">
                        <span class="category-badge category-${categoryId}" style="background-color: ${category.color};">
                          <i class="fas fa-${category.icon}"></i> ${categoryName}
                        </span>
                        <div class="nutrition-bar">
                          <div class="nutrition-fill" style="width: ${meal.nutritionBreakdown[categoryId]}%; background-color: ${category.color};"></div>
                        </div>
                        <span class="nutrition-percentage">${meal.nutritionBreakdown[categoryId]}%</span>
                      </div>
                    `;
                  }).filter(html => html !== '').join('')}
                </div>
              </div>
            </div>
            <div class="meal-summary">
              <div class="meal-cost">
                <strong>${totalCostText}</strong> ${meal.totalCost} RWF
              </div>
              <div class="meal-savings">
                <strong>${savingsText}</strong> ${budget - meal.totalCost} RWF
              </div>
            </div>
            <div class="meal-preparation">
              <h5>${preparationText}</h5>
              <p>${meal.preparationTip}</p>
            </div>
            ${currentUser ? `
              <button class="btn btn-secondary save-meal-btn" data-meal-index="${index}">
                <i class="fas fa-save"></i> ${saveMealText}
              </button>
            ` : ''}
          </div>
        `;
        }).join('')}
      </div>
    </div>
  `;
  
  resultsContainer.appendChild(recommendationsCard);
  
  // Add event listeners to save buttons
  if (currentUser) {
    const saveButtons = resultsContainer.querySelectorAll('.save-meal-btn');
    saveButtons.forEach(button => {
      button.addEventListener('click', () => {
        const mealIndex = parseInt(button.dataset.mealIndex);
        saveMealToUserProfile(recommendations[mealIndex]);
      });
    });
  }
  
  // Save budget history for logged in users
  if (currentUser) {
    saveBudgetHistory(budget, recommendations);
  }

  // Dispatch event for language system
  const event = new CustomEvent('budgetRecommendationsGenerated', {
    detail: { budget, recommendations }
  });
  document.dispatchEvent(event);
}

/**
 * Generate meal recommendations based on budget
 * @param {number} budget - Budget in RWF
 * @returns {Array} Array of meal recommendations
 */
function generateMealRecommendationsForBudget(budget) {
  if (!window.foodData || !window.foodData.foods || !window.foodData.categories) {
    console.error('Food data not available for recommendation generation');
    return [];
  }

  const recommendations = [];

  // Sort foods by price (cheapest first)
  const sortedFoods = [...window.foodData.foods].sort((a, b) => a.price - b.price);
  
  // Improved algorithm to create balanced meals within budget
  const minBudgetPerCategory = 150; // Reduced minimum budget per category to accommodate more categories
  const requiredCategories = ['carbohydrates', 'proteins', 'vitamins', 'fats']; // Essential categories for balanced nutrition
  const optionalCategories = []; // All essential categories are now required

  // Check if budget is sufficient for basic meal (now includes all 4 categories)
  if (budget < minBudgetPerCategory * requiredCategories.length) {
    console.warn('Budget too low for fully balanced meal, attempting basic recommendations with available categories');
  }

  // Attempt to create up to 3 different meal options
  const maxAttempts = Math.min(3, Math.floor(sortedFoods.length / 4));

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const mealFoods = [];
    let remainingBudget = budget;
    let categoriesCovered = {};

    // Initialize categories covered
    const allCategories = [...requiredCategories, ...optionalCategories];
    allCategories.forEach(categoryId => {
      categoriesCovered[categoryId] = false;
    });

    // Strategy 1: Cover essential categories first with smart budget allocation
    const budgetPerCategory = Math.floor(remainingBudget / requiredCategories.length);

    for (const categoryId of requiredCategories) {
      const categoryFoods = sortedFoods.filter(food =>
        food.category === categoryId && food.price <= remainingBudget
      );

      if (categoryFoods.length > 0) {
        // Select different food for variety based on attempt number
        const foodIndex = attempt % categoryFoods.length;
        const selectedFood = categoryFoods[foodIndex];

        // Calculate optimal quantity based on category budget allocation
        const maxAffordableQty = Math.floor(remainingBudget / selectedFood.price);
        const categoryBudgetQty = Math.floor(budgetPerCategory / selectedFood.price);
        const optimalQty = Math.min(maxAffordableQty, Math.max(1, categoryBudgetQty), 3); // Max 3 units per food
        const quantity = Math.max(1, optimalQty);

        mealFoods.push({
          ...selectedFood,
          quantity: quantity,
          unit: selectedFood.quantityUnits[0]
        });

        remainingBudget -= selectedFood.price * quantity;
        categoriesCovered[categoryId] = true;
      }
    }

    // Strategy 2: Add optional categories if budget allows
    for (const categoryId of optionalCategories) {
      if (remainingBudget < minBudgetPerCategory) break;

      const categoryFoods = sortedFoods.filter(food =>
        food.category === categoryId &&
        food.price <= remainingBudget &&
        !mealFoods.some(mf => mf.id === food.id) // Avoid duplicates
      );

      if (categoryFoods.length > 0) {
        const selectedFood = categoryFoods[0]; // Choose cheapest
        const quantity = Math.min(Math.floor(remainingBudget / selectedFood.price), 2);

        if (quantity > 0) {
          mealFoods.push({
            ...selectedFood,
            quantity: quantity,
            unit: selectedFood.quantityUnits[0]
          });

          remainingBudget -= selectedFood.price * quantity;
          categoriesCovered[categoryId] = true;
        }
      }
    }

    // Strategy 3: Use remaining budget to enhance the meal
    if (remainingBudget > 0 && mealFoods.length > 0) {
      // Try to add more quantity to existing foods or add variety
      const enhancementOptions = sortedFoods.filter(food =>
        food.price <= remainingBudget &&
        (mealFoods.some(mf => mf.id === food.id) || // Existing food
         !mealFoods.some(mf => mf.category === food.category)) // New category
      );

      for (const food of enhancementOptions) {
        if (remainingBudget < food.price) break;

        const existingFoodIndex = mealFoods.findIndex(f => f.id === food.id);

        if (existingFoodIndex >= 0) {
          // Increase quantity of existing food (max 5 units total)
          if (mealFoods[existingFoodIndex].quantity < 5) {
            mealFoods[existingFoodIndex].quantity += 1;
            remainingBudget -= food.price;
          }
        } else {
          // Add new food for variety (limit to 2 new foods)
          const newFoodsCount = mealFoods.filter(mf =>
            !requiredCategories.includes(mf.category)
          ).length;

          if (newFoodsCount < 2) {
            mealFoods.push({
              ...food,
              quantity: 1,
              unit: food.quantityUnits[0]
            });
            remainingBudget -= food.price;
          }
        }

        // Stop if budget is too low for cheapest food
        if (remainingBudget < sortedFoods[0].price) break;
      }
    }

    // Check if we have at least a basic meal (minimum 2 categories including carbs and proteins)
    const hasCarbs = categoriesCovered['carbohydrates'];
    const hasProteins = categoriesCovered['proteins'];
    const hasVitamins = categoriesCovered['vitamins'];
    const hasFats = categoriesCovered['fats'];
    const isBasicMeal = hasCarbs && hasProteins;
    const isBalanced = requiredCategories.every(cat => categoriesCovered[cat]);
    const isFullyBalanced = hasCarbs && hasProteins && hasVitamins && hasFats;

    // Only create recommendation if we have at least a basic meal
    if (isBasicMeal && mealFoods.length >= 2) {
      // Calculate total cost
      const totalCost = mealFoods.reduce((sum, food) => sum + (food.price * food.quantity), 0);

      // Calculate nutrition breakdown with improved logic
      const nutritionBreakdown = {};
      const categoryCount = {};
      const categoryWeight = {
        'carbohydrates': 1.3, // Higher weight for energy foods
        'proteins': 1.5,      // Highest weight for body building
        'vitamins': 1.2,      // Higher weight for vitamins & minerals (protective foods)
        'fats': 1.0          // Standard weight for fats & oils (energy-concentrated foods)
      };

      // Count weighted items in each category
      mealFoods.forEach(food => {
        if (!categoryCount[food.category]) {
          categoryCount[food.category] = 0;
        }
        const weight = categoryWeight[food.category] || 1.0;
        categoryCount[food.category] += food.quantity * weight;
      });

      // Calculate percentage for each category
      const totalWeightedItems = Object.values(categoryCount).reduce((sum, count) => sum + count, 0);

      if (totalWeightedItems > 0) {
        Object.keys(categoryCount).forEach(category => {
          nutritionBreakdown[category] = Math.round((categoryCount[category] / totalWeightedItems) * 100);
        });
      }

      // Generate a meal name
      const mealName = generateMealName(mealFoods);

      // Generate a preparation tip
      const preparationTip = generatePreparationTip(mealFoods);

      // Add meal quality indicator
      const qualityScore = calculateMealQuality(mealFoods, isBalanced, isFullyBalanced, totalCost, budget);

      // Add to recommendations
      recommendations.push({
        name: mealName,
        foods: mealFoods,
        totalCost: totalCost,
        nutritionBreakdown: nutritionBreakdown,
        preparationTip: preparationTip,
        isBalanced: isBalanced,
        qualityScore: qualityScore,
        savings: budget - totalCost
      });
    }
  }

  // Sort recommendations by quality score (highest first)
  recommendations.sort((a, b) => b.qualityScore - a.qualityScore);

  return recommendations;
}

/**
 * Calculate meal quality score based on various factors
 * @param {Array} mealFoods - Array of foods in the meal
 * @param {boolean} isBalanced - Whether the meal is balanced
 * @param {boolean} isFullyBalanced - Whether the meal includes all 4 categories
 * @param {number} totalCost - Total cost of the meal
 * @param {number} budget - Available budget
 * @returns {number} Quality score (0-100)
 */
function calculateMealQuality(mealFoods, isBalanced, isFullyBalanced, totalCost, budget) {
  let score = 0;

  // Base score for having foods
  score += Math.min(mealFoods.length * 10, 40); // Max 40 points for variety

  // Bonus for balanced meal (includes vitamins & minerals, fats & oils)
  if (isFullyBalanced) {
    score += 35; // Higher bonus for including all 4 categories
  } else if (isBalanced) {
    score += 25; // Standard bonus for basic balance
  }

  // Bonus for good budget utilization (80-95% of budget used)
  const budgetUtilization = totalCost / budget;
  if (budgetUtilization >= 0.8 && budgetUtilization <= 0.95) {
    score += 20;
  } else if (budgetUtilization >= 0.6) {
    score += 10;
  }

  // Bonus for category diversity (emphasizing all 4 categories)
  const categories = new Set(mealFoods.map(food => food.category));
  const categoryBonus = categories.size * 6; // 6 points per category
  score += Math.min(categoryBonus, 24); // Max 24 points for all 4 categories

  // Penalty for very low budget utilization
  if (budgetUtilization < 0.3) {
    score -= 10;
  }

  return Math.max(0, Math.min(100, score));
}

/**
 * Generate a meal name based on ingredients
 * @param {Array} foods - Array of food objects
 * @returns {string} Meal name
 */
function generateMealName(foods) {
  // Get the main protein and carb
  const protein = foods.find(food => food.category === 'proteins');
  const carb = foods.find(food => food.category === 'carbohydrates');

  // Get current language
  const currentLang = window.languageManager ? window.languageManager.getCurrentLanguage() : 'en';

  // Get translations for meal components
  const withTranslation = window.languageManager ?
    window.languageManager.getTranslation('budget.meal.with') || 'with' : 'with';
  const mealTranslation = window.languageManager ?
    window.languageManager.getTranslation('budget.meal.balanced') || 'Meal' : 'Meal';
  const dishTranslation = window.languageManager ?
    window.languageManager.getTranslation('budget.meal.dish') || 'Dish' : 'Dish';
  const balancedMealTranslation = window.languageManager ?
    window.languageManager.getTranslation('budget.meal.balanced') || 'Balanced Meal' : 'Balanced Meal';

  if (protein && carb) {
    const proteinName = currentLang === 'rw' ? protein.name.rw : protein.name.en;
    const carbName = currentLang === 'rw' ? carb.name.rw : carb.name.en;
    return `${proteinName} ${withTranslation} ${carbName}`;
  } else if (protein) {
    const proteinName = currentLang === 'rw' ? protein.name.rw : protein.name.en;
    return `${proteinName} ${mealTranslation}`;
  } else if (carb) {
    const carbName = currentLang === 'rw' ? carb.name.rw : carb.name.en;
    return `${carbName} ${dishTranslation}`;
  } else {
    return balancedMealTranslation;
  }
}

/**
 * Generate a preparation tip based on ingredients
 * @param {Array} foods - Array of food objects
 * @returns {string} Preparation tip
 */
function generatePreparationTip(foods) {
  // Get translated tips if language manager is available
  const tips = [];

  if (window.languageManager) {
    tips.push(
      window.languageManager.getTranslation('budget.prep.tip1') || "Cook the carbohydrates until soft, then add proteins and vegetables.",
      window.languageManager.getTranslation('budget.prep.tip2') || "Start by preparing the proteins, then add vegetables for the last few minutes of cooking.",
      window.languageManager.getTranslation('budget.prep.tip3') || "Boil the vegetables separately to preserve nutrients, then combine with other ingredients.",
      window.languageManager.getTranslation('budget.prep.tip4') || "Use minimal water when cooking to preserve nutrients.",
      window.languageManager.getTranslation('budget.prep.tip5') || "Add a small amount of oil or fat to help absorb fat-soluble vitamins.",
      window.languageManager.getTranslation('budget.prep.tip6') || "Include colorful vegetables for vitamins and minerals essential for good health.",
      window.languageManager.getTranslation('budget.prep.tip7') || "Add healthy fats like avocado or a small amount of oil for better nutrient absorption.",
      window.languageManager.getTranslation('budget.prep.tip8') || "Combine vitamin-rich vegetables with healthy fats for maximum nutritional benefit."
    );
  } else {
    // Fallback to English tips
    tips.push(
      "Cook the carbohydrates until soft, then add proteins and vegetables.",
      "Start by preparing the proteins, then add vegetables for the last few minutes of cooking.",
      "Boil the vegetables separately to preserve nutrients, then combine with other ingredients.",
      "Use minimal water when cooking to preserve nutrients.",
      "Add a small amount of oil or fat to help absorb fat-soluble vitamins.",
      "Include colorful vegetables for vitamins and minerals essential for good health.",
      "Add healthy fats like avocado or a small amount of oil for better nutrient absorption.",
      "Combine vitamin-rich vegetables with healthy fats for maximum nutritional benefit."
    );
  }

  // Return a random tip
  return tips[Math.floor(Math.random() * tips.length)];
}

/**
 * Save meal to user profile
 * @param {Object} meal - Meal object to save
 */
function saveMealToUserProfile(meal) {
  if (!currentUser) return;
  
  // Initialize saved meals array if it doesn't exist
  if (!currentUser.savedMeals) {
    currentUser.savedMeals = [];
  }
  
  // Add meal with timestamp
  currentUser.savedMeals.push({
    date: new Date().toISOString(),
    meal: meal
  });
  
  // Keep only the last 10 meals
  if (currentUser.savedMeals.length > 10) {
    currentUser.savedMeals.shift();
  }
  
  // Save to localStorage
  localStorage.setItem('currentUser', JSON.stringify(currentUser));

  const successMessage = window.languageManager ?
    window.languageManager.getTranslation('budget.success.meal.saved') || 'Meal saved to your profile.' :
    'Meal saved to your profile.';
  showSuccess(successMessage);
}

/**
 * Save budget history
 * @param {number} budget - Budget amount
 * @param {Array} recommendations - Generated recommendations
 */
function saveBudgetHistory(budget, recommendations) {
  if (!currentUser) return;
  
  // Initialize budget history array if it doesn't exist
  if (!currentUser.budgetHistory) {
    currentUser.budgetHistory = [];
  }
  
  // Add budget entry with timestamp
  currentUser.budgetHistory.push({
    date: new Date().toISOString(),
    budget: budget,
    recommendationsCount: recommendations.length
  });
  
  // Keep only the last 10 entries
  if (currentUser.budgetHistory.length > 10) {
    currentUser.budgetHistory.shift();
  }
  
  // Save to localStorage
  localStorage.setItem('currentUser', JSON.stringify(currentUser));
}

/**
 * Load budget history for the current user
 */
function loadBudgetHistory() {
  if (!currentUser || !currentUser.budgetHistory || currentUser.budgetHistory.length === 0) return;
  
  const historyContainer = document.getElementById('budget-history');
  if (!historyContainer) return;
  
  // Clear container
  historyContainer.innerHTML = '';
  
  // Create history card
  const historyCard = document.createElement('div');
  historyCard.className = 'card history-card';

  const historyTitle = window.languageManager ?
    window.languageManager.getTranslation('budget.history.title') || 'Your Budget History' :
    'Your Budget History';
  const useButtonText = window.languageManager ?
    window.languageManager.getTranslation('budget.history.use') || 'Use' :
    'Use';

  historyCard.innerHTML = `
    <h3>${historyTitle}</h3>
    <ul class="budget-history-list">
      ${currentUser.budgetHistory.map(entry => `
        <li>
          <span class="budget-date">${new Date(entry.date).toLocaleDateString()}</span>
          <span class="budget-amount">${entry.budget} RWF</span>
          <button class="btn-use-budget" data-budget="${entry.budget}">${useButtonText}</button>
        </li>
      `).join('')}
    </ul>
  `;
  
  historyContainer.appendChild(historyCard);
  
  // Add event listeners to use buttons
  const useButtons = historyContainer.querySelectorAll('.btn-use-budget');
  useButtons.forEach(button => {
    button.addEventListener('click', () => {
      const budget = button.dataset.budget;
      document.getElementById('budget-amount').value = budget;
      generateBudgetRecommendations();
    });
  });

  // Dispatch event for language system
  const event = new CustomEvent('budgetHistoryLoaded', {
    detail: { historyCount: currentUser.budgetHistory.length }
  });
  document.dispatchEvent(event);
}
