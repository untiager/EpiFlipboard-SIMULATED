import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCategories, toggleFavoriteCategory, getFavoriteCategories } from '../services/api';
import './FavoritesSetup.css';

const FavoritesSetup = () => {
  const [categories, setCategories] = useState([]);
  const [favorites, setFavorites] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [categoriesData, favoritesData] = await Promise.all([
        getCategories(),
        getFavoriteCategories()
      ]);
      setCategories(categoriesData);
      setFavorites(new Set(favoritesData.map(f => f.id)));
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (categoryId) => {
    try {
      await toggleFavoriteCategory(categoryId);
      setFavorites(prev => {
        const newSet = new Set(prev);
        if (newSet.has(categoryId)) {
          newSet.delete(categoryId);
        } else {
          newSet.add(categoryId);
        }
        return newSet;
      });
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };

  const handleContinue = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="favorites-setup">
      <div className="favorites-container">
        <h1 className="favorites-title">Choose Your Favorite Topics</h1>
        <p className="favorites-subtitle">
          Select topics you're interested in. Articles from your favorite topics will appear first.
        </p>

        <div className="categories-grid">
          {categories.map((category) => (
            <div
              key={category.id}
              className={`category-card ${favorites.has(category.id) ? 'selected' : ''}`}
              onClick={() => handleToggle(category.id)}
              style={{ borderColor: category.color }}
            >
              <div className="category-card-header" style={{ backgroundColor: category.color }}>
                <h3>{category.name}</h3>
              </div>
              <p className="category-card-description">{category.description}</p>
              <div className="category-check">
                {favorites.has(category.id) && <span>✓</span>}
              </div>
            </div>
          ))}
        </div>

        <div className="favorites-actions">
          <button onClick={handleContinue} className="continue-button">
            {favorites.size > 0 ? `Continue with ${favorites.size} topics` : 'Skip for now'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FavoritesSetup;
