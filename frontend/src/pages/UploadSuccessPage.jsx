import { Link } from 'react-router-dom';
import './UploadSuccessPage.css';

function UploadSuccessPage() {
  return (
    <div className="page-container">
      <div className="screen-box">
        <h2 className="screen-title">Upload Success</h2>
        
        <div className="content">
          <p className="success-message">"Upload your image to copyright it"</p>
          
          <div className="status-box">
            <p className="status-text">"upload successful"</p>
          </div>
          
          <p className="download-label">"Download copyrighted image"</p>
          
          <button className="action-button download">
            Download
          </button>
          
          <div className="nav-links">
            <Link to="/upload" className="nav-link">Upload Another</Link>
            <Link to="/" className="nav-link">Search Images</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UploadSuccessPage;