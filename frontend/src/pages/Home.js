import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getArticles, getTrendingArticles } from '../services/api';
import ArticleCard from '../components/ArticleCard';
import './Home.css';

const Home = () => {
  const [articles, setArticles] = useState([]);
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const observer = useRef();
  const navigate = useNavigate();
  const ITEMS_PER_PAGE = 12;

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [articlesData, trendingData] = await Promise.all([
        getArticles(null, ITEMS_PER_PAGE, 0),
        getTrendingArticles(5)
      ]);
      setArticles(articlesData);
      setTrending(trendingData);
      setPage(1);
      setHasMore(articlesData.length === ITEMS_PER_PAGE);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMoreArticles = async () => {
    if (loadingMore || !hasMore) return;

    try {
      setLoadingMore(true);
      const newArticles = await getArticles(null, ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
      
      if (newArticles.length === 0) {
        setHasMore(false);
      } else {
        setArticles(prev => [...prev, ...newArticles]);
        setPage(prev => prev + 1);
        setHasMore(newArticles.length === ITEMS_PER_PAGE);
      }
    } catch (error) {
      console.error('Failed to fetch more articles:', error);
    } finally {
      setLoadingMore(false);
    }
  };

  const lastArticleRef = useCallback(node => {
    if (loading || loadingMore) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        fetchMoreArticles();
      }
    });
    
    if (node) observer.current.observe(node);
  }, [loading, loadingMore, hasMore]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
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
  
          <form className="hero-search" onSubmit={handleSearch}>
            <input
              type="text"
              className="hero-search-input"
              placeholder="Search for articles, topics, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="hero-search-button">
              🔍 Search
            </button>
          </form>
        
  return (
    <div className="home">
      <div className="home-container">
        <section className="hero-section">
          <h1 className="hero-title">Your Personal Magazine</h1>
          <p className="hero-subtitle">Discover stories that matter to you from around the world</p>
        </section>

        {trending.length > 0 && (
          <section className="trending-section">
            <div className="section-header">
              <h2 className="section-title">
                <span className="section-icon">🔥</span>
                Trending Now
              </h2>
            </div>
            <div className="trending-grid">
              {trending.map((article) => (
                <ArticleCard key={article.id} article={article} size="large" />
              ))}
            </div>
          </section>
        )}

        <section className="articles-section">
          <div className="section-header">
            <h2 className="section-title">
              <span className="section-icon">📰</span>
              Latest Stories
            </h2>
          </div>
          <div className="articles-grid">
            {articles.map((article, index) => {
              if (articles.length === index + 1) {
                return (
                  <div ref={lastArticleRef} key={article.id}>
                    <ArticleCard article={article} />
                  </div>
                );
              }
              return <ArticleCard key={article.id} article={article} />;
            })}
          </div>

          {loadingMore && (
            <div className="loading-more">
              <div className="loading-spinner"></div>
              <p>Loading more articles...</p>
            </div>
          )}

          {!hasMore && articles.length > 0 && (
            <div className="end-message">
              <p>You've reached the end! 🎉</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Home;
