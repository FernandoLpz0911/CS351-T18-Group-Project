import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import './UploadSuccessPage.css';

function UploadSuccessPage() {
  const location = useLocation();
  const [copyStatus, setCopyStatus] = useState('');
  const blockData = location.state?.blockData;
    
  const imageHash = blockData?.image_hash || 'N/A';
  const imageUrl = blockData?.registered_image;
    
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
        setCopyStatus('Failed to copy.');
        console.error('Copy failed:', err);
      }
      setTimeout(() => setCopyStatus(''), 2000);
    }
  };

  return (
    <div className="page-container">
      <div className="screen-box">
        <h2 className="screen-title">Upload Success</h2>
            
        <div className="content">
          <div className="status-box">
            <p className="status-text">✅ Upload Successful</p>
          </div>
          
          <div className="info-details">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '15px' }}>
              <strong>Image Hash (Key):</strong>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span title={imageHash} style={{ marginRight: '10px', wordBreak: 'break-all', fontFamily: 'monospace' }}>
                  {imageHash.substring(0, 10)}...
                </span>
                
                <button
                  onClick={handleCopyHash}
                  disabled={imageHash === 'N/A'}
                  className="copy-button"
                  style={{
                    backgroundColor: copyStatus ? '#4CAF50' : '#f0f0f0',
                    color: copyStatus ? 'white' : 'black',
                  }}
                >
                  {copyStatus || 'Copy'}
                </button>
              </div>
            </div>
          </div>
                
          <button 
            className="action-button download"
            onClick={handleDownload}
            disabled={!imageUrl}
          >
            Download Original File
          </button>
                
          <div className="nav-links">
            <Link to="/upload" className="nav-link">Register Another</Link>
            <Link to="/search" className="nav-link">Search Registry</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UploadSuccessPage;