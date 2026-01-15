import React, { useState, useEffect } from 'react';
import { getArticles, getTrendingArticles } from '../services/api';
import ArticleCard from '../components/ArticleCard';
import './Home.css';

const Home = () => {
  const [articles, setArticles] = useState([]);
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [articlesData, trendingData] = await Promise.all([
        getArticles(null, 20, 0),
        getTrendingArticles(5)
      ]);
      setArticles(articlesData);
      setTrending(trendingData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading articles...</p>
      </div>
    );
  }

  return (
    <div className="home">
      <div className="home-container">
        <section className="hero-section">
          <h1 className="hero-title">Your Personal Magazine</h1>
          <p className="hero-subtitle">Discover stories that matter to you</p>
        </section>

        {trending.length > 0 && (
          <section className="trending-section">
            <h2 className="section-title">🔥 Trending Now</h2>
            <div className="trending-grid">
              {trending.map((article) => (
                <ArticleCard key={article.id} article={article} size="large" />
              ))}
            </div>
          </section>
        )}

        <section className="articles-section">
          <h2 className="section-title">Latest Stories</h2>
          <div className="articles-grid">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
