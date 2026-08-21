import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import "../../App.css";
import { Link, useNavigate } from "react-router-dom";
import { RxDropdownMenu } from "react-icons/rx";
import { MdOutlineMenu } from "react-icons/md";

const Header = () => {
 

 const { user, logout } = useAuth();
const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
const navigate = useNavigate();

const toggleMobileMenu = () => {
  setIsMobileMenuOpen(prev => !prev);
};

const closeMobileMenu = () => {
  setIsMobileMenuOpen(false);
};

useEffect(() => {
  const close = () => setIsMobileMenuOpen(false);
  window.addEventListener("resize", close);
  return () => window.removeEventListener("resize", close);
}, []);



  return (
    <nav className="sticky-nav">
      <div className="logo" onClick={() => navigate("/")}>
        CrowdMailer
      </div>

     <div className="hamburger" onClick={toggleMobileMenu}>
  {isMobileMenuOpen ? (
    <MdOutlineMenu size={30} />
  ) : (
    <RxDropdownMenu size={30} />
  )}
</div>

      <ul className={`nav-links ${isMobileMenuOpen ? "mobile-open" : ""}`}>
        <li><Link to="/" onClick={() => { closeMobileMenu(); }}>Home</Link></li>
        <li><Link to="/about" onClick={() => { closeMobileMenu(); }}>About</Link></li>
        <li><Link to="/features" onClick={() => { closeMobileMenu(); }}>Features</Link></li>
        <li><Link to="/pricing" onClick={() => { closeMobileMenu(); }}>Pricing</Link></li>
        <li><Link to="/contact" onClick={() => { closeMobileMenu(); }}>Contact</Link></li>

        {user && (
          <li><Link to="/dashboard" onClick={() => { closeMobileMenu(); }}>Dashboard</Link></li>
        )}

        <li className="nav-btn">
          {user ? (
            <button className="logout-btn" onClick={logout}>Logout</button>
          ) : (
            <>
              <button className="login-btn" onClick={() => navigate("/login")}>
                Login
              </button>
              <button className="reg-btn" onClick={() => navigate("/register")}>
                Get Started
              </button>
            </>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default Header;
