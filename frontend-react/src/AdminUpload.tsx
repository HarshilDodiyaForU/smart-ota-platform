import React, { useState, useRef } from 'react';
import axios from 'axios';
import './AdminUpload.css';

function AdminUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [version, setVersion] = useState('');
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.name.endsWith('.zip')) {
        setFile(droppedFile);
        setError('');
      } else {
        setError('Please upload a .zip file');
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.name.endsWith('.zip')) {
        setFile(selectedFile);
        setError('');
      } else {
        setError('Please upload a .zip file');
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file');
      return;
    }
    if (!version) {
      setError('Please enter a version number');
      return;
    }

    setUploading(true);
    setError('');
    setMessage('');

    try {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        setError('You must be logged in to upload firmware');
        setUploading(false);
        return;
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('version', version);

      const response = await axios.post('http://localhost:8081/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      });

      setMessage(`Firmware ${version} uploaded successfully!`);
      setFile(null);
      setVersion('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to upload firmware');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="admin-upload">
      <h2>Firmware Upload</h2>
      
      <div className="upload-form">
        <div
          className={`drop-zone ${dragActive ? 'drag-active' : ''} ${file ? 'has-file' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".zip"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          {file ? (
            <div className="file-info">
              <span className="file-icon">📦</span>
              <span className="file-name">{file.name}</span>
              <span className="file-size">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
            </div>
          ) : (
            <div className="drop-zone-content">
              <span className="drop-icon">📤</span>
              <p>Drag & drop firmware .zip file here</p>
              <p className="drop-hint">or click to browse</p>
            </div>
          )}
        </div>

        <div className="version-input">
          <label htmlFor="version">Version Number:</label>
          <input
            id="version"
            type="text"
            placeholder="e.g., 1.0.2"
            value={version}
            onChange={(e) => setVersion(e.target.value)}
          />
        </div>

        <button
          className="upload-btn"
          onClick={handleUpload}
          disabled={uploading || !file || !version}
        >
          {uploading ? 'Uploading...' : 'Upload Firmware'}
        </button>

        {error && <div className="error-message">{error}</div>}
        {message && <div className="success-message">{message}</div>}
      </div>
    </div>
  );
}

export default AdminUpload;

