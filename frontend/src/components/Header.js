import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCategories } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import './Header.css';

const Header = () => {
  const [categories, setCategories] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <svg className="logo-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="3" width="8" height="8" rx="1" fill="currentColor"/>
            <rect x="13" y="3" width="8" height="8" rx="1" fill="currentColor"/>
            <rect x="3" y="13" width="8" height="8" rx="1" fill="currentColor"/>
            <rect x="13" y="13" width="8" height="8" rx="1" fill="currentColor"/>
          </svg>
          <span className="logo-text">Flipboard</span>
        </Link>
        
        <button 
          className="menu-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? '✕' : '☰'}
        </button>

        <nav className={`nav ${isMenuOpen ? 'nav-open' : ''}`}>
          <Link to="/" className="nav-link" onClick={() => setIsMenuOpen(false)}>
            Home
          </Link>
          <Link to="/search" className="nav-link" onClick={() => setIsMenuOpen(false)}>
            🔍 Search
          </Link>
          {categories.slice(0, 5).map((category) => (
            <Link
              key={category.id}
              to={`/category/${category.slug}`}
              className="nav-link"
              onClick={() => setIsMenuOpen(false)}
            >
              {category.name}
            </Link>
          ))}
          
          <button 
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          
          {isAuthenticated ? (
            <>
              <Link to="/favorites-setup" className="nav-link nav-link-highlight" onClick={() => setIsMenuOpen(false)}>
                ⭐ My Topics
              </Link>
              <span className="nav-user">Hi, {user?.username}</span>
              <button className="nav-button" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                Login
              </Link>
              <Link to="/register" className="nav-button-link" onClick={() => setIsMenuOpen(false)}>
                <button className="nav-button">Get Started</button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
