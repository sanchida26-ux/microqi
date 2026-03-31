import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAuthToken, setAuthToken, removeAuthToken, setUserId, getUserId, authAPI } from '@/lib/api';

interface AuthContextType {
  isAuthenticated: boolean;
  userId: string | null;
  email: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId_State] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if token exists on mount
    const token = getAuthToken();
    const storedUserId = getUserId();
    if (token && storedUserId) {
      setIsAuthenticated(true);
      setUserId_State(storedUserId);
      // Optionally fetch email from token or API
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const data = await authAPI.login(email, password);
      setIsAuthenticated(true);
      setUserId_State(data.userId);
      setEmail(data.email);
    } catch (error) {
      throw error;
    }
  };

  const register = async (email: string, password: string) => {
    try {
      const data = await authAPI.register(email, password);
      setIsAuthenticated(true);
      setUserId_State(data.userId);
      setEmail(data.email);
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    authAPI.logout();
    setIsAuthenticated(false);
    setUserId_State(null);
    setEmail(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userId, email, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
