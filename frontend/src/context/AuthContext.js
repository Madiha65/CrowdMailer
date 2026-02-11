import React, { createContext, useState, useContext, useEffect } from 'react';
import { login, register, logout } from '../services/authService';
import { toast } from 'react-toastify';
const AuthContext = createContext();


export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        setUser({ token });
      }
    } else if (token) {
      setUser({ token });
    }
    setLoading(false);
  }, []);

  const handleLogin = async (email, password) => {
    try {
      const data = await login(email, password);
      // persist token and full user object (backend returns { _id, name, email, role, token })
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      setUser(data);
      return data;
    } catch (error) {
      throw error;
    }
  };

const handleRegister = async (userData) => {
  const data = await register(userData);
  return data;
};

 const handleLogout = () => {
    logout();
    localStorage.removeItem('token');
   localStorage.removeItem('user');
    setUser(null);

    toast.success('Logged out successfully 👋');
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