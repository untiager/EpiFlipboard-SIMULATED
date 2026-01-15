const Parser = require('rss-parser');
const db = require('../database/db');

const parser = new Parser({
  customFields: {
    item: [
      ['media:content', 'media'],
      ['media:thumbnail', 'thumbnail'],
      ['enclosure', 'enclosure'],
    ]
  }
});

// RSS feeds for different categories
const RSS_FEEDS = {
  technology: [
    'https://techcrunch.com/feed/',
    'https://www.theverge.com/rss/index.xml',
    'https://www.wired.com/feed/rss',
  ],
  business: [
    'https://feeds.bloomberg.com/markets/news.rss',
    'https://www.cnbc.com/id/100003114/device/rss/rss.html',
  ],
  science: [
    'https://www.sciencedaily.com/rss/all.xml',
    'https://www.nature.com/nature.rss',
  ],
  entertainment: [
    'https://www.hollywoodreporter.com/feed/',
    'https://variety.com/feed/',
  ],
  sports: [
    'https://www.espn.com/espn/rss/news',
    'https://www.reuters.com/lifestyle/sports',
  ],
  health: [
    'https://www.medicalnewstoday.com/rss',
    'https://www.health.com/syndication/feed',
  ],
  travel: [
    'https://www.lonelyplanet.com/blog/feed/',
    'https://www.travelandleisure.com/rss',
  ],
  food: [
    'https://www.bonappetit.com/feed/rss',
    'https://www.foodnetwork.com/feeds/all-recipes.rss',
  ]
};

// Extract image URL from RSS item
const extractImageUrl = (item) => {
  // Try media content
  if (item.media && item.media.$) {
    return item.media.$.url;
  }
  
  // Try enclosure
  if (item.enclosure && item.enclosure.url) {
    return item.enclosure.url;
  }
  
  // Try thumbnail
  if (item.thumbnail && item.thumbnail.$) {
    return item.thumbnail.$.url;
  }
  
  // Try to extract image from content
  if (item.content) {
    const imgMatch = item.content.match(/<img[^>]+src="([^">]+)"/);
    if (imgMatch) {
      return imgMatch[1];
    }
  }
  
  // Try content:encoded
  if (item['content:encoded']) {
    const imgMatch = item['content:encoded'].match(/<img[^>]+src="([^">]+)"/);
    if (imgMatch) {
      return imgMatch[1];
    }
  }
  
  return null;
};

// Clean HTML tags from text
const cleanText = (text) => {
  if (!text) return '';
  return text
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
};

// Fetch articles from a single RSS feed
const fetchFromFeed = async (feedUrl, categorySlug) => {
  try {
    console.log(`Fetching from ${feedUrl} for category ${categorySlug}...`);
    const feed = await parser.parseURL(feedUrl);
    
    // Get category ID
    const categoryResult = await db.query(
      'SELECT id FROM categories WHERE slug = $1',
      [categorySlug]
    );
    
    if (categoryResult.rows.length === 0) {
      console.error(`Category not found: ${categorySlug}`);
      return 0;
    }
    
    const categoryId = categoryResult.rows[0].id;
    let insertedCount = 0;
    
    // Process only recent items (last 10)
    const items = feed.items.slice(0, 10);
    
    for (const item of items) {
      try {
        const title = cleanText(item.title);
        const description = cleanText(item.contentSnippet || item.description || '').substring(0, 300);
        const content = cleanText(item.contentSnippet || item.description || item.content || '').substring(0, 2000);
        const imageUrl = extractImageUrl(item);
        const sourceUrl = item.link;
        const author = item.creator || item.author || feed.title || 'Unknown';
        const publishedAt = item.pubDate ? new Date(item.pubDate) : new Date();
        
        // Check if article already exists
        const existingArticle = await db.query(
          'SELECT id FROM articles WHERE source_url = $1',
          [sourceUrl]
        );
        
        if (existingArticle.rows.length > 0) {
          continue; // Skip if already exists
        }
        
        // Insert new article
        await db.query(
          `INSERT INTO articles (title, description, content, image_url, source, source_url, author, category_id, published_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
          [title, description, content, imageUrl, feed.title, sourceUrl, author, categoryId, publishedAt]
        );
        
        insertedCount++;
      } catch (itemError) {
        console.error(`Error processing item from ${feedUrl}:`, itemError.message);
      }
    }
    
    console.log(`Inserted ${insertedCount} articles from ${feedUrl}`);
    return insertedCount;
  } catch (error) {
    console.error(`Error fetching feed ${feedUrl}:`, error.message);
    return 0;
  }
};

// Fetch articles for all categories
const aggregateContent = async () => {
  console.log('Starting content aggregation...');
  let totalInserted = 0;
  
  for (const [categorySlug, feeds] of Object.entries(RSS_FEEDS)) {
    for (const feedUrl of feeds) {
      const count = await fetchFromFeed(feedUrl, categorySlug);
      totalInserted += count;
      
      // Add delay to avoid overwhelming servers
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  console.log(`Content aggregation completed. Total new articles: ${totalInserted}`);
  return totalInserted;
};

module.exports = {
  aggregateContent,
  fetchFromFeed,
};
