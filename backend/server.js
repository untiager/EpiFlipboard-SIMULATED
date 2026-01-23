const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cron = require('node-cron');
const articlesRouter = require('./routes/articles');
const categoriesRouter = require('./routes/categories');
const aggregationRouter = require('./routes/aggregation');
const authRouter = require('./routes/auth');
const favoritesRouter = require('./routes/favorites');
const commentsRouter = require('./routes/comments');
const { initializeDatabase } = require('./database/db');
const { aggregateContent } = require('./services/contentAggregator');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/articles', articlesRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/admin', aggregationRouter);
app.use('/api/auth', authRouter);
app.use('/api/favorites', favoritesRouter);
app.use('/api/comments', commentsRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Flipboard API',
    version: '1.0.0',
    endpoints: {
      articles: '/api/articles',
      categories: '/api/categories',
      health: '/health'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Initialize database and start server
const startServer = async () => {
  try {
    await initializeDatabase();
    console.log('Database initialized successfully');
    
    // Initial content aggregation on startup
    console.log('Running initial content aggregation...');
    await aggregateContent();
    
    // Schedule content aggregation every 6 hours
    cron.schedule('0 */6 * * *', async () => {
      console.log('Running scheduled content aggregation...');
      await aggregateContent();
    });
    
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
      console.log('Content aggregation scheduled to run every 6 hours');
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
