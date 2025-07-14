/**
 * Language Toggle Functionality
 * Supports English and Kinyarwanda translations
 */

class LanguageManager {
  constructor() {
    this.currentLanguage = 'en';
    this.translations = {
      en: {
        // Logo
        'logo.balanced': 'Balanced',
        'logo.diet': 'Diet',

        // Navigation
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

        // Page content
        'page.title': 'Grocery Analysis',
        
        // Welcome messages
        'welcome.user': 'Welcome',
        'welcome.user.description': 'Select your groceries below to analyze your diet.',
        'welcome.guest': 'Welcome, Guest!',
        'welcome.guest.description': 'Select your groceries below to analyze your diet.',
        'welcome.guest.login': 'Login or register',
        'welcome.guest.save': 'to save your results.',
        
        // Grocery section
        'grocery.title': 'Select Your Groceries',
        'grocery.description': 'Check the items you currently have at home:',
        
        // Search
        'search.placeholder': 'Search for foods (e.g., Beans, Rice, Milk)...',
        
        // Categories
        'categories.carbohydrates': 'Carbohydrates',
        'categories.proteins': 'Proteins',
        'categories.vitamins': 'Vitamins',
        'categories.fats': 'Fats',
        
        // Buttons
        'buttons.analyze': 'Analyze Diet',
        
        // Results
        'results.selected.title': 'Selected Foods',
        'results.selected.empty': 'No foods selected yet.',
        
        // Footer
        'footer.copyright': '© 2023 Balanced Diet Recommendation System',
        'footer.subtitle': 'Designed for Rwandan Parents',

        // Analysis results
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

        // Common UI elements
        'ui.loading': 'Loading...',
        'ui.loading.foods': 'Loading food items...',
        'ui.error': 'Error',
        'ui.success': 'Success',
        'ui.close': 'Close',
        'ui.save': 'Save',
        'ui.cancel': 'Cancel',
        'ui.confirm': 'Confirm',

        // Analysis
        'analysis.placeholder': 'Select foods and click "Analyze Diet" to see your nutrition analysis.',

        // Meals
        'meals.lunch': 'Balanced Lunch',
        'meals.dinner': 'Nutritious Dinner',

        // Saved groceries
        'saved.title': 'Your Last Saved Grocery List',
        'saved.date': 'Saved on:',
        'saved.load': 'Load This List',

        // Food items
        'food.quantity': 'Quantity:',

        // Table headers
        'table.food': 'Food',
        'table.category': 'Category',
        'table.quantity': 'Quantity',
        'table.action': 'Action',
        'table.price': 'Price',
        'table.total': 'Total',

        // Actions
        'action.remove': 'Remove',
        'action.edit': 'Edit',
        'action.add': 'Add',
        'action.select': 'Select',
        'action.clear': 'Clear',
        'action.reset': 'Reset',

        // Status messages
        'status.loading': 'Loading...',
        'status.saving': 'Saving...',
        'status.saved': 'Saved successfully',
        'status.error': 'An error occurred',
        'status.empty': 'No items found',
        'status.complete': 'Complete',

        // Validation messages
        'validation.required': 'This field is required',
        'validation.invalid': 'Invalid input',
        'validation.min': 'Minimum value required',
        'validation.max': 'Maximum value exceeded',

        // Budget-specific translations
        'budget.title': 'Budget-Based Meal Recommendations',
        'budget.welcome.user': 'Welcome',
        'budget.welcome.user.description': 'Enter your budget to get balanced meal recommendations.',
        'budget.welcome.guest': 'Welcome, Guest!',
        'budget.welcome.guest.description': 'Enter your budget to get balanced meal recommendations.',
        'budget.welcome.guest.login': 'Login or register',
        'budget.welcome.guest.save': 'to save your results.',

        // Budget form
        'budget.form.title': 'Enter Your Budget',
        'budget.form.description': 'We\'ll recommend balanced meals within your budget using local Rwandan food prices.',
        'budget.form.label': 'Budget Amount',
        'budget.form.placeholder': 'Enter amount',
        'budget.form.currency': 'RWF',
        'budget.form.submit': 'Get Recommendations',

        // Budget results
        'budget.results.title': 'Meal Recommendations for',
        'budget.results.description': 'Here are balanced meal options within your budget:',
        'budget.results.option': 'Option',
        'budget.results.ingredients': 'Ingredients:',
        'budget.results.nutrition': 'Nutrition:',
        'budget.results.total.cost': 'Total Cost:',
        'budget.results.savings': 'Savings:',
        'budget.results.preparation': 'Preparation Tip:',
        'budget.results.save.meal': 'Save This Meal',

        // Budget errors
        'budget.error.no.recommendations': 'No Recommendations Available',
        'budget.error.no.recommendations.description': 'We couldn\'t generate balanced meal recommendations for your budget of',
        'budget.error.no.recommendations.suggestion': 'Try increasing your budget or check back later for more affordable options.',
        'budget.error.invalid.amount': 'Please enter a valid budget amount.',

        // Budget history
        'budget.history.title': 'Your Budget History',
        'budget.history.use': 'Use',
        'budget.history.date': 'Date',
        'budget.history.amount': 'Amount',

        // Budget how it works
        'budget.how.title': 'How It Works',
        'budget.how.step1': 'Enter your budget in Rwandan Francs (RWF)',
        'budget.how.step2': 'Our system will analyze local food prices',
        'budget.how.step3': 'You\'ll receive balanced meal recommendations within your budget',
        'budget.how.step4': 'Each recommendation includes:',
        'budget.how.step4.ingredients': 'List of ingredients with quantities',
        'budget.how.step4.nutrition': 'Nutritional breakdown',
        'budget.how.step4.cost': 'Total cost and savings',
        'budget.how.step4.preparation': 'Preparation tips',
        'budget.how.tip': 'Tip:',
        'budget.how.tip.description': 'For a family of four, a budget of at least 2000 RWF is recommended for a balanced meal.',

        // Budget meal names
        'budget.meal.balanced': 'Balanced Meal',
        'budget.meal.with': 'with',
        'budget.meal.dish': 'Dish',

        // Budget preparation tips
        'budget.prep.tip1': 'Cook the carbohydrates until soft, then add proteins and vegetables.',
        'budget.prep.tip2': 'Start by preparing the proteins, then add vegetables for the last few minutes of cooking.',
        'budget.prep.tip3': 'Boil the vegetables separately to preserve nutrients, then combine with other ingredients.',
        'budget.prep.tip4': 'Use minimal water when cooking to preserve nutrients.',
        'budget.prep.tip5': 'Add a small amount of oil or fat to help absorb fat-soluble vitamins.',

        // Budget success messages
        'budget.success.meal.saved': 'Meal saved to your profile.',
        'budget.success.recommendations.generated': 'Budget recommendations generated successfully.'
      },
      
      rw: {
        // Logo
        'logo.balanced': 'Indyo',
        'logo.diet': 'Y\'uzuye',

        // Navigation
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

        // Page content
        'page.title': 'Isesengura ry\'Ibiribwa',
        
        // Welcome messages
        'welcome.user': 'Murakaza neza',
        'welcome.user.description': 'Hitamo ibiribwa byawe hano munsi kugira ngo usesengure indyo yawe.',
        'welcome.guest': 'Murakaza neza, Umunyeshuri!',
        'welcome.guest.description': 'Hitamo ibiribwa byawe hano munsi kugira ngo usesengure indyo yawe.',
        'welcome.guest.login': 'Kwinjira cyangwa kwiyandikisha',
        'welcome.guest.save': 'kugira ngo ubike ibisubizo byawe.',
        
        // Grocery section
        'grocery.title': 'Hitamo Ibiribwa Byawe',
        'grocery.description': 'Kanda ku bintu ufite mu rugo:',
        
        // Search
        'search.placeholder': 'Shakisha ibiribwa (urugero: Ibinyomoro, Umuceri, Amata)...',
        
        // Categories
        'categories.carbohydrates': 'Ibitera imbaraga',
        'categories.proteins': 'Ibubaka umubiri',
        'categories.vitamins': 'Vitamini n\'imyunyu ngombwa',
        'categories.fats': 'Amavuta',
        
        // Buttons
        'buttons.analyze': 'Sesengura Indyo',
        
        // Results
        'results.selected.title': 'Ibiribwa Byahiswemo',
        'results.selected.empty': 'Nta biribwa byahiswemo.',
        
        // Footer
        'footer.copyright': '© 2023 Sisitemu y\'Inama z\'Indyo Zuzuye',
        'footer.subtitle': 'Yakozwe ku Babyeyi b\'u Rwanda',

        // Analysis results
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

        // Common UI elements
        'ui.loading': 'Birashakishwa...',
        'ui.loading.foods': 'Ibiribwa birashakishwa...',
        'ui.error': 'Ikosa',
        'ui.success': 'Byagenze neza',
        'ui.close': 'Funga',
        'ui.save': 'Bika',
        'ui.cancel': 'Hagarika',
        'ui.confirm': 'Emeza',

        // Analysis
        'analysis.placeholder': 'Hitamo ibiribwa hanyuma ukande "Sesengura Indyo" kugira ngo ubone isesengura ry\'intungamubiri yawe.',

        // Meals
        'meals.lunch': 'Ifunguro ryo mu Gitondo Rizuye',
        'meals.dinner': 'Ifunguro ryo mu Mugoroba Riryoshye',

        // Saved groceries
        'saved.title': 'Urutonde rwawe rw\'Ibiribwa rwabitswe',
        'saved.date': 'Byabitswe ku wa:',
        'saved.load': 'Koresha Uyu Rutonde',

        // Food items
        'food.quantity': 'Ingano:',

        // Table headers
        'table.food': 'Ibiribwa',
        'table.category': 'Icyiciro',
        'table.quantity': 'Ingano',
        'table.action': 'Igikorwa',
        'table.price': 'Igiciro',
        'table.total': 'Igiteranyo',

        // Actions
        'action.remove': 'Kuraho',
        'action.edit': 'Guhindura',
        'action.add': 'Kongeramo',
        'action.select': 'Guhitamo',
        'action.clear': 'Gusiba',
        'action.reset': 'Gutangira',

        // Status messages
        'status.loading': 'Birashakishwa...',
        'status.saving': 'Birabikwa...',
        'status.saved': 'Byabitswe neza',
        'status.error': 'Habaye ikosa',
        'status.empty': 'Nta kintu cyabonetse',
        'status.complete': 'Byarangiye',

        // Validation messages
        'validation.required': 'Iki gice ni ngombwa',
        'validation.invalid': 'Inyandiko itemewe',
        'validation.min': 'Agaciro gato karasabwa',
        'validation.max': 'Agaciro karenze urugero',

        // Budget-specific translations
        'budget.title': 'Inama z\'Ifunguro zishingiye ku Ngengo y\'Amafaranga',
        'budget.welcome.user': 'Murakaza neza',
        'budget.welcome.user.description': 'Shyiramo ingengo y\'amafaranga yawe kugira ngo ubone inama z\'ifunguro zuzuye.',
        'budget.welcome.guest': 'Murakaza neza, Umunyeshuri!',
        'budget.welcome.guest.description': 'Shyiramo ingengo y\'amafaranga yawe kugira ngo ubone inama z\'ifunguro zuzuye.',
        'budget.welcome.guest.login': 'Kwinjira cyangwa kwiyandikisha',
        'budget.welcome.guest.save': 'kugira ngo ubike ibisubizo byawe.',

        // Budget form
        'budget.form.title': 'Shyiramo Ingengo y\'Amafaranga Yawe',
        'budget.form.description': 'Tuzagutanga inama z\'ifunguro zuzuye mu rwego rw\'ingengo y\'amafaranga yawe tukoresha ibiciro by\'ibiribwa byo mu Rwanda.',
        'budget.form.label': 'Amafaranga y\'Ingengo',
        'budget.form.placeholder': 'Shyiramo amafaranga',
        'budget.form.currency': 'RWF',
        'budget.form.submit': 'Bona Inama',

        // Budget results
        'budget.results.title': 'Inama z\'Ifunguro kuri',
        'budget.results.description': 'Dore amahitamo y\'ifunguro zuzuye mu rwego rw\'ingengo y\'amafaranga yawe:',
        'budget.results.option': 'Ihitamo',
        'budget.results.ingredients': 'Ibikoresho:',
        'budget.results.nutrition': 'Intungamubiri:',
        'budget.results.total.cost': 'Igiciro Cyose:',
        'budget.results.savings': 'Amafaranga Yabitswe:',
        'budget.results.preparation': 'Inama yo Gutegura:',
        'budget.results.save.meal': 'Bika Iri funguro',

        // Budget errors
        'budget.error.no.recommendations': 'Nta nama Ziboneka',
        'budget.error.no.recommendations.description': 'Ntidushoboye gutanga inama z\'ifunguro zuzuye ku ngengo y\'amafaranga yawe ya',
        'budget.error.no.recommendations.suggestion': 'Gerageza kongera ingengo y\'amafaranga yawe cyangwa ugaruke nyuma kugira ngo ubone amahitamo ahendutse.',
        'budget.error.invalid.amount': 'Nyamuneka shyiramo amafaranga y\'ingengo yemewe.',

        // Budget history
        'budget.history.title': 'Amateka y\'Ingengo y\'Amafaranga Yawe',
        'budget.history.use': 'Koresha',
        'budget.history.date': 'Itariki',
        'budget.history.amount': 'Amafaranga',

        // Budget how it works
        'budget.how.title': 'Uburyo Bikora',
        'budget.how.step1': 'Shyiramo ingengo y\'amafaranga yawe mu mafaranga y\'u Rwanda (RWF)',
        'budget.how.step2': 'Sisitemu yacu izasesengura ibiciro by\'ibiribwa byo mu gace',
        'budget.how.step3': 'Uzabona inama z\'ifunguro zuzuye mu rwego rw\'ingengo y\'amafaranga yawe',
        'budget.how.step4': 'Buri nama irimo:',
        'budget.how.step4.ingredients': 'Urutonde rw\'ibikoresho hamwe n\'ingano',
        'budget.how.step4.nutrition': 'Isesengura ry\'intungamubiri',
        'budget.how.step4.cost': 'Igiciro cyose n\'amafaranga yabitswe',
        'budget.how.step4.preparation': 'Inama zo gutegura',
        'budget.how.tip': 'Inama:',
        'budget.how.tip.description': 'Ku muryango w\'abantu bane, ingengo y\'amafaranga ya byibuze 2000 RWF irasabwa kugira ngo ubone ifunguro rizuye.',

        // Budget meal names
        'budget.meal.balanced': 'Ifunguro Rizuye',
        'budget.meal.with': 'hamwe na',
        'budget.meal.dish': 'Ifunguro',

        // Budget preparation tips
        'budget.prep.tip1': 'Teka ibitera imbaraga kugeza byoroshye, hanyuma wongereho poroteyine n\'imboga.',
        'budget.prep.tip2': 'Tangira utegura poroteyine, hanyuma wongereho imboga mu minota ya nyuma yo guteka.',
        'budget.prep.tip3': 'Teka imboga ku ruhande kugira ngo ubike intungamubiri, hanyuma ubihuze n\'ibindi bikoresho.',
        'budget.prep.tip4': 'Koresha amazi make mu guteka kugira ngo ubike intungamubiri.',
        'budget.prep.tip5': 'Ongeraho amavuta make kugira ngo ufashe vitamini zishobora gushonga mu mavuta.',

        // Budget success messages
        'budget.success.meal.saved': 'Ifunguro ryabitswe muri profayile yawe.',
        'budget.success.recommendations.generated': 'Inama z\'ingengo y\'amafaranga zatanzwe neza.'
      }
    };
    
    this.init();
  }
  
  init() {
    // Load saved language preference
    const savedLanguage = localStorage.getItem('preferred-language');
    if (savedLanguage && this.translations[savedLanguage]) {
      this.currentLanguage = savedLanguage;
    }

    this.setupEventListeners();
    this.updateLanguageDisplay();
    this.translateAllContent();
    this.setupDynamicContentListeners();

    // Setup budget-specific functionality if on budget page
    if (window.location.pathname.includes('budget.html')) {
      this.setupBudgetSpecificListeners();
      this.translateBudgetContent();
    }

    // Auto-translate common words and scan for untranslated text in development
    setTimeout(() => {
      this.autoTranslateCommonWords();
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        this.scanForUntranslatedText();
      }
    }, 1000);
  }

  /**
   * Setup budget-specific event listeners
   */
  setupBudgetSpecificListeners() {
    // Setup budget-specific language change handlers
    this.onBudgetLanguageChange();

    // Listen for budget form submissions
    const budgetForm = document.getElementById('budget-form');
    if (budgetForm) {
      budgetForm.addEventListener('submit', (e) => {
        // Add a small delay to allow results to render before translating
        setTimeout(() => {
          this.translateBudgetResults();
          this.translateBudgetFoodNames();
        }, 200);
      });
    }

    // Setup mutation observer for budget results
    const budgetResults = document.getElementById('budget-results');
    if (budgetResults) {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            // Check if budget recommendations were added
            const hasRecommendations = Array.from(mutation.addedNodes).some(node =>
              node.nodeType === Node.ELEMENT_NODE &&
              (node.classList.contains('recommendations-card') || node.classList.contains('error-card'))
            );

            if (hasRecommendations) {
              setTimeout(() => {
                this.translateBudgetResults();
                this.translateBudgetFoodNames();
              }, 100);
            }
          }
        });
      });

      observer.observe(budgetResults, {
        childList: true,
        subtree: true
      });
    }

    // Setup mutation observer for budget history
    const budgetHistory = document.getElementById('budget-history');
    if (budgetHistory) {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            setTimeout(() => {
              this.translateBudgetHistory();
            }, 100);
          }
        });
      });

      observer.observe(budgetHistory, {
        childList: true,
        subtree: true
      });
    }
  }
  
  setupEventListeners() {
    const languageBtn = document.getElementById('language-btn');
    const languageDropdown = document.getElementById('language-dropdown');
    const languageOptions = document.querySelectorAll('.language-option');
    
    if (languageBtn) {
      languageBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleDropdown();
      });
    }
    
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
    
    // Prevent dropdown from closing when clicking inside it
    if (languageDropdown) {
      languageDropdown.addEventListener('click', (e) => {
        e.stopPropagation();
      });
    }
  }

  setupDynamicContentListeners() {
    // Listen for when selected foods are updated
    document.addEventListener('selectedFoodsUpdated', () => {
      this.updateSelectedFoodsDisplay();
    });

    // Listen for when analysis results are displayed
    document.addEventListener('analysisResultsDisplayed', () => {
      this.updateAnalysisResults();
    });

    // Listen for when saved groceries are loaded
    document.addEventListener('savedGroceriesLoaded', () => {
      this.updateSavedGroceriesDisplay();
    });

    // Use MutationObserver to watch for dynamic content changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          // Check if selected foods table was added/modified
          if (mutation.target.id === 'selected-foods' ||
              mutation.target.closest('#selected-foods')) {
            setTimeout(() => this.updateSelectedFoodsDisplay(), 100);
          }

          // Check if analysis results were added/modified
          if (mutation.target.id === 'analysis-results' ||
              mutation.target.closest('#analysis-results')) {
            setTimeout(() => this.updateAnalysisResults(), 100);
          }
        }
      });
    });

    // Start observing
    const selectedFoodsContainer = document.getElementById('selected-foods');
    const analysisResultsContainer = document.getElementById('analysis-results');

    if (selectedFoodsContainer) {
      observer.observe(selectedFoodsContainer, {
        childList: true,
        subtree: true
      });
    }

    if (analysisResultsContainer) {
      observer.observe(analysisResultsContainer, {
        childList: true,
        subtree: true
      });
    }
  }

  toggleDropdown() {
    const dropdown = document.getElementById('language-dropdown');
    const btn = document.getElementById('language-btn');
    
    if (dropdown && btn) {
      dropdown.classList.toggle('hidden');
      btn.classList.toggle('active');
    }
  }
  
  closeDropdown() {
    const dropdown = document.getElementById('language-dropdown');
    const btn = document.getElementById('language-btn');
    
    if (dropdown && btn) {
      dropdown.classList.add('hidden');
      btn.classList.remove('active');
    }
  }
  
  changeLanguage(language) {
    if (this.translations[language]) {
      this.currentLanguage = language;
      localStorage.setItem('preferred-language', language);

      // Comprehensive translation of all content
      this.translateAllContent();
      this.closeDropdown();

      // Update document language attribute
      document.documentElement.lang = language;

      // Trigger custom event for other scripts to listen to
      const event = new CustomEvent('languageChanged', {
        detail: { language: language }
      });
      document.dispatchEvent(event);
    }
  }
  
  updateLanguageDisplay() {
    const currentLanguageSpan = document.getElementById('current-language');
    const languageOptions = document.querySelectorAll('.language-option');
    
    if (currentLanguageSpan) {
      currentLanguageSpan.textContent = this.currentLanguage.toUpperCase();
    }
    
    // Update active state in dropdown
    languageOptions.forEach(option => {
      const lang = option.getAttribute('data-lang');
      if (lang === this.currentLanguage) {
        option.classList.add('active');
      } else {
        option.classList.remove('active');
      }
    });
  }
  
  translatePage() {
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

    // Handle aria-label translations
    const ariaLabelElements = document.querySelectorAll('[data-translate-aria-label]');
    ariaLabelElements.forEach(element => {
      const key = element.getAttribute('data-translate-aria-label');
      const translation = this.getTranslation(key);

      if (translation) {
        element.setAttribute('aria-label', translation);
      }
    });

    // Handle dynamic content translations
    this.translateDynamicContent();
  }

  translateDynamicContent() {
    // Update food names in selected foods table
    this.updateSelectedFoodsDisplay();

    // Update analysis results if they exist
    this.updateAnalysisResults();

    // Update saved groceries display
    this.updateSavedGroceriesDisplay();

    // Update food items in the main list
    this.updateFoodItemsDisplay();
  }

  updateSelectedFoodsDisplay() {
    // Update the selected foods table headers
    const tableHeaders = document.querySelectorAll('.selected-foods-table th');
    if (tableHeaders.length > 0) {
      const headerTranslations = {
        en: ['Food', 'Category', 'Quantity', 'Action'],
        rw: ['Ibiribwa', 'Icyiciro', 'Ingano', 'Igikorwa']
      };

      const translations = headerTranslations[this.currentLanguage] || headerTranslations.en;
      tableHeaders.forEach((header, index) => {
        if (translations[index]) {
          header.textContent = translations[index];
        }
      });
    }

    // Update food names in the table
    const foodCells = document.querySelectorAll('.selected-foods-table tbody td:first-child');
    foodCells.forEach(cell => {
      const text = cell.textContent;
      // Extract food names from format "English (Kinyarwanda)"
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

    // Update "No foods selected yet" message
    const emptyMessage = document.querySelector('#selected-foods p');
    if (emptyMessage && emptyMessage.textContent.includes('No foods selected')) {
      const translation = this.getTranslation('results.selected.empty');
      if (translation) {
        emptyMessage.textContent = translation;
      }
    }
  }

  updateAnalysisResults() {
    // Update analysis headers
    const balancedHeader = document.querySelector('.analysis-header.balanced h3');
    if (balancedHeader) {
      const translation = this.getTranslation('analysis.balanced.title') ||
                         (this.currentLanguage === 'rw' ? 'Indyo Zuzuye!' : 'Balanced Diet!');
      balancedHeader.textContent = translation;
    }

    const unbalancedHeader = document.querySelector('.analysis-header.unbalanced h3');
    if (unbalancedHeader) {
      const translation = this.getTranslation('analysis.unbalanced.title') ||
                         (this.currentLanguage === 'rw' ? 'Indyo Zidazuye' : 'Unbalanced Diet');
      unbalancedHeader.textContent = translation;
    }

    // Update analysis content descriptions
    const balancedDescription = document.querySelector('.analysis-header.balanced + .analysis-content p');
    if (balancedDescription) {
      const translation = this.getTranslation('analysis.balanced.description');
      if (translation) {
        balancedDescription.textContent = translation;
      }
    }

    const unbalancedDescription = document.querySelector('.analysis-header.unbalanced + .analysis-content p');
    if (unbalancedDescription) {
      const translation = this.getTranslation('analysis.unbalanced.description');
      if (translation) {
        unbalancedDescription.textContent = translation;
      }
    }

    // Update section headers
    const breakdownHeader = document.querySelector('.category-breakdown h4');
    if (breakdownHeader) {
      const translation = this.getTranslation('analysis.balanced.breakdown');
      if (translation) {
        breakdownHeader.textContent = translation;
      }
    }

    const benefitsHeader = document.querySelector('.benefits-section h4');
    if (benefitsHeader) {
      const translation = this.getTranslation('analysis.balanced.benefits');
      if (translation) {
        benefitsHeader.textContent = translation;
      }
    }

    const mealsHeader = document.querySelector('.meal-suggestions h4');
    if (mealsHeader) {
      const translation = this.getTranslation('analysis.balanced.meals');
      if (translation) {
        mealsHeader.textContent = translation;
      }
    }

    const missingHeader = document.querySelector('.missing-categories h4');
    if (missingHeader) {
      const translation = this.getTranslation('analysis.unbalanced.missing');
      if (translation) {
        missingHeader.textContent = translation;
      }
    }

    // Update category names in analysis
    const categoryBadges = document.querySelectorAll('.analysis-content .category-badge');
    categoryBadges.forEach(badge => {
      if (window.foodData && window.foodData.categories) {
        const categoryClass = badge.className.match(/category-(\w+)/);
        if (categoryClass) {
          const categoryId = categoryClass[1];
          const category = window.foodData.categories.find(c => c.id === categoryId);
          if (category && category.name) {
            const categoryName = this.currentLanguage === 'rw' ? category.name.rw : category.name.en;
            // Update only the text content, preserve the icon
            const icon = badge.querySelector('i');
            if (icon) {
              badge.innerHTML = icon.outerHTML + ' ' + categoryName;
            } else {
              badge.textContent = categoryName;
            }
          }
        }
      }
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

  updateFoodItemsDisplay() {
    // Update food names in the main food selection list using data attributes
    const foodItems = document.querySelectorAll('.food-item');

    foodItems.forEach(item => {
      const nameEn = item.dataset.nameEn;
      const nameRw = item.dataset.nameRw;
      const label = item.querySelector('.food-name-label');

      if (label && nameEn && nameRw) {
        const displayName = this.currentLanguage === 'rw' ?
          `${nameRw} (${nameEn})` :
          `${nameEn} (${nameRw})`;
        label.textContent = displayName;
      }

      // Update quantity label
      const quantityLabel = item.querySelector('.food-quantity label[data-translate="food.quantity"]');
      if (quantityLabel) {
        const translation = this.getTranslation('food.quantity');
        if (translation) {
          quantityLabel.textContent = translation;
        }
      }
    });

    // Also handle any food labels that don't have data attributes (fallback)
    const foodLabels = document.querySelectorAll('.food-item label:not([data-translate])');
    foodLabels.forEach(label => {
      if (label.classList.contains('food-name-label')) return; // Skip already handled labels

      const text = label.textContent;
      const match = text.match(/^(.+?)\s*\((.+?)\)(.*)$/);
      if (match) {
        const englishName = match[1].trim();
        const kinyarwandaName = match[2].trim();
        const remainder = match[3]; // Any additional text like price

        if (this.currentLanguage === 'rw') {
          label.textContent = `${kinyarwandaName} (${englishName})${remainder}`;
        } else {
          label.textContent = `${englishName} (${kinyarwandaName})${remainder}`;
        }
      }
    });
  }

  updateSavedGroceriesDisplay() {
    // Update saved groceries section
    const savedGroceriesTitle = document.querySelector('.saved-groceries-card h3');
    if (savedGroceriesTitle) {
      const translation = this.currentLanguage === 'rw' ?
        'Urutonde rwawe rw\'Ibiribwa rwabitswe' :
        'Your Last Saved Grocery List';
      savedGroceriesTitle.textContent = translation;
    }

    const savedDateText = document.querySelector('.saved-date');
    if (savedDateText) {
      const dateMatch = savedDateText.textContent.match(/Saved on: (.+)/);
      if (dateMatch) {
        const dateStr = dateMatch[1];
        const prefix = this.currentLanguage === 'rw' ? 'Byabitswe ku wa: ' : 'Saved on: ';
        savedDateText.textContent = prefix + dateStr;
      }
    }

    const loadButton = document.getElementById('load-saved-groceries');
    if (loadButton) {
      const translation = this.currentLanguage === 'rw' ? 'Koresha Uyu Rutonde' : 'Load This List';
      loadButton.textContent = translation;
    }
  }
  
  getTranslation(key) {
    const keys = key.split('.');
    let translation = this.translations[this.currentLanguage];
    
    for (const k of keys) {
      if (translation && translation[k]) {
        translation = translation[k];
      } else {
        // Fallback to English if translation not found
        translation = this.translations.en;
        for (const fallbackKey of keys) {
          if (translation && translation[fallbackKey]) {
            translation = translation[fallbackKey];
          } else {
            return null;
          }
        }
        break;
      }
    }
    
    return typeof translation === 'string' ? translation : null;
  }
  
  getCurrentLanguage() {
    return this.currentLanguage;
  }

  addTranslations(language, translations) {
    if (!this.translations[language]) {
      this.translations[language] = {};
    }

    Object.assign(this.translations[language], translations);
  }

  /**
   * Comprehensive translation function that handles all possible text elements
   */
  translateAllContent() {
    // Translate all elements with data-translate attributes
    this.translatePage();

    // Handle special cases for dynamic content
    this.translateSpecialElements();

    // Update language-specific UI elements
    this.updateLanguageSpecificUI();

    // Translate budget-specific content if on budget page
    if (window.location.pathname.includes('budget.html')) {
      this.translateBudgetContent();
      this.translateBudgetFoodNames();
    }
  }

  /**
   * Handle special elements that need custom translation logic
   */
  translateSpecialElements() {
    // Update loading messages
    const loadingElements = document.querySelectorAll('.loading:not(.hidden)');
    loadingElements.forEach(element => {
      const loadingText = element.querySelector('span');
      if (loadingText && !loadingText.hasAttribute('data-translate')) {
        const translation = this.getTranslation('ui.loading');
        if (translation) {
          loadingText.textContent = translation;
        }
      }
    });

    // Update error messages
    const errorElements = document.querySelectorAll('.error-message, .alert-error');
    errorElements.forEach(element => {
      if (!element.hasAttribute('data-translate') && element.textContent.includes('Error')) {
        const translation = this.getTranslation('ui.error');
        if (translation) {
          element.textContent = element.textContent.replace(/Error/g, translation);
        }
      }
    });

    // Update success messages
    const successElements = document.querySelectorAll('.success-message, .alert-success');
    successElements.forEach(element => {
      if (!element.hasAttribute('data-translate') && element.textContent.includes('Success')) {
        const translation = this.getTranslation('ui.success');
        if (translation) {
          element.textContent = element.textContent.replace(/Success/g, translation);
        }
      }
    });
  }

  /**
   * Update language-specific UI elements
   */
  updateLanguageSpecificUI() {
    // Update document direction for RTL languages (if needed in future)
    document.documentElement.dir = this.currentLanguage === 'ar' ? 'rtl' : 'ltr';

    // Update language indicator in dropdown
    this.updateLanguageDisplay();

    // Update any language-specific CSS classes
    document.body.className = document.body.className.replace(/lang-\w+/g, '');
    document.body.classList.add(`lang-${this.currentLanguage}`);
  }

  /**
   * Force retranslation of all content (useful for dynamic content)
   */
  retranslateAll() {
    this.translateAllContent();
  }

  /**
   * Translate budget-specific content
   */
  translateBudgetContent() {
    // Translate page title
    const pageTitle = document.querySelector('h1.section-title');
    if (pageTitle && pageTitle.textContent.includes('Budget-Based Meal Recommendations')) {
      const translation = this.getTranslation('budget.title');
      if (translation) {
        pageTitle.textContent = translation;
      }
    }

    // Translate welcome messages
    this.translateBudgetWelcomeMessages();

    // Translate budget form
    this.translateBudgetForm();

    // Translate how it works section
    this.translateBudgetHowItWorks();

    // Translate any existing budget results
    this.translateBudgetResults();

    // Translate budget history
    this.translateBudgetHistory();
  }

  /**
   * Translate budget welcome messages
   */
  translateBudgetWelcomeMessages() {
    // User welcome message
    const userWelcome = document.querySelector('.user-welcome.auth-dependent h2');
    if (userWelcome && userWelcome.textContent.includes('Welcome')) {
      const translation = this.getTranslation('budget.welcome.user');
      if (translation) {
        userWelcome.innerHTML = `${translation}, <span class="user-name">User</span>!`;
      }
    }

    const userWelcomeDesc = document.querySelector('.user-welcome.auth-dependent p');
    if (userWelcomeDesc && userWelcomeDesc.textContent.includes('Enter your budget')) {
      const translation = this.getTranslation('budget.welcome.user.description');
      if (translation) {
        userWelcomeDesc.textContent = translation;
      }
    }

    // Guest welcome message
    const guestWelcome = document.querySelector('.user-welcome.guest-only h2');
    if (guestWelcome && guestWelcome.textContent.includes('Welcome, Guest!')) {
      const translation = this.getTranslation('budget.welcome.guest');
      if (translation) {
        guestWelcome.textContent = translation;
      }
    }

    const guestWelcomeDesc = document.querySelector('.user-welcome.guest-only p');
    if (guestWelcomeDesc) {
      const descTranslation = this.getTranslation('budget.welcome.guest.description');
      const loginTranslation = this.getTranslation('budget.welcome.guest.login');
      const saveTranslation = this.getTranslation('budget.welcome.guest.save');

      if (descTranslation && loginTranslation && saveTranslation) {
        guestWelcomeDesc.innerHTML = `
          ${descTranslation}
          <a href="login.html">${loginTranslation}</a> ${saveTranslation}
        `;
      }
    }
  }

  /**
   * Translate budget form elements
   */
  translateBudgetForm() {
    // Form title
    const formTitle = document.querySelector('.budget-input-container .card h2');
    if (formTitle && formTitle.textContent.includes('Enter Your Budget')) {
      const translation = this.getTranslation('budget.form.title');
      if (translation) {
        formTitle.textContent = translation;
      }
    }

    // Form description
    const formDesc = document.querySelector('.budget-input-container .card p');
    if (formDesc && formDesc.textContent.includes('We\'ll recommend balanced meals')) {
      const translation = this.getTranslation('budget.form.description');
      if (translation) {
        formDesc.textContent = translation;
      }
    }

    // Form label
    const formLabel = document.querySelector('label[for="budget-amount"]');
    if (formLabel && formLabel.textContent.includes('Budget Amount')) {
      const translation = this.getTranslation('budget.form.label');
      if (translation) {
        formLabel.textContent = translation;
      }
    }

    // Form placeholder
    const formInput = document.getElementById('budget-amount');
    if (formInput && formInput.placeholder.includes('Enter amount')) {
      const translation = this.getTranslation('budget.form.placeholder');
      if (translation) {
        formInput.placeholder = translation;
      }
    }

    // Submit button
    const submitBtn = document.querySelector('#budget-form button[type="submit"]');
    if (submitBtn) {
      const icon = submitBtn.querySelector('i');
      const translation = this.getTranslation('budget.form.submit');
      if (translation && icon) {
        submitBtn.innerHTML = `${icon.outerHTML} ${translation}`;
      }
    }
  }

  /**
   * Translate "How It Works" section
   */
  translateBudgetHowItWorks() {
    const howItWorksCard = document.querySelector('.intro-card');
    if (!howItWorksCard) return;

    // Title
    const title = howItWorksCard.querySelector('h3');
    if (title && title.textContent.includes('How It Works')) {
      const translation = this.getTranslation('budget.how.title');
      if (translation) {
        title.textContent = translation;
      }
    }

    // Steps
    const steps = howItWorksCard.querySelectorAll('ol > li');
    const stepTranslations = [
      'budget.how.step1',
      'budget.how.step2',
      'budget.how.step3',
      'budget.how.step4'
    ];

    steps.forEach((step, index) => {
      if (stepTranslations[index]) {
        const translation = this.getTranslation(stepTranslations[index]);
        if (translation) {
          if (index === 3) { // Step 4 has sub-items
            const subItems = step.querySelector('ul');
            if (subItems) {
              const subItemTranslations = [
                'budget.how.step4.ingredients',
                'budget.how.step4.nutrition',
                'budget.how.step4.cost',
                'budget.how.step4.preparation'
              ];

              const subItemElements = subItems.querySelectorAll('li');
              subItemElements.forEach((subItem, subIndex) => {
                if (subItemTranslations[subIndex]) {
                  const subTranslation = this.getTranslation(subItemTranslations[subIndex]);
                  if (subTranslation) {
                    subItem.textContent = subTranslation;
                  }
                }
              });

              step.innerHTML = `${translation}<ul>${subItems.innerHTML}</ul>`;
            }
          } else {
            step.textContent = translation;
          }
        }
      }
    });

    // Tip section
    const tipParagraph = howItWorksCard.querySelector('p.tip');
    if (tipParagraph) {
      const tipIcon = tipParagraph.querySelector('i');
      const tipTitle = this.getTranslation('budget.how.tip');
      const tipDesc = this.getTranslation('budget.how.tip.description');

      if (tipTitle && tipDesc && tipIcon) {
        tipParagraph.innerHTML = `
          ${tipIcon.outerHTML} <strong>${tipTitle}</strong> ${tipDesc}
        `;
      }
    }
  }

  /**
   * Translate budget results
   */
  translateBudgetResults() {
    // Translate recommendations card header
    const recommendationsCard = document.querySelector('.recommendations-card');
    if (recommendationsCard) {
      const header = recommendationsCard.querySelector('.card-header h3');
      if (header) {
        const text = header.textContent;
        const budgetMatch = text.match(/(\d+)\s*RWF/);
        if (budgetMatch) {
          const budget = budgetMatch[1];
          const translation = this.getTranslation('budget.results.title');
          if (translation) {
            header.textContent = `${translation} ${budget} RWF`;
          }
        }
      }

      const description = recommendationsCard.querySelector('.card-content > p');
      if (description && description.textContent.includes('Here are balanced meal options')) {
        const translation = this.getTranslation('budget.results.description');
        if (translation) {
          description.textContent = translation;
        }
      }
    }

    // Translate meal options
    const mealOptions = document.querySelectorAll('.meal-option');
    mealOptions.forEach((mealOption, index) => {
      // Translate option title
      const optionTitle = mealOption.querySelector('h4');
      if (optionTitle) {
        const optionTranslation = this.getTranslation('budget.results.option');
        const mealName = optionTitle.textContent.replace(/Option \d+: /, '');
        const translatedMealName = this.translateMealName(mealName);
        if (optionTranslation) {
          optionTitle.textContent = `${optionTranslation} ${index + 1}: ${translatedMealName}`;
        }
      }

      // Translate ingredients section
      const ingredientsTitle = mealOption.querySelector('.meal-ingredients h5');
      if (ingredientsTitle) {
        const translation = this.getTranslation('budget.results.ingredients');
        if (translation) {
          ingredientsTitle.textContent = translation;
        }
      }

      // Translate nutrition section
      const nutritionTitle = mealOption.querySelector('.meal-nutrition h5');
      if (nutritionTitle) {
        const translation = this.getTranslation('budget.results.nutrition');
        if (translation) {
          nutritionTitle.textContent = translation;
        }
      }

      // Translate cost and savings
      const totalCostElement = mealOption.querySelector('.meal-cost strong');
      if (totalCostElement && totalCostElement.textContent.includes('Total Cost:')) {
        const translation = this.getTranslation('budget.results.total.cost');
        if (translation) {
          totalCostElement.textContent = `${translation}`;
        }
      }

      const savingsElement = mealOption.querySelector('.meal-savings strong');
      if (savingsElement && savingsElement.textContent.includes('Savings:')) {
        const translation = this.getTranslation('budget.results.savings');
        if (translation) {
          savingsElement.textContent = `${translation}`;
        }
      }

      // Translate preparation section
      const preparationTitle = mealOption.querySelector('.meal-preparation h5');
      if (preparationTitle) {
        const translation = this.getTranslation('budget.results.preparation');
        if (translation) {
          preparationTitle.textContent = translation;
        }
      }

      // Translate preparation tip content
      const preparationTip = mealOption.querySelector('.meal-preparation p');
      if (preparationTip) {
        const tipText = preparationTip.textContent;
        const translatedTip = this.translatePreparationTip(tipText);
        if (translatedTip) {
          preparationTip.textContent = translatedTip;
        }
      }

      // Translate save button
      const saveButton = mealOption.querySelector('.save-meal-btn');
      if (saveButton) {
        const icon = saveButton.querySelector('i');
        const translation = this.getTranslation('budget.results.save.meal');
        if (translation && icon) {
          saveButton.innerHTML = `${icon.outerHTML} ${translation}`;
        }
      }
    });

    // Translate error messages
    const errorCard = document.querySelector('.error-card');
    if (errorCard) {
      const errorTitle = errorCard.querySelector('.card-header h3');
      if (errorTitle && errorTitle.textContent.includes('No Recommendations Available')) {
        const translation = this.getTranslation('budget.error.no.recommendations');
        if (translation) {
          errorTitle.textContent = translation;
        }
      }

      const errorDescription = errorCard.querySelector('.card-content p:first-child');
      if (errorDescription) {
        const text = errorDescription.textContent;
        const budgetMatch = text.match(/(\d+)\s*RWF/);
        if (budgetMatch) {
          const budget = budgetMatch[1];
          const translation = this.getTranslation('budget.error.no.recommendations.description');
          if (translation) {
            errorDescription.textContent = `${translation} ${budget} RWF.`;
          }
        }
      }

      const errorSuggestion = errorCard.querySelector('.card-content p:last-child');
      if (errorSuggestion) {
        const translation = this.getTranslation('budget.error.no.recommendations.suggestion');
        if (translation) {
          errorSuggestion.textContent = translation;
        }
      }
    }
  }

  /**
   * Translate budget history section
   */
  translateBudgetHistory() {
    const historyCard = document.querySelector('.history-card');
    if (!historyCard) return;

    // Title
    const title = historyCard.querySelector('h3');
    if (title && title.textContent.includes('Your Budget History')) {
      const translation = this.getTranslation('budget.history.title');
      if (translation) {
        title.textContent = translation;
      }
    }

    // Use buttons
    const useButtons = historyCard.querySelectorAll('.btn-use-budget');
    useButtons.forEach(button => {
      const translation = this.getTranslation('budget.history.use');
      if (translation) {
        button.textContent = translation;
      }
    });
  }

  /**
   * Translate meal names
   */
  translateMealName(mealName) {
    if (!mealName) return mealName;

    // Handle "X with Y" format
    if (mealName.includes(' with ')) {
      const withTranslation = this.getTranslation('budget.meal.with');
      if (withTranslation) {
        return mealName.replace(' with ', ` ${withTranslation} `);
      }
    }

    // Handle "X Meal" format
    if (mealName.includes(' Meal')) {
      const mealTranslation = this.getTranslation('budget.meal.balanced');
      if (mealTranslation) {
        return mealName.replace(' Meal', ` ${mealTranslation}`);
      }
    }

    // Handle "X Dish" format
    if (mealName.includes(' Dish')) {
      const dishTranslation = this.getTranslation('budget.meal.dish');
      if (dishTranslation) {
        return mealName.replace(' Dish', ` ${dishTranslation}`);
      }
    }

    // Handle "Balanced Meal"
    if (mealName === 'Balanced Meal') {
      const translation = this.getTranslation('budget.meal.balanced');
      if (translation) {
        return translation;
      }
    }

    return mealName;
  }

  /**
   * Translate preparation tips
   */
  translatePreparationTip(tipText) {
    if (!tipText) return tipText;

    const tipTranslations = {
      'Cook the carbohydrates until soft, then add proteins and vegetables.': 'budget.prep.tip1',
      'Start by preparing the proteins, then add vegetables for the last few minutes of cooking.': 'budget.prep.tip2',
      'Boil the vegetables separately to preserve nutrients, then combine with other ingredients.': 'budget.prep.tip3',
      'Use minimal water when cooking to preserve nutrients.': 'budget.prep.tip4',
      'Add a small amount of oil or fat to help absorb fat-soluble vitamins.': 'budget.prep.tip5'
    };

    const translationKey = tipTranslations[tipText];
    if (translationKey) {
      const translation = this.getTranslation(translationKey);
      if (translation) {
        return translation;
      }
    }

    return tipText;
  }

  /**
   * Translate food names in budget results
   */
  translateBudgetFoodNames() {
    // Translate food names in ingredient lists
    const foodNameElements = document.querySelectorAll('.meal-ingredients .food-name');
    foodNameElements.forEach(element => {
      const text = element.textContent;
      const match = text.match(/^(.+?)\s*\((.+?)\)$/);
      if (match) {
        const englishName = match[1].trim();
        const kinyarwandaName = match[2].trim();

        if (this.currentLanguage === 'rw') {
          element.textContent = `${kinyarwandaName} (${englishName})`;
        } else {
          element.textContent = `${englishName} (${kinyarwandaName})`;
        }
      }
    });

    // Translate category names in nutrition section
    const categoryBadges = document.querySelectorAll('.meal-nutrition .category-badge');
    categoryBadges.forEach(badge => {
      if (window.foodData && window.foodData.categories) {
        const categoryClass = badge.className.match(/category-(\w+)/);
        if (categoryClass) {
          const categoryId = categoryClass[1];
          const category = window.foodData.categories.find(c => c.id === categoryId);
          if (category && category.name) {
            const categoryName = this.currentLanguage === 'rw' ? category.name.rw : category.name.en;
            const icon = badge.querySelector('i');
            if (icon) {
              badge.innerHTML = `${icon.outerHTML} ${categoryName}`;
            } else {
              badge.textContent = categoryName;
            }
          }
        }
      }
    });
  }

  /**
   * Handle budget-specific language change events
   */
  onBudgetLanguageChange() {
    // Listen for budget-specific events
    document.addEventListener('budgetRecommendationsGenerated', () => {
      setTimeout(() => {
        this.translateBudgetResults();
        this.translateBudgetFoodNames();
      }, 100);
    });

    document.addEventListener('budgetHistoryLoaded', () => {
      setTimeout(() => {
        this.translateBudgetHistory();
      }, 100);
    });

    // Listen for general language change events
    document.addEventListener('languageChanged', () => {
      setTimeout(() => {
        this.translateBudgetContent();
        this.translateBudgetFoodNames();
      }, 100);
    });
  }

  /**
   * Auto-detect and translate common English words/phrases
   */
  autoTranslateCommonWords() {
    const commonTranslations = {
      en: {
        'Loading...': 'ui.loading',
        'Error': 'ui.error',
        'Success': 'ui.success',
        'Save': 'ui.save',
        'Cancel': 'ui.cancel',
        'Close': 'ui.close',
        'Confirm': 'ui.confirm',
        'Remove': 'action.remove',
        'Edit': 'action.edit',
        'Add': 'action.add',
        'Select': 'action.select',
        'Clear': 'action.clear',
        'Reset': 'action.reset'
      }
    };

    // Find text nodes and translate common words
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );

    const textNodes = [];
    let node;
    while (node = walker.nextNode()) {
      if (node.nodeValue.trim() && !node.parentElement.hasAttribute('data-translate')) {
        textNodes.push(node);
      }
    }

    textNodes.forEach(textNode => {
      let text = textNode.nodeValue.trim();
      const translations = commonTranslations.en;

      for (const [englishText, translationKey] of Object.entries(translations)) {
        if (text === englishText) {
          const translation = this.getTranslation(translationKey);
          if (translation) {
            textNode.nodeValue = textNode.nodeValue.replace(englishText, translation);
          }
        }
      }
    });
  }

  /**
   * Scan page for untranslated text and log for debugging
   */
  scanForUntranslatedText() {
    const untranslated = [];
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );

    let node;
    while (node = walker.nextNode()) {
      const text = node.nodeValue.trim();
      if (text &&
          !node.parentElement.hasAttribute('data-translate') &&
          !node.parentElement.hasAttribute('data-translate-placeholder') &&
          !node.parentElement.hasAttribute('data-translate-title') &&
          text.length > 2 &&
          /[a-zA-Z]/.test(text)) {
        untranslated.push({
          text: text,
          element: node.parentElement,
          tagName: node.parentElement.tagName
        });
      }
    }

    if (untranslated.length > 0) {
      console.log('🔍 Untranslated text found:', untranslated);
    }

    return untranslated;
  }
}

// Initialize language manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.languageManager = new LanguageManager();
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = LanguageManager;
}
