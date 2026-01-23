const express = require('express');
const router = express.Router();
const db = require('../database/db');
const { authenticateToken } = require('../middleware/auth');

// Get user's favorite categories
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const result = await db.query(
      `SELECT 
        c.id, c.name, c.slug, c.description, c.icon, c.color
      FROM user_favorite_categories ufc
      JOIN categories c ON ufc.category_id = c.id
      WHERE ufc.user_id = $1
      ORDER BY c.name`,
      [userId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching favorite categories:', error);
    res.status(500).json({ error: 'Failed to fetch favorite categories' });
  }
});

// Add category to favorites
router.post('/:categoryId', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const categoryId = parseInt(req.params.categoryId);

    // Check if category exists
    const categoryCheck = await db.query(
      'SELECT id FROM categories WHERE id = $1',
      [categoryId]
    );

    if (categoryCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }

    // Check if already favorited
    const existingFavorite = await db.query(
      'SELECT id FROM user_favorite_categories WHERE user_id = $1 AND category_id = $2',
      [userId, categoryId]
    );

    if (existingFavorite.rows.length > 0) {
      return res.status(409).json({ error: 'Category already in favorites' });
    }

    // Add to favorites
    await db.query(
      'INSERT INTO user_favorite_categories (user_id, category_id) VALUES ($1, $2)',
      [userId, categoryId]
    );

    res.status(201).json({ message: 'Category added to favorites' });
  } catch (error) {
    console.error('Error adding favorite category:', error);
    res.status(500).json({ error: 'Failed to add favorite category' });
  }
});

// Remove category from favorites
router.delete('/:categoryId', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const categoryId = parseInt(req.params.categoryId);

    const result = await db.query(
      'DELETE FROM user_favorite_categories WHERE user_id = $1 AND category_id = $2 RETURNING id',
      [userId, categoryId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Favorite not found' });
    }

    res.json({ message: 'Category removed from favorites' });
  } catch (error) {
    console.error('Error removing favorite category:', error);
    res.status(500).json({ error: 'Failed to remove favorite category' });
  }
});

// Toggle favorite status
router.put('/:categoryId/toggle', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const categoryId = parseInt(req.params.categoryId);

    // Check if already favorited
    const existingFavorite = await db.query(
      'SELECT id FROM user_favorite_categories WHERE user_id = $1 AND category_id = $2',
      [userId, categoryId]
    );

    if (existingFavorite.rows.length > 0) {
      // Remove from favorites
      await db.query(
        'DELETE FROM user_favorite_categories WHERE user_id = $1 AND category_id = $2',
        [userId, categoryId]
      );
      res.json({ message: 'Category removed from favorites', isFavorite: false });
    } else {
      // Add to favorites
      await db.query(
        'INSERT INTO user_favorite_categories (user_id, category_id) VALUES ($1, $2)',
        [userId, categoryId]
      );
      res.json({ message: 'Category added to favorites', isFavorite: true });
    }
  } catch (error) {
    console.error('Error toggling favorite category:', error);
    res.status(500).json({ error: 'Failed to toggle favorite category' });
  }
});

module.exports = router;
