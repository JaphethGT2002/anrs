# Budget Language Toggle System

A comprehensive language switching system specifically designed for the budget recommendations page of the Balanced Diet Recommendation System. This system provides seamless translation between English and Kinyarwanda for all budget-related content.

## Features

### 🌐 Complete Language Support
- **Static Content Translation**: All form labels, buttons, descriptions, and instructions
- **Dynamic Content Translation**: Budget recommendations, meal names, preparation tips
- **Real-time Translation**: Instant language switching without page reload
- **Error Message Translation**: Localized error and success messages
- **Food Name Translation**: Bilingual food names with proper formatting

### 🎯 Budget-Specific Functionality
- **Budget Form Translation**: Input labels, placeholders, and validation messages
- **Recommendation Results**: Meal options, ingredients, nutrition info, and costs
- **Budget History**: Historical budget entries with localized dates and actions
- **Preparation Tips**: Context-aware cooking instructions in both languages
- **Meal Naming**: Intelligent meal name generation based on ingredients

## File Structure

```
js/
├── language-toggle.js           # Main language system (extended)
├── budget-language-toggle.js    # Budget-specific language manager
├── budget-recommendations.js    # Updated with language support
└── budget-language-demo.js      # Demo and testing utilities

budget.html                      # Updated with data-translate attributes
```

## Implementation Details

### 1. Extended Language Manager

The main `LanguageManager` class has been extended with budget-specific methods:

```javascript
// New budget translation methods
translateBudgetContent()         // Translates all static budget content
translateBudgetResults()         // Translates dynamic recommendation results
translateBudgetHistory()         // Translates budget history section
translateBudgetFoodNames()       // Translates food names in budget context
translateMealName(mealName)      // Translates meal names intelligently
translatePreparationTip(tip)     // Translates cooking tips
```

### 2. Budget Language Manager

A specialized class that handles budget-specific language functionality:

```javascript
class BudgetLanguageManager {
  // Manages budget-specific translations
  // Sets up mutation observers for dynamic content
  // Handles budget-specific events
  // Provides translation utilities
}
```

### 3. Translation Keys

#### Budget Form
- `budget.title` - Page title
- `budget.form.title` - Form title
- `budget.form.description` - Form description
- `budget.form.label` - Budget amount label
- `budget.form.placeholder` - Input placeholder
- `budget.form.submit` - Submit button text

#### Budget Results
- `budget.results.title` - Results header
- `budget.results.description` - Results description
- `budget.results.option` - Option numbering
- `budget.results.ingredients` - Ingredients section
- `budget.results.nutrition` - Nutrition section
- `budget.results.total.cost` - Total cost label
- `budget.results.savings` - Savings label
- `budget.results.preparation` - Preparation section

#### Error Messages
- `budget.error.no.recommendations` - No recommendations title
- `budget.error.no.recommendations.description` - No recommendations description
- `budget.error.invalid.amount` - Invalid amount error

#### Meal Components
- `budget.meal.balanced` - Balanced meal
- `budget.meal.with` - Connector word (with/hamwe na)
- `budget.meal.dish` - Dish suffix

## Usage

### Basic Setup

1. Include the language toggle scripts in your HTML:
```html
<script src="js/language-toggle.js"></script>
<script src="js/budget-language-toggle.js"></script>
<script src="js/budget-recommendations.js"></script>
```

2. Add data-translate attributes to HTML elements:
```html
<h1 data-translate="budget.title">Budget-Based Meal Recommendations</h1>
<label data-translate="budget.form.label">Budget Amount</label>
<input data-translate-placeholder="budget.form.placeholder" placeholder="Enter amount">
```

### Language Switching

The system automatically detects language changes and translates all budget content:

```javascript
// Switch to Kinyarwanda
window.languageManager.changeLanguage('rw');

// Switch to English
window.languageManager.changeLanguage('en');
```

### Dynamic Content Translation

The system automatically translates dynamically generated content:

```javascript
// When budget recommendations are generated
document.addEventListener('budgetRecommendationsGenerated', () => {
  // Content is automatically translated
});
```

## Translation Examples

### English to Kinyarwanda

| English | Kinyarwanda |
|---------|-------------|
| Budget-Based Meal Recommendations | Inama z'Ifunguro zishingiye ku Ngengo y'Amafaranga |
| Enter Your Budget | Shyiramo Ingengo y'Amafaranga Yawe |
| Get Recommendations | Bona Inama |
| Total Cost | Igiciro Cyose |
| Preparation Tip | Inama yo Gutegura |
| Balanced Meal | Ifunguro Rizuye |

### Meal Name Translation

```javascript
// English: "Beans with Rice"
// Kinyarwanda: "Ibinyomoro hamwe na Umuceri"

// English: "Chicken Meal"
// Kinyarwanda: "Inkoko Ifunguro"
```

## Event System

The system uses custom events for coordination:

```javascript
// Budget recommendations generated
document.addEventListener('budgetRecommendationsGenerated', (event) => {
  console.log('Recommendations:', event.detail.recommendations);
});

// Language changed
document.addEventListener('languageChanged', (event) => {
  console.log('New language:', event.detail.language);
});

// Budget history loaded
document.addEventListener('budgetHistoryLoaded', (event) => {
  console.log('History entries:', event.detail.historyCount);
});
```

## Testing and Demo

### Demo Mode

In development mode (localhost), a demo panel is automatically added with testing controls:

- **Toggle Language**: Switch between English and Kinyarwanda
- **Generate Sample Budget**: Create sample budget recommendations
- **Show History**: Display sample budget history
- **Test Errors**: Test error message translations

### Manual Testing

```javascript
// Test all translations
window.budgetLanguageDemo.testAllTranslations();

// Demonstrate language switching
window.budgetLanguageDemo.demonstrateLanguageSwitching();

// Check translation coverage
window.budgetLanguageDemo.logTranslationCoverage();
```

## Browser Support

- Modern browsers with ES6+ support
- Chrome 60+, Firefox 55+, Safari 12+, Edge 79+
- Mobile browsers supported

## Performance

- Lazy loading of translations
- Efficient DOM updates using mutation observers
- Minimal impact on page load time
- Cached translation lookups

## Troubleshooting

### Common Issues

1. **Translations not appearing**: Check that data-translate attributes are properly set
2. **Dynamic content not translating**: Ensure events are properly dispatched
3. **Language not persisting**: Check localStorage permissions

### Debug Mode

Enable debug logging:
```javascript
window.languageManager.scanForUntranslatedText();
```

## Contributing

To add new budget translations:

1. Add translation keys to both English and Kinyarwanda sections in `language-toggle.js`
2. Add corresponding data-translate attributes to HTML elements
3. Update dynamic content generation to use translation keys
4. Test with the demo system

## License

Part of the Balanced Diet Recommendation System for Rwandan Parents.
