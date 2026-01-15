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
