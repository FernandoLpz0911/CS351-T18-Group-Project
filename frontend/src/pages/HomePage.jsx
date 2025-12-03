import { Link } from 'react-router-dom';
import './HomePage.css';

function HomePage() {
  return (
    <div className="page-container">
      <div className="home-content">
        <div className="hero-section">
          <h1 className="hero-title">Protect Your Art from AI Infringement</h1>
          <p className="hero-subtitle">
            Register your artwork with cryptographic fingerprints to prove ownership and control AI usage rights
          </p>
        </div>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3>Secure Registration</h3>
            <p>Each artwork gets a unique SHA-256 fingerprint that proves authenticity and ownership</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎨</div>
            <h3>Rights Management</h3>
            <p>Declare whether your work can be used for AI training - your art, your choice</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔍</div>
            <h3>Instant Verification</h3>
            <p>Anyone can verify ownership by searching with the image or its unique hash key</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⏰</div>
            <h3>Timestamped Proof</h3>
            <p>Every registration includes creation date to establish prior art and ownership timeline</p>
          </div>
          
        </div>
        <div className="cta-section">
          <h2>Get Started</h2>
          <div className="cta-buttons">
            <Link to="/upload" className="cta-button primary">
              Register Your Artwork
            </Link>
            <Link to="/search" className="cta-button secondary">
              Search Registry
            </Link>
          </div>
        </div>
        <div className="info-section">
          <h3>How It Works</h3>
          <div className="steps">
            <div className="step">
              <span className="step-number">1</span>
              <div className="step-content">
                <h4>Upload Your Work</h4>
                <p>Submit your artwork with artist information</p>
              </div>
            </div>
            <div className="step">
              <span className="step-number">2</span>
              <div className="step-content">
                <h4>Get Your Fingerprint</h4>
                <p>Receive a unique SHA-256 hash key for your piece</p>
              </div>
            </div>            
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