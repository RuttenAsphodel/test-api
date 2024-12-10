import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Configuration for API interactions
const API_BASE_URL = 'https://goalstats-api.onrender.com/api';  // Adjust to your Django backend URL

// Authentication Context for managing user state
const AuthContext = React.createContext({
  user: null,
  login: () => {},
  logout: () => {}
});

// Main App Component
function PerformanceTrackerApp() {
  const [user, setUser] = useState(null);
  
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      <div className="app-container">
        {user ? <DashboardPage /> : <LoginPage />}
      </div>
    </AuthContext.Provider>
  );
}

// Login Component
function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = React.useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE_URL}/login/`, { 
        username, 
        password 
      });
      login(response.data.user);
    } catch (error) {
      alert('Login failed');
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleLogin}>
        <h2>Performance Tracker Login</h2>
        <input 
          type="text" 
          placeholder="Username" 
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

// Dashboard Component
function DashboardPage() {
  const { user, logout } = React.useContext(AuthContext);
  const [performanceMetrics, setPerformanceMetrics] = useState([]);

  useEffect(() => {
    const fetchPerformanceMetrics = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/performance-metrics/`, {
          headers: { 
            'Authorization': `Bearer ${user.token}` 
          }
        });
        setPerformanceMetrics(response.data);
      } catch (error) {
        console.error('Error fetching performance metrics', error);
      }
    };

    fetchPerformanceMetrics();
  }, [user]);

  return (
    <div className="dashboard-container">
      <h1>Performance Dashboard</h1>
      <div className="user-info">
        <h2>Welcome, {user.nombre} {user.apellido}</h2>
        <p>Role: {user.role}</p>
        <button onClick={logout}>Logout</button>
      </div>

      <div className="performance-metrics">
        <h3>Performance Metrics</h3>
        {performanceMetrics.map(metric => (
          <div key={metric.id} className="metric-card">
            <p>Sport: {metric.sport}</p>
            <p>Meters Covered: {metric.meters_covered}</p>
            <p>Goals Scored: {metric.goals_scored}</p>
            <p>Performance Score: {metric.performance_score}</p>
            <p>Suggested Position: {metric.suggested_position}</p>
          </div>
        ))}
      </div>
    </div>
  );
}


export default PerformanceTrackerApp;