const express = require('express');
const router = express.Router();
const { aggregateContent } = require('../services/contentAggregator');

// Manual trigger for content aggregation (admin endpoint)
router.post('/aggregate', async (req, res) => {
  try {
    console.log('Manual content aggregation triggered');
    const count = await aggregateContent();
    res.json({ 
      success: true, 
      message: `Aggregation completed. ${count} new articles added.`,
      newArticles: count
    });
  } catch (error) {
    console.error('Error during manual aggregation:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to aggregate content' 
    });
  }
});

module.exports = router;
