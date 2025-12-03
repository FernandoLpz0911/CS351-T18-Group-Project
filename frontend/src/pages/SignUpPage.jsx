import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './SignUpPage.css';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

function SignUpPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (password !== confirmPassword) {
      setError('Passwords do not match!');
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${BASE_URL}/api/register/`, {
        username: username,
        email: email,
        password: password,
        first_name: firstName, 
        last_name: lastName    
      });

      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('username', username);
      localStorage.setItem('fullName', response.data.full_name); 
      
      console.log('Registration successful:', response.data);
      alert('Account created successfully!');
      
      navigate('/'); 
      
    } catch (err) {
      console.error('Registration failed:', err.response?.data || err.message);
      const serverError = err.response?.data?.username?.[0] || err.response?.data?.password?.[0];
      setError(serverError || 'Registration failed. Please check your details.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="screen-box" style={{ maxWidth: '500px' }}>
        <h2 className="screen-title">Create Account</h2>
        
        <div className="content">
          {error && <div style={{ color: 'red', textAlign: 'center', marginBottom: '1rem' }}>{error}</div>}

          <form onSubmit={handleSignUp} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            
            <div style={{display: 'flex', gap: '1rem'}}>
                <div style={{flex: 1}}>
                    <label className="field-label">First Name (Legal):</label>
                    <input 
                        type="text" 
                        className="text-input" 
                        value={firstName} 
                        onChange={(e) => setFirstName(e.target.value)} 
                        required 
                    />
                </div>
                <div style={{flex: 1}}>
                    <label className="field-label">Last Name (Legal):</label>
                    <input 
                        type="text" 
                        className="text-input" 
                        value={lastName} 
                        onChange={(e) => setLastName(e.target.value)} 
                        required 
                    />
                </div>
            </div>

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
              <label className="field-label">Email:</label>
              <input
                type="email"
                className="text-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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

            <div>
              <label className="field-label">Confirm Password:</label>
              <input
                type="password"
                className="text-input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <button 
              type="submit" 
              className="action-button" 
              disabled={isLoading}
              style={{ marginTop: '1rem' }}
            >
              {isLoading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '1rem' }}>
            Already have an account? <Link to="/login" className="nav-link">Log In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignUpPage;