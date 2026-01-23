import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const searchArticles = async (searchQuery, category = null, dateFrom = null, dateTo = null, limit = 20, offset = 0) => {
  try {
    const params = { limit, offset };
    if (searchQuery) params.q = searchQuery;
    if (category) params.category = category;
    if (dateFrom) params.dateFrom = dateFrom;
    if (dateTo) params.dateTo = dateTo;
    const response = await api.get('/api/articles/search', { params });
    return response.data;
  } catch (error) {
    console.error('Error searching articles:', error);
    throw error;
  }
};

export const getArticles = async (category = null, limit = 20, offset = 0) => {
  try {
    const params = { limit, offset };
    if (category) params.category = category;
    const response = await api.get('/api/articles', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching articles:', error);
    throw error;
  }
};

export const getArticle = async (id) => {
  try {
    const response = await api.get(`/api/articles/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching article:', error);
    throw error;
  }
};

export const getTrendingArticles = async (limit = 10) => {
  try {
    const response = await api.get('/api/articles/trending/top', { params: { limit } });
    return response.data;
  } catch (error) {
    console.error('Error fetching trending articles:', error);
    throw error;
  }
};

export const getCategories = async () => {
  try {
    const response = await api.get('/api/categories');
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

export const getCategory = async (slug) => {
  try {
    const response = await api.get(`/api/categories/${slug}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching category:', error);
    throw error;
  }
};

// Authentication
export const register = async (email, password, username) => {
  try {
    const response = await api.post('/api/auth/register', { email, password, username });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Registration failed';
  }
};

export const login = async (email, password) => {
  try {
    const response = await api.post('/api/auth/login', { email, password });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Login failed';
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await api.get('/api/auth/me');
    return response.data.user;
  } catch (error) {
    throw error.response?.data?.error || 'Failed to get user info';
  }
};

// Favorites
export const getFavoriteCategories = async () => {
  try {
    const response = await api.get('/api/favorites');
    return response.data;
  } catch (error) {
    console.error('Error fetching favorite categories:', error);
    throw error;
  }
};

export const toggleFavoriteCategory = async (categoryId) => {
  try {
    const response = await api.put(`/api/favorites/${categoryId}/toggle`);
    return response.data;
  } catch (error) {
    console.error('Error toggling favorite category:', error);
    throw error;
  }
};
// Comments API
export const getComments = async (articleId) => {
  try {
    const response = await api.get(`/api/comments/article/${articleId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }
};

export const postComment = async (articleId, content) => {
  try {
    const response = await api.post(`/api/comments/article/${articleId}`, { content });
    return response.data;
  } catch (error) {
    console.error('Error posting comment:', error);
    throw error;
  }
};

export const deleteComment = async (commentId) => {
  try {
    const response = await api.delete(`/api/comments/${commentId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting comment:', error);
    throw error;
  }
};

export const updateComment = async (commentId, content) => {
  try {
    const response = await api.put(`/api/comments/${commentId}`, { content });
    return response.data;
  } catch (error) {
    console.error('Error updating comment:', error);
    throw error;
  }
};

export const getCommentCount = async (articleId) => {
  try {
    const response = await api.get(`/api/comments/count/${articleId}`);
    return response.data.count;
  } catch (error) {
    console.error('Error fetching comment count:', error);
    throw error;
  }
};
export default api;
