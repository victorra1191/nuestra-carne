import React from 'react';

const AdminTest = () => {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1 style={{ color: 'red', fontSize: '2rem' }}>🚨 PANEL ADMIN - TEST 🚨</h1>
      <p>Si ves este mensaje, el routing funciona correctamente.</p>
      <p>URL actual: {window.location.href}</p>
      <p>Timestamp: {new Date().toLocaleString()}</p>
      
      <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#f0f0f0', borderRadius: '8px' }}>
        <h3>Información de debug:</h3>
        <p><strong>Backend URL:</strong> {process.env.REACT_APP_BACKEND_URL}</p>
        <p><strong>Node ENV:</strong> {process.env.NODE_ENV}</p>
      </div>
      
      <button 
        onClick={() => window.location.href = '/'}
        style={{ 
          marginTop: '1rem', 
          padding: '0.5rem 1rem', 
          backgroundColor: '#007bff', 
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        ← Volver al sitio principal
      </button>
    </div>
  );
};

export default AdminTest;