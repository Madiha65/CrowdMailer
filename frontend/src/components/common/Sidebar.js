import React, { useState } from 'react';
import { Nav } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { MdDashboardCustomize, MdCampaign } from "react-icons/md";
import { CiMenuBurger } from "react-icons/ci";
import { FaBell } from "react-icons/fa";
import { RiMenuFold3Line } from "react-icons/ri";
import { FaUser, FaEnvelopeOpen } from "react-icons/fa";

const Sidebar = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(true);

  if (!user) return null;

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <div className={`sidebar-container ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        {isOpen ? (
          <RiMenuFold3Line size={26} className="toggle-icon" onClick={toggleSidebar} />
        ) : (
          <CiMenuBurger size={26} className="toggle-icon" onClick={toggleSidebar} />
        )}
      </div>

      <Nav className="flex-column sidebar-content">
        <Nav.Item>
          <Nav.Link href="/" className="d-flex align-items-center mb-3">
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
          <Nav.Link href="/" className="d-flex align-items-center mb-3">
            <FaUser size={22} className="me-2" style={{ color: '#0dcaf0' }}/>
            {isOpen && <span>Users</span>}
          </Nav.Link>
        </Nav.Item>
         <Nav.Item>
          <Nav.Link href="/" className="d-flex align-items-center mb-3">
            <FaEnvelopeOpen size={22} className="me-2 text-warning" />
            {isOpen && <span>Open Rate</span>}
          </Nav.Link>
        </Nav.Item>
      </Nav>
    </div>
  );
};

export default Sidebar;
