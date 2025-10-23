import { Link, useLocation } from 'react-router-dom';
// Removed useState and useEffect as the data is passed via state
import './SearchResultPage.css';

function SearchResultPage() {
  const location = useLocation();
  
  const searchResult = location.state?.result; // extract post request

  // Default values if no searchResult is available
  const isFound = searchResult && !searchResult.error;

  const author = isFound ? searchResult.author : 'N/A';
  const dateUploaded = isFound ? searchResult.date_uploaded : 'N/A';
  const hashKey = isFound ? (searchResult.block_hash || searchResult.hash_key) : 'N/A';
  
  // Determine the display status
  const ownershipStatus = isFound 
                            ? "VERIFIED" 
                            : (searchResult?.error || "NOT FOUND"); // If searchResult exists but has an error field, show the error.

  const hashDisplay = (typeof hashKey === 'string' && hashKey.length > 10) 
                      ? `${hashKey.substring(0, 10)}...` 
                      : hashKey;
  
  // check if missing
  if (!searchResult) {

      // if user navigates directly to /result url without searching, mainly for us because we're goobers
      return (
        <div className="page-container">
          <div className="screen-box">
            <h2 className="screen-title">Search Result</h2>
            <div className="content">
                <p className="ownership-text">"Ownership Status: NOT FOUND"</p>
                <p style={{ marginTop: '20px', color: 'gray' }}>
                    No search data was provided. Please go back to the search page.
                </p>
                <Link to="/" className="back-link">← Back to Search</Link>
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
          <p className="ownership-text">
            "Ownership Status: <strong>{ownershipStatus}</strong>"
          </p>
                    
          <div className="info-section">
            <div className="info-row">
              <span className="info-label">Author:</span>
              <span className="info-value">{author}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Date uploaded:</span>
              <span className="info-value">{dateUploaded}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Hash Key:</span>
              <span className="info-value short-hash">{hashDisplay}</span>
            </div>
          </div>
          
          <Link to="/" className="back-link">← Back to Search</Link>
        </div>
      </div>
    </div>
  );
}

export default SearchResultPage;