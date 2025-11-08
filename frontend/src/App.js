import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/common/Header';
import Sidebar from './components/common/Sidebar';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import CampaignList from './components/campaigns/CampaignList';
import CreateCampaign from './components/campaigns/CreateCampaign';
import CampaignReport from './components/campaigns/CampaignReport';
import SubscriberList from './components/subscribers/SubscriberList';
import AddSubscriber from './components/subscribers/AddSubscriber';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Footer from './components/common/Footer';
// import AppRoutes from './routes';

function App() {
  return (
     <AuthProvider>
      <Router>
        <div className="app-container">
          <Header />
          <div className="main-container">
            <Sidebar />
            <div className="content">
              <AppRoutes />
            </div>
          </div>
        <Footer/>
        </div>
      </Router>
    </AuthProvider>
  );
}

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
      
      <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
      <Route path="/" element={user ? <Dashboard /> : <Navigate to="/login" />} />
      <Route path="/campaigns" element={user ? <CampaignList /> : <Navigate to="/login" />} />
      <Route path="/campaigns/create" element={user ? <CreateCampaign /> : <Navigate to="/login" />} />
      <Route path="/campaigns/:id" element={user ? <CampaignReport /> : <Navigate to="/login" />} />
      <Route path="/subscribers" element={user ? <SubscriberList /> : <Navigate to="/login" />} />
      <Route path="/subscribers/add" element={user ? <AddSubscriber /> : <Navigate to="/login" />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;