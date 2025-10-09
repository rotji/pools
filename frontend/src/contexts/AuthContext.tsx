/**
 * Authentication Context
 * Manages user authentication state across the entire application
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { UserService } from '../services/userService';
import type { User } from '../services/userService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing authentication on app start
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedUser = UserService.getStoredUser();
        const token = UserService.getAuthToken();

        if (storedUser && token) {
          // Verify token is still valid by fetching current user
          try {
            const response = await UserService.getCurrentUser();
            if (response.success && response.data) {
              setUser(response.data);
              console.log('✅ User authenticated from storage:', response.data.username);
            } else {
              // Token invalid, clear storage
              console.warn('⚠️ Stored token invalid, clearing auth');
              await UserService.logout();
            }
          } catch (error) {
            console.warn('⚠️ Failed to verify stored auth:', error);
            await UserService.logout();
          }
        }
      } catch (error) {
        console.error('❌ Auth initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    console.log('✅ User logged in:', userData.username);
  };

  const logout = async () => {
    try {
      await UserService.logout();
      setUser(null);
      console.log('✅ User logged out');
    } catch (error) {
      console.error('❌ Logout error:', error);
      // Force logout even if API call fails
      setUser(null);
    }
  };

  const refreshUser = async () => {
    if (!user) return;

    try {
      const response = await UserService.getCurrentUser();
      if (response.success && response.data) {
        setUser(response.data);
        console.log('✅ User data refreshed:', response.data.username);
      }
    } catch (error) {
      console.error('❌ Failed to refresh user data:', error);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    refreshUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;