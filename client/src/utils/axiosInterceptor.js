import axios from 'axios';
import { toast } from 'react-toastify';

// Create axios instance with default config
const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log request in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`, config.data || config.params);
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // Log response in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, response.data);
    }
    
    return response;
  },
  (error) => {
    // Handle different error types
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          localStorage.removeItem('token');
          delete api.defaults.headers.common['Authorization'];
          toast.error('Session expired. Please login again.');
          window.location.href = '/login';
          break;
          
        case 403:
          // Forbidden
          toast.error('Access denied. You don\'t have permission to perform this action.');
          break;
          
        case 404:
          // Not found
          toast.error('Resource not found.');
          break;
          
        case 422:
          // Validation error
          const validationErrors = data.errors || [data.message];
          validationErrors.forEach(err => toast.error(err));
          break;
          
        case 429:
          // Too many requests
          toast.error('Too many requests. Please try again later.');
          break;
          
        case 500:
          // Server error
          toast.error('Server error. Please try again later.');
          break;
          
        default:
          // Other errors
          toast.error(data.message || 'An error occurred. Please try again.');
      }
    } else if (error.request) {
      // Network error - more detailed logging
      console.error('❌ Network Error Details:', {
        message: error.message,
        code: error.code,
        config: error.config,
        request: error.request
      });
      
      if (error.code === 'ECONNREFUSED') {
        toast.error('Cannot connect to server. Please ensure the backend is running on port 5000.');
      } else if (error.code === 'ERR_NETWORK') {
        toast.error('Network error. Please check if backend server is running.');
      } else if (error.message.includes('CORS')) {
        toast.error('CORS error. Please check backend configuration.');
      } else {
        toast.error(`Network error: ${error.message || 'Please check your connection.'}`);
      }
    } else {
      // Other errors
      toast.error('An unexpected error occurred.');
    }
    
    // Log error in development
    if (process.env.NODE_ENV === 'development') {
      console.error('❌ API Error:', error.response?.data || error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api;
