import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import SearchPage from './pages/SearchPage';
import UploadPage from './pages/UploadPage';
import SearchResultPage from './pages/SearchResultPage';
import UploadSuccessPage from './pages/UploadSuccessPage';

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <h1>Artist Copyright System</h1>
          <div className="nav-links">
            <Link to="/">Search</Link>
            <Link to="/upload">Upload</Link>
            <Link to="/success">Success (Demo)</Link>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<SearchPage />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/result" element={<SearchResultPage />} />
          <Route path="/success" element={<UploadSuccessPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;