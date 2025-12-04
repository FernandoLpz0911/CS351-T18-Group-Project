import { Link, useLocation, Navigate } from 'react-router-dom';
import { useState } from 'react';
import './UploadSuccessPage.css';

function UploadSuccessPage() {
  const location = useLocation();
  const [copyStatus, setCopyStatus] = useState('');
  const blockData = location.state?.blockData;

  if (!blockData) {
    return <Navigate to="/upload" replace />;
  }
    
  const imageHash = blockData?.image_hash || blockData?.hash_key || 'N/A';
  const imageUrl = blockData?.registered_image || blockData?.image_url;
    
  const handleDownload = () => {
    if (imageUrl) {
      window.open(imageUrl, '_blank');
    }
  };

  const handleCopyHash = async () => {
    if (imageHash && imageHash !== 'N/A') {
      try {
        await navigator.clipboard.writeText(imageHash);
        setCopyStatus('Copied!');
      } catch (err) {
        setCopyStatus('Failed');
        console.error('Copy failed:', err);
      }
      setTimeout(() => setCopyStatus(''), 2000);
    }
  };

  return (
    <div className="page-container">
      <div className="screen-box success-layout">
        <h2 className="screen-title">Upload Success</h2>
            
        <div className="content">
          <div className="status-box">
            <span className="status-icon">✅</span>
            <span className="status-text">Registration Complete</span>
          </div>
          
          <div className="info-details">
            <label className="field-label">Immutable Hash (Key):</label>
            <div className="hash-row">
              <code className="hash-value">
                {imageHash}
              </code>
              
              <button
                onClick={handleCopyHash}
                disabled={imageHash === 'N/A'}
                className={`copy-button ${copyStatus ? 'copied' : ''}`}
              >
                {copyStatus || 'Copy'}
              </button>
            </div>
          </div>
                
          <button 
            className="action-button download-btn"
            onClick={handleDownload}
            disabled={!imageUrl}
          >
            Download Original File
          </button>
          
          <hr className="divider" />
                
          <div className="nav-links">
            <Link to="/upload" className="nav-link">Register Another</Link>
            <span className="separator">|</span>
            <Link to="/search" className="nav-link">Search Registry</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UploadSuccessPage;