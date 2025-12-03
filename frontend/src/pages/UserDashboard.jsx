import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './UserDashboard.css';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

function UserDashboard() {
  const [myBlocks, setMyBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyBlocks = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get(`${BASE_URL}/api/blocks/mine/`, {
          headers: { 'Authorization': `Token ${token}` }
        });
        setMyBlocks(response.data);
      } catch (error) {
        console.error("Failed to fetch registry:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyBlocks();
  }, [navigate]);

  const handleCopy = (hash, id) => {
    if (hash) {
      navigator.clipboard.writeText(hash);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  return (
    <div className="page-container">
      <div className="screen-box dashboard-box">
        
        <div className="dashboard-header">
          <h2 className="screen-title">My Registry</h2>
          <Link to="/upload" className="primary-action-btn">
            + Register New Image
          </Link>
        </div>
        
        {loading ? (
          <div className="loading-state">Loading your secure registry...</div>
        ) : (
          <div className="registry-container">
            {myBlocks.length === 0 ? (
              <div className="empty-state">
                <p>You haven't registered any intellectual property yet.</p>
                <Link to="/upload" className="nav-link">Start Registration</Link>
              </div>
            ) : (
              <table className="registry-table">
                <thead>
                  <tr>
                    <th className="th-image">Artwork</th>
                    <th className="th-hash">Cryptographic Hash Key</th>
                    <th className="th-consent">AI Usage</th>
                    <th className="th-date">Date Registered</th>
                  </tr>
                </thead>
                <tbody>
                  {myBlocks.map((block) => (
                    <tr key={block.id} className="registry-row">
                      <td className="td-image">
                        <a href={block.registered_image} target="_blank" rel="noopener noreferrer">
                            <img 
                              src={block.registered_image} 
                              alt="Thumbnail" 
                              className="table-thumb"
                            />
                        </a>
                      </td>

                      <td className="td-hash">
                        <div className="hash-wrapper">
                          <code className="hash-code" title={block.image_hash}>
                            {block.image_hash ? `${block.image_hash.substring(0, 16)}...` : 'Generating...'}
                          </code>
                          <button 
                            className={`copy-icon-btn ${copiedId === block.id ? 'copied' : ''}`}
                            onClick={() => handleCopy(block.image_hash, block.id)}
                            title="Copy full hash key"
                          >
                            {copiedId === block.id ? '✓ Copied' : 'Copy'}
                          </button>
                        </div>
                      </td>

                      <td>
                        {block.ai_consent ? 
                          <span className="badge badge-success">Allowed</span> : 
                          <span className="badge badge-danger">Denied</span>
                        }
                      </td>

                      <td className="td-date">
                        {new Date(block.timestamp).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default UserDashboard;