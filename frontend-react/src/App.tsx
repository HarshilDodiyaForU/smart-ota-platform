import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
import Dashboard from './Dashboard';
import AdminUpload from './AdminUpload';
import UpdateHistory from './UpdateHistory';

interface OtaData {
  status: string;
  version: string;
  downloadUrl: string;
}

type Page = 'ota' | 'dashboard' | 'admin' | 'history';

function App() {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('password');
  const [token, setToken] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [otaData, setOtaData] = useState<OtaData | null>(null);
  const [currentPage, setCurrentPage] = useState<Page>('ota');

  useEffect(() => {
    const storedToken = localStorage.getItem('jwtToken');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const handleLogin = async () => {
    try {
      const response = await axios.get('http://localhost:8081/login', {
        params: { username, password },
      });
      const receivedToken = response.data.token as string;
      localStorage.setItem('jwtToken', receivedToken);
      setToken(receivedToken);
      setError('');
    } catch (err) {
      setError('Login failed. Please check your credentials.');
      setToken(null);
      localStorage.removeItem('jwtToken');
    }
  };

  const fetchMessage = async () => {
    try {
      const response = await axios.get('http://localhost:8081/');
      setMessage(response.data);
      setError('');
    } catch (err) {
      setError('Failed to connect to backend.');
      setMessage('');
    }
  };

  const fetchOta = async () => {
    try {
      const storedToken = token || localStorage.getItem('jwtToken');
      if (!storedToken) {
        setError('You must be logged in to check OTA updates.');
        setOtaData(null);
        return;
      }
      const response = await axios.get('http://localhost:8081/ota', {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });
      setOtaData(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch OTA data.');
      setOtaData(null);
    }
  };

  return (
    <div className="App">
      <h1>Smart OTA Platform</h1>

      {!token && (
        <div className="login-form">
          <h2>Login</h2>
          <div>
            <label>
              Username:
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </label>
          </div>
          <div>
            <label>
              Password:
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
          </div>
          <button onClick={handleLogin}>Login</button>
        </div>
      )}

      {token && (
        <>
          <nav className="main-nav">
            <button 
              className={currentPage === 'ota' ? 'active' : ''} 
              onClick={() => setCurrentPage('ota')}
            >
              OTA Check
            </button>
            <button 
              className={currentPage === 'dashboard' ? 'active' : ''} 
              onClick={() => setCurrentPage('dashboard')}
            >
              Device Dashboard
            </button>
            <button 
              className={currentPage === 'admin' ? 'active' : ''} 
              onClick={() => setCurrentPage('admin')}
            >
              Firmware Upload
            </button>
            <button 
              className={currentPage === 'history' ? 'active' : ''} 
              onClick={() => setCurrentPage('history')}
            >
              Update History
            </button>
            <button 
              className="logout-btn" 
              onClick={() => {
                setToken(null);
                localStorage.removeItem('jwtToken');
                setCurrentPage('ota');
              }}
            >
              Logout
            </button>
          </nav>

          {currentPage === 'ota' && (
            <div className="ota-page">
              <div className="actions">
                <button onClick={fetchMessage}>Fetch Backend</button>
                <button onClick={fetchOta}>Check OTA Update</button>
              </div>
              
              {message && <p>Backend: {message}</p>}
              {error && <p className="error">{error}</p>}
              
              {otaData && (
                <div className="ota-container">
                  <h3>OTA Update Available</h3>
                  <p><strong>Status:</strong> {otaData.status}</p>
                  <p><strong>Version:</strong> {otaData.version}</p>
                  <p><strong>Download:</strong> <a href={otaData.downloadUrl} target="_blank" rel="noopener noreferrer">{otaData.downloadUrl}</a></p>
                </div>
              )}
            </div>
          )}

          {currentPage === 'dashboard' && <Dashboard />}
          {currentPage === 'admin' && <AdminUpload />}
          {currentPage === 'history' && <UpdateHistory />}
        </>
      )}
    </div>
  );
}

export default App;
