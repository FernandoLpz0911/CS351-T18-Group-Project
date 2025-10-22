import { Link } from 'react-router-dom';
import './SearchResultPage.css';

function SearchResultPage() {
  return (
    <div className="page-container">
      <div className="screen-box">
        <h2 className="screen-title">Search Result</h2>
        
        <div className="content">
          <p className="ownership-text">"see who owns this"</p>
          
          <div className="image-box large">
            <div className="placeholder large">Image</div>
          </div>
          
          <div className="info-section">
            <div className="info-row">
              <span className="info-label">Author:</span>
              <span className="info-value">++</span>
            </div>
            <div className="info-row">
              <span className="info-label">Date uploaded:</span>
              <span className="info-value">++</span>
            </div>
          </div>
          
          <Link to="/" className="back-link">← Back to Search</Link>
        </div>
      </div>
    </div>
  );
}

export default SearchResultPage;