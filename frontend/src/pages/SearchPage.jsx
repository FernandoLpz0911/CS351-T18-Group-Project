// SearchPage.jsx - Page where users can search for registered artwork
// Users can search by entering a hash key/ID to find the owner

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './SearchPage.css';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
const SEARCH_API_URL = `${BASE_URL}/api/search/`;

function SearchPage() {
  // State variables to track user input and search status
  const [inputHash, setInputHash] = useState('');  // The hash/ID entered by user
  const [selectedFile, setSelectedFile] = useState(null);  // File uploaded by user (not used yet)
  const [isSearching, setIsSearching] = useState(false);  // True when search is in progress
  const [searchError, setSearchError] = useState(null);  // Error message if search fails
  const navigate = useNavigate();  // Function to navigate to other pages

  // Function called when user selects a file (not fully implemented)
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setSearchError(null);  // Clear any previous errors
    }
  };

  // Function called when user clicks "Lookup Owner/Status" button
  const handleSearch = async (searchType) => {
    // Validation: Make sure user entered a hash
    if (searchType === 'hash-lookup' && !inputHash.trim()) {
      setSearchError('Please enter a File Hash or IP ID.');
      return;
    }
    
    // Validation: Make sure user selected a file (if doing file search)
    if (searchType === 'file-compare' && !selectedFile) {
      setSearchError('Please select an image file for comparison.');
      return;
    }

    // Show loading state
    setIsSearching(true);
    setSearchError(null);

    // Prepare data to send to backend
    let endpoint = '';
    let dataToSend = {};
    let contentType = 'application/json';

    if (searchType === 'hash-lookup') {
      // Search by hash key
      endpoint = `${SEARCH_API_URL}id-lookup/`;
      dataToSend = { query_hash: inputHash.trim() };
    } else {
      // Search by uploading file
      endpoint = `${SEARCH_API_URL}file-compare/`;
      const formData = new FormData();
      formData.append('image', selectedFile);
      dataToSend = formData;
      contentType = 'multipart/form-data';
    }

    // Make API request to backend
    try {
      const response = await axios.post(endpoint, dataToSend, {
        headers: { 'Content-Type': contentType },
      });

      // If successful, navigate to results page with the data
      navigate('/result', { state: { result: response.data, searchType: searchType } });

    } catch (error) {
      // If error, show error message
      console.error('Search failed:', error);
      const errorMessage = error.response?.data?.error || 'Search failed due to a server error.';
      setSearchError(errorMessage);
      
    } finally {
      // Always turn off loading state when done
      setIsSearching(false);
    }
  };

  return (
    <div className="page-container">
      <div className="screen-box">
        <h2 className="screen-title">Search Registered Works</h2>
        
        <div className="content">
          
          {/* ========== SEARCH BY HASH SECTION ========== */}
          <h3 className="section-title">Search by File Hash or IP ID</h3>
          
          {/* Input field for hash/ID */}
          <label className="field-label" htmlFor="hash-input">File Hash / IP ID:</label>
          <input
            id="hash-input"
            type="text"
            className="text-input"
            placeholder="Enter unique registered hash or ID"
            value={inputHash}
            onChange={(e) => setInputHash(e.target.value)}  // Update state as user types
            disabled={isSearching}  // Disable while searching
          />
          
          {/* Search button */}
          <button 
            className="action-button primary-action" 
            onClick={() => handleSearch('hash-lookup')}
            disabled={isSearching || !inputHash.trim()}  // Disable if searching or no input
          >
            {isSearching ? 'Looking Up...' : 'Lookup Owner/Status'}
          </button>

          {/* Divider line */}
          <hr className="divider" />
          
          {/* Show error message if search failed */}
          {searchError && <p style={{ color: 'red', marginTop: '20px' }}>{searchError}</p>}
        </div>
      </div>
    </div>
  );
}

export default SearchPage;