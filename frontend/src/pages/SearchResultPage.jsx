import { useState } from 'react';
import axios from 'axios';
import './SearchPage.css';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
const SEARCH_API_URL = `${BASE_URL}/api/search/id-lookup/`;

function SearchPage() {
  const [searchHash, setSearchHash] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchHash.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await axios.post(SEARCH_API_URL, { query_hash: searchHash.trim() });
      setResult(response.data);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 404) {
        setError("No record found. This hash key is not in the registry.");
      } else {
        setError("Search failed. Please check the key.");
      }
    } finally {
      setLoading(false);
    }
  };

  const getFullImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    return `${BASE_URL}${imagePath}`;
  };

  return (
    <div className="page-container search-layout">
      
      {result && (
        <div className="screen-box certificate-box">
          <div className="certificate-header">
            <h3>✅ Official Registration Record</h3>
            <span className="timestamp">Registered: {new Date(result.timestamp || result.date_uploaded).toLocaleString()}</span>
          </div>

          <div className="certificate-content">
            <div className="evidence-image-container">
              {result.image_url || result.registered_image ? (
                <img 
                  src={getFullImageUrl(result.image_url || result.registered_image)} 
                  alt="Registered Work" 
                  className="evidence-image" 
                  onError={(e) => {e.target.onerror = null; e.target.src = "https://placehold.co/400x300?text=Image+Not+Found"}}
                />
              ) : (
                <div className="no-image-placeholder">No Image Available</div>
              )}
              <p className="caption">Visual Evidence</p>
            </div>

            <div className="evidence-details">
              <div className="detail-row">
                <label>Rights Holder:</label>
                <div className="verified-name">
                {result.legal_name || result.author || "Unknown"}
                </div>
              </div>

              <div className="detail-row">
                <label>Cryptographic Hash:</label>
                <code className="hash-display">{result.image_hash || result.hash_key}</code>
              </div>

              <div className="detail-row">
                <label>AI Training Consent:</label>
                {result.ai_consent ? (
                  <div className="consent-badge allowed">
                    ✅ AUTHORIZED
                    <small>The rights holder HAS granted permission for AI training.</small>
                  </div>
                ) : (
                  <div className="consent-badge denied">
                    ⛔ PROHIBITED
                    <small>The rights holder has STRICTLY FORBIDDEN AI training use.</small>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="certificate-footer">
            <p>This record is immutable and cryptographically secured on the ArtGuard Registry.</p>
          </div>
        </div>
      )}

      <div className="screen-box search-box">
        <h2 className="screen-title">Registry Lookup</h2>
        <p className="descriptive-text">
          Enter a cryptographic hash key to retrieve the official registration record and usage rights.
        </p>
        
        <div className="search-bar">
          <input
            type="text"
            className="text-input search-input"
            placeholder="e.g. 5dce308c3d2f9..."
            value={searchHash}
            onChange={(e) => setSearchHash(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button className="action-button" onClick={handleSearch} disabled={loading}>
            {loading ? 'Verifying...' : 'Verify'}
          </button>
        </div>

        {error && <div className="error-message">⚠️ {error}</div>}
      </div>

    </div>
  );
}

export default SearchPage;