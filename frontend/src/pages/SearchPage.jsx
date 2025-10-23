import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './SearchPage.css';

const SEARCH_API_URL = 'http://127.0.0.1:8000/api/search/'; 

function SearchPage() {
  const [inputHash, setInputHash] = useState(''); // State for manual ID/Hash input
  const [selectedFile, setSelectedFile] = useState(null); // State for the uploaded file
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const navigate = useNavigate();

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file); // Save the file
      setSearchError(null); // Clear errors
    }
  };

  const handleSearch = async (searchType) => {
    if (searchType === 'hash-lookup' && !inputHash.trim()) {
      setSearchError('Please enter a File Hash or IP ID.');
      return;
    }
    if (searchType === 'file-compare' && !selectedFile) {
      setSearchError('Please select an image file for comparison.');
      return;
    }

    setIsSearching(true);
    setSearchError(null);

    let endpoint = '';
    let dataToSend = {};
    let contentType = 'application/json';

    if (searchType === 'hash-lookup') {
      // Send the input hash directly
      endpoint = `${SEARCH_API_URL}id-lookup/`;
      dataToSend = { query_hash: inputHash.trim() };
    } else {
      // Send the file using FormData
      endpoint = `${SEARCH_API_URL}file-compare/`;
      const formData = new FormData();
      formData.append('image', selectedFile); // Key must match Django view
      dataToSend = formData;
      contentType = 'multipart/form-data';
    }

    // API Request
    try {
      const response = await axios.post(endpoint, dataToSend, {
        headers: { 'Content-Type': contentType },
      });

      //  Navigate to result page with the data returned
      navigate('/result', { state: { result: response.data, searchType: searchType } });

    } catch (error) {
      console.error('Search failed:', error);
      const errorMessage = error.response?.data?.error || 'Search failed due to a server error.';
      setSearchError(errorMessage);
      
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="page-container">
      <div className="screen-box">
        <h2 className="screen-title">Search Registered Works</h2>
        
        <div className="content">
          
          <h3 className="section-title">Search by File Hash or IP ID</h3>
          <label className="field-label" htmlFor="hash-input">File Hash / IP ID:</label>
          <input
            id="hash-input"
            type="text"
            className="text-input"
            placeholder="Enter unique registered hash or ID"
            value={inputHash}
            onChange={(e) => setInputHash(e.target.value)}
            disabled={isSearching}
          />
          <button 
            className="action-button primary-action" 
            onClick={() => handleSearch('hash-lookup')}
            disabled={isSearching || !inputHash.trim()}
          >
            {isSearching ? 'Looking Up...' : 'Lookup Owner/Status'}
          </button>

          <hr className="divider" />
          
          {searchError && <p style={{ color: 'red', marginTop: '20px' }}>{searchError}</p>}
        </div>
      </div>
    </div>
  );
}

export default SearchPage;