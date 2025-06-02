import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import OrderForm from './pages/OrderForm';
import './App.css';

// Componente Admin simple inline
const SimpleAdmin = () => {
  return (
    <div style={{ 
      padding: '2rem', 
      textAlign: 'center',
      backgroundColor: '#f0f0f0',
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ color: 'red', fontSize: '2rem', marginBottom: '2rem' }}>
        🚨 PANEL ADMIN - FUNCIONANDO 🚨
      </h1>
      <p style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>
        ¡El panel admin está funcionando!
      </p>
      <p>URL: {window.location.href}</p>
      <p>Hora: {new Date().toLocaleString()}</p>
      
      <div style={{ 
        marginTop: '2rem', 
        padding: '2rem', 
        backgroundColor: 'white', 
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ color: '#333', marginBottom: '1rem' }}>Panel de Blog - Nuestra Carne</h2>
        <form style={{ textAlign: 'left', maxWidth: '500px', margin: '0 auto' }}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Usuario:
            </label>
            <input 
              type="text" 
              defaultValue="admin"
              style={{ 
                width: '100%', 
                padding: '0.5rem', 
                border: '1px solid #ccc', 
                borderRadius: '4px' 
              }}
            />
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Contraseña:
            </label>
            <input 
              type="password" 
              defaultValue="nuestra123"
              style={{ 
                width: '100%', 
                padding: '0.5rem', 
                border: '1px solid #ccc', 
                borderRadius: '4px' 
              }}
            />
          </div>
          
          <button 
            type="button"
            onClick={() => alert('Panel completo en desarrollo. Esta es la versión de prueba.')}
            style={{ 
              width: '100%',
              padding: '0.75rem', 
              backgroundColor: '#007bff', 
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 'bold'
            }}
          >
            Iniciar Sesión (Prueba)
          </button>
        </form>
      </div>
      
      <button 
        onClick={() => window.location.href = '/'}
        style={{ 
          marginTop: '2rem', 
          padding: '0.75rem 1.5rem', 
          backgroundColor: '#28a745', 
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '1rem'
        }}
      >
        ← Volver a Nuestra Carne
      </button>
    </div>
  );
};

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/pedido" element={<OrderForm />} />
          <Route path="/haz-tu-pedido" element={<OrderForm />} />
          <Route path="/admin" element={<SimpleAdmin />} />
          <Route path="/admin/*" element={<SimpleAdmin />} />
          {/* Fallback para rutas no encontradas */}
          <Route path="*" element={<LandingPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;