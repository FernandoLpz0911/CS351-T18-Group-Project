// UploadPage.jsx - Page where artists can register/upload their artwork
// Modified to include User Authentication

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './UploadPage.css';

// Use environment variable for URL
const BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
const UPLOAD_API_URL = `${BASE_URL}/api/blocks/`; 

function UploadPage() {
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [authorName, setAuthorName] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  
  const navigate = useNavigate();

  // NEW: Check if user is logged in when page loads
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const savedUser = localStorage.getItem('username');
    
    if (!token) {
        // If no token, redirect to login page
        alert("Please log in to upload artwork.");
        navigate('/login');
    } else if (savedUser) {
        // Optional: Auto-fill author name with username
        setAuthorName(savedUser);
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
    if (!selectedFile || !authorName.trim()) {
      setUploadError('Please select an image and enter the Author Name.');
      return;
    }

    const token = localStorage.getItem('authToken');
    if (!token) {
        setUploadError('You are not logged in.');
        navigate('/login');
        return;
    }

    setIsUploading(true);
    setUploadError(null);

    const formData = new FormData();
    formData.append('registered_image', selectedFile);
    
    const items = [
        `AUTHOR_NAME:${authorName.trim()}`,
        `FILENAME:${selectedFile.name}`,
        `TIMESTAMP:${new Date().toISOString()}`
    ];
    formData.append('items', JSON.stringify(items));

    try {
      const response = await axios.post(UPLOAD_API_URL, formData, {
        // NEW: Add the Authorization header
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Token ${token}` // This is the key part!
        }
      });
      
      console.log('Block created successfully:', response.data);
      navigate('/success', { state: { blockData: response.data } });

    } catch (error) {
      console.error('Upload failed:', error.response?.data || error.message);
      
      // Handle errors gracefully
      let errorMessage = error.response?.data?.error; // Custom backend error (duplicates)
      
      if (!errorMessage) {
          errorMessage = error.response?.data?.detail; // Auth errors often come as 'detail'
      }
      if (!errorMessage) {
          errorMessage = error.response?.data?.non_field_errors?.[0];
      }
      if (!errorMessage) {
          errorMessage = 'Upload failed. Please try again.';
      }

      // If unauthorized, redirect to login
      if (error.response?.status === 401) {
          alert("Your session has expired. Please log in again.");
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
        <h2 className="screen-title">Upload & Register Work</h2>
        
        <div className="content">
          <p className="descriptive-text">"Upload your image to copyright it"</p>
          
          <label className="field-label">Upload image:</label>
          
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
          
          <hr style={{margin: '20px 0'}} />
          
          <label className="field-label">Author Name:</label>
          <input
            type="text"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            className="text-input"
            placeholder="Enter Author/Creator Name"
            disabled={isUploading}
          />
          
          {uploadError && <p style={{ color: 'red', marginTop: '20px' }}>{uploadError}</p>}
          
          <button 
            className="action-button" 
            onClick={handleUpload}
            disabled={isUploading || !selectedFile || !authorName.trim()}
          >
            {isUploading ? 'Registering...' : 'Upload & Register'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default UploadPage;