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
          <span className="range">0</span><span className="desc">Exact Match</span>
        </div>
        <div className={`legend-item ${score > 0 && score <= 10 ? 'active' : ''}`}>
          <span className="range">1 - 10</span><span className="desc">Tiny Changes</span>
        </div>
        <div className={`legend-item ${score > 10 && score <= 20 ? 'active' : ''}`}>
          <span className="range">11 - 20</span><span className="desc">Visible Edits</span>
        </div>
        <div className={`legend-item ${score > 20 ? 'active' : ''}`}>
          <span className="range">20+</span><span className="desc">Significant</span>
        </div>
      </div>
    </div>
  );
};

function SearchPage() {
  const [searchHash, setSearchHash] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [activeTab, setActiveTab] = useState('hash'); 
  
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
        setError(null);
        setResult(null);
    }
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
      if (err.response?.status === 404) {
        setError("No record found for this ID.");
      } else {
        setError("Search failed. Please check the key.");
      }
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
      if (err.response?.status === 404) {
        setError("No visual match found in registry.");
      } else {
        setError("Search failed. Please try again.");
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
            <h3>
              {result.match_type ? `⚠️ ${result.match_type}` : "✅ Official Record Found"}
            </h3>
            <span className="timestamp">Registered: {new Date(result.timestamp || result.date_uploaded).toLocaleString()}</span>
          </div>

          <DistanceLegend matchType={result.match_type} />

          <div className="certificate-content">
            
            {activeTab === 'file' && previewUrl ? (
                <div className="comparison-container">
                    <div className="evidence-image-container">
                        <div className="image-label">Your Upload (Suspicious)</div>
                        <img 
                            src={previewUrl} 
                            alt="Scanned Work" 
                            className="evidence-image" 
                        />
                    </div>
                    <div className="match-indicator">
                        <span>⚡ MATCHED ⚡</span>
                        <div className="arrow">➜</div>
                    </div>
                    <div className="evidence-image-container">
                        <div className="image-label">Registered Original</div>
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
                    </div>
                </div>
            ) : (
                <div className="evidence-image-container" style={{maxWidth: '100%'}}>
                    <div className="image-label">Registered Original</div>
                    <img 
                        src={getFullImageUrl(result.image_url || result.registered_image)} 
                        alt="Registered Work" 
                        className="evidence-image" 
                    />
                </div>
            )}

            <div className="evidence-details" style={{width: '100%', marginTop: '20px'}}>
              <hr />
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
                    <small>The rights holder HAS granted permission.</small>
                  </div>
                ) : (
                  <div className="consent-badge denied">
                    ⛔ PROHIBITED
                    <small>The rights holder has STRICTLY FORBIDDEN AI use.</small>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="screen-box search-box">
        <h2 className="screen-title">Registry Lookup</h2>
        
        <div style={{display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2rem'}}>
            <button 
                onClick={() => {setActiveTab('hash'); setError(null); setResult(null);}}
                style={{
                    padding: '10px 20px', 
                    border: 'none', 
                    borderBottom: activeTab === 'hash' ? '3px solid #333' : '3px solid transparent',
                    background: 'transparent',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                }}
            >
                Search by ID
            </button>
            <button 
                onClick={() => {setActiveTab('file'); setError(null); setResult(null);}}
                style={{
                    padding: '10px 20px', 
                    border: 'none', 
                    borderBottom: activeTab === 'file' ? '3px solid #333' : '3px solid transparent',
                    background: 'transparent',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                }}
            >
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
                <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleFileSelect}
                />
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