import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import OrderForm from './pages/OrderForm';
import Admin from './pages/Admin';
import BlogList from './pages/BlogList';
import BlogPost from './pages/BlogPost';
import BlogTest from './pages/BlogTest';
import DebugApi from './pages/DebugApi';
import NetworkDebug from './pages/NetworkDebug';
import Auth from './pages/Auth';
import UserDashboard from './pages/UserDashboard';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/pedido" element={<OrderForm />} />
            <Route path="/haz-tu-pedido" element={<OrderForm />} />
            <Route path="/blog" element={<BlogList />} />
            <Route path="/blog-test" element={<BlogTest />} />
          <Route path="/debug-api" element={<DebugApi />} />
          <Route path="/network-debug" element={<NetworkDebug />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/*" element={<Admin />} />
            <Route path="/auth" element={<Auth />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <UserDashboard />
                </ProtectedRoute>
              } 
            />
            {/* Fallback para rutas no encontradas */}
            <Route path="*" element={<LandingPage />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;