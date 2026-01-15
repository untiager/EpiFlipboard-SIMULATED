const express = require('express');
const router = express.Router();
const db = require('../database/db');

// Get all articles with optional category filter
router.get('/', async (req, res) => {
  try {
    const { category, limit = 20, offset = 0 } = req.query;
    
    let query = `
      SELECT 
        a.*,
        c.name as category_name,
        c.slug as category_slug,
        c.color as category_color
      FROM articles a
      LEFT JOIN categories c ON a.category_id = c.id
    `;
    
    const params = [];
    
    if (category) {
      query += ' WHERE c.slug = $1';
      params.push(category);
      query += ` ORDER BY a.published_at DESC LIMIT $2 OFFSET $3`;
      params.push(limit, offset);
    } else {
      query += ` ORDER BY a.published_at DESC LIMIT $1 OFFSET $2`;
      params.push(limit, offset);
    }
    
    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching articles:', error);
    res.status(500).json({ error: 'Failed to fetch articles' });
  }
});

// Get single article by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await db.query(
      `
      SELECT 
        a.*,
        c.name as category_name,
        c.slug as category_slug,
        c.color as category_color
      FROM articles a
      LEFT JOIN categories c ON a.category_id = c.id
      WHERE a.id = $1
      `,
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Article not found' });
    }
    
    // Increment view count
    await db.query('UPDATE articles SET views = views + 1 WHERE id = $1', [id]);
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching article:', error);
    res.status(500).json({ error: 'Failed to fetch article' });
  }
});

// Get trending articles (most viewed in last 24 hours)
router.get('/trending/top', async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    const result = await db.query(
      `
      SELECT 
        a.*,
        c.name as category_name,
        c.slug as category_slug,
        c.color as category_color
      FROM articles a
      LEFT JOIN categories c ON a.category_id = c.id
      WHERE a.published_at > NOW() - INTERVAL '24 hours'
      ORDER BY a.views DESC, a.published_at DESC
      LIMIT $1
      `,
      [limit]
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching trending articles:', error);
    res.status(500).json({ error: 'Failed to fetch trending articles' });
  }
});

module.exports = router;
