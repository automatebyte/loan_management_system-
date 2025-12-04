import React from 'react';

function App() {
  return (
    <div style={{ 
      padding: '2rem', 
      fontFamily: 'Arial, sans-serif',
      maxWidth: '800px',
      margin: '0 auto',
      textAlign: 'center'
    }}>
      <h1 style={{ color: '#1e3a8a', marginBottom: '1rem' }}>
        KreditAI Loan Management System
      </h1>
      <p style={{ fontSize: '1.1rem', marginBottom: '2rem' }}>
        Application is currently being updated with new features.
      </p>
      <div style={{ 
        background: '#f8fafc', 
        padding: '1.5rem', 
        borderRadius: '8px',
        marginBottom: '2rem'
      }}>
        <h3>System Status: [ONLINE]</h3>
        <p>Backend APIs are fully operational</p>
        <p>Frontend interface is being optimized</p>
      </div>
      <div style={{ fontSize: '0.9rem', color: '#666' }}>
        <p>API Endpoint: <code>https://kreditai.onrender.com/api/</code></p>
        <p>Please check back shortly for the complete application interface.</p>
      </div>
    </div>
  );
}

export default App;