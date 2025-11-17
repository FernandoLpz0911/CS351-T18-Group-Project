// HomePage.jsx - Landing page that explains what ArtGuard Registry does
// This is the first page users see when they visit the site

import { Link } from 'react-router-dom';
import './HomePage.css';

function HomePage() {
  return (
    <div className="page-container">
      <div className="home-content">
        
        {/* ========== HERO SECTION ========== */}
        {/* Big headline and subtitle at the top */}
        <div className="hero-section">
          <h1 className="hero-title">Protect Your Art from AI Infringement</h1>
          <p className="hero-subtitle">
            Register your artwork with cryptographic fingerprints to prove ownership and control AI usage rights
          </p>
        </div>

        {/* ========== FEATURES GRID ========== */}
        {/* Four cards explaining the main features */}
        <div className="features-grid">
          
          {/* Feature 1: Secure Registration */}
          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3>Secure Registration</h3>
            <p>Each artwork gets a unique SHA-256 fingerprint that proves authenticity and ownership</p>
          </div>

          {/* Feature 2: Rights Management */}
          <div className="feature-card">
            <div className="feature-icon">🎨</div>
            <h3>Rights Management</h3>
            <p>Declare whether your work can be used for AI training - your art, your choice</p>
          </div>

          {/* Feature 3: Instant Verification */}
          <div className="feature-card">
            <div className="feature-icon">🔍</div>
            <h3>Instant Verification</h3>
            <p>Anyone can verify ownership by searching with the image or its unique hash key</p>
          </div>

          {/* Feature 4: Timestamped Proof */}
          <div className="feature-card">
            <div className="feature-icon">⏰</div>
            <h3>Timestamped Proof</h3>
            <p>Every registration includes creation date to establish prior art and ownership timeline</p>
          </div>
          
        </div>

        {/* ========== CALL TO ACTION SECTION ========== */}
        {/* Big buttons to get started */}
        <div className="cta-section">
          <h2>Get Started</h2>
          <div className="cta-buttons">
            {/* Primary button - Register artwork */}
            <Link to="/upload" className="cta-button primary">
              Register Your Artwork
            </Link>
            {/* Secondary button - Search registry */}
            <Link to="/search" className="cta-button secondary">
              Search Registry
            </Link>
          </div>
        </div>

        {/* ========== HOW IT WORKS SECTION ========== */}
        {/* Step-by-step explanation */}
        <div className="info-section">
          <h3>How It Works</h3>
          <div className="steps">
            
            {/* Step 1 */}
            <div className="step">
              <span className="step-number">1</span>
              <div className="step-content">
                <h4>Upload Your Work</h4>
                <p>Submit your artwork with artist information</p>
              </div>
            </div>
            
            {/* Step 2 */}
            <div className="step">
              <span className="step-number">2</span>
              <div className="step-content">
                <h4>Get Your Fingerprint</h4>
                <p>Receive a unique SHA-256 hash key for your piece</p>
              </div>
            </div>
            
            {/* Step 3 */}
            <div className="step">
              <span className="step-number">3</span>
              <div className="step-content">
                <h4>Prove Ownership</h4>
                <p>Use your hash key to verify authenticity anywhere</p>
              </div>
            </div>
            
          </div>
        </div>
        
      </div>
    </div>
  );
}

export default HomePage;