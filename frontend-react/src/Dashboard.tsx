import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Dashboard.css';

interface Device {
  deviceId: string;
  currentVersion: string;
  latestVersion: string;
  lastUpdated: string;
  status: string;
}

function Dashboard() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDevices();
    const interval = setInterval(fetchDevices, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchDevices = async () => {
    try {
      const response = await axios.get('http://localhost:8081/api/devices');
      setDevices(response.data);
      setError('');
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch devices');
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: { [key: string]: { class: string; text: string } } = {
      'up-to-date': { class: 'status-success', text: 'Up to Date' },
      'update-available': { class: 'status-warning', text: 'Update Available' },
      'updating': { class: 'status-info', text: 'Updating' },
      'error': { class: 'status-error', text: 'Error' },
    };
    const statusInfo = statusMap[status] || { class: 'status-default', text: status };
    return <span className={`status-badge ${statusInfo.class}`}>{statusInfo.text}</span>;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (loading) {
    return <div className="dashboard-loading">Loading devices...</div>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Device Fleet Management</h2>
        <button onClick={fetchDevices} className="refresh-btn">Refresh</button>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="table-container">
        <table className="devices-table">
          <thead>
            <tr>
              <th>Device ID</th>
              <th>Current Version</th>
              <th>Latest Version</th>
              <th>Last Updated</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {devices.length === 0 ? (
              <tr>
                <td colSpan={5} className="no-devices">No devices registered yet</td>
              </tr>
            ) : (
              devices.map((device) => (
                <tr key={device.deviceId}>
                  <td>{device.deviceId}</td>
                  <td>{device.currentVersion}</td>
                  <td>{device.latestVersion}</td>
                  <td>{formatDate(device.lastUpdated)}</td>
                  <td>{getStatusBadge(device.status)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Dashboard;

