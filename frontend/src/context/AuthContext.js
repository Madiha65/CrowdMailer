import React, { createContext, useState, useContext, useEffect } from 'react';
import { login, register, logout } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setUser({ token });
    }
    setLoading(false);
  }, []);

  const handleLogin = async (email, password) => {
    try {
      const data = await login(email, password);
      localStorage.setItem('token', data.token);
      setUser({ token: data.token, ...data.user });
      return data;
    } catch (error) {
      throw error;
    }
  };

  const handleRegister = async (userData) => {
    try {
      const data = await register(userData);
      localStorage.setItem('token', data.token);
      setUser({ token: data.token, ...data.user });
      return data;
    } catch (error) {
      throw error;
    }
  };

  const handleLogout = () => {
    logout();
    setUser(null);
  };

  const value = {
    user,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};