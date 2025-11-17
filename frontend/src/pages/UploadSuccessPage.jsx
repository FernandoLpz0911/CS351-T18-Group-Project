// UploadSuccessPage.jsx - Success page shown after artwork is registered
// Displays the unique hash key and provides download link

import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import './UploadSuccessPage.css';

function UploadSuccessPage() {
  // Get the registration data that was passed from UploadPage
  const location = useLocation();
  const [copyStatus, setCopyStatus] = useState('');  // Feedback message for copy button
    
  // Extract the block data from navigation state
  const blockData = location.state?.blockData;
    
  // Extract individual fields from the block data, or show 'N/A' if missing
  const blockHeight = blockData?.height || 'N/A';
  const imageHash = blockData?.image_hash || 'N/A';  // The SHA-256 fingerprint
  const merkleRoot = blockData?.merkle_root || 'N/A';
  const imageUrl = blockData?.registered_image;  // URL to download the original image
    
  // Function to download the original image file
  const handleDownload = () => {
    if (imageUrl) {
      window.open(imageUrl, '_blank');  // Open image in new tab
    }
  };

  // Function to copy the hash key to clipboard
  const handleCopyHash = async () => {
    if (imageHash && imageHash !== 'N/A') {
      try {
        // Use browser's clipboard API to copy text
        await navigator.clipboard.writeText(imageHash);
        setCopyStatus('Copied!');  // Show success message
      } catch (err) {
        // If clipboard API fails (older browsers)
        setCopyStatus('Failed to copy.');
        console.error('Copy failed:', err);
      }
      
      // Clear the feedback message after 2 seconds
      setTimeout(() => setCopyStatus(''), 2000);
    }
  };

  return (
    <div className="page-container">
      <div className="screen-box">
        <h2 className="screen-title">Upload Success</h2>
            
        <div className="content">
                
          {/* ========== SUCCESS MESSAGE ========== */}
          {/* Green box with checkmark */}
          <div className="status-box">
            <p className="status-text">✅ Upload Successful</p>
          </div>
                
          {/* ========== ARTWORK INFORMATION ========== */}
          {/* Display the hash key with copy button */}
          <div className="info-details">
            <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <strong>Image Hash (Key):</strong>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {/* Show shortened hash with full hash in tooltip */}
                <span title={imageHash} style={{ marginRight: '10px', wordBreak: 'break-all' }}>
                  {imageHash.substring(0, 10)}...
                </span>
                
                {/* Copy button */}
                <button
                  onClick={handleCopyHash}
                  disabled={imageHash === 'N/A'}
                  className="copy-button"
                  style={{
                    backgroundColor: copyStatus ? '#4CAF50' : '#f0f0f0',  // Green when copied
                    color: copyStatus ? 'white' : 'black',
                  }}
                >
                  {copyStatus || 'Copy'}  {/* Show "Copied!" or "Copy" */}
                </button>
              </div>
            </p>
          </div>
                
          {/* ========== DOWNLOAD BUTTON ========== */}
          {/* Button to download the original image file */}
          <button 
            className="action-button download"
            onClick={handleDownload}
            disabled={!imageUrl}  // Disable if no URL available
          >
            Download Original File
          </button>
                
          {/* ========== NAVIGATION LINKS ========== */}
          {/* Links to register another artwork or search registry */}
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