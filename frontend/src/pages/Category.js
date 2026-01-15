import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getArticles, getCategory } from '../services/api';
import ArticleCard from '../components/ArticleCard';
import './Category.css';

const Category = () => {
  const { slug } = useParams();
  const [articles, setArticles] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [slug]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [articlesData, categoryData] = await Promise.all([
        getArticles(slug, 20, 0),
        getCategory(slug)
      ]);
      setArticles(articlesData);
      setCategory(categoryData);
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

  if (!category) {
    return (
      <div className="error-container">
        <h2>Category not found</h2>
      </div>
    );
  }

  return (
    <div className="category">
      <div className="category-container">
        <section className="category-hero" style={{ backgroundColor: category.color }}>
          <div className="category-hero-content">
            <h1 className="category-title">{category.name}</h1>
            <p className="category-description">{category.description}</p>
            <p className="category-count">{category.article_count} articles</p>
          </div>
        </section>

        <section className="category-articles">
          <div className="articles-grid">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
          {articles.length === 0 && (
            <div className="no-articles">
              <p>No articles found in this category yet.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Category;
