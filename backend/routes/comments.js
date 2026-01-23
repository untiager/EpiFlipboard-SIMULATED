const express = require('express');
const router = express.Router();
const db = require('../database/db');
const { authenticateToken, optionalAuth } = require('../middleware/auth');

// Get all comments for an article
router.get('/article/:articleId', async (req, res) => {
  try {
    const { articleId } = req.params;
    
    const result = await db.query(
      `
      SELECT 
        c.id,
        c.content,
        c.created_at,
        c.updated_at,
        u.username,
        u.id as user_id
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.article_id = $1
      ORDER BY c.created_at DESC
      `,
      [articleId]
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
});

// Post a new comment (requires authentication)
router.post('/article/:articleId', authenticateToken, async (req, res) => {
  try {
    const { articleId } = req.params;
    const { content } = req.body;
    const userId = req.user.userId;
    
    if (!content || content.trim().length === 0) {
      return res.status(400).json({ error: 'Comment content is required' });
    }
    
    if (content.length > 2000) {
      return res.status(400).json({ error: 'Comment is too long (max 2000 characters)' });
    }
    
    const result = await db.query(
      `
      INSERT INTO comments (article_id, user_id, content)
      VALUES ($1, $2, $3)
      RETURNING id, content, created_at, updated_at
      `,
      [articleId, userId, content.trim()]
    );
    
    // Get username for the response
    const userResult = await db.query(
      'SELECT username FROM users WHERE id = $1',
      [userId]
    );
    
    const comment = {
      ...result.rows[0],
      username: userResult.rows[0].username,
      user_id: userId
    };
    
    res.status(201).json(comment);
  } catch (error) {
    console.error('Error posting comment:', error);
    res.status(500).json({ error: 'Failed to post comment' });
  }
});

// Delete a comment (user can only delete their own comments)
router.delete('/:commentId', authenticateToken, async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user.userId;
    
    // Check if comment belongs to user
    const checkResult = await db.query(
      'SELECT user_id FROM comments WHERE id = $1',
      [commentId]
    );
    
    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Comment not found' });
    }
    
    if (checkResult.rows[0].user_id !== userId) {
      return res.status(403).json({ error: 'You can only delete your own comments' });
    }
    
    await db.query('DELETE FROM comments WHERE id = $1', [commentId]);
    
    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ error: 'Failed to delete comment' });
  }
});

// Update a comment (user can only update their own comments)
router.put('/:commentId', authenticateToken, async (req, res) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;
    const userId = req.user.userId;
    
    if (!content || content.trim().length === 0) {
      return res.status(400).json({ error: 'Comment content is required' });
    }
    
    if (content.length > 2000) {
      return res.status(400).json({ error: 'Comment is too long (max 2000 characters)' });
    }
    
    // Check if comment belongs to user
    const checkResult = await db.query(
      'SELECT user_id FROM comments WHERE id = $1',
      [commentId]
    );
    
    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Comment not found' });
    }
    
    if (checkResult.rows[0].user_id !== userId) {
      return res.status(403).json({ error: 'You can only edit your own comments' });
    }
    
    const result = await db.query(
      `
      UPDATE comments 
      SET content = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING id, content, created_at, updated_at
      `,
      [content.trim(), commentId]
    );
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating comment:', error);
    res.status(500).json({ error: 'Failed to update comment' });
  }
});

// Get comment count for an article
router.get('/count/:articleId', async (req, res) => {
  try {
    const { articleId } = req.params;
    
    const result = await db.query(
      'SELECT COUNT(*) as count FROM comments WHERE article_id = $1',
      [articleId]
    );
    
    res.json({ count: parseInt(result.rows[0].count) });
  } catch (error) {
    console.error('Error fetching comment count:', error);
    res.status(500).json({ error: 'Failed to fetch comment count' });
  }
});

module.exports = router;
