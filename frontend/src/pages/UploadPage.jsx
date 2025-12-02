// UploadPage.jsx - Page where artists can register/upload their artwork
// Creates a unique SHA-256 fingerprint for each piece of art

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './UploadPage.css';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
const SEARCH_API_URL = `${BASE_URL}/api/search/`;
const UPLOAD_API_URL = `${BASE_URL}/api/blocks/`;

function UploadPage() {
  // State variables to track form data and upload status
  const [imagePreview, setImagePreview] = useState(null);  // Preview of selected image
  const [selectedFile, setSelectedFile] = useState(null);  // The actual file object
  const [authorName, setAuthorName] = useState('');  // Artist's name
  const [isUploading, setIsUploading] = useState(false);  // True when upload is in progress
  const [uploadError, setUploadError] = useState(null);  // Error message if upload fails
  
  const navigate = useNavigate();  // Function to navigate to other pages

  // Function called when user selects an image file
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      
      // Create a preview of the image
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);  // Set preview to show in UI
      };
      reader.readAsDataURL(file);  // Read file as data URL
      
      setUploadError(null);  // Clear any previous errors
    }
  };

  // Function called when user clicks "Upload & Register" button
  const handleUpload = async () => {
    // Validation: Make sure both image and author name are provided
    if (!selectedFile || !authorName.trim()) {
      setUploadError('Please select an image and enter the Author Name.');
      return;
    }

    // Show loading state
    setIsUploading(true);
    setUploadError(null);

    // Prepare data to send to backend using FormData (for file upload)
    const formData = new FormData();
    formData.append('registered_image', selectedFile);  // Add the image file
    
    // Add metadata as JSON array
    const items = [
        `AUTHOR_NAME:${authorName.trim()}`,
        `FILENAME:${selectedFile.name}`,
        `TIMESTAMP:${new Date().toISOString()}`
    ];
    formData.append('items', JSON.stringify(items));

    // Make API request to backend
    try {
      const response = await axios.post(UPLOAD_API_URL, formData);
      
      // If successful, navigate to success page with the response data
      console.log('Block created successfully:', response.data);
      navigate('/success', { state: { blockData: response.data } });

    } catch (error) {
      console.error('Upload failed:', error.response?.data || error.message);
      
      // 1. Check for the specific "error" key we sent from the backend
      let errorMessage = error.response?.data?.error;

      // 2. If not found, check for Django's default "non_field_errors"
      if (!errorMessage) {
          errorMessage = error.response?.data?.non_field_errors?.[0];
      }

      // 3. If still nothing, show a generic fallback
      if (!errorMessage) {
          errorMessage = 'Upload failed due to a server error.';
      }

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
          {/* Instruction text */}
          <p className="descriptive-text">"Upload your image to copyright it"</p>
          
          {/* ========== IMAGE UPLOAD SECTION ========== */}
          <label className="field-label">Upload image:</label>
          
          {/* Image preview area */}
          <div className="upload-area">
            {imagePreview ? (
              // Show image preview if file selected
              <img src={imagePreview} alt="Preview" className="preview-image" />
            ) : (
              // Show placeholder text if no file selected
              <div className="upload-placeholder">Upload attachment</div>
            )}
          </div>
          
          {/* Hidden file input (triggered by button below) */}
          <input
            type="file"
            accept="image/*"  // Only accept image files
            onChange={handleImageSelect}
            style={{ display: 'none' }}  // Hide the default ugly file input
            id="upload-file-input"
            disabled={isUploading}
          />
          
          {/* Pretty button to trigger file selection */}
          <label htmlFor="upload-file-input" className="file-button">
            {selectedFile ? `Change File: ${selectedFile.name}` : 'Choose File'}
          </label>
          
          {/* Divider line */}
          <hr style={{margin: '20px 0'}} />
          
          {/* ========== AUTHOR NAME INPUT ========== */}
          <label className="field-label">Author Name:</label>
          <input
            type="text"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}  // Update state as user types
            className="text-input"
            placeholder="Enter Author/Creator Name"
            disabled={isUploading}
          />
          
          {/* Show error message if upload failed */}
          {uploadError && <p style={{ color: 'red', marginTop: '20px' }}>{uploadError}</p>}
          
          {/* Upload button */}
          <button 
            className="action-button" 
            onClick={handleUpload}
            disabled={isUploading || !selectedFile || !authorName.trim()}  // Disable if uploading or missing data
          >
            {isUploading ? 'Registering...' : 'Upload & Register'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default UploadPage;