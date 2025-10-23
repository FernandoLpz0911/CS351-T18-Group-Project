import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react'; // ⬅️ Import useState for copy feedback
import './UploadSuccessPage.css';

function UploadSuccessPage() {
  const location = useLocation();
  const [copyStatus, setCopyStatus] = useState(''); // State to hold feedback message
    
  // ⬅️ Extract the block data passed from the UploadPage
  const blockData = location.state?.blockData;
    
  // Safely access the data fields
  const blockHeight = blockData?.height || 'N/A';
  const imageHash = blockData?.image_hash || 'N/A';
  const merkleRoot = blockData?.merkle_root || 'N/A';
  const imageUrl = blockData?.registered_image; 
    
  // Function to handle the download
  const handleDownload = () => {
    if (imageUrl) {
      window.open(imageUrl, '_blank');
    }
  };

  // ⬅️ NEW: Function to copy the image hash to the clipboard
  const handleCopyHash = async () => {
    if (imageHash && imageHash !== 'N/A') {
      try {
        // Use the clipboard API to write the text
        await navigator.clipboard.writeText(imageHash);
        setCopyStatus('Copied!');
      } catch (err) {
        // Fallback for older browsers or restricted environments
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
                
          <div className="status-box">
            <p className="status-text">✅ Upload Successful</p>
          </div>
                
          <div className="info-details">
            
            <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <strong>Image Hash (Key):</strong>
              <div style={{ display: 'flex', alignItems: 'center' }}>

                <span title={imageHash} style={{ marginRight: '10px', wordBreak: 'break-all' }}>
                  {imageHash.substring(0, 10)}...
                </span>
                
                <button
                  onClick={handleCopyHash}
                  disabled={imageHash === 'N/A'}
                  className="copy-button"
                  style={{
                    padding: '5px 10px',
                    fontSize: '12px',
                    cursor: 'pointer',
                    backgroundColor: copyStatus ? '#4CAF50' : '#f0f0f0',
                    color: copyStatus ? 'white' : 'black',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                  }}
                >
                  {copyStatus || 'Copy'}
                </button>
              </div>
            </p>
            
          </div>
                
          <button 
            className="action-button download"
            onClick={handleDownload}
            disabled={!imageUrl} 
          >
            Download Original File
          </button>
                
          <div className="nav-links">
            <Link to="/upload" className="nav-link">Upload Another</Link>
            <Link to="/" className="nav-link">Search Images</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UploadSuccessPage;