// SearchResultPage.jsx - Shows the results after searching for artwork
// Displays whether artwork was found and shows owner information

import { Link, useLocation } from 'react-router-dom';
import './SearchResultPage.css';

function SearchResultPage() {
  // Get the search result data that was passed from SearchPage
  const location = useLocation();
  const searchResult = location.state?.result;

  // Check if artwork was found in the database
  const isFound = searchResult && !searchResult.error;

  // Extract data from the search result, or show 'N/A' if not found
  const author = isFound ? searchResult.author : 'N/A';
  const dateUploaded = isFound ? searchResult.date_uploaded : 'N/A';
  const hashKey = isFound ? (searchResult.block_hash || searchResult.hash_key) : 'N/A';
  
  // Determine status text to display
  const ownershipStatus = isFound 
                            ? "VERIFIED"  // Found in database
                            : (searchResult?.error || "NOT FOUND");  // Not found or error

  // Shorten the hash for display (show first 10 characters + "...")
  const hashDisplay = (typeof hashKey === 'string' && hashKey.length > 10) 
                      ? `${hashKey.substring(0, 10)}...` 
                      : hashKey;
  
  // If user navigated here directly without searching, show error message
  if (!searchResult) {
      return (
        <div className="page-container">
          <div className="screen-box">
            <h2 className="screen-title">Search Result</h2>
            <div className="content">
                <p className="descriptive-text">"Ownership Status: NOT FOUND"</p>
                <p style={{ marginTop: '20px', color: 'gray' }}>
                    No search data was provided. Please go back to the search page.
                </p>
                <Link to="/search" className="back-link">← Back to Search</Link>
            </div>
          </div>
        </div>
      );
  }

  return (
    <div className="page-container">
      <div className="screen-box">
        <h2 className="screen-title">Search Result</h2>
        
        <div className="content">
          {/* ========== OWNERSHIP STATUS ========== */}
          {/* Shows VERIFIED or NOT FOUND */}
          <p className="descriptive-text">
            "Ownership Status: <strong>{ownershipStatus}</strong>"
          </p>
                    
          {/* ========== ARTWORK INFORMATION ========== */}
          {/* Shows author, date, and hash key */}
          <div className="info-section">
            
            {/* Author name */}
            <div className="info-row">
              <span className="info-label">Author:</span>
              <span className="info-value">{author}</span>
            </div>
            
            {/* Date uploaded */}
            <div className="info-row">
              <span className="info-label">Date uploaded:</span>
              <span className="info-value">{dateUploaded}</span>
            </div>
            
            {/* Hash key (shortened) */}
            <div className="info-row">
              <span className="info-label">Hash Key:</span>
              <span className="info-value short-hash">{hashDisplay}</span>
            </div>
            
          </div>
          
          {/* Back link to search page */}
          <Link to="/search" className="back-link">← Back to Search</Link>
        </div>
      </div>
    </div>
  );
}

export default SearchResultPage;