// App.jsx - Main application component that handles routing and navigation
// This is the top-level component that wraps everything in your app

import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useState } from 'react';
import './App.css';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import UploadPage from './pages/UploadPage';
import SearchResultPage from './pages/SearchResultPage';
import UploadSuccessPage from './pages/UploadSuccessPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import UserDashboard from './pages/UserDashboard';

function App() {
  // State to track if the sidebar menu is open or closed
  const [menuOpen, setMenuOpen] = useState(false);

  // Function to toggle the menu open/closed
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Function to close the menu
  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <div className="navbar-left">
            <button className="menu-button" onClick={toggleMenu} aria-label="Menu">
              <span className="menu-icon"></span>
              <span className="menu-icon"></span>
              <span className="menu-icon"></span>
            </button>
            
            <Link to="/" style={{ textDecoration: 'none' }}>
              <h1>ArtGuard Registry</h1>
            </Link>
          </div>
        </nav>

        <div className={`sidebar ${menuOpen ? 'open' : ''}`}>
          <div className="sidebar-header">
            <h2>Menu</h2>
            <button className="close-button" onClick={closeMenu} aria-label="Close menu">
              ×
            </button>
          </div>
          
          <nav className="sidebar-nav">
            <Link to="/" onClick={closeMenu}>
              <span className="menu-icon-text">🏠</span>
              Home
            </Link>
            <Link to="/dashboard" onClick={closeMenu}>
              <span className='menu-icon-text'>📁</span>
              Dashboard
            </Link>
            <Link to="/search" onClick={closeMenu}>
              <span className="menu-icon-text">🔍</span>
              Search Registry
            </Link>
            <Link to="/upload" onClick={closeMenu}>
              <span className="menu-icon-text">📝</span>
              Register Artwork
            </Link>
            <Link to="/login" onClick={closeMenu}>
              <span className="menu-icon-text">🔐</span>
              Login/Register
            </Link>
          </nav>
          
          {/* Footer section with branding and tagline */}
          <div className="sidebar-footer">
            <p>ArtGuard Registry</p>
            <p className="sidebar-tagline">Protecting artists from AI infringement</p>
          </div>
        </div>

        {menuOpen && <div className="overlay" onClick={closeMenu}></div>}

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/result" element={<SearchResultPage />} />
          <Route path="/success" element={<UploadSuccessPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/dashboard" element={<UserDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;