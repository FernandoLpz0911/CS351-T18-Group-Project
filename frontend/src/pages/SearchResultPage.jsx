import { Link, useLocation } from 'react-router-dom';
import './SearchResultPage.css';

function SearchResultPage() {
  const location = useLocation();
  const searchResult = location.state?.result;
  const isFound = searchResult && !searchResult.error;

  const author = isFound ? searchResult.author : 'N/A';
  const dateUploaded = isFound ? searchResult.date_uploaded : 'N/A';
  const hashKey = isFound ? (searchResult.block_hash || searchResult.hash_key) : 'N/A';
  
  const ownershipStatus = isFound 
                            ? "VERIFIED" 
                            : (searchResult?.error || "NOT FOUND");

  const hashDisplay = (typeof hashKey === 'string' && hashKey.length > 10) 
                      ? `${hashKey.substring(0, 10)}...` 
                      : hashKey;
  
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
          <p className="descriptive-text">
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
          
          <Link to="/search" className="back-link">← Back to Search</Link>
        </div>
      </div>
    </div>
  );
}

export default SearchResultPage;