/**
 * Simple API Service Layer
 * Handles all HTTP requests to the backend without complex types
 */

import axios from 'axios';

// API Response type
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// API base URL from environment  
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3005/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth tokens
apiClient.interceptors.request.use(
  (config) => {
    // Add authentication token if available
    const token = localStorage.getItem('authToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for handling common responses
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);

    // Handle specific status codes
    if (error.response?.status === 401) {
      // Handle unauthorized - clear token and redirect to login
      localStorage.removeItem('authToken');
      // Could dispatch auth state reset here
    }

    return Promise.reject(error);
  }
);

// Generic API methods
export const api = {
  // GET request
  get: async <T>(url: string, config = {}): Promise<ApiResponse<T>> => {
    try {
      const response = await apiClient.get(url, config);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'An error occurred');
    }
  },

  // POST request
  post: async <T>(url: string, data = {}, config = {}): Promise<ApiResponse<T>> => {
    try {
      const response = await apiClient.post(url, data, config);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'An error occurred');
    }
  },

  // PUT request
  put: async <T>(url: string, data = {}, config = {}): Promise<ApiResponse<T>> => {
    try {
      const response = await apiClient.put(url, data, config);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'An error occurred');
    }
  },

  // DELETE request
  delete: async <T>(url: string, config = {}): Promise<ApiResponse<T>> => {
    try {
      const response = await apiClient.delete(url, config);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'An error occurred');
    }
  },
};

// Health check function
export const checkApiHealth = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL.replace('/api/v1', '')}/health`);
    return response.ok;
  } catch (error) {
    console.error('Health check failed:', error);
    return false;
  }
};

export default api;