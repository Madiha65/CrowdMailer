import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import "../../App.css";
import { useNavigate } from "react-router-dom";
const Header = () => {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };
 const navigate = useNavigate();
  

  return (
  <nav className="sticky-nav">
      <div className="logo" onClick={() => navigate("/")}>CrowdMailer</div>

      <ul className={isMobileMenuOpen ? "nav-links mobile-open" : "nav-links"}>
        <li><button onClick={() => { navigate("/"); closeMobileMenu(); }} className="nav-link-btn">Home</button></li>
        <li><button onClick={() => { navigate("/about"); closeMobileMenu(); }} className="nav-link-btn">About</button></li>
        <li><button onClick={() => { navigate("/features"); closeMobileMenu(); }} className="nav-link-btn">Features</button></li>

        {/* ✅ PRICING PAGE */}
        <li>
          <button onClick={() => { navigate("/pricing"); closeMobileMenu(); }} className="nav-link-btn">
            Pricing
          </button>
        </li>

        <li><button onClick={() => { navigate("/contact"); closeMobileMenu(); }} className="nav-link-btn">Contact</button></li>

        {user && (
          <li><button onClick={() => { navigate("/dashboard"); closeMobileMenu(); }} className="nav-link-btn">Dashboard</button></li>
        )}

        <li className="nav-btn">
          {user ? (
            <button className="logout-btn" onClick={logout}>Logout</button>
          ) : (
            <>
              <button onClick={() => navigate("/login")} className="nav-link-btn">Login</button>
              <button onClick={() => navigate("/register")} className="nav-link-btn">Get Started</button>
            </>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default Header;
