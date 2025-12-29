import React, { useState } from 'react';
import { Nav } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { MdDashboardCustomize, MdCampaign, MdOutlineMenu } from "react-icons/md";
import { RiMenuFold3Line } from "react-icons/ri";
import { FaUser, FaEnvelopeOpen, FaBell } from "react-icons/fa";

const Sidebar = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(true);

  if (!user) return null;

  const toggleSidebar = () => {
    setIsOpen(prev => !prev);
  };

  return (
    <div className={`sidebar-container ${isOpen ? 'open' : 'closed'}`}>

      {/* ✅ HAMBURGER TOGGLE */}
      <div className="sidebar-header">
        <div className="hamburger" onClick={toggleSidebar}>
  {isOpen ? (
    <MdOutlineMenu size={26} />
  ) : (
    <RiMenuFold3Line size={26} />
  )}
</div>
      </div>

      <Nav className="flex-column sidebar-content">
        <Nav.Item>
          <Nav.Link href="/dashboard" className="d-flex align-items-center mb-3">
            <MdDashboardCustomize size={22} className="me-2 text-primary" />
            {isOpen && <span>Dashboard</span>}
          </Nav.Link>
        </Nav.Item>

        <Nav.Item>
          <Nav.Link href="/campaigns" className="d-flex align-items-center mb-3">
            <MdCampaign size={22} className="me-2 text-success" />
            {isOpen && <span>Campaigns</span>}
          </Nav.Link>
        </Nav.Item>

        <Nav.Item>
          <Nav.Link href="/subscribers" className="d-flex align-items-center mb-3">
            <FaBell size={22} className="me-2" style={{ color: '#0d6efd' }} />
            {isOpen && <span>Subscribers</span>}
          </Nav.Link>
        </Nav.Item>

        <Nav.Item>
          <Nav.Link href="#Users" className="d-flex align-items-center mb-3">
            <FaUser size={22} className="me-2" style={{ color: '#0dcaf0' }} />
            {isOpen && <span>Users</span>}
          </Nav.Link>
        </Nav.Item>

        <Nav.Item>
          <Nav.Link href="#" className="d-flex align-items-center mb-3">
            <FaEnvelopeOpen size={22} className="me-2 text-warning" />
            {isOpen && <span>Open Rate</span>}
          </Nav.Link>
        </Nav.Item>
      </Nav>
    </div>
  );
};

export default Sidebar;
