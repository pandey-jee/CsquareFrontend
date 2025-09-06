import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://csquarebackend-1.onrender.com/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common error cases
    if (error.response?.status === 401) {
      // Unauthorized - remove token
      localStorage.removeItem('adminToken');
      
      // Only redirect/reload if we're not already on a login attempt
      const isLoginRequest = error.config?.url?.includes('/auth/login');
      const isVerifyRequest = error.config?.url?.includes('/auth/verify');
      
      if (!isLoginRequest && !isVerifyRequest) {
        // For other requests, we'll let the component handle the auth state change
        console.warn('Authentication failed, token removed');
      }
    }
    
    // Return a standardized error format
    const customError = {
      message: error.response?.data?.message || error.message || 'An error occurred',
      status: error.response?.status,
      data: error.response?.data,
    };
    
    return Promise.reject(customError);
  }
);

export default api;
