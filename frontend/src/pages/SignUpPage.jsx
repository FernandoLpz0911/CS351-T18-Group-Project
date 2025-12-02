// SignUpPage.jsx - Registration page for new users
// Has fields for username, email, password, and confirm password

import { useState } from 'react';
import { Link } from 'react-router-dom';
import './SignUpPage.css';

function SignUpPage() {
  // State variables for form inputs
  const [username, setUsername] = useState('');  // Username
  const [email, setEmail] = useState('');  // Email address
  const [password, setPassword] = useState('');  // Password
  const [confirmPassword, setConfirmPassword] = useState('');  // Confirm password

  // Function called when user clicks "Create Account" button
  // This is just a demo - you'll connect to backend later
  const handleSignUp = (e) => {
    e.preventDefault();  // Prevent form from refreshing the page
    
    // Basic validation: Check if passwords match
    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    
    console.log('Sign up attempt:', { username, email, password });
    // TODO: Connect to backend registration
    alert('Account creation functionality coming soon!');
  };

  return (
    <div className="page-container">
      <div className="screen-box signup-box">
        <h2 className="screen-title">Create Your Account</h2>
        
        <div className="content">
          {/* Welcome message */}
          <p className="descriptive-text">
            Join ArtGuard Registry to protect your artwork
          </p>
          
          {/* ========== SIGN UP FORM ========== */}
          <form onSubmit={handleSignUp} className="signup-form">
            
            {/* Username field */}
            <div className="form-group">
              <label className="field-label" htmlFor="username">
                Username
              </label>
              <input
                id="username"
                type="text"
                className="text-input"
                placeholder="Choose a username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            
            {/* Email field */}
            <div className="form-group">
              <label className="field-label" htmlFor="email">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                className="text-input"
                placeholder="Enter your email"
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
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength="8"  // Minimum 8 characters
              />
              <small className="field-hint">Must be at least 8 characters</small>
            </div>
            
            {/* Confirm password field */}
            <div className="form-group">
              <label className="field-label" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                className="text-input"
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            
            {/* Create Account button */}
            <button type="submit" className="action-button signup-button">
              Create Account
            </button>
          </form>
          
          {/* ========== DIVIDER ========== */}
          <div className="divider-with-text">
            <span>or</span>
          </div>
          
          {/* ========== LOGIN LINK ========== */}
          <div className="login-section">
            <p className="login-text">Already have an account?</p>
            <Link to="/login" className="action-button secondary-button">
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUpPage;