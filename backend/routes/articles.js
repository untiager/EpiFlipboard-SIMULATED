const express = require('express');
const router = express.Router();
const db = require('../database/db');
const { optionalAuth } = require('../middleware/auth');

// Search articles with filters
router.get('/search', optionalAuth, async (req, res) => {
  try {
    const { q, category, dateFrom, dateTo, limit = 20, offset = 0 } = req.query;
    const userId = req.user?.userId;
    
    const params = [];
    let paramIndex = 1;
    const conditions = [];
    
    // Build the base query
    let query = `
      SELECT 
        a.*,
        c.name as category_name,
        c.slug as category_slug,
        c.color as category_color
        ${userId ? ', CASE WHEN ufc.id IS NOT NULL THEN 1 ELSE 0 END as is_favorite_category' : ''}
      FROM articles a
      LEFT JOIN categories c ON a.category_id = c.id
    `;
    
    // Add user favorites join if authenticated
    if (userId) {
      query += ` LEFT JOIN user_favorite_categories ufc ON c.id = ufc.category_id AND ufc.user_id = $${paramIndex}`;
      params.push(userId);
      paramIndex++;
    }
    
    // Add search query filter
    if (q) {
      conditions.push(`(a.title ILIKE $${paramIndex} OR a.description ILIKE $${paramIndex} OR a.content ILIKE $${paramIndex})`);
      params.push(`%${q}%`);
      paramIndex++;
    }
    
    // Add category filter
    if (category) {
      conditions.push(`c.slug = $${paramIndex}`);
      params.push(category);
      paramIndex++;
    }
    
    // Add date range filters
    if (dateFrom) {
      conditions.push(`a.published_at >= $${paramIndex}`);
      params.push(dateFrom);
      paramIndex++;
    }
    
    if (dateTo) {
      conditions.push(`a.published_at <= $${paramIndex}`);
      params.push(dateTo);
      paramIndex++;
    }
    
    // Apply WHERE clause if there are conditions
    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`;
    }
    
    // Order by relevance (favorites first if authenticated), then by date
    query += ` ORDER BY ${userId ? 'is_favorite_category DESC, ' : ''}a.published_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);
    
    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error searching articles:', error);
    res.status(500).json({ error: 'Failed to search articles' });
  }
});

// Get all articles with optional category filter and user favorites priority
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { category, limit = 20, offset = 0 } = req.query;
    const userId = req.user?.userId;
    
    const params = [];
    let paramIndex = 1;
    
    // Build the base query
    let query = `
      SELECT 
        a.*,
        c.name as category_name,
        c.slug as category_slug,
        c.color as category_color
        ${userId ? ', CASE WHEN ufc.id IS NOT NULL THEN 1 ELSE 0 END as is_favorite_category' : ''}
      FROM articles a
      LEFT JOIN categories c ON a.category_id = c.id
    `;
    
    // Add user favorites join if authenticated
    if (userId) {
      query += ` LEFT JOIN user_favorite_categories ufc ON c.id = ufc.category_id AND ufc.user_id = $${paramIndex}`;
      params.push(userId);
      paramIndex++;
    }
    
    // Add category filter if provided
    if (category) {
      query += ` WHERE c.slug = $${paramIndex}`;
      params.push(category);
      paramIndex++;
    }
    
    // Order by favorite categories first, then by published date
    query += ` ORDER BY ${userId ? 'is_favorite_category DESC, ' : ''}a.published_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);
    
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
