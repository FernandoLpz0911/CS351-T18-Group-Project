import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchPage.css';

function SearchPage() {
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

  const handleSearch = () => {
    // For now, just navigate to result page
    navigate('/result');
  };

  return (
    <div className="page-container">
      <div className="screen-box">
        <h2 className="screen-title">Search</h2>
        
        <div className="content">
          <label className="field-label">Upload Image:</label>
          
          <div className="image-box">
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" className="preview-image" />
            ) : (
              <div className="placeholder">Image link</div>
            )}
          </div>
          
          <input
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            style={{ display: 'none' }}
            id="search-file-input"
          />
          <label htmlFor="search-file-input" className="file-button">
            Choose Image
          </label>
          
          <button className="action-button" onClick={handleSearch}>
            Search
          </button>
        </div>
      </div>
    </div>
  );
}

export default SearchPage;