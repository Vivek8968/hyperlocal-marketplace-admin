import React, { createContext, useContext, useState, useCallback } from 'react';
import api from '../services/api';
import { setAuthToken, removeAuthToken, getAuthToken } from '../utils/authStorage';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const login = useCallback(async (email, password) => {
    try {
      setLoading(true);
      setError('');
      
      const response = await api.post('/admin/login', { email, password });
      const { token, user } = response.data;
      
      setAuthToken(token);
      setCurrentUser(user);
      
      return user;
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to login');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    removeAuthToken();
    setCurrentUser(null);
  }, []);

  const checkAuthStatus = useCallback(async () => {
    try {
      setLoading(true);
      const token = getAuthToken();
      
      if (!token) {
        return setLoading(false);
      }
      
      const response = await api.get('/admin/me');
      setCurrentUser(response.data);
    } catch (error) {
      removeAuthToken();
      setCurrentUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const value = {
    currentUser,
    loading,
    error,
    login,
    logout,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
