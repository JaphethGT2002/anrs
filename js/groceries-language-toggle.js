/**
 * Groceries Page Language Toggle Functionality
 * Dedicated language switcher for index.html (Grocery Analysis) only
 * Supports English and Kinyarwanda translations with dynamic food data
 */

class GroceriesLanguageToggle {
  constructor() {
    this.currentLanguage = 'en';
    this.storageKey = 'groceries-language-preference';
    
    // Groceries page specific translations
    this.translations = {
      en: {
        // Logo and Branding
        'logo.balanced': 'Balanced',
        'logo.diet': 'Diet',

        // Navigation Menu
        'nav.home': 'Home',
        'nav.grocery': 'Grocery',
        'nav.budget': 'Budget',
        'nav.children': 'Children',
        'nav.login': 'Login',
        'nav.dashboard': 'Dashboard',

        // Language Toggle
        'language.english': 'English',
        'language.kinyarwanda': 'Kinyarwanda',
        'ui.switch.language': 'Switch Language',

        // Page Title and Welcome
        'page.title': 'Grocery Analysis',
        'welcome.user': 'Welcome',
        'welcome.user.description': 'Select your groceries below to analyze your diet.',
        'welcome.guest': 'Welcome, Guest!',
        'welcome.guest.description': 'Select your groceries below to analyze your diet.',
        'welcome.guest.login': 'Login or register',
        'welcome.guest.save': 'to save your results.',

        // Grocery Selection Section
        'grocery.title': 'Select Your Groceries',
        'grocery.description': 'Check the items you currently have at home:',

        // Search and Filters
        'search.placeholder': 'Search for foods (e.g., Beans, Rice, Milk)...',
        'categories.carbohydrates': 'Carbohydrates',
        'categories.proteins': 'Proteins',
        'categories.vitamins': 'Vitamins',
        'categories.fats': 'Fats',

        // Food Selection
        'food.quantity': 'Quantity:',
        'ui.loading.foods': 'Loading food items...',
        'buttons.analyze': 'Analyze Diet',

        // Results Section
        'results.selected.title': 'Selected Foods',
        'results.selected.empty': 'No foods selected yet.',
        'analysis.placeholder': 'Select foods and click "Analyze Diet" to see your nutrition analysis.',

        // Analysis Results
        'analysis.balanced.title': 'Balanced Diet!',
        'analysis.balanced.description': 'Congratulations! Your selected foods make up a balanced diet.',
        'analysis.balanced.breakdown': 'Category Breakdown:',
        'analysis.balanced.benefits': 'Benefits for Children:',
        'analysis.balanced.meals': 'Possible Meal Ideas:',
        
        'analysis.unbalanced.title': 'Unbalanced Diet',
        'analysis.unbalanced.description': 'Your selected foods do not make up a balanced diet. Here\'s what\'s missing:',
        'analysis.unbalanced.missing': 'Missing Categories:',
        'analysis.suggestions': 'Suggested affordable options:',

        // Benefits
        'benefits.growth': 'Growth Support: Proteins help build strong muscles and tissues.',
        'benefits.brain': 'Brain Development: Fats are essential for brain development.',
        'benefits.energy': 'Energy: Carbohydrates provide energy for daily activities.',
        'benefits.immune': 'Immune Support: Vitamins and minerals strengthen the immune system.',

        // Meals
        'meals.lunch': 'Balanced Lunch',
        'meals.dinner': 'Nutritious Dinner',

        // Table Headers
        'table.food': 'Food',
        'table.category': 'Category',
        'table.quantity': 'Quantity',
        'table.action': 'Action',

        // Actions
        'action.remove': 'Remove',

        // Saved Groceries
        'saved.title': 'Your Last Saved Grocery List',
        'saved.date': 'Saved on:',
        'saved.load': 'Load This List',

        // Status Messages
        'status.loading': 'Loading...',
        'status.saving': 'Saving...',
        'status.saved': 'Saved successfully',
        'status.error': 'An error occurred',

        // Footer
        'footer.copyright': '© 2023 Balanced Diet Recommendation System',
        'footer.subtitle': 'Designed for Rwandan Parents'
      },
      
      rw: {
        // Logo and Branding
        'logo.balanced': 'Indyo',
        'logo.diet': 'Y\'uzuye',

        // Navigation Menu
        'nav.home': 'Ahabanza',
        'nav.grocery': 'Ibiribwa',
        'nav.budget': 'Ingengo y\'amafaranga',
        'nav.children': 'Abana',
        'nav.login': 'Kwinjira',
        'nav.dashboard': 'Ikibaho',

        // Language Toggle
        'language.english': 'Icyongereza',
        'language.kinyarwanda': 'Ikinyarwanda',
        'ui.switch.language': 'Hindura Ururimi',

        // Page Title and Welcome
        'page.title': 'Isesengura ry\'Ibiribwa',
        'welcome.user': 'Murakaza neza',
        'welcome.user.description': 'Hitamo ibiribwa byawe hano munsi kugira ngo usesengure indyo yawe.',
        'welcome.guest': 'Murakaza neza, Umunyeshuri!',
        'welcome.guest.description': 'Hitamo ibiribwa byawe hano munsi kugira ngo usesengure indyo yawe.',
        'welcome.guest.login': 'Kwinjira cyangwa kwiyandikisha',
        'welcome.guest.save': 'kugira ngo ubike ibisubizo byawe.',

        // Grocery Selection Section
        'grocery.title': 'Hitamo Ibiribwa Byawe',
        'grocery.description': 'Kanda ku bintu ufite mu rugo:',

        // Search and Filters
        'search.placeholder': 'Shakisha ibiribwa (urugero: Ibishyimbo, Umuceri, Amata)...',
        'categories.carbohydrates': 'Ibitera imbaraga',
        'categories.proteins': 'Ibubaka umubiri',
        'categories.vitamins': 'Vitamini',
        'categories.fats': 'Amavuta',

        // Food Selection
        'food.quantity': 'Ingano:',
        'ui.loading.foods': 'Ibiribwa birashakishwa...',
        'buttons.analyze': 'Sesengura Indyo',

        // Results Section
        'results.selected.title': 'Ibiribwa Byahiswemo',
        'results.selected.empty': 'Nta biribwa byahiswemo.',
        'analysis.placeholder': 'Hitamo ibiribwa hanyuma ukande "Sesengura Indyo" kugira ngo ubone isesengura ry\'intungamubiri yawe.',

        // Analysis Results
        'analysis.balanced.title': 'Indyo Zuzuye!',
        'analysis.balanced.description': 'Amashimwe! Ibiribwa byawe byahiswemo bigize indyo zuzuye.',
        'analysis.balanced.breakdown': 'Igabanywa ry\'Ibyiciro:',
        'analysis.balanced.benefits': 'Inyungu ku Bana:',
        'analysis.balanced.meals': 'Ibitekerezo by\'Ifunguro:',
        
        'analysis.unbalanced.title': 'Indyo Zidazuye',
        'analysis.unbalanced.description': 'Ibiribwa byawe byahiswemo ntibigize indyo zuzuye. Dore icyabuze:',
        'analysis.unbalanced.missing': 'Ibyiciro Bibuze:',
        'analysis.suggestions': 'Ibyifuzo byoroshye:',

        // Benefits
        'benefits.growth': 'Gufasha Gukura: Poroteyine ifasha kubaka imitsi ikomeye n\'inyama.',
        'benefits.brain': 'Iterambere ry\'Ubwoba: Amavuta ni ngombwa mu iterambere ry\'ubwoba.',
        'benefits.energy': 'Ingufu: Carbohydrates itanga ingufu z\'ibikorwa bya buri munsi.',
        'benefits.immune': 'Gufasha Kurwanya Indwara: Vitamini n\'ibikoresho bikomeye bifasha kurwanya indwara.',

        // Meals
        'meals.lunch': 'Ifunguro ryo mu Gitondo Rizuye',
        'meals.dinner': 'Ifunguro ryo mu Mugoroba Riryoshye',

        // Table Headers
        'table.food': 'Ibiribwa',
        'table.category': 'Icyiciro',
        'table.quantity': 'Ingano',
        'table.action': 'Igikorwa',

        // Actions
        'action.remove': 'Kuraho',

        // Saved Groceries
        'saved.title': 'Urutonde rwawe rw\'Ibiribwa rwabitswe',
        'saved.date': 'Byabitswe ku wa:',
        'saved.load': 'Koresha Uyu Rutonde',

        // Status Messages
        'status.loading': 'Birashakishwa...',
        'status.saving': 'Birabikwa...',
        'status.saved': 'Byabitswe neza',
        'status.error': 'Habaye ikosa',

        // Footer
        'footer.copyright': '© 2023 Sisitemu y\'Inama z\'Indyo Zuzuye',
        'footer.subtitle': 'Yakozwe ku Babyeyi b\'u Rwanda'
      }
    };

    this.init();
  }

