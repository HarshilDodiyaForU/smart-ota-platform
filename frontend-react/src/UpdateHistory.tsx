import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './UpdateHistory.css';

interface OtaUpdate {
  id: number;
  version: string;
  status: string;
  downloadUrl: string;
  uploadedAt: string;
}

function UpdateHistory() {
  const [updates, setUpdates] = useState<OtaUpdate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchHistory();
    const interval = setInterval(fetchHistory, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await axios.get('http://localhost:8081/api/history');
      setUpdates(response.data);
      setError('');
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch update history');
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const getStatusBadge = (status: string) => {
    const statusMap: { [key: string]: { class: string; text: string } } = {
      'active': { class: 'status-active', text: 'Active' },
      'deprecated': { class: 'status-deprecated', text: 'Deprecated' },
      'available': { class: 'status-available', text: 'Available' },
    };
    const statusInfo = statusMap[status] || { class: 'status-default', text: status };
    return <span className={`status-badge ${statusInfo.class}`}>{statusInfo.text}</span>;
  };

  if (loading) {
    return <div className="history-loading">Loading update history...</div>;
  }

  return (
    <div className="update-history">
      <div className="history-header">
        <h2>Update History</h2>
        <button onClick={fetchHistory} className="refresh-btn">Refresh</button>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="table-container">
        <table className="history-table">
          <thead>
            <tr>
              <th>Version</th>
              <th>Status</th>
              <th>Download URL</th>
              <th>Uploaded At</th>
            </tr>
          </thead>
          <tbody>
            {updates.length === 0 ? (
              <tr>
                <td colSpan={4} className="no-updates">No updates found</td>
              </tr>
            ) : (
              updates.map((update) => (
                <tr key={update.id}>
                  <td><strong>{update.version}</strong></td>
                  <td>{getStatusBadge(update.status)}</td>
                  <td>
                    <a href={update.downloadUrl} target="_blank" rel="noopener noreferrer">
                      {update.downloadUrl}
                    </a>
                  </td>
                  <td>{formatDate(update.uploadedAt)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UpdateHistory;

