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

-- Insert sample articles
INSERT INTO articles (title, description, content, image_url, source, source_url, author, category_id, published_at) VALUES
    (
        'The Future of Artificial Intelligence in 2026',
        'Exploring how AI is transforming industries and daily life',
        'Artificial Intelligence continues to revolutionize every aspect of our lives. From healthcare to transportation, AI-powered solutions are making processes more efficient and accurate. This year has seen remarkable breakthroughs in natural language processing, computer vision, and autonomous systems.',
        'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800',
        'Tech Today',
        'https://example.com/ai-future',
        'Sarah Johnson',
        1,
        CURRENT_TIMESTAMP - INTERVAL '2 hours'
    ),
    (
        'Quantum Computing Breakthrough Announced',
        'Scientists achieve major milestone in quantum error correction',
        'Researchers at a leading quantum computing lab have announced a breakthrough in quantum error correction, bringing us closer to practical quantum computers. This achievement could revolutionize cryptography, drug discovery, and complex simulations.',
        'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800',
        'Science Daily',
        'https://example.com/quantum',
        'Dr. Michael Chen',
        3,
        CURRENT_TIMESTAMP - INTERVAL '5 hours'
    ),
    (
        'Global Markets Rally on Economic Data',
        'Stock markets surge as inflation shows signs of cooling',
        'Major stock indices around the world experienced significant gains today following the release of positive economic indicators. Investors are optimistic about the economic outlook as inflation rates continue to moderate.',
        'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800',
        'Financial Times',
        'https://example.com/markets',
        'Emma Williams',
        2,
        CURRENT_TIMESTAMP - INTERVAL '1 hour'
    ),
    (
        'New Blockbuster Film Breaks Records',
        'Latest superhero movie surpasses box office expectations',
        'The highly anticipated superhero film has shattered box office records, earning over $300 million in its opening weekend. Critics and audiences alike are praising the film''s innovative storytelling and spectacular visual effects.',
        'https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=800',
        'Entertainment Weekly',
        'https://example.com/movie',
        'Alex Rodriguez',
        4,
        CURRENT_TIMESTAMP - INTERVAL '3 hours'
    ),
    (
        'Championship Team Secures Victory',
        'Underdog team wins in stunning upset',
        'In a thrilling match that kept fans on the edge of their seats, the underdog team secured a stunning victory against the reigning champions. The final score of 3-2 came after an intense overtime period.',
        'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800',
        'Sports Network',
        'https://example.com/sports',
        'James Martinez',
        5,
        CURRENT_TIMESTAMP - INTERVAL '4 hours'
    ),
    (
        'Revolutionary Health App Launches',
        'AI-powered app helps users track and improve wellness',
        'A new health and wellness app using artificial intelligence has launched, promising to revolutionize how people manage their health. The app provides personalized recommendations based on user data and health goals.',
        'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800',
        'Health Magazine',
        'https://example.com/health-app',
        'Dr. Lisa Park',
        6,
        CURRENT_TIMESTAMP - INTERVAL '6 hours'
    ),
    (
        'Hidden Gems: Top Travel Destinations for 2026',
        'Discover off-the-beaten-path locations',
        'Travel enthusiasts are looking beyond traditional tourist destinations. This year''s top picks include pristine beaches, mountain villages, and cultural havens that offer authentic experiences away from the crowds.',
        'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=800',
        'Travel Guide',
        'https://example.com/travel',
        'Maria Santos',
        7,
        CURRENT_TIMESTAMP - INTERVAL '7 hours'
    ),
    (
        'The Art of Plant-Based Cooking',
        'Chefs share secrets to delicious vegan meals',
        'Plant-based cuisine has evolved far beyond simple salads. Top chefs reveal their techniques for creating flavorful, satisfying vegan dishes that appeal to everyone, regardless of dietary preferences.',
        'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800',
        'Food Network',
        'https://example.com/cooking',
        'Chef Antonio Rossi',
        8,
        CURRENT_TIMESTAMP - INTERVAL '8 hours'
    ),
    (
        'Sustainable Tech: Green Innovations',
        'Companies race to develop eco-friendly technology',
        'The tech industry is prioritizing sustainability with new innovations in renewable energy, biodegradable materials, and energy-efficient devices. These developments are crucial for addressing climate change.',
        'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800',
        'Green Tech',
        'https://example.com/green-tech',
        'David Green',
        1,
        CURRENT_TIMESTAMP - INTERVAL '9 hours'
    ),
    (
        'Virtual Reality Transforms Education',
        'Schools adopt VR technology for immersive learning',
        'Educational institutions are increasingly adopting virtual reality technology to create immersive learning experiences. Students can now explore ancient civilizations, dive into the ocean, or travel through space without leaving the classroom.',
        'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=800',
        'Education Today',
        'https://example.com/vr-education',
        'Jennifer Lee',
        1,
        CURRENT_TIMESTAMP - INTERVAL '10 hours'
    )
ON CONFLICT DO NOTHING;
