import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

export default function Navbar() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  function isActive(path) {
    return location.pathname === path;
  }

  function toggleMobileMenu() {
    setMobileMenuOpen(!mobileMenuOpen);
  }

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <Link to="/" className="navbar-brand">
            <span>MOTORS</span>
          </Link>

          <button 
            className="mobile-menu-toggle"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          <ul className={`navbar-menu ${mobileMenuOpen ? 'mobile-open' : ''}`}>
            <li>
              <Link 
                to="/" 
                className={isActive("/") ? "active" : ""}
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
            </li>
            <li>
              <Link 
                to="/cars" 
                className={isActive("/cars") ? "active" : ""}
                onClick={() => setMobileMenuOpen(false)}
              >
                Cars
              </Link>
            </li>
            <li>
              <Link 
                to="/cars/new" 
                className="btn btn-primary"
                style={{ color: 'white' }}
                onClick={() => setMobileMenuOpen(false)}
              >
                Add Car
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}