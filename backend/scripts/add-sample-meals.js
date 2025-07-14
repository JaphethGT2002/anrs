const database = require('../config/mysql-database');

async function addSampleMeals() {
  try {
    console.log('Adding sample meals to database...');

    // Initialize database connection
    await database.connect();

    // Sample meal data using existing user IDs (8, 9, 10, 11, 12)
    const sampleMeals = [
      {
        user_id: 8,
        name: 'Healthy Breakfast Bowl',
        total_cost: 8.50,
        foods_data: JSON.stringify([
          { id: 1, name: 'Beans', quantity: 1, unit: 'kg', price: 3.00 },
          { id: 2, name: 'Rice', quantity: 0.5, unit: 'kg', price: 2.50 },
          { id: 3, name: 'Vegetables', quantity: 1, unit: 'bunch', price: 3.00 }
        ])
      },
      {
        user_id: 9,
        name: 'Balanced Lunch',
        total_cost: 12.75,
        foods_data: JSON.stringify([
          { id: 4, name: 'Chicken', quantity: 1, unit: 'kg', price: 8.00 },
          { id: 1, name: 'Beans', quantity: 0.5, unit: 'kg', price: 1.50 },
          { id: 5, name: 'Fruits', quantity: 2, unit: 'piece', price: 3.25 }
        ])
      },
      {
        user_id: 10,
        name: 'Nutritious Dinner',
        total_cost: 15.20,
        foods_data: JSON.stringify([
          { id: 6, name: 'Fish', quantity: 1, unit: 'kg', price: 10.00 },
          { id: 2, name: 'Rice', quantity: 1, unit: 'kg', price: 5.00 },
          { id: 7, name: 'Spinach', quantity: 1, unit: 'bunch', price: 0.20 }
        ])
      },
      {
        user_id: 11,
        name: 'Quick Snack Mix',
        total_cost: 6.30,
        foods_data: JSON.stringify([
          { id: 8, name: 'Nuts', quantity: 0.2, unit: 'kg', price: 4.00 },
          { id: 5, name: 'Fruits', quantity: 3, unit: 'piece', price: 2.30 }
        ])
      },
      {
        user_id: 12,
        name: 'Family Feast',
        total_cost: 25.80,
        foods_data: JSON.stringify([
          { id: 4, name: 'Chicken', quantity: 2, unit: 'kg', price: 16.00 },
          { id: 2, name: 'Rice', quantity: 2, unit: 'kg', price: 10.00 },
          { id: 3, name: 'Vegetables', quantity: 3, unit: 'bunch', price: 9.00 },
          { id: 9, name: 'Cooking Oil', quantity: 0.5, unit: 'liter', price: 0.80 }
        ])
      },
      {
        user_id: 8,
        name: 'Protein Power Bowl',
        total_cost: 18.45,
        foods_data: JSON.stringify([
          { id: 10, name: 'Eggs', quantity: 12, unit: 'piece', price: 6.00 },
          { id: 1, name: 'Beans', quantity: 1, unit: 'kg', price: 3.00 },
          { id: 11, name: 'Milk', quantity: 1, unit: 'liter', price: 2.45 },
          { id: 12, name: 'Cheese', quantity: 0.5, unit: 'kg', price: 7.00 }
        ])
      },
      {
        user_id: 9,
        name: 'Vegetarian Delight',
        total_cost: 9.90,
        foods_data: JSON.stringify([
          { id: 1, name: 'Beans', quantity: 1, unit: 'kg', price: 3.00 },
          { id: 3, name: 'Vegetables', quantity: 2, unit: 'bunch', price: 6.00 },
          { id: 13, name: 'Tomatoes', quantity: 1, unit: 'kg', price: 0.90 }
        ])
      },
      {
        user_id: 10,
        name: 'Traditional Meal',
        total_cost: 11.60,
        foods_data: JSON.stringify([
          { id: 14, name: 'Sweet Potatoes', quantity: 2, unit: 'kg', price: 4.00 },
          { id: 1, name: 'Beans', quantity: 1, unit: 'kg', price: 3.00 },
          { id: 15, name: 'Groundnuts', quantity: 0.5, unit: 'kg', price: 4.60 }
        ])
      },
      {
        user_id: 11,
        name: 'Light Lunch',
        total_cost: 7.25,
        foods_data: JSON.stringify([
          { id: 16, name: 'Bread', quantity: 2, unit: 'piece', price: 1.50 },
          { id: 17, name: 'Avocado', quantity: 2, unit: 'piece', price: 3.00 },
          { id: 11, name: 'Milk', quantity: 1, unit: 'liter', price: 2.75 }
        ])
      },
      {
        user_id: 12,
        name: 'Energy Breakfast',
        total_cost: 13.40,
        foods_data: JSON.stringify([
          { id: 18, name: 'Oats', quantity: 1, unit: 'kg', price: 5.00 },
          { id: 19, name: 'Bananas', quantity: 6, unit: 'piece', price: 3.00 },
          { id: 20, name: 'Honey', quantity: 0.5, unit: 'liter', price: 5.40 }
        ])
      }
    ];

    // Insert sample meals
    const sql = `
      INSERT INTO saved_meals (user_id, name, total_cost, foods_data, saved_at)
      VALUES (?, ?, ?, ?, ?)
    `;

    for (const meal of sampleMeals) {
      // Generate random dates within the last 60 days
      const randomDaysAgo = Math.floor(Math.random() * 60);
      const savedAt = new Date();
      savedAt.setDate(savedAt.getDate() - randomDaysAgo);
      
      await database.execute(sql, [
        meal.user_id,
        meal.name,
        meal.total_cost,
        meal.foods_data,
        savedAt.toISOString().slice(0, 19).replace('T', ' ')
      ]);
      
      console.log(`Added meal: ${meal.name}`);
    }

    console.log('Sample meals added successfully!');
    
    // Verify the data
    const countResult = await database.execute('SELECT COUNT(*) as count FROM saved_meals');
    const count = countResult[0]?.count || 0;
    console.log(`Total meals in database: ${count}`);
    
  } catch (error) {
    console.error('Error adding sample meals:', error);
  }
}

// Run the script
addSampleMeals().then(() => {
  console.log('Script completed');
  process.exit(0);
}).catch(error => {
  console.error('Script failed:', error);
  process.exit(1);
});
