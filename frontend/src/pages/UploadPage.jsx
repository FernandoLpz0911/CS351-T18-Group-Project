import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './UploadPage.css';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
const UPLOAD_API_URL = `${BASE_URL}/api/blocks/`; 

function UploadPage() {
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  
  // State for the legal name (now read-only) and AI consent
  const [legalName, setLegalName] = useState('');
  const [aiConsent, setAiConsent] = useState(false);

  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  
  const navigate = useNavigate();

  // Check login and get the user's verified name
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const savedName = localStorage.getItem('fullName');

    if (!token) {
        alert("Please log in to upload artwork.");
        navigate('/login');
    } else if (savedName) {
        setLegalName(savedName); // Auto-fill the Verified Identity
    } else {
        setLegalName("Unknown User");
    }
  }, [navigate]);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setUploadError(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadError('Please select an image.');
      return;
    }

    const token = localStorage.getItem('authToken');
    if (!token) {
        navigate('/login');
        return;
    }

    setIsUploading(true);
    setUploadError(null);

    const formData = new FormData();
    formData.append('registered_image', selectedFile);
    formData.append('ai_consent', aiConsent); // Send the boolean
    
    // We add the legal name to the cryptographic hash items, but we don't
    // need to send it as a separate field because the backend knows who we are.
    const items = [
        `LEGAL_OWNER:${legalName}`,
        `FILENAME:${selectedFile.name}`,
        `AI_CONSENT:${aiConsent}`,
        `TIMESTAMP:${new Date().toISOString()}`
    ];
    formData.append('items', JSON.stringify(items));

    try {
      const response = await axios.post(UPLOAD_API_URL, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Token ${token}`
        }
      });
      
      console.log('Block created successfully:', response.data);
      // Navigate to the dashboard or success page
      navigate('/success', { state: { blockData: response.data } });

    } catch (error) {
      console.error('Upload failed:', error.response?.data || error.message);
      
      let errorMessage = error.response?.data?.error;
      if (!errorMessage) errorMessage = error.response?.data?.detail;
      if (!errorMessage) errorMessage = 'Upload failed. Please try again.';

      if (error.response?.status === 401) {
          alert("Session expired.");
          localStorage.removeItem('authToken');
          navigate('/login');
      } else {
          setUploadError(errorMessage);
      }
      
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="screen-box">
        <h2 className="screen-title">Register Intellectual Property</h2>
        
        <div className="content">
          <p className="descriptive-text">"Upload your image to copyright it"</p>
          
          <div className="upload-area">
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" className="preview-image" />
            ) : (
              <div className="upload-placeholder">Upload attachment</div>
            )}
          </div>
          
          <input
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            style={{ display: 'none' }}
            id="upload-file-input"
            disabled={isUploading}
          />
          
          <label htmlFor="upload-file-input" className="file-button">
            {selectedFile ? `Change File: ${selectedFile.name}` : 'Choose File'}
          </label>
          
          <hr className="divider" />
          
          {/* --- NEW: Verified Identity Box --- */}
          <div className="form-group">
            <label className="field-label">Identity Verified:</label>
            <div style={{
                padding: '12px', 
                marginTop: '5px',
                backgroundColor: '#e8f5e9', 
                border: '1px solid #4caf50', 
                borderRadius: '4px',
                color: '#2e7d32',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
            }}>
                <span>✅</span>
                <span>{legalName || "Loading..."}</span>
            </div>
            <p style={{fontSize: '0.8rem', color: '#666', marginTop: '5px'}}>
                This legal identity will be cryptographically signed into the block.
            </p>
          </div>

          {/* --- NEW: AI Consent Checkbox --- */}
          <div className="form-group" style={{marginTop: '15px'}}>
            <label className="field-label" style={{display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer'}}>
              <input 
                type="checkbox" 
                checked={aiConsent}
                onChange={(e) => setAiConsent(e.target.checked)}
                style={{width: '20px', height: '20px'}}
              />
              I consent to this image being used for AI Training datasets.
            </label>
          </div>
          
          {uploadError && <p style={{ color: 'red', marginTop: '20px' }}>{uploadError}</p>}
          
          <button 
            className="action-button" 
            onClick={handleUpload}
            disabled={isUploading || !selectedFile}
          >
            {isUploading ? 'Registering...' : 'Sign & Register'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default UploadPage;