  /**
   * Initialize the language toggle functionality
   */
  init() {
    this.loadSavedLanguage();
    this.setupEventListeners();
    this.updateLanguageDisplay();
    this.translatePage();
    this.setupFoodDataListener();
    
    console.log('Groceries Language Toggle initialized with language:', this.currentLanguage);
  }

  /**
   * Load saved language preference from localStorage
   */
  loadSavedLanguage() {
    const savedLanguage = localStorage.getItem(this.storageKey);
    if (savedLanguage && this.translations[savedLanguage]) {
      this.currentLanguage = savedLanguage;
    }
  }

  /**
   * Setup event listeners for language toggle and food data
   */
  setupEventListeners() {
    const languageBtn = document.getElementById('language-btn');
    const languageDropdown = document.getElementById('language-dropdown');
    const languageOptions = document.querySelectorAll('.language-option');

    // Toggle dropdown on button click
    if (languageBtn) {
      languageBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleDropdown();
      });
    }

    // Handle language selection
    if (languageOptions) {
      languageOptions.forEach(option => {
        option.addEventListener('click', (e) => {
          e.stopPropagation();
          const selectedLang = option.getAttribute('data-lang');
          this.changeLanguage(selectedLang);
        });
      });
    }

    // Close dropdown when clicking outside
    document.addEventListener('click', () => {
      this.closeDropdown();
    });

    // Prevent dropdown from closing when clicking inside
    if (languageDropdown) {
      languageDropdown.addEventListener('click', (e) => {
        e.stopPropagation();
      });
    }
  }

  /**
   * Setup listener for food data loading
   */
  setupFoodDataListener() {
    // Listen for food data loaded event
    document.addEventListener('foodDataLoaded', () => {
      this.translateFoodItems();
    });

    // Listen for selected foods updates
    document.addEventListener('selectedFoodsUpdated', () => {
      this.translateSelectedFoods();
    });

    // Listen for analysis results
    document.addEventListener('analysisResultsDisplayed', () => {
      this.translateAnalysisResults();
    });
  }

  /**
   * Toggle the language dropdown visibility
   */
  toggleDropdown() {
    const dropdown = document.getElementById('language-dropdown');
    const btn = document.getElementById('language-btn');

    if (dropdown && btn) {
      const isHidden = dropdown.classList.contains('hidden');

      if (isHidden) {
        dropdown.classList.remove('hidden');
        btn.classList.add('active');
      } else {
        dropdown.classList.add('hidden');
        btn.classList.remove('active');
      }
    }
  }

  /**
   * Close the language dropdown
   */
  closeDropdown() {
    const dropdown = document.getElementById('language-dropdown');
    const btn = document.getElementById('language-btn');

    if (dropdown && btn) {
      dropdown.classList.add('hidden');
      btn.classList.remove('active');
    }
  }

  /**
   * Change the current language
   */
  changeLanguage(language) {
    if (!this.translations[language]) {
      console.error('Language not supported:', language);
      return;
    }

    this.currentLanguage = language;
    localStorage.setItem(this.storageKey, language);

    this.updateLanguageDisplay();
    this.translatePage();
    this.translateFoodItems();
    this.translateSelectedFoods();
    this.closeDropdown();

    // Update document language attribute
    document.documentElement.lang = language;

    // Add language class to body for CSS styling
    document.body.className = document.body.className.replace(/lang-\w+/g, '');
    document.body.classList.add(`lang-${language}`);

    // Dispatch custom event for other scripts
    const event = new CustomEvent('groceriesLanguageChanged', {
      detail: { language: language, translations: this.translations[language] }
    });
    document.dispatchEvent(event);

    console.log('Groceries language changed to:', language);
  }

  /**
   * Update the language display in the toggle button
   */
  updateLanguageDisplay() {
    const currentLanguageSpan = document.getElementById('current-language');
    const languageOptions = document.querySelectorAll('.language-option');

    // Update current language indicator
    if (currentLanguageSpan) {
      currentLanguageSpan.textContent = this.currentLanguage.toUpperCase();
    }

    // Update active state in dropdown options
    languageOptions.forEach(option => {
      const lang = option.getAttribute('data-lang');
      if (lang === this.currentLanguage) {
        option.classList.add('active');
      } else {
        option.classList.remove('active');
      }
    });
  }

  /**
   * Translate all content on the groceries page
   */
  translatePage() {
    // Translate elements with data-translate attributes
    this.translateDataAttributes();

    // Translate specific groceries page sections
    this.translateWelcomeSection();
    this.translateGrocerySection();
    this.translateResultsSection();
    this.translateFooter();

    console.log('Groceries page translated to:', this.currentLanguage);
  }

  /**
   * Translate elements with data-translate attributes
   */
  translateDataAttributes() {
    const elements = document.querySelectorAll('[data-translate]');

    elements.forEach(element => {
      const key = element.getAttribute('data-translate');
      const translation = this.getTranslation(key);

      if (translation) {
        element.textContent = translation;
      }
    });

    // Handle placeholder translations
    const placeholderElements = document.querySelectorAll('[data-translate-placeholder]');
    placeholderElements.forEach(element => {
      const key = element.getAttribute('data-translate-placeholder');
      const translation = this.getTranslation(key);

      if (translation) {
        element.placeholder = translation;
      }
    });

    // Handle title attribute translations
    const titleElements = document.querySelectorAll('[data-translate-title]');
    titleElements.forEach(element => {
      const key = element.getAttribute('data-translate-title');
      const translation = this.getTranslation(key);

      if (translation) {
        element.title = translation;
      }
    });
  }

  /**
   * Translate welcome section content
   */
  translateWelcomeSection() {
    // User welcome message
    const userWelcome = document.querySelector('.user-welcome.auth-dependent h2 span');
    if (userWelcome) {
      const translation = this.getTranslation('welcome.user');
      if (translation) userWelcome.textContent = translation;
    }

    // Guest welcome message
    const guestWelcome = document.querySelector('.user-welcome.guest-only h2');
    if (guestWelcome) {
      const translation = this.getTranslation('welcome.guest');
      if (translation) guestWelcome.textContent = translation;
    }
  }

  /**
   * Translate grocery selection section
   */
  translateGrocerySection() {
    // Search placeholder is handled by data-translate-placeholder

    // Category filter badges
    const categoryBadges = document.querySelectorAll('.category-badge');
    categoryBadges.forEach(badge => {
      if (badge.classList.contains('category-carbohydrates')) {
        const translation = this.getTranslation('categories.carbohydrates');
        if (translation) badge.textContent = translation;
      } else if (badge.classList.contains('category-proteins')) {
        const translation = this.getTranslation('categories.proteins');
        if (translation) badge.textContent = translation;
      } else if (badge.classList.contains('category-vitamins')) {
        const translation = this.getTranslation('categories.vitamins');
        if (translation) badge.textContent = translation;
      } else if (badge.classList.contains('category-fats')) {
        const translation = this.getTranslation('categories.fats');
        if (translation) badge.textContent = translation;
      }
    });
  }

  /**
   * Translate results section
   */
  translateResultsSection() {
    // Selected foods title is handled by data-translate

    // Empty state message
    const emptyMessage = document.querySelector('#selected-foods p');
    if (emptyMessage && emptyMessage.textContent.includes('No foods selected')) {
      const translation = this.getTranslation('results.selected.empty');
      if (translation) emptyMessage.textContent = translation;
    }

    // Analysis placeholder
    const placeholder = document.querySelector('#analysis-placeholder p');
    if (placeholder) {
      const translation = this.getTranslation('analysis.placeholder');
      if (translation) placeholder.textContent = translation;
    }
  }

  /**
   * Translate food items in the selection list
   */
  translateFoodItems() {
    if (!window.foodData || !window.foodData.foods) return;

    const foodItems = document.querySelectorAll('.food-item');

    foodItems.forEach(item => {
      const checkbox = item.querySelector('input[type="checkbox"]');
      if (!checkbox) return;

      const foodId = parseInt(checkbox.getAttribute('data-food-id'));
      const food = window.foodData.foods.find(f => f.id === foodId);

      if (food) {
        const label = item.querySelector('.food-name-label');
        if (label) {
          const displayName = this.currentLanguage === 'rw' ?
            `${food.name.rw} (${food.name.en})` :
            `${food.name.en} (${food.name.rw})`;
          label.textContent = displayName;
        }

        // Update quantity label
        const quantityLabel = item.querySelector('.food-quantity label');
        if (quantityLabel) {
          const translation = this.getTranslation('food.quantity');
          if (translation) quantityLabel.textContent = translation;
        }
      }
    });
  }

  /**
   * Translate selected foods table
   */
  translateSelectedFoods() {
    // Update table headers
    const tableHeaders = document.querySelectorAll('.selected-foods-table th');
    if (tableHeaders.length > 0) {
      const headerKeys = ['table.food', 'table.category', 'table.quantity', 'table.action'];
      tableHeaders.forEach((header, index) => {
        if (headerKeys[index]) {
          const translation = this.getTranslation(headerKeys[index]);
          if (translation) header.textContent = translation;
        }
      });
    }

    // Update food names in table rows
    const foodCells = document.querySelectorAll('.selected-foods-table tbody td:first-child');
    foodCells.forEach(cell => {
      const text = cell.textContent;
      const match = text.match(/^(.+?)\s*\((.+?)\)$/);
      if (match) {
        const englishName = match[1].trim();
        const kinyarwandaName = match[2].trim();

        if (this.currentLanguage === 'rw') {
          cell.textContent = `${kinyarwandaName} (${englishName})`;
        } else {
          cell.textContent = `${englishName} (${kinyarwandaName})`;
        }
      }
    });

    // Update category names in table
    const categoryBadges = document.querySelectorAll('.selected-foods-table .category-badge');
    categoryBadges.forEach(badge => {
      if (window.foodData && window.foodData.categories) {
        const categoryClass = badge.className.match(/category-(\w+)/);
        if (categoryClass) {
          const categoryId = categoryClass[1];
          const category = window.foodData.categories.find(c => c.id === categoryId);
          if (category && category.name) {
            const categoryName = this.currentLanguage === 'rw' ? category.name.rw : category.name.en;
            badge.textContent = categoryName;
          }
        }
      }
    });

    // Update remove button text
    const removeButtons = document.querySelectorAll('.btn-remove');
    removeButtons.forEach(button => {
      const translation = this.getTranslation('action.remove');
      if (translation) {
        button.title = translation;
        // Update text if button has text content
        const textSpan = button.querySelector('span');
        if (textSpan) textSpan.textContent = translation;
      }
    });
  }

  /**
   * Translate analysis results
   */
  translateAnalysisResults() {
    // Update analysis headers
    const balancedHeader = document.querySelector('.analysis-header.balanced h3');
    if (balancedHeader) {
      const translation = this.getTranslation('analysis.balanced.title');
      if (translation) balancedHeader.textContent = translation;
    }

    const unbalancedHeader = document.querySelector('.analysis-header.unbalanced h3');
    if (unbalancedHeader) {
      const translation = this.getTranslation('analysis.unbalanced.title');
      if (translation) unbalancedHeader.textContent = translation;
    }

    // Update analysis descriptions
    const balancedDescription = document.querySelector('.analysis-header.balanced + .analysis-content p');
    if (balancedDescription) {
      const translation = this.getTranslation('analysis.balanced.description');
      if (translation) balancedDescription.textContent = translation;
    }

    const unbalancedDescription = document.querySelector('.analysis-header.unbalanced + .analysis-content p');
    if (unbalancedDescription) {
      const translation = this.getTranslation('analysis.unbalanced.description');
      if (translation) unbalancedDescription.textContent = translation;
    }

    // Update section headers
    const breakdownHeader = document.querySelector('.category-breakdown h4');
    if (breakdownHeader) {
      const translation = this.getTranslation('analysis.balanced.breakdown');
      if (translation) breakdownHeader.textContent = translation;
    }

    const benefitsHeader = document.querySelector('.benefits-section h4');
    if (benefitsHeader) {
      const translation = this.getTranslation('analysis.balanced.benefits');
      if (translation) benefitsHeader.textContent = translation;
    }

    const mealsHeader = document.querySelector('.meal-suggestions h4');
    if (mealsHeader) {
      const translation = this.getTranslation('analysis.balanced.meals');
      if (translation) mealsHeader.textContent = translation;
    }

    const missingHeader = document.querySelector('.missing-categories h4');
    if (missingHeader) {
      const translation = this.getTranslation('analysis.unbalanced.missing');
      if (translation) missingHeader.textContent = translation;
    }

    // Update meal names
    const mealCards = document.querySelectorAll('.meal-card h5');
    mealCards.forEach((card, index) => {
      const mealKey = index === 0 ? 'meals.lunch' : 'meals.dinner';
      const translation = this.getTranslation(mealKey);
      if (translation) card.textContent = translation;
    });

    // Update food names in meal suggestions and food suggestions
    const foodNameElements = document.querySelectorAll('.meal-card li, .food-suggestions li strong');
    foodNameElements.forEach(element => {
      const text = element.textContent;
      const match = text.match(/^(.+?)\s*\((.+?)\)/);
      if (match) {
        const englishName = match[1].trim();
        const kinyarwandaName = match[2].trim();

        if (this.currentLanguage === 'rw') {
          element.textContent = element.textContent.replace(
            `${englishName} (${kinyarwandaName})`,
            `${kinyarwandaName} (${englishName})`
          );
        } else {
          element.textContent = element.textContent.replace(
            `${kinyarwandaName} (${englishName})`,
            `${englishName} (${kinyarwandaName})`
          );
        }
      }
    });
  }

  /**
   * Translate footer content
   */
  translateFooter() {
    // Copyright and subtitle are handled by data-translate attributes

    // Healthcare partners title
    const healthcareTitle = document.querySelector('.healthcare-links h4');
    if (healthcareTitle && !healthcareTitle.hasAttribute('data-translate')) {
      const translation = this.currentLanguage === 'rw' ? 'Abafatanyabikorwa mu Buzima' : 'Healthcare Partners';
      healthcareTitle.textContent = translation;
    }

    // Social media title
    const socialTitle = document.querySelector('.footer-section:last-child h4');
    if (socialTitle && !socialTitle.hasAttribute('data-translate')) {
      const translation = this.currentLanguage === 'rw' ? 'Dukurikire' : 'Follow Us';
      socialTitle.textContent = translation;
    }
  }

  /**
   * Get translation for a given key
   */
  getTranslation(key) {
    const translation = this.translations[this.currentLanguage][key];

    // Fallback to English if translation not found
    if (!translation && this.currentLanguage !== 'en') {
      return this.translations.en[key] || key;
    }

    return translation || key;
  }

  /**
   * Get current language
   */
  getCurrentLanguage() {
    return this.currentLanguage;
  }

  /**
   * Check if current language is Kinyarwanda
   */
  isKinyarwanda() {
    return this.currentLanguage === 'rw';
  }

  /**
   * Check if current language is English
   */
  isEnglish() {
    return this.currentLanguage === 'en';
  }

  /**
   * Add custom translations (for extending functionality)
   */
  addTranslations(language, newTranslations) {
    if (!this.translations[language]) {
      this.translations[language] = {};
    }

    Object.assign(this.translations[language], newTranslations);
  }

  /**
   * Force retranslation of the entire page
   */
  retranslate() {
    this.translatePage();
    this.translateFoodItems();
    this.translateSelectedFoods();
    this.translateAnalysisResults();
  }

  /**
   * Reset language to default (English)
   */
  resetToDefault() {
    this.changeLanguage('en');
  }

  /**
   * Get all available languages
   */
  getAvailableLanguages() {
    return Object.keys(this.translations);
  }

  /**
   * Get language display name
   */
  getLanguageDisplayName(langCode) {
    const displayNames = {
      'en': 'English',
      'rw': 'Kinyarwanda'
    };

    return displayNames[langCode] || langCode;
  }

  /**
   * Debug method to log current translations
   */
  debugTranslations() {
    console.log('Current Language:', this.currentLanguage);
    console.log('Available Languages:', this.getAvailableLanguages());
    console.log('Current Translations:', this.translations[this.currentLanguage]);
    console.log('Food Data Available:', !!window.foodData);
    if (window.foodData) {
      console.log('Food Categories:', window.foodData.categories);
      console.log('Food Items Count:', window.foodData.foods?.length || 0);
    }
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Only initialize if we're on the groceries page (index.html)
  if (document.body.classList.contains('groceries-page') ||
      window.location.pathname.includes('index.html') ||
      document.querySelector('#grocery-form, #food-selection, #analyze-diet')) {

    window.groceriesLanguageToggle = new GroceriesLanguageToggle();

    // Make it globally accessible for debugging
    window.debugGroceriesLanguage = () => {
      if (window.groceriesLanguageToggle) {
        window.groceriesLanguageToggle.debugTranslations();
      }
    };

    console.log('Groceries Language Toggle initialized successfully');
  }
});

// Export for use in other scripts if needed
if (typeof module !== 'undefined' && module.exports) {
  module.exports = GroceriesLanguageToggle;
}
