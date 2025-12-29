//frontend/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import Header from './components/common/Header';
import Sidebar from './components/common/Sidebar';
import Footer from './components/common/Footer';

import Login from './components/auth/Login';
import Register from './components/auth/Register';

import Dashboard from './components/dashboard/Dashboard';
import CampaignList from './components/campaigns/CampaignList';
import CreateCampaign from './components/campaigns/CreateCampaign';
import CampaignReport from './components/campaigns/CampaignReport';
import SubscriberList from './components/subscribers/SubscriberList';
import AddSubscriber from './components/subscribers/AddSubscriber';

import LandingPage from './pages/LandingPage';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import BankDetails from './pages/BankDetails';
import PricingPage from './pages/PricingPage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



function LayoutWrapper({ children }) {
  const location = useLocation();

  const publicPages = ['/', '/login', '/register'];
  const isPublicPage = publicPages.includes(location.pathname);

  if (isPublicPage) {
    return (
      <>
        <Header />  
        {children}
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="main-container">
        <Sidebar />
        <div className="content">{children}</div>
      </div>
      <Footer />
    </>
  );
}


function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  return (
    <Routes>
      {/* Public Routes */}
    
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
      <Route path="/register" element={!user ? <Register /> : <Navigate to="/login" />} />
  <Route path="/" element={<LandingPage />} />
      {/* Protected Routes */}
      <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
      <Route path="/campaigns" element={user ? <CampaignList /> : <Navigate to="/login" />} />
      <Route path="/campaigns/create" element={user ? <CreateCampaign /> : <Navigate to="/login" />} />
      <Route path="/campaigns/:id" element={user ? <CampaignReport /> : <Navigate to="/login" />} />
      <Route path="/subscribers" element={user ? <SubscriberList /> : <Navigate to="/login" />} />
      <Route path="/subscribers/add" element={user ? <AddSubscriber /> : <Navigate to="/login" />} />
      <Route path="/bank-details" element={<BankDetails/>} />

<Route path="/pricing" element={<PricingPage/>} />
      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}


function App() {
  return (
    <AuthProvider>
      <Router>
                <ToastContainer position="top-right" autoClose={3000} />
        <LayoutWrapper>
          <AppRoutes />
        </LayoutWrapper>
      </Router>
    </AuthProvider>
  );
}

export default App;
