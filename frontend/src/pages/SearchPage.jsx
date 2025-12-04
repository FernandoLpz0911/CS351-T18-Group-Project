import { useState } from 'react';
import axios from 'axios';
import './SearchPage.css';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
const ID_SEARCH_URL = `${BASE_URL}/api/search/id-lookup/`;
const FILE_SEARCH_URL = `${BASE_URL}/api/search/file-compare/`;

const DistanceLegend = ({ matchType }) => {
  if (!matchType || !matchType.includes("Distance")) return null;

  const distanceMatch = matchType.match(/Distance: (\d+)/);
  const score = distanceMatch ? parseInt(distanceMatch[1]) : 0;

  return (
    <div className="distance-legend">
      <h4>Understanding the Match Score: <span className="score-highlight">{score}</span></h4>
      <div className="legend-grid">
        <div className={`legend-item ${score === 0 ? 'active' : ''}`}>
          <span className="range">0</span>
          <span className="desc">Exact Match</span>
        </div>
        <div className={`legend-item ${score > 0 && score <= 10 ? 'active' : ''}`}>
          <span className="range">1 - 10</span>
          <span className="desc">Tiny Changes (Compression, Format)</span>
        </div>
        <div className={`legend-item ${score > 10 && score <= 20 ? 'active' : ''}`}>
          <span className="range">11 - 20</span>
          <span className="desc">Visible Edits (Dots, Lines, Cropping)</span>
        </div>
        <div className={`legend-item ${score > 20 ? 'active' : ''}`}>
          <span className="range">20+</span>
          <span className="desc">Significant Modification</span>
        </div>
      </div>
    </div>
  );
};

function SearchPage() {
  const [searchHash, setSearchHash] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [activeTab, setActiveTab] = useState('hash');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const resetState = (tab) => {
    setActiveTab(tab);
    setError(null);
    setResult(null);
  };

  const handleHashSearch = async () => {
    if (!searchHash.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await axios.post(ID_SEARCH_URL, { query_hash: searchHash.trim() });
      setResult(response.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.status === 404 ? "No record found for this ID." : "Search failed. Please check the key.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileSearch = async () => {
    if (!selectedFile) return;
    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const response = await axios.post(FILE_SEARCH_URL, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResult(response.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.status === 404 ? "No visual match found in registry." : "Search failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getFullImageUrl = (imagePath) => {
    if (!imagePath) return null;
    return imagePath.startsWith('http') ? imagePath : `${BASE_URL}${imagePath}`;
  };

  return (
    <div className="page-container search-layout">
      {result && (
        <div className="screen-box certificate-box">
          <div className="certificate-header">
            <h3>{result.match_type ? `⚠️ ${result.match_type}` : "✅ Official Record Found"}</h3>
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
                <div className="verified-name">{result.legal_name || result.author || "Unknown"}</div>
              </div>

              <div className="detail-row">
                <label>Cryptographic Hash:</label>
                <code className="hash-display">{result.image_hash || result.hash_key}</code>
              </div>

              <div className="detail-row">
                <label>AI Training Consent:</label>
                <div className={`consent-badge ${result.ai_consent ? 'allowed' : 'denied'}`}>
                  {result.ai_consent ? '✅ AUTHORIZED' : '⛔ PROHIBITED'}
                  <small>{result.ai_consent ? 'The rights holder HAS granted permission.' : 'The rights holder has STRICTLY FORBIDDEN AI use.'}</small>
                </div>
              </div>
            </div>
          </div>
           <DistanceLegend matchType={result.match_type} />
        </div>
      )}

      <div className="screen-box search-box">
        <h2 className="screen-title">Registry Lookup</h2>
        
        <div className="search-tabs">
            <button className={`tab-button ${activeTab === 'hash' ? 'active' : ''}`} onClick={() => resetState('hash')}>
                Search by ID
            </button>
            <button className={`tab-button ${activeTab === 'file' ? 'active' : ''}`} onClick={() => resetState('file')}>
                Search by Image (Stolen?)
            </button>
        </div>

        <div className="search-bar" style={{flexDirection: 'column'}}>
          {activeTab === 'hash' ? (
            <div style={{display: 'flex', gap: '10px'}}>
                <input
                    type="text"
                    className="text-input search-input"
                    placeholder="e.g. 5dce308c3d2f9..."
                    value={searchHash}
                    onChange={(e) => setSearchHash(e.target.value)}
                />
                <button className="action-button" onClick={handleHashSearch} disabled={loading}>
                    {loading ? '...' : 'Verify ID'}
                </button>
            </div>
          ) : (
            <div style={{display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'center'}}>
                <p className="descriptive-text">Upload a suspicious image to check if it's a derivative of registered work.</p>
                <input type="file" accept="image/*" onChange={(e) => setSelectedFile(e.target.files[0])} />
                <button 
                    className="action-button" 
                    onClick={handleFileSearch} 
                    disabled={loading || !selectedFile}
                    style={{width: '100%'}}
                >
                    {loading ? 'Scanning Registry...' : 'Scan Image'}
                </button>
            </div>
          )}
        </div>

        {error && <div className="error-message">⚠️ {error}</div>}
      </div>
    </div>
  );
}

export default SearchPage;