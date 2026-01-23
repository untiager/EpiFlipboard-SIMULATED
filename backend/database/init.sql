-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(50),
    color VARCHAR(7),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create articles table
CREATE TABLE IF NOT EXISTS articles (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    content TEXT,
    image_url TEXT,
    source VARCHAR(100),
    source_url TEXT,
    author VARCHAR(100),
    category_id INTEGER REFERENCES categories(id),
    published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    views INTEGER DEFAULT 0
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category_id);
CREATE INDEX IF NOT EXISTS idx_articles_published ON articles(published_at DESC);

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    username VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create user_favorite_categories table
CREATE TABLE IF NOT EXISTS user_favorite_categories (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, category_id)
);

-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
    id SERIAL PRIMARY KEY,
    article_id INTEGER REFERENCES articles(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for user tables
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_user_favorites_user ON user_favorite_categories(user_id);
CREATE INDEX IF NOT EXISTS idx_user_favorites_category ON user_favorite_categories(category_id);
CREATE INDEX IF NOT EXISTS idx_comments_article ON comments(article_id);
CREATE INDEX IF NOT EXISTS idx_comments_created ON comments(created_at);

-- Insert default categories
INSERT INTO categories (name, slug, description, icon, color) VALUES
    ('Technology', 'technology', 'Latest tech news and innovations', '', '#3B82F6'),
    ('Business', 'business', 'Business and finance news', '', '#10B981'),
    ('Science', 'science', 'Scientific discoveries and research', '', '#8B5CF6'),
    ('Entertainment', 'entertainment', 'Movies, music, and pop culture', '', '#F59E0B'),
    ('Sports', 'sports', 'Sports news and highlights', '', '#EF4444'),
    ('Health', 'health', 'Health and wellness tips', '', '#EC4899'),
    ('Travel', 'travel', 'Travel guides and destinations', '', '#14B8A6'),
    ('Food', 'food', 'Recipes and culinary adventures', '', '#F97316')
ON CONFLICT (slug) DO NOTHING;

-- Sample articles removed - real content will be aggregated from RSS feeds
