import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import CampaignList from './components/campaigns/CampaignList';
import CreateCampaign from './components/campaigns/CreateCampaign';
import CampaignReport from './components/campaigns/CampaignReport';
import SubscriberList from './components/subscribers/SubscriberList';
import AddSubscriber from './components/subscribers/AddSubscriber';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }
  
  return user ? children : <Navigate to="/login" />;
};

// Public Route Component (redirects to dashboard if already logged in)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }
  
  return user ? <Navigate to="/" /> : children;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route 
        path="/login" 
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } 
      />
      <Route 
        path="/register" 
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        } 
      />
      
      {/* Protected Routes */}
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/campaigns" 
        element={
          <ProtectedRoute>
            <CampaignList />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/campaigns/create" 
        element={
          <ProtectedRoute>
            <CreateCampaign />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/campaigns/:id" 
        element={
          <ProtectedRoute>
            <CampaignReport />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/subscribers" 
        element={
          <ProtectedRoute>
            <SubscriberList />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/subscribers/add" 
        element={
          <ProtectedRoute>
            <AddSubscriber />
          </ProtectedRoute>
        } 
      />
      
      {/* Catch all route - redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;