import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './UploadPage.css';

function UploadPage() {
  const [imagePreview, setImagePreview] = useState(null);
  const navigate = useNavigate();

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = () => {
    // For now, just navigate to success page
    navigate('/success');
  };

  return (
    <div className="page-container">
      <div className="screen-box">
        <h2 className="screen-title">Upload</h2>
        
        <div className="content">
          <p className="instruction-text">"Upload your image to copyright it"</p>
          
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
          />
          <label htmlFor="upload-file-input" className="file-button">
            Choose File
          </label>
          
          <button className="action-button" onClick={handleUpload}>
            Upload
          </button>
        </div>
      </div>
    </div>
  );
}

export default UploadPage;