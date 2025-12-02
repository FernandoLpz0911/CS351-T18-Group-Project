import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './SignUpPage.css'; // Reusing existing styles

const BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await axios.post(`${BASE_URL}/api/login/`, {
        username: username,
        password: password
      });

      // Save token AND the full name
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('username', response.data.username);
      localStorage.setItem('fullName', response.data.full_name); // <--- Critical Update
      
      console.log('Login successful');
      
      // Force reload to update navigation state
      window.location.href = '/'; 

    } catch (err) {
      console.error('Login failed:', err);
      setError('Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="screen-box" style={{ maxWidth: '400px' }}>
        <h2 className="screen-title">Log In</h2>
        
        <div className="content">
          {error && <div style={{ color: 'red', textAlign: 'center', marginBottom: '1rem' }}>{error}</div>}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label className="field-label">Username:</label>
              <input
                type="text"
                className="text-input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="field-label">Password:</label>
              <input
                type="password"
                className="text-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button 
              type="submit" 
              className="action-button" 
              disabled={isLoading}
              style={{ marginTop: '1rem' }}
            >
              {isLoading ? 'Logging In...' : 'Log In'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '1rem' }}>
            Don't have an account? <Link to="/signup" className="nav-link">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;