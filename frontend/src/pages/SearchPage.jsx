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

  // --- HELPER FUNCTION TO FIX BROKEN IMAGE LINKS ---
  const getFullImageUrl = (imagePath) => {
    if (!imagePath) return null;
    // If it already starts with http, it's fine. 
    if (imagePath.startsWith('http')) return imagePath;
    // Otherwise, prepend the Backend URL to make it a full link
    return `${BASE_URL}${imagePath}`;
  };

  return (
    <div className="page-container">
      <div className="screen-box search-box">
        <h2 className="screen-title">Registry Lookup</h2>
        <p className="descriptive-text">
          Enter a cryptographic hash key to retrieve the official registration record and usage rights.
        </p>
        
        <div className="search-bar">
          <input
            type="text"
            className="text-input search-input"
            placeholder="e.g. 8f434346648f6b96df89dda901c5176b..."
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

      {/* --- EVIDENCE / CERTIFICATE DISPLAY --- */}
      {result && (
        <div className="screen-box certificate-box">
          <div className="certificate-header">
            <h3>✅ Official Registration Record</h3>
            <span className="timestamp">Registered: {new Date(result.timestamp).toLocaleString()}</span>
          </div>

          <div className="certificate-content">
            
            {/* Visual Evidence */}
            <div className="evidence-image-container">
              {/* WE USE THE HELPER FUNCTION HERE */}
              <img 
                src={getFullImageUrl(result.registered_image)} 
                alt="Registered Work" 
                className="evidence-image" 
              />
              <p className="caption">Visual Evidence</p>
            </div>

            {/* Legal Details */}
            <div className="evidence-details">
              
              <div className="detail-row">
                <label>Rights Holder:</label>
                <div className="verified-name">
                  <span>🛡️</span> {result.legal_name || result.owner || "Unknown"}
                </div>
              </div>

              <div className="detail-row">
                <label>Cryptographic Hash:</label>
                <code className="hash-display">{result.image_hash}</code>
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
    </div>
  );
}

export default SearchPage;