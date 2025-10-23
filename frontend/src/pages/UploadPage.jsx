// src/components/UploadPage.js (or wherever it resides)

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './UploadPage.css';

const UPLOAD_API_URL = 'http://127.0.0.1:8000/api/blocks/'; 

function UploadPage() {
  // State for file preview and the actual file object
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null); 
  
  // State for other required form data
  const [authorName, setAuthorName] = useState('');
  // Block height state is REMOVED
  
  // State for UI control
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  
  const navigate = useNavigate();

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file); 
      // ... (file preview logic remains the same)
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setUploadError(null); 
    }
  };

  const handleUpload = async () => {
    // Basic Client-side Validation (only file and author name needed)
    if (!selectedFile || !authorName.trim()) {
      setUploadError('Please select an image and enter the Author Name.');
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    // 1. Construct the FormData object
    const formData = new FormData();
    // 'registered_image' must match the model field
    formData.append('registered_image', selectedFile); 
    
    // NOTE: block_height IS NO LONGER APPENDED. It's calculated by Django.
    
    // Append items
    const items = [
        `AUTHOR_NAME:${authorName.trim()}`,
        `FILENAME:${selectedFile.name}`,
        `TIMESTAMP:${new Date().toISOString()}`
    ];
    formData.append('items', JSON.stringify(items));

    // 2. Send the POST request
    try {
      const response = await axios.post(UPLOAD_API_URL, formData);
      
      // 3. Navigate on successful creation
      console.log('Block created successfully:', response.data);
      navigate('/success', { state: { blockData: response.data } });

    } catch (error) {
      console.error('Upload failed:', error.response?.data || error.message);
      const errorMessage = error.response?.data?.non_field_errors?.[0] || 'Upload failed due to a server error.';
      setUploadError(errorMessage);
      
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="screen-box">
        <h2 className="screen-title">Upload & Register Work</h2>
        
        <div className="content">
          <p className="instruction-text">"Upload your image to copyright it"</p>
          
          {/* --- Image Selection --- */}
          <label className="field-label">Upload image:</label>
          {/* ... (image preview and file input remain the same) ... */}
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
          
          {/* --- Other Form Data --- */}
          <label className="field-label">Author Name:</label>
          <input
            type="text"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            className="text-input"
            placeholder="Enter Author/Creator Name"
            disabled={isUploading}
          />
          
          {/* REMOVED: Block Height input field */}
          
          {/* --- Action Button --- */}
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