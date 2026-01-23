import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchArticles, getCategories } from '../services/api';
import ArticleCard from '../components/ArticleCard';
import './Search.css';

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  
  const [filters, setFilters] = useState({
    query: searchParams.get('q') || '',
    category: searchParams.get('category') || '',
    dateRange: searchParams.get('dateRange') || 'all',
    customDateFrom: searchParams.get('dateFrom') || '',
    customDateTo: searchParams.get('dateTo') || ''
  });

  const observer = useRef();
  const ITEMS_PER_PAGE = 12;

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    performSearch(true);
  }, [searchParams]);

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const getDateRange = () => {
    const now = new Date();
    let dateFrom = null;
    
    switch (filters.dateRange) {
      case 'today':
        dateFrom = new Date(now.setHours(0, 0, 0, 0)).toISOString();
        break;
      case 'week':
        dateFrom = new Date(now.setDate(now.getDate() - 7)).toISOString();
        break;
      case 'month':
        dateFrom = new Date(now.setMonth(now.getMonth() - 1)).toISOString();
        break;
      case 'custom':
        return {
          dateFrom: filters.customDateFrom ? new Date(filters.customDateFrom).toISOString() : null,
          dateTo: filters.customDateTo ? new Date(filters.customDateTo).toISOString() : null
        };
      default:
        return { dateFrom: null, dateTo: null };
    }
    
    return { dateFrom, dateTo: null };
  };

  const performSearch = async (reset = false) => {
    if (!reset && (loadingMore || !hasMore)) return;

    try {
      reset ? setLoading(true) : setLoadingMore(true);
      
      const currentPage = reset ? 0 : page;
      const { dateFrom, dateTo } = getDateRange();
      
      const results = await searchArticles(
        filters.query || searchParams.get('q'),
        filters.category || searchParams.get('category'),
        dateFrom,
        dateTo,
        ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
      );

      if (reset) {
        setArticles(results);
        setPage(1);
      } else {
        setArticles(prev => [...prev, ...results]);
        setPage(prev => prev + 1);
      }
      
      setHasMore(results.length === ITEMS_PER_PAGE);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    // Only auto-search for non-text filters (category, date changes)
    // Text input will search on Enter key or Search button click
    if (key !== 'query') {
      const params = new URLSearchParams();
      if (newFilters.query) params.set('q', newFilters.query);
      if (newFilters.category) params.set('category', newFilters.category);
      if (newFilters.dateRange !== 'all') params.set('dateRange', newFilters.dateRange);
      if (newFilters.dateRange === 'custom') {
        if (newFilters.customDateFrom) params.set('dateFrom', newFilters.customDateFrom);
        if (newFilters.customDateTo) params.set('dateTo', newFilters.customDateTo);
      }
      
      setSearchParams(params);
    }
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (filters.query) params.set('q', filters.query);
    if (filters.category) params.set('category', filters.category);
    if (filters.dateRange !== 'all') params.set('dateRange', filters.dateRange);
    if (filters.dateRange === 'custom') {
      if (filters.customDateFrom) params.set('dateFrom', filters.customDateFrom);
      if (filters.customDateTo) params.set('dateTo', filters.customDateTo);
    }
    
    setSearchParams(params);
  };

  const clearFilters = () => {
    setFilters({
      query: '',
      category: '',
      dateRange: 'all',
      customDateFrom: '',
      customDateTo: ''
    });
    setSearchParams(new URLSearchParams());
  };

  const lastArticleRef = useCallback(node => {
    if (loading || loadingMore) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        performSearch(false);
      }
    });
    
    if (node) observer.current.observe(node);
  }, [loading, loadingMore, hasMore]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Searching...</p>
      </div>
    );
  }

  return (
    <div className="search-page">
      <div className="search-container">
        <div className="search-header">
          <h1 className="search-title">
            <span className="search-icon">🔍</span>
            Search Articles
          </h1>
        </div>

        <div className="search-filters">
          <div className="search-bar">
            <input
              type="text"
              className="search-input"
              placeholder="Search articles by title, description, or content..."
              value={filters.query}
              onChange={(e) => handleFilterChange('query', e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button className="search-button" onClick={handleSearch}>
              Search
            </button>
          </div>

          <div className="filters-row">
            <div className="filter-group">
              <label className="filter-label">Category</label>
              <select
                className="filter-select"
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.slug}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">Date Range</label>
              <select
                className="filter-select"
                value={filters.dateRange}
                onChange={(e) => handleFilterChange('dateRange', e.target.value)}
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">Past Week</option>
                <option value="month">Past Month</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>

            {filters.dateRange === 'custom' && (
              <>
                <div className="filter-group">
                  <label className="filter-label">From</label>
                  <input
                    type="date"
                    className="filter-input"
                    value={filters.customDateFrom}
                    onChange={(e) => handleFilterChange('customDateFrom', e.target.value)}
                  />
                </div>
                <div className="filter-group">
                  <label className="filter-label">To</label>
                  <input
                    type="date"
                    className="filter-input"
                    value={filters.customDateTo}
                    onChange={(e) => handleFilterChange('customDateTo', e.target.value)}
                  />
                </div>
              </>
            )}

            <button className="clear-filters-button" onClick={clearFilters}>
              Clear Filters
            </button>
          </div>
        </div>

        <div className="search-results">
          {articles.length > 0 ? (
            <>
              <div className="results-header">
                <p className="results-count">
                  Found {articles.length}+ article{articles.length !== 1 ? 's' : ''}
                </p>
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
                  <p>Loading more results...</p>
                </div>
              )}

              {!hasMore && articles.length > 0 && (
                <div className="end-message">
                  <p>No more results found</p>
                </div>
              )}
            </>
          ) : (
            <div className="no-results">
              <div className="no-results-icon">🔍</div>
              <h2>No articles found</h2>
              <p>Try adjusting your search terms or filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
