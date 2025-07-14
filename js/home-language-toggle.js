/**
 * Home Page Language Toggle Functionality
 * Dedicated language switcher for home.html only
 * Supports English and Kinyarwanda translations
 */

class HomeLanguageToggle {
  constructor() {
    this.currentLanguage = 'en';
    this.storageKey = 'home-language-preference';
    
    // Home page specific translations
    this.translations = {
      en: {
        // Logo and Branding
        'logo.balanced': 'Balanced',
        'logo.diet': 'Diet',
        'logo.tagline': 'Nutrition for Rwandan Families',

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
        'language.switch': 'Switch Language',

        // Hero Section
        'hero.title': 'Balanced Nutrition for Your Family',
        'hero.subtitle': 'Get personalized diet recommendations based on Rwandan foods and your budget',
        'hero.cta.primary': 'Start Analyzing Your Diet',
        'hero.cta.secondary': 'Learn More',

        // Features Section
        'features.title': 'Why Choose Our System?',
        'features.subtitle': 'Designed specifically for Rwandan families',
        
        'feature.local.title': 'Local Foods Focus',
        'feature.local.description': 'Recommendations based on foods available in Rwanda',
        
        'feature.budget.title': 'Budget-Friendly',
        'feature.budget.description': 'Get nutrition advice that fits your budget',
        
        'feature.children.title': 'Child-Focused',
        'feature.children.description': 'Special recommendations for growing children',
        
        'feature.expert.title': 'Expert Guidance',
        'feature.expert.description': 'Based on nutritional guidelines for Rwandan families',

        // Food Categories Section
        'categories.title': 'Essential Food Categories',
        'categories.subtitle': 'Understanding the building blocks of a balanced diet',
        
        'category.carbs.title': 'Carbohydrates',
        'category.carbs.description': 'Energy-giving foods like Ubugari, Ibirayi, and Umuceri.',
        'category.carbs.badge': 'Ibitera Imbaraga',
        
        'category.proteins.title': 'Proteins',
        'category.proteins.description': 'Body-building foods like Ibishyimbo, Inyama, and Amata.',
        'category.proteins.badge': 'Ibyubaka Umubiri',
        
        'category.vitamins.title': 'Vitamins & Minerals',
        'category.vitamins.description': 'Protective foods like Isombe, Imbwija, and Karoti.',
        'category.vitamins.badge': 'Vitamini',
        
        'category.fats.title': 'Fats & Oils',
        'category.fats.description': 'Energy-concentrated foods like Amavuta y\'inka and Avoka.',
        'category.fats.badge': 'Amavuta',

        // Call to Action Section
        'cta.title': 'Ready to Start Your Nutrition Journey?',
        'cta.description': 'Join thousands of Rwandan families improving their nutrition',
        'cta.button': 'Get Started Now',

        // Footer
        'footer.copyright': '© 2025 Balanced Diet Recommendation System',
        'footer.subtitle': 'Designed for Rwandan Parents',
        'footer.healthcare.title': 'Healthcare Partners',
        'footer.social.title': 'Follow Us'
      },
      
      rw: {
        // Logo and Branding
        'logo.balanced': 'Indyo',
        'logo.diet': 'Y\'uzuye',
        'logo.tagline': 'Intungamubiri y\'Imiryango y\'Abanyarwanda',

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
        'language.switch': 'Hindura Ururimi',

        // Hero Section
        'hero.title': 'Intungamubiri Zuzuye ku Muryango Wawe',
        'hero.subtitle': 'Bonera inama z\'indyo zikurikije ibiribwa by\'u Rwanda n\'ingengo yawe y\'amafaranga',
        'hero.cta.primary': 'Tangira Gusesengura Indyo Yawe',
        'hero.cta.secondary': 'Menya Byinshi',

        // Features Section
        'features.title': 'Kuki Uhitamo Sisitemu Yacu?',
        'features.subtitle': 'Yakozwe ku miryango y\'Abanyarwanda',
        
        'feature.local.title': 'Yibanze ku Biribwa by\'Aha',
        'feature.local.description': 'Inama zishingiye ku biribwa biboneka mu Rwanda',
        
        'feature.budget.title': 'Bihuye n\'Ingengo y\'Amafaranga',
        'feature.budget.description': 'Bonera inama z\'intungamubiri zihuye n\'ingengo yawe',
        
        'feature.children.title': 'Yibanze ku Bana',
        'feature.children.description': 'Inama zihariye z\'abana bakura',
        
        'feature.expert.title': 'Ubuyobozi bw\'Abahanga',
        'feature.expert.description': 'Bushingiye ku mategeko y\'intungamubiri y\'imiryango y\'Abanyarwanda',

        // Food Categories Section
        'categories.title': 'Ibyiciro by\'Ibiribwa Ngombwa',
        'categories.subtitle': 'Gusobanukirwa ibishinzwe indyo zuzuye',
        
        'category.carbs.title': 'Ibitera Imbaraga',
        'category.carbs.description': 'Ibiribwa bitera imbaraga nk\'Ubugari, Ibirayi, n\'Umuceri.',
        'category.carbs.badge': 'Ibitera Imbaraga',
        
        'category.proteins.title': 'Ibyubaka Umubiri',
        'category.proteins.description': 'Ibiribwa bibaka umubiri nk\'Ibishyimbo, Inyama, n\'Amata.',
        'category.proteins.badge': 'Ibyubaka Umubiri',
        
        'category.vitamins.title': 'Vitamini n\'Ibikoresho Ngombwa',
        'category.vitamins.description': 'Ibiribwa birinda indwara nk\'Isombe, Imbwija, na Karoti.',
        'category.vitamins.badge': 'Vitamini',
        
        'category.fats.title': 'Amavuta',
        'category.fats.description': 'Ibiribwa bikungahaye imbaraga nk\'Amavuta y\'inka n\'Avoka.',
        'category.fats.badge': 'Amavuta',

        // Call to Action Section
        'cta.title': 'Witeguye Gutangira Urugendo rw\'Intungamubiri?',
        'cta.description': 'Jya ku miryango y\'Abanyarwanda ibihumbi itezimbere intungamubiri yayo',
        'cta.button': 'Tangira Ubu',

        // Footer
        'footer.copyright': '© 2025 Sisitemu y\'Inama z\'Indyo Zuzuye',
        'footer.subtitle': 'Yakozwe ku Babyeyi b\'u Rwanda',
        'footer.healthcare.title': 'Abafatanyabikorwa mu Buzima',
        'footer.social.title': 'Dukurikire'
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
    
    console.log('Home Language Toggle initialized with language:', this.currentLanguage);
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
   * Setup event listeners for language toggle
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
    this.closeDropdown();
    
    // Update document language attribute
    document.documentElement.lang = language;
    
    // Add language class to body for CSS styling
    document.body.className = document.body.className.replace(/lang-\w+/g, '');
    document.body.classList.add(`lang-${language}`);
    
    // Dispatch custom event for other scripts
    const event = new CustomEvent('homeLanguageChanged', {
      detail: { language: language, translations: this.translations[language] }
    });
    document.dispatchEvent(event);
    
    console.log('Language changed to:', language);
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
   * Translate all content on the home page
   */
  translatePage() {
    // Translate elements with data-translate attributes
    this.translateDataAttributes();

    // Translate specific home page sections
    this.translateHeroSection();
    this.translateFeaturesSection();
    this.translateCategoriesSection();
    this.translateCTASection();
    this.translateFooter();

    console.log('Home page translated to:', this.currentLanguage);
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
   * Translate hero section content
   */
  translateHeroSection() {
    // Hero title
    const heroTitle = document.querySelector('.hero-title, .hero h1, .hero-section h1');
    if (heroTitle) {
      const translation = this.getTranslation('hero.title');
      if (translation) heroTitle.textContent = translation;
    }

    // Hero subtitle
    const heroSubtitle = document.querySelector('.hero-subtitle, .hero p, .hero-section p');
    if (heroSubtitle) {
      const translation = this.getTranslation('hero.subtitle');
      if (translation) heroSubtitle.textContent = translation;
    }

    // Hero CTA buttons
    const primaryCTA = document.querySelector('.hero-cta-primary, .btn-primary');
    if (primaryCTA) {
      const translation = this.getTranslation('hero.cta.primary');
      if (translation) primaryCTA.textContent = translation;
    }

    const secondaryCTA = document.querySelector('.hero-cta-secondary, .btn-secondary');
    if (secondaryCTA) {
      const translation = this.getTranslation('hero.cta.secondary');
      if (translation) secondaryCTA.textContent = translation;
    }
  }

  /**
   * Translate features section
   */
  translateFeaturesSection() {
    // Features section title
    const featuresTitle = document.querySelector('.features-title, .features h2');
    if (featuresTitle) {
      const translation = this.getTranslation('features.title');
      if (translation) featuresTitle.textContent = translation;
    }

    // Features subtitle
    const featuresSubtitle = document.querySelector('.features-subtitle, .features .subtitle');
    if (featuresSubtitle) {
      const translation = this.getTranslation('features.subtitle');
      if (translation) featuresSubtitle.textContent = translation;
    }

    // Individual feature cards
    const featureCards = document.querySelectorAll('.feature-card, .feature');
    const featureKeys = ['local', 'budget', 'children', 'expert'];

    featureCards.forEach((card, index) => {
      if (index < featureKeys.length) {
        const key = featureKeys[index];

        const title = card.querySelector('h3, .feature-title');
        if (title) {
          const translation = this.getTranslation(`feature.${key}.title`);
          if (translation) title.textContent = translation;
        }

        const description = card.querySelector('p, .feature-description');
        if (description) {
          const translation = this.getTranslation(`feature.${key}.description`);
          if (translation) description.textContent = translation;
        }
      }
    });
  }

  /**
   * Translate food categories section
   */
  translateCategoriesSection() {
    // Categories section title
    const categoriesTitle = document.querySelector('.categories-title, .categories h2');
    if (categoriesTitle) {
      const translation = this.getTranslation('categories.title');
      if (translation) categoriesTitle.textContent = translation;
    }

    // Categories subtitle
    const categoriesSubtitle = document.querySelector('.categories-subtitle, .categories .subtitle');
    if (categoriesSubtitle) {
      const translation = this.getTranslation('categories.subtitle');
      if (translation) categoriesSubtitle.textContent = translation;
    }

    // Individual category cards
    const categoryCards = document.querySelectorAll('.category-card');
    const categoryKeys = ['carbs', 'proteins', 'vitamins', 'fats'];

    categoryCards.forEach((card, index) => {
      if (index < categoryKeys.length) {
        const key = categoryKeys[index];

        const title = card.querySelector('h3');
        if (title) {
          const translation = this.getTranslation(`category.${key}.title`);
          if (translation) title.textContent = translation;
        }

        const description = card.querySelector('p');
        if (description) {
          const translation = this.getTranslation(`category.${key}.description`);
          if (translation) description.textContent = translation;
        }

        const badge = card.querySelector('.category-badge');
        if (badge) {
          const translation = this.getTranslation(`category.${key}.badge`);
          if (translation) badge.textContent = translation;
        }
      }
    });
  }

  /**
   * Translate call-to-action section
   */
  translateCTASection() {
    const ctaTitle = document.querySelector('.cta-title, .cta h2');
    if (ctaTitle) {
      const translation = this.getTranslation('cta.title');
      if (translation) ctaTitle.textContent = translation;
    }

    const ctaDescription = document.querySelector('.cta-description, .cta p');
    if (ctaDescription) {
      const translation = this.getTranslation('cta.description');
      if (translation) ctaDescription.textContent = translation;
    }

    const ctaButton = document.querySelector('.cta-button, .cta .btn');
    if (ctaButton) {
      const translation = this.getTranslation('cta.button');
      if (translation) ctaButton.textContent = translation;
    }
  }

  /**
   * Translate footer content
   */
  translateFooter() {
    // Copyright text
    const copyright = document.querySelector('footer p:first-child');
    if (copyright) {
      const translation = this.getTranslation('footer.copyright');
      if (translation) copyright.textContent = translation;
    }

    // Subtitle text
    const subtitle = document.querySelector('footer p:nth-child(2)');
    if (subtitle) {
      const translation = this.getTranslation('footer.subtitle');
      if (translation) subtitle.textContent = translation;
    }

    // Healthcare partners title
    const healthcareTitle = document.querySelector('.healthcare-links h4');
    if (healthcareTitle) {
      const translation = this.getTranslation('footer.healthcare.title');
      if (translation) healthcareTitle.textContent = translation;
    }

    // Social media title
    const socialTitle = document.querySelector('.footer-section:last-child h4');
    if (socialTitle) {
      const translation = this.getTranslation('footer.social.title');
      if (translation) socialTitle.textContent = translation;
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
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Only initialize if we're on the home page
  if (document.body.classList.contains('home-page') ||
      window.location.pathname.includes('home.html') ||
      document.querySelector('.hero-section, .categories-section')) {

    window.homeLanguageToggle = new HomeLanguageToggle();

    // Make it globally accessible for debugging
    window.debugHomeLanguage = () => {
      if (window.homeLanguageToggle) {
        window.homeLanguageToggle.debugTranslations();
      }
    };

    console.log('Home Language Toggle initialized successfully');
  }
});

// Export for use in other scripts if needed
if (typeof module !== 'undefined' && module.exports) {
  module.exports = HomeLanguageToggle;
}
