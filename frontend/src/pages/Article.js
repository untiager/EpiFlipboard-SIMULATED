import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getArticle } from '../services/api';
import './Article.css';

const Article = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticle();
  }, [id]);

  const fetchArticle = async () => {
    try {
      setLoading(true);
      const data = await getArticle(id);
      setArticle(data);
    } catch (error) {
      console.error('Failed to fetch article:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading article...</p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="error-container">
        <h2>Article not found</h2>
        <Link to="/" className="back-link">← Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="article-page">
      <div className="article-header">
        <img 
          src={article.image_url || 'https://via.placeholder.com/1200x600?text=No+Image'} 
          alt={article.title}
          className="article-header-image"
        />
        <div className="article-header-overlay">
          <div className="article-header-content">
            <Link 
              to={`/category/${article.category_slug}`}
              className="article-category-badge"
              style={{ backgroundColor: article.category_color }}
            >
              {article.category_name}
            </Link>
            <h1 className="article-page-title">{article.title}</h1>
            <p className="article-page-description">{article.description}</p>
            <div className="article-page-meta">
              <span className="article-author">{article.author}</span>
              <span className="meta-separator">•</span>
              <span className="article-source">{article.source}</span>
              <span className="meta-separator">•</span>
              <span className="article-date">{formatDate(article.published_at)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="article-body">
        <div className="article-content-wrapper">
          <div className="article-text">
            {article.content.split('\n\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          {article.source_url && (
            <div className="article-source-link">
              <a 
                href={article.source_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="source-button"
              >
                Read original article →
              </a>
            </div>
          )}

          <div className="article-footer">
            <Link to="/" className="back-link">← Back to Home</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Article;
