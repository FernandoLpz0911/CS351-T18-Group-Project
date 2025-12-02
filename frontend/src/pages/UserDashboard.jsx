import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './UserDashboard.css'; // Create a simple CSS file for this

const BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

function UserDashboard() {
  const [myBlocks, setMyBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyBlocks = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        // Fetch from our new custom "mine" endpoint
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

  return (
    <div className="page-container">
      <div className="screen-box dashboard-box">
        <h2 className="screen-title">My Image Registry</h2>
        <Link to="/upload" className="nav-link" style={{marginBottom: '20px', display:'block'}}>+ Register New Image</Link>
        
        {loading ? <p>Loading your registry...</p> : (
          <div className="registry-list">
            {myBlocks.length === 0 ? (
              <p>You haven't registered any images yet.</p>
            ) : (
              <table className="registry-table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Hash Key (ID)</th>
                    <th>AI Consent</th>
                    <th>Registered Date</th>
                  </tr>
                </thead>
                <tbody>
                  {myBlocks.map((block) => (
                    <tr key={block.id}>
                      <td>
                        <img 
                          src={block.registered_image} 
                          alt="Thumbnail" 
                          style={{width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px'}}
                        />
                      </td>
                      <td className="hash-cell" title={block.image_hash}>
                        {block.image_hash.substring(0, 10)}...
                      </td>
                      <td>
                        {block.ai_consent ? 
                          <span className="badge-green">Allowed</span> : 
                          <span className="badge-red">Denied</span>
                        }
                      </td>
                      <td>{new Date(block.timestamp).toLocaleDateString()}</td>
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