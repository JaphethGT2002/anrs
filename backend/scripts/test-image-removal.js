/**
 * Test Script: Verify image removal functionality
 * This script tests that the food management system works correctly
 * without image functionality.
 */

const database = require('../config/mysql-database');

async function testImageRemoval() {
  try {
    console.log('🧪 Testing image removal functionality...');

    // Initialize database connection
    await database.connect();
    console.log('✅ Database connected');

    // Test 1: Check that image column doesn't exist
    console.log('\n📋 Test 1: Checking database schema...');
    const checkColumnSql = `
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() 
        AND TABLE_NAME = 'foods' 
        AND COLUMN_NAME = 'image'
    `;

    const columnExists = await database.execute(checkColumnSql);
    if (!columnExists || columnExists.length === 0) {
      console.log('✅ Image column successfully removed from database');
    } else {
      console.log('❌ Image column still exists in database');
      return false;
    }

    // Test 2: Check current table structure
    console.log('\n📋 Test 2: Checking current table structure...');
    const describeTableSql = `DESCRIBE foods`;
    const tableStructure = await database.execute(describeTableSql);
    
    console.log('Current foods table columns:');
    tableStructure.forEach(column => {
      console.log(`  - ${column.Field} (${column.Type})`);
    });

    // Test 3: Try inserting a food item without image
    console.log('\n📋 Test 3: Testing food insertion without image...');
    const testFoodData = {
      id: 9999,
      name_en: 'Test Food Item',
      name_rw: 'Ibiryo byo Kwigeza',
      category: 'proteins',
      price: 1500.00,
      price_unit: 'kg',
      benefits: JSON.stringify(['Test benefit 1', 'Test benefit 2']),
      quantity_units: JSON.stringify(['kg', 'piece'])
    };

    const insertSql = `
      INSERT INTO foods (id, name_en, name_rw, category, price, price_unit, benefits, quantity_units)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await database.execute(insertSql, [
      testFoodData.id,
      testFoodData.name_en,
      testFoodData.name_rw,
      testFoodData.category,
      testFoodData.price,
      testFoodData.price_unit,
      testFoodData.benefits,
      testFoodData.quantity_units
    ]);

    console.log('✅ Successfully inserted test food item without image');

    // Test 4: Retrieve the food item
    console.log('\n📋 Test 4: Testing food retrieval...');
    const selectSql = `SELECT * FROM foods WHERE id = ?`;
    const retrievedFood = await database.execute(selectSql, [testFoodData.id]);

    if (retrievedFood && retrievedFood.length > 0) {
      console.log('✅ Successfully retrieved test food item');
      console.log('Retrieved data:', {
        id: retrievedFood[0].id,
        name_en: retrievedFood[0].name_en,
        name_rw: retrievedFood[0].name_rw,
        category: retrievedFood[0].category,
        price: retrievedFood[0].price,
        price_unit: retrievedFood[0].price_unit,
        benefits: retrievedFood[0].benefits,
        quantity_units: retrievedFood[0].quantity_units
      });
    } else {
      console.log('❌ Failed to retrieve test food item');
      return false;
    }

    // Test 5: Update the food item
    console.log('\n📋 Test 5: Testing food update without image...');
    const updateSql = `
      UPDATE foods 
      SET name_en = ?, price = ?, benefits = ?
      WHERE id = ?
    `;

    await database.execute(updateSql, [
      'Updated Test Food',
      2000.00,
      JSON.stringify(['Updated benefit 1', 'Updated benefit 2', 'New benefit']),
      testFoodData.id
    ]);

    console.log('✅ Successfully updated test food item without image');

    // Test 6: Clean up - delete test food item
    console.log('\n📋 Test 6: Cleaning up test data...');
    const deleteSql = `DELETE FROM foods WHERE id = ?`;
    await database.execute(deleteSql, [testFoodData.id]);
    console.log('✅ Successfully cleaned up test data');

    console.log('\n🎉 All tests passed! Image removal functionality is working correctly.');
    return true;

  } catch (error) {
    console.error('❌ Test failed:', error);
    return false;
  } finally {
    // Close database connection
    await database.close();
  }
}

async function main() {
  try {
    const success = await testImageRemoval();
    process.exit(success ? 0 : 1);
  } catch (error) {
    console.error('Test execution failed:', error);
    process.exit(1);
  }
}

// Run the test if this script is executed directly
if (require.main === module) {
  main();
}

module.exports = { testImageRemoval };
