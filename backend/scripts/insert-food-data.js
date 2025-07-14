/**
 * Script to insert food data from rwanda-foods.json into the database
 */

const fs = require('fs');
const path = require('path');
const database = require('../config/mysql-database');

async function insertFoodData() {
  try {
    console.log('🚀 Starting food data insertion...');
    
    // Connect to database
    await database.connect();
    console.log('✅ Connected to database');
    
    // Read the JSON file
    const jsonPath = path.join(__dirname, '../../data/rwanda-foods.json');
    const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    
    console.log(`📊 Found ${jsonData.foods.length} foods and ${jsonData.categories.length} categories`);
    
    // Insert categories first
    console.log('📂 Inserting food categories...');
    await insertCategories(jsonData.categories);
    
    // Insert foods
    console.log('🍎 Inserting foods...');
    await insertFoods(jsonData.foods);
    
    console.log('🎉 Food data insertion completed successfully!');
    
  } catch (error) {
    console.error('❌ Error inserting food data:', error);
    process.exit(1);
  } finally {
    await database.close();
  }
}

async function insertCategories(categories) {
  for (const category of categories) {
    try {
      // Check if category already exists
      const existingCategory = await database.execute(
        'SELECT id FROM food_categories WHERE id = ?',
        [category.id]
      );
      
      if (existingCategory.length > 0) {
        console.log(`⚠️  Category '${category.id}' already exists, updating...`);
        
        // Update existing category
        await database.execute(
          `UPDATE food_categories SET 
           name_en = ?, name_rw = ?, icon = ?, color = ?, description = ?
           WHERE id = ?`,
          [
            category.name.en,
            category.name.rw,
            category.icon,
            category.color,
            category.description,
            category.id
          ]
        );
      } else {
        // Insert new category
        await database.execute(
          `INSERT INTO food_categories (id, name_en, name_rw, icon, color, description)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [
            category.id,
            category.name.en,
            category.name.rw,
            category.icon,
            category.color,
            category.description
          ]
        );
        console.log(`✅ Inserted category: ${category.name.en} (${category.name.rw})`);
      }
    } catch (error) {
      console.error(`❌ Error inserting category ${category.id}:`, error);
    }
  }
}

async function insertFoods(foods) {
  for (const food of foods) {
    try {
      // Check if food already exists
      const existingFood = await database.execute(
        'SELECT id FROM foods WHERE id = ?',
        [food.id]
      );
      
      if (existingFood.length > 0) {
        console.log(`⚠️  Food '${food.name.en}' already exists, updating...`);
        
        // Update existing food
        await database.execute(
          `UPDATE foods SET
           name_en = ?, name_rw = ?, category = ?, price = ?, price_unit = ?,
           benefits = ?, quantity_units = ?
           WHERE id = ?`,
          [
            food.name.en,
            food.name.rw,
            food.category,
            food.price,
            food.priceUnit,
            JSON.stringify(food.benefits),
            JSON.stringify(food.quantityUnits),
            food.id
          ]
        );
      } else {
        // Insert new food
        await database.execute(
          `INSERT INTO foods (id, name_en, name_rw, category, price, price_unit, benefits, quantity_units)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            food.id,
            food.name.en,
            food.name.rw,
            food.category,
            food.price,
            food.priceUnit,
            JSON.stringify(food.benefits),
            JSON.stringify(food.quantityUnits)
          ]
        );
        console.log(`✅ Inserted food: ${food.name.en} (${food.name.rw}) - ${food.price} RWF/${food.priceUnit}`);
      }
    } catch (error) {
      console.error(`❌ Error inserting food ${food.name.en}:`, error);
    }
  }
}

// Run the script if called directly
if (require.main === module) {
  insertFoodData();
}

module.exports = { insertFoodData, insertCategories, insertFoods };
