# Epi-Flipboard

A modern web application that recreates the Flipboard experience with content aggregation, magazine-style layout, and smooth animations. Built with React, Node.js, Express, and PostgreSQL, fully containerized with Docker.

## Features

- **Magazine-style UI** - Beautiful card-based layout inspired by Flipboard
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **User Authentication** - Secure registration and login system with JWT
- **Personalized Experience** - Select favorite topics and get prioritized content
- **Trending Articles** - Highlights the most viewed content
- **Category Navigation** - Browse articles by topic (Technology, Business, Science, etc.)
- **Rich Media** - High-quality images with smooth hover effects
- **Fast & Efficient** - Optimized performance with PostgreSQL database
- **Docker Ready** - Single command deployment with docker-compose
- **Real Content Aggregation** - Automatically fetches articles from RSS feeds (TechCrunch, Wired, Bloomberg, ESPN, etc.)
- **Auto-Update** - Content refreshes every 6 hours automatically
- **Professional Design** - Clean interface for a professional look

## Architecture

```
├── frontend/             # React application
│   ├── src/
│   │   ├── components/   # Reusable components (Header, ArticleCard)
│   │   ├── pages/        # Page components (Home, Category, Article)
│   │   └── services/     # API integration
│   └── Dockerfile
├── backend/              # Node.js/Express API
│   ├── routes/           # API routes
│   ├── database/         # Database configuration and schema
│   └── Dockerfile
└── docker-compose.yml    # Docker orchestration
```

## Quick Start

### Prerequisites

- Docker (v20.10+)
- Docker Compose (v2.0+)

### Installation & Running

1. **Clone the repository**
   ```bash
   cd /home/untiager/delivery/tek3/epiflipboard
   ```

2. **Start all services with Docker Compose**
   ```bash
   docker-compose up --build
   ```

   This command will:
   - Build the frontend and backend Docker images
   - Start PostgreSQL database
   - Initialize the database with schema and sample data
   - Start the Node.js backend API
   - Start the React frontend

3. **Access the application**
   - **Frontend**: http://localhost:3000
   - **Backend API**: http://localhost:5000
   - **Database**: localhost:5432

4. **Stop the application**
   ```bash
   docker-compose down
   ```

   To remove volumes (database data):
   ```bash
   docker-compose down -v
   ```

## API Endpoints

### Articles
- `GET /api/articles` - Get all articles (supports ?category=slug&limit=20&offset=0)
- `GET /api/articles/:id` - Get single article by ID
- `GET /api/articles/trending/top` - Get trending articles

### Categories
- `GET /api/categories` - Get all categories with article counts
- `GET /api/categories/:slug` - Get single category by slug

### Admin
- `POST /api/admin/aggregate` - Manually trigger content aggregation

### Health Check
- `GET /health` - API health check

## Content Sources

The application automatically aggregates content from:

- **Technology**: TechCrunch, The Verge, Wired
- **Business**: Bloomberg, CNBC
- **Science**: Science Daily, Nature
- **Entertainment**: Hollywood Reporter, Variety
- **Sports**: ESPN
- **Food**: Bon Appétit

Content is fetched automatically every 6 hours, or can be manually triggered via the admin endpoint.

## Design Features

### Visual Elements
- **Card Layouts**: Magazine-style cards with images, titles, and descriptions
- **Color-Coded Categories**: Each category has a unique color theme
- **Hover Effects**: Smooth transitions and animations on interaction
- **Image Overlays**: Gradient overlays for better text readability
- **Responsive Grid**: Adapts to different screen sizes

### User Experience
- **Lazy Loading**: Efficient content loading
- **Category Filtering**: Easy navigation between topics
- **Trending Section**: Highlights popular content
- **Reading View**: Clean, distraction-free article reading

## Database Schema

### Categories Table
- id (SERIAL PRIMARY KEY)
- name (VARCHAR)
- slug (VARCHAR UNIQUE)
- description (TEXT)
- icon (VARCHAR)
- color (VARCHAR)

### Articles Table
- id (SERIAL PRIMARY KEY)
- title (VARCHAR)
- description (TEXT)
- content (TEXT)
- image_url (TEXT)
- source (VARCHAR)
- author (VARCHAR)
- category_id (INTEGER)
- published_at (TIMESTAMP)
- views (INTEGER)

## Technology Stack

### Frontend
- **React 18** - UI library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **CSS3** - Styling with modern features

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **PostgreSQL** - Database
- **pg** - PostgreSQL client

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Nginx** - Frontend web server

## Environment Variables

### Backend (.env)
```env
NODE_ENV=production
PORT=5000
DB_HOST=postgres
DB_PORT=5432
DB_NAME=flipboard
DB_USER=flipboard
DB_PASSWORD=flipboard123
```

### Frontend
```env
REACT_APP_API_URL=http://localhost:5000
```

## Development Mode

### Backend Development
```bash
cd backend
npm install
npm run dev
```

### Frontend Development
```bash
cd frontend
npm install
npm start
```

## Sample Data

The application comes pre-loaded with:
- **8 Categories**: Technology, Business, Science, Entertainment, Sports, Health, Travel, Food
- **10 Sample Articles**: Diverse content across all categories
- **High-quality placeholder images**: From Unsplash

## Future Enhancements

- [ ] User authentication and personalization
- [ ] Bookmarking and favorites
- [ ] Search functionality
- [ ] Real content aggregation from RSS feeds
- [ ] Social sharing features
- [ ] Comment system
- [ ] Dark mode
- [ ] Infinite scroll pagination
- [ ] Article recommendations

## License

MIT License - feel free to use this project for learning or production.

## Contributing

Contributions are welcome! Feel free to submit issues or pull requests.

## Acknowledgments

- Inspired by Flipboard's elegant design
- Images courtesy of Unsplash
- Built with modern web technologies

---

**Enjoy your personal magazine!**
