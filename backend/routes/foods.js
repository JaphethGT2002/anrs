/**
 * Food API Routes
 * Handles food data retrieval from database
 */

const express = require('express');
const database = require('../config/mysql-database');
const router = express.Router();

/**
 * GET /api/foods - Get all foods with categories
 */
router.get('/', async (req, res) => {
  try {
    // Get all foods
    const foods = await database.execute(`
      SELECT
        id,
        name_en,
        name_rw,
        category,
        price,
        price_unit,
        benefits,
        quantity_units
      FROM foods
      ORDER BY name_en ASC
    `);

    // Get all categories
    const categories = await database.execute(`
      SELECT
        id,
        name_en,
        name_rw,
        icon,
        color,
        description
      FROM food_categories
    `);

    // Transform the data to match the frontend format
    const transformedFoods = foods.map(food => ({
      id: food.id,
      name: {
        en: food.name_en,
        rw: food.name_rw
      },
      category: food.category,
      price: parseFloat(food.price),
      priceUnit: food.price_unit,
      benefits: JSON.parse(food.benefits || '[]'),
      quantityUnits: JSON.parse(food.quantity_units || '[]')
    }));

    const transformedCategories = categories.map(category => ({
      id: category.id,
      name: {
        en: category.name_en,
        rw: category.name_rw
      },
      icon: category.icon,
      color: category.color,
      description: category.description
    }));

    res.json({
      success: true,
      data: {
        foods: transformedFoods,
        categories: transformedCategories
      }
    });

  } catch (error) {
    console.error('Error fetching foods:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch foods',
      error: error.message
    });
  }
});

router.get('/test', (req, res) => {
  res.json({ message: 'Foods routes working' });
});

/**
 * GET /api/foods/:id - Get specific food by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const foods = await database.execute(`
      SELECT
        id,
        name_en,
        name_rw,
        category,
        price,
        price_unit,
        benefits,
        quantity_units
      FROM foods
      WHERE id = ?
    `, [id]);

    if (foods.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Food not found'
      });
    }

    const food = foods[0];
    const transformedFood = {
      id: food.id,
      name: {
        en: food.name_en,
        rw: food.name_rw
      },
      category: food.category,
      price: parseFloat(food.price),
      priceUnit: food.price_unit,
      benefits: JSON.parse(food.benefits || '[]'),
      quantityUnits: JSON.parse(food.quantity_units || '[]')
    };

    res.json({
      success: true,
      data: transformedFood
    });

  } catch (error) {
    console.error('Error fetching food:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch food',
      error: error.message
    });
  }
});

module.exports = router;
