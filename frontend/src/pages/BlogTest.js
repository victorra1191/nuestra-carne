import React, { useState, useEffect } from 'react';

const BlogTest = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [url, setUrl] = useState('');

  const API_BASE = process.env.REACT_APP_BACKEND_URL || 'https://nuestracarnepa.com/api';

  useEffect(() => {
    setUrl(`${API_BASE}/admin/articles`);
    console.log('API_BASE:', API_BASE);
    console.log('Full URL:', `${API_BASE}/admin/articles`);
  }, [API_BASE]);

  const testAPI = async () => {
    try {
      setError(null);
      console.log('Testing API...');
      
      const response = await fetch(`${API_BASE}/admin/articles`);
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log('API Response:', result);
      setData(result);
    } catch (err) {
      console.error('API Error:', err);
      setError(err.message);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Blog API Test Page</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <strong>Environment:</strong> {process.env.NODE_ENV || 'development'}
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <strong>API Base URL:</strong> {API_BASE}
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <strong>Full API URL:</strong> {url}
      </div>
      
      <button onClick={testAPI} style={{ padding: '10px 20px', fontSize: '16px' }}>
        Test API Call
      </button>
      
      {error && (
        <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#ffebee', border: '1px solid #f44336', borderRadius: '4px' }}>
          <strong>Error:</strong> {error}
        </div>
      )}
      
      {data && (
        <div style={{ marginTop: '20px' }}>
          <h3>API Response:</h3>
          <div style={{ backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '4px', overflow: 'auto' }}>
            <pre>{JSON.stringify(data, null, 2)}</pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogTest;