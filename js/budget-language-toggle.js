/**
 * Budget Page Language Toggle Functionality
 * Simplified language toggle specifically for the budget page
 * Supports English and Kinyarwanda translations
 */

class BudgetLanguageManager {
  constructor() {
    this.currentLanguage = 'en';
    this.translations = {
      en: {
        // Page Meta
        'page.title': 'Budget Recommendations | Balanced Diet Recommendation System',
        'page.description': 'Get balanced meal recommendations within your budget',

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

        // Budget Page Content
        'budget.page.title': 'Budget-Based Meal Recommendations',
        'budget.welcome.user': 'Welcome',
        'budget.welcome.guest': 'Welcome, Guest!',
        'budget.welcome.description': 'Enter your budget to get balanced meal recommendations.',
        'budget.welcome.guest.description': 'Enter your budget to get balanced meal recommendations.',
        'budget.welcome.login.link': 'Login or register',
        'budget.welcome.save.results': 'to save your results.',

        // Budget Form
        'budget.form.title': 'Enter Your Budget',
        'budget.form.description': 'We\'ll recommend balanced meals within your budget using local Rwandan food prices.',
        'budget.form.label': 'Budget Amount',
        'budget.form.placeholder': 'Enter amount',
        'budget.form.button': 'Get Recommendations',

        // How It Works Section
        'budget.intro.title': 'How It Works',
        'budget.intro.step1': 'Enter your budget in Rwandan Francs (RWF)',
        'budget.intro.step2': 'Our system will analyze local food prices',
        'budget.intro.step3': 'You\'ll receive balanced meal recommendations within your budget',
        'budget.intro.step4': 'Each recommendation includes:',
        'budget.intro.step4.ingredients': 'List of ingredients with quantities',
        'budget.intro.step4.nutrition': 'Nutritional breakdown',
        'budget.intro.step4.cost': 'Total cost and savings',
        'budget.intro.step4.tips': 'Preparation tips',
        'budget.intro.tip.label': 'Tip:',
        'budget.intro.tip.text': 'For a family of four, a budget of at least 2000 RWF is recommended for a balanced meal.',

        // Footer
        'footer.copyright': '© 2023 Balanced Diet Recommendation System',
        'footer.tagline': 'Designed for Rwandan Parents',
        'footer.partners.title': 'Healthcare Partners',
        'footer.partners.moh': 'Ministry of Health Rwanda',
        'footer.partners.rbc': 'Rwanda Biomedical Centre',
        'footer.partners.kfh': 'King Faisal Hospital Rwanda',
        'footer.partners.hmis': 'Health Information System',
        'footer.social.title': 'Follow Us',

        // Budget-specific translations
        'budget.error.empty.amount': 'Please enter a budget amount.',
        'budget.error.invalid.amount': 'Please enter a valid budget amount.',
        'budget.error.too.low': 'Budget must be at least 200 RWF for meal recommendations.',
        'budget.error.too.high': 'Budget seems unusually high. Please enter a reasonable amount under 50000 RWF.',
        'budget.error.no.data': 'Food data is not available. Please try again later.',
        'budget.error.no.recommendations': 'No Recommendations Available',
        'budget.error.no.recommendations.description': 'We couldn\'t generate balanced meal recommendations for your budget of',
        'budget.error.no.recommendations.suggestion': 'Try increasing your budget or check back later for more affordable options.',
        'budget.results.title': 'Meal Recommendations for',
        'budget.results.description': 'Here are balanced meal options within your budget:',
        'budget.meal.with': 'with',
        'budget.meal.balanced': 'Balanced Meal',
        'budget.meal.dish': 'Dish',
        'budget.prep.tip1': 'Cook the carbohydrates until soft, then add proteins and vegetables.',
        'budget.prep.tip2': 'Start by preparing the proteins, then add vegetables for the last few minutes of cooking.',
        'budget.prep.tip3': 'Boil the vegetables separately to preserve nutrients, then combine with other ingredients.',
        'budget.prep.tip4': 'Use minimal water when cooking to preserve nutrients.',
        'budget.prep.tip5': 'Add a small amount of oil or fat to help absorb fat-soluble vitamins.',
        'budget.prep.tip6': 'Include colorful vegetables for vitamins and minerals essential for good health.',
        'budget.prep.tip7': 'Add healthy fats like avocado or a small amount of oil for better nutrient absorption.',
        'budget.prep.tip8': 'Combine vitamin-rich vegetables with healthy fats for maximum nutritional benefit.',
        'budget.success.meal.saved': 'Meal saved to your profile.',
        'budget.history.title': 'Your Budget History',
        'budget.history.use': 'Use',
        'budget.loading.message': 'Generating meal recommendations...',
        'budget.results.option': 'Option',
        'budget.results.ingredients': 'Ingredients:',
        'budget.results.nutrition': 'Nutrition:',
        'budget.results.total.cost': 'Total Cost:',
        'budget.results.savings': 'Savings:',
        'budget.results.preparation': 'Preparation Tip:',
        'budget.results.save.meal': 'Save This Meal'
      },
      
      rw: {
        // Page Meta
        'page.title': 'Inama z\'Ingengo y\'Amafaranga | Sisitemu y\'Inama z\'Indyo Zuzuye',
        'page.description': 'Bona inama z\'ifunguro zuzuye mu rwego rw\'ingengo y\'amafaranga yawe',

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

        // Budget Page Content
        'budget.page.title': 'Inama z\'Ifunguro Zishingiye ku Ngengo y\'Amafaranga',
        'budget.welcome.user': 'Murakaza neza',
        'budget.welcome.guest': 'Murakaza neza, Mushyitsi!',
        'budget.welcome.description': 'Shyiramo ingengo y\'amafaranga yawe kugira ngo ubone inama z\'ifunguro zuzuye.',
        'budget.welcome.guest.description': 'Shyiramo ingengo y\'amafaranga yawe kugira ngo ubone inama z\'ifunguro zuzuye.',
        'budget.welcome.login.link': 'Injira cyangwa wiyandikishe',
        'budget.welcome.save.results': 'kugira ngo ubike ibisubizo byawe.',

        // Budget Form
        'budget.form.title': 'Shyiramo Ingengo y\'Amafaranga Yawe',
        'budget.form.description': 'Tuzagutanga inama z\'ifunguro zuzuye mu rwego rw\'ingengo y\'amafaranga yawe tukoresha ibiciro by\'ibiribwa byo mu Rwanda.',
        'budget.form.label': 'Amafaranga y\'Ingengo',
        'budget.form.placeholder': 'Shyiramo amafaranga',
        'budget.form.button': 'Bona Inama',

        // How It Works Section
        'budget.intro.title': 'Uburyo Bikora',
        'budget.intro.step1': 'Shyiramo ingengo y\'amafaranga yawe mu mafaranga y\'u Rwanda (RWF)',
        'budget.intro.step2': 'Sisitemu yacu izasesengura ibiciro by\'ibiribwa byo mu gace',
        'budget.intro.step3': 'Uzabona inama z\'ifunguro zuzuye mu rwego rw\'ingengo y\'amafaranga yawe',
        'budget.intro.step4': 'Buri nama irimo:',
        'budget.intro.step4.ingredients': 'Urutonde rw\'ibikoresho n\'ingano zacyo',
        'budget.intro.step4.nutrition': 'Isesengura ry\'intungamubiri',
        'budget.intro.step4.cost': 'Igiciro cyose n\'amafaranga yabitswe',
        'budget.intro.step4.tips': 'Inama zo gutegura',
        'budget.intro.tip.label': 'Inama:',
        'budget.intro.tip.text': 'Ku muryango w\'abantu bane, ingengo y\'amafaranga y\'byibuze 2000 RWF irasabwa kugira ngo ubone ifunguro rizuye.',

        // Footer
        'footer.copyright': '© 2023 Sisitemu y\'Inama z\'Indyo Zuzuye',
        'footer.tagline': 'Yakozwe ku Babyeyi b\'Abanyarwanda',
        'footer.partners.title': 'Abafatanyabikorwa mu Buzima',
        'footer.partners.moh': 'Minisiteri y\'Ubuzima mu Rwanda',
        'footer.partners.rbc': 'Ikigo cy\'Ubushakashatsi bw\'Ubuzima mu Rwanda',
        'footer.partners.kfh': 'Ibitaro bya King Faisal mu Rwanda',
        'footer.partners.hmis': 'Sisitemu y\'Amakuru y\'Ubuzima',
        'footer.social.title': 'Dukurikire',

        // Budget-specific translations
        'budget.error.empty.amount': 'Nyamuneka shyiramo amafaranga y\'ingengo.',
        'budget.error.invalid.amount': 'Nyamuneka shyiramo amafaranga y\'ingengo yemewe.',
        'budget.error.too.low': 'Ingengo y\'amafaranga igomba kuba byibuze 200 RWF kugira ngo ubone inama z\'ifunguro.',
        'budget.error.too.high': 'Ingengo y\'amafaranga isa nkaho iri hejuru cyane. Nyamuneka shyiramo amafaranga y\'ibisanzwe munsi ya 50000 RWF.',
        'budget.error.no.data': 'Amakuru y\'ibiribwa ntaboneka. Nyamuneka ongera ugerageze nyuma.',
        'budget.error.no.recommendations': 'Nta nama Ziboneka',
        'budget.error.no.recommendations.description': 'Ntidushoboye gutanga inama z\'ifunguro zuzuye ku ngengo y\'amafaranga yawe ya',
        'budget.error.no.recommendations.suggestion': 'Gerageza kongera ingengo y\'amafaranga yawe cyangwa ugaruke nyuma kugira ngo ubone amahitamo ahendutse.',
        'budget.results.title': 'Inama z\'Ifunguro kuri',
        'budget.results.description': 'Dore amahitamo y\'ifunguro zuzuye mu rwego rw\'ingengo y\'amafaranga yawe:',
        'budget.meal.with': 'hamwe na',
        'budget.meal.balanced': 'Ifunguro Rizuye',
        'budget.meal.dish': 'Ifunguro',
        'budget.prep.tip1': 'Teka ibitera imbaraga kugeza byoroshye, hanyuma wongereho poroteyine n\'imboga.',
        'budget.prep.tip2': 'Tangira utegura poroteyine, hanyuma wongereho imboga mu minota ya nyuma yo guteka.',
        'budget.prep.tip3': 'Teka imboga ku ruhande kugira ngo ubike intungamubiri, hanyuma ubihuze n\'ibindi bikoresho.',
        'budget.prep.tip4': 'Koresha amazi make mu guteka kugira ngo ubike intungamubiri.',
        'budget.prep.tip5': 'Ongeraho amavuta make kugira ngo ufashe vitamini zishobora gushonga mu mavuta.',
        'budget.prep.tip6': 'Ongeraho imboga z\'amabara atandukanye kugira ngo ubone vitamini n\'amabuye y\'agaciro akenewe ubuzima bwiza.',
        'budget.prep.tip7': 'Ongeraho amavuta meza nka avoka cyangwa amavuta make kugira ngo ufashe intungamubiri kwinjiza mu mubiri.',
        'budget.prep.tip8': 'Huza imboga zikungahaye vitamini n\'amavuta meza kugira ngo ubone inyungu nyinshi z\'intungamubiri.',
        'budget.success.meal.saved': 'Ifunguro ryabitswe muri profayile yawe.',
        'budget.history.title': 'Amateka y\'Ingengo y\'Amafaranga Yawe',
        'budget.history.use': 'Koresha',
        'budget.loading.message': 'Turimo gutegura inama z\'ifunguro...',
        'budget.results.option': 'Ihitamo',
        'budget.results.ingredients': 'Ibikoresho:',
        'budget.results.nutrition': 'Intungamubiri:',
        'budget.results.total.cost': 'Igiciro Cyose:',
        'budget.results.savings': 'Amafaranga Yabitswe:',
        'budget.results.preparation': 'Inama yo Gutegura:',
        'budget.results.save.meal': 'Bika Iri funguro'
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

    // Wait a bit for all DOM elements to be ready
    setTimeout(() => {
      this.setupEventListeners();
      this.updateLanguageDisplay();
      this.translatePage();
      this.setupDynamicContentListeners();
    }, 100);
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

    if (languageOptions && languageOptions.length > 0) {
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
      console.log(`🌐 Changing language to: ${language}`);
      this.currentLanguage = language;
      localStorage.setItem('preferred-language', language);

      this.translatePage();
      this.closeDropdown();

      // Update document language attribute
      document.documentElement.lang = language;

      // Trigger custom event for other scripts to listen to
      const event = new CustomEvent('languageChanged', {
        detail: { language: language }
      });
      document.dispatchEvent(event);

      console.log(`✅ Language changed to: ${language}`);
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
    // Translate elements with data-translate attributes
    const elements = document.querySelectorAll('[data-translate]');

    elements.forEach(element => {
      const key = element.getAttribute('data-translate');
      const translation = this.getTranslation(key);

      if (translation) {
        element.textContent = translation;
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

    // Handle placeholder attribute translations
    const placeholderElements = document.querySelectorAll('[data-translate-placeholder]');
    placeholderElements.forEach(element => {
      const key = element.getAttribute('data-translate-placeholder');
      const translation = this.getTranslation(key);

      if (translation) {
        element.placeholder = translation;
      }
    });

    // Handle content attribute translations (for meta descriptions)
    const contentElements = document.querySelectorAll('[data-translate-content]');
    contentElements.forEach(element => {
      const key = element.getAttribute('data-translate-content');
      const translation = this.getTranslation(key);

      if (translation) {
        element.content = translation;
      }
    });

    // Handle page title translation
    const titleElement = document.querySelector('title[data-translate]');
    if (titleElement) {
      const key = titleElement.getAttribute('data-translate');
      const translation = this.getTranslation(key);

      if (translation) {
        document.title = translation;
      }
    }

    // Update language display after translation
    this.updateLanguageDisplay();
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

  setupDynamicContentListeners() {
    // Listen for budget recommendations generated event to re-translate dynamic content
    document.addEventListener('budgetRecommendationsGenerated', () => {
      // Re-translate any dynamically generated content
      setTimeout(() => {
        this.translatePage();
      }, 100);
    });

    // Listen for budget history loaded event to re-translate dynamic content
    document.addEventListener('budgetHistoryLoaded', () => {
      // Re-translate any dynamically generated content
      setTimeout(() => {
        this.translatePage();
      }, 100);
    });
  }
}

// Initialize the budget language manager when the DOM is loaded
function initializeBudgetLanguageManager() {
  // Use a more robust approach to ensure DOM is ready
  function createManager() {
    window.budgetLanguageManager = new BudgetLanguageManager();
    // Also expose as window.languageManager for compatibility with budget-recommendations.js
    window.languageManager = window.budgetLanguageManager;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createManager);
  } else if (document.readyState === 'interactive') {
    // DOM is ready but resources might still be loading
    setTimeout(createManager, 50);
  } else {
    // DOM and resources are fully loaded
    createManager();
  }
}

// Initialize immediately
initializeBudgetLanguageManager();
