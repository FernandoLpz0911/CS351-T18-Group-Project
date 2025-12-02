// LoginPage.jsx - Login page for users to access their account
// Has fields for email/username and password, plus link to sign up

import { useState } from 'react';
import { Link } from 'react-router-dom';
import './LoginPage.css';

function LoginPage() {
  // State variables for form inputs
  const [email, setEmail] = useState('');  // Email/username input
  const [password, setPassword] = useState('');  // Password input

  // Function called when user clicks "Login" button
  // This is just a demo - you'll connect to backend later
  const handleLogin = (e) => {
    e.preventDefault();  // Prevent form from refreshing the page
    console.log('Login attempt:', { email, password });
    // TODO: Connect to backend authentication
    alert('Login functionality coming soon!');
  };

  return (
    <div className="page-container">
      <div className="screen-box login-box">
        <h2 className="screen-title">Login to ArtGuard</h2>
        
        <div className="content">
          {/* Welcome message */}
          <p className="descriptive-text">
            Sign in to manage your registered artwork
          </p>
          
          {/* ========== LOGIN FORM ========== */}
          <form onSubmit={handleLogin} className="login-form">
            
            {/* Email/Username field */}
            <div className="form-group">
              <label className="field-label" htmlFor="email">
                Email or Username
              </label>
              <input
                id="email"
                type="text"
                className="text-input"
                placeholder="Enter your email or username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            {/* Password field */}
            <div className="form-group">
              <label className="field-label" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                className="text-input"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            {/* Forgot password link */}
            <div className="forgot-password">
              <Link to="/forgot-password" className="link-text">
                Forgot password?
              </Link>
            </div>
            
            {/* Login button */}
            <button type="submit" className="action-button login-button">
              Login
            </button>
          </form>
          
          {/* ========== DIVIDER ========== */}
          <div className="divider-with-text">
            <span>or</span>
          </div>
          
          {/* ========== CREATE ACCOUNT SECTION ========== */}
          <div className="signup-section">
            <p className="signup-text">Don't have an account?</p>
            <Link to="/signup" className="action-button secondary-button">
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;