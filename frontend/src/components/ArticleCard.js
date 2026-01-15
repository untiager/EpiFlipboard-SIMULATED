import React from 'react';
import { Link } from 'react-router-dom';
import './ArticleCard.css';

const ArticleCard = ({ article, size = 'medium' }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    return date.toLocaleDateString();
  };

  return (
    <Link to={`/article/${article.id}`} className={`article-card article-card-${size}`}>
      <div className="article-image-container">
        <img 
          src={article.image_url || 'https://via.placeholder.com/800x600?text=No+Image'} 
          alt={article.title}
          className="article-image"
        />
        <div className="article-overlay">
          <div className="article-category" style={{ backgroundColor: article.category_color }}>
            {article.category_name}
          </div>
        </div>
      </div>
      <div className="article-content">
        <h3 className="article-title">{article.title}</h3>
        <p className="article-description">{article.description}</p>
        <div className="article-meta">
          <span className="article-source">{article.source}</span>
          <span className="article-date">{formatDate(article.published_at)}</span>
        </div>
      </div>
    </Link>
  );
};

export default ArticleCard;
