import React, { useState } from 'react';
import axios from 'axios';

// Configuration for API interactions
const API_BASE_URL = 'https://goalstats-api.onrender.com/api';  // Adjust to your Django backend URL

// Authentication Context for managing user state
const AuthContext = React.createContext({
  user: null,
  login: () => {},
  logout: () => {}
});
// Performance Metric Creation Component
function CreatePerformanceMetricForm() {
  const { user } = React.useContext(AuthContext);
  const [metricData, setMetricData] = useState({
    meters_covered: 0,
    goals_scored: 0,
    intercepted_passes: 0,
    successful_passes: 0,
    match_date: new Date(),
    sport: null
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/performance-metrics/`, metricData, {
        headers: { 
          'Authorization': `Bearer ${user.token}` 
        }
      });
      alert('Performance Metric Created Successfully');
    } catch (error) {
      console.error('Error creating performance metric', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Create Performance Metric</h3>
      <input 
        type="number" 
        placeholder="Meters Covered"
        value={metricData.meters_covered}
        onChange={(e) => setMetricData({
          ...metricData, 
          meters_covered: parseFloat(e.target.value)
        })}
      />
      {/* Add similar inputs for other performance metric fields */}
      <button type="submit">Create Metric</button>
    </form>
  );
}

export default CreatePerformanceMetricForm