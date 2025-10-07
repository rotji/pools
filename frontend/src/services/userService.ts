/**
 * User Service
 * Handles user authentication and profile management
 */

import { api } from './api';
import type { ApiResponse } from './api';

// User data types
export interface User {
  id: string;
  walletAddress: string;
  username?: string;
  email?: string;
  profileImage?: string;
  totalContributions: number;
  activeGroups: number;
  completedGroups: number;
  createdAt: string;
  lastLoginAt: string;
}

export interface AuthData {
  walletAddress: string;
  signature?: string;
  message?: string;
}

export interface UserProfile {
  username?: string;
  email?: string;
  profileImage?: string;
  bio?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  expiresAt: string;
}

// User API service
export class UserService {
  /**
   * Authenticate user with wallet address
   */
  static async authenticate(authData: AuthData): Promise<ApiResponse<AuthResponse>> {
    const response = await api.post<AuthResponse>('/auth/login', authData);
    
    // Store auth token if successful
    if (response.success && response.data?.token) {
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response;
  }

  /**
   * Register new user
   */
  static async register(authData: AuthData & { username?: string }): Promise<ApiResponse<AuthResponse>> {
    const response = await api.post<AuthResponse>('/auth/register', authData);
    
    // Store auth token if successful
    if (response.success && response.data?.token) {
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response;
  }

  /**
   * Logout user
   */
  static async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.warn('Logout API call failed:', error);
    } finally {
      // Always clear local storage
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    }
  }

  /**
   * Get current user profile
   */
  static async getCurrentUser(): Promise<ApiResponse<User>> {
    return api.get('/users/me');
  }

  /**
   * Update user profile
   */
  static async updateProfile(profileData: UserProfile): Promise<ApiResponse<User>> {
    return api.put('/users/me', profileData);
  }

  /**
   * Get user by ID
   */
  static async getUserById(userId: string): Promise<ApiResponse<User>> {
    return api.get(`/users/${userId}`);
  }

  /**
   * Get user statistics
   */
  static async getUserStats(userId?: string): Promise<ApiResponse<{
    totalContributions: number;
    totalEarnings: number;
    activeGroups: number;
    completedGroups: number;
    successRate: number;
    monthlyActivity: Array<{ month: string; contributions: number; earnings: number }>;
  }>> {
    const url = userId ? `/users/${userId}/stats` : '/users/me/stats';
    return api.get(url);
  }

  /**
   * Check if user is authenticated
   */
  static isAuthenticated(): boolean {
    const token = localStorage.getItem('authToken');
    return !!token;
  }

  /**
   * Get stored user data
   */
  static getStoredUser(): User | null {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  }

  /**
   * Get auth token
   */
  static getAuthToken(): string | null {
    return localStorage.getItem('authToken');
  }

  /**
   * Refresh authentication token
   */
  static async refreshToken(): Promise<ApiResponse<{ token: string; expiresAt: string }>> {
    const response = await api.post<{ token: string; expiresAt: string }>('/auth/refresh');
    
    if (response.success && response.data?.token) {
      localStorage.setItem('authToken', response.data.token);
    }
    
    return response;
  }

  /**
   * Verify wallet ownership (for authentication)
   */
  static async requestSignMessage(walletAddress: string): Promise<ApiResponse<{ message: string }>> {
    return api.post('/auth/request-signature', { walletAddress });
  }
}

export default UserService;