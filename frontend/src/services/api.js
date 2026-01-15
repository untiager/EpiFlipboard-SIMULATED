import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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

export default api;
