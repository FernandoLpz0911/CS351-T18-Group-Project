import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './UploadPage.css';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
const UPLOAD_API_URL = `${BASE_URL}/api/blocks/`;
const CHECK_DUPLICATE_URL = `${BASE_URL}/api/search/file-compare/`;

function UploadPage() {
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [legalName, setLegalName] = useState('');
  const [aiConsent, setAiConsent] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const savedName = localStorage.getItem('fullName');

    if (!token) {
        alert("Please log in to upload artwork.");
        navigate('/login');
    } else if (savedName) {
        setLegalName(savedName);
    } else {
        setLegalName("Unknown User");
    }
  }, [navigate]);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
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

    // 1. Security Check: Scan registry for existing matches
    try {
        const checkData = new FormData();
        checkData.append('image', selectedFile);

        // If this returns 200, a match exists -> BLOCK UPLOAD
        const checkResponse = await axios.post(CHECK_DUPLICATE_URL, checkData);
        
        if (checkResponse.data) {
            setUploadError(`Security Alert: This image (or a close variation) is already registered to ${checkResponse.data.legal_name || "another user"}. Registration blocked.`);
            setIsUploading(false);
            return; 
        }

    } catch (checkErr) {
        // 404 means "No match found", which is exactly what we want for a NEW registration.
        if (checkErr.response?.status !== 404) {
            console.error("Registry scan failed", checkErr);
            setUploadError("Could not verify image uniqueness. Please try again.");
            setIsUploading(false);
            return;
        }
    }

    // 2. Proceed to Registration (Only if check returned 404)
    const formData = new FormData();
    formData.append('registered_image', selectedFile);
    formData.append('ai_consent', aiConsent);
    
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
      
      navigate('/success', { state: { blockData: response.data } });

    } catch (error) {
      console.error('Upload failed:', error);
      const msg = error.response?.data?.error || error.response?.data?.detail || 'Upload failed.';
      
      if (error.response?.status === 401) {
          alert("Session expired.");
          localStorage.removeItem('authToken');
          navigate('/login');
      } else {
          setUploadError(msg);
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
          
          <div className="form-group" style={{marginTop: '20px'}}>
            <label className="field-label">Identity Verified:</label>
            <div style={{
                padding: '12px', 
                marginTop: '5px',
                backgroundColor: '#ecfdf5', 
                border: '1px solid #d1fae5', 
                borderRadius: '6px',
                color: '#065f46',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
            }}>
                <span>✅</span>
                <span>{legalName || "Loading..."}</span>
            </div>
            <p style={{fontSize: '0.8rem', color: '#6b7280', marginTop: '5px'}}>
                This legal identity will be cryptographically signed into the block.
            </p>
          </div>

          <div className="form-group">
            <label className="field-label" style={{display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer'}}>
              <input 
                type="checkbox" 
                checked={aiConsent}
                onChange={(e) => setAiConsent(e.target.checked)}
                style={{width: '18px', height: '18px', accentColor: '#059669'}}
              />
              I consent to this image being used for AI Training datasets.
            </label>
          </div>
          
          {uploadError && (
            <div className="error-message" style={{textAlign: 'left', fontSize: '0.9rem'}}>
                ⚠️ {uploadError}
            </div>
          )}
          
          <button 
            className="action-button" 
            onClick={handleUpload}
            disabled={isUploading || !selectedFile}
          >
            {isUploading ? 'Verifying Uniqueness...' : 'Sign & Register'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default UploadPage;