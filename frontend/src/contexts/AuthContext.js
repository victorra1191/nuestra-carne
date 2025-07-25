import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // URL del backend - Determinar dinámicamente
  const getApiBase = () => {
    // Si NO es localhost, asumir que es producción
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      
      if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
        return 'https://nuestracarnepa.com/api';
      }
      
      // Solo usar localhost si realmente estamos en localhost
      if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return 'http://localhost:8001/api';
      }
    }
    
    // Fallback a producción
    return 'https://nuestracarnepa.com/api';
  };

  const API_BASE = getApiBase();

  // Verificar token al cargar la app
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('userToken');
        const userData = localStorage.getItem('userData');

        if (token && userData) {
          const parsedUser = JSON.parse(userData);
          
          // Verificar si el token sigue siendo válido
          const response = await fetch(`${API_BASE}/auth/profile/${parsedUser.id}`);
          const data = await response.json();

          if (data.success && data.user.estado === 'activo') {
            setUser(data.user);
            setIsAuthenticated(true);
          } else {
            // Token inválido o usuario inactivo
            logout();
          }
        }
      } catch (error) {
        console.error('Error verificando autenticación:', error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [API_BASE]);

  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        setUser(data.user);
        setIsAuthenticated(true);
        localStorage.setItem('userToken', data.token);
        localStorage.setItem('userData', JSON.stringify(data.user));
        return { success: true, user: data.user };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('Error en login:', error);
      return { success: false, error: 'Error de conexión' };
    }
  };

  const register = async (userData) => {
    try {
      const response = await fetch(`${API_BASE}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (data.success) {
        // Si es un mayorista, no logear automáticamente (necesita aprobación)
        if (userData.tipo === 'mayorista') {
          return { 
            success: true, 
            message: data.message,
            requiresApproval: true 
          };
        } else {
          // Auto-login para usuarios individuales
          setUser(data.user);
          setIsAuthenticated(true);
          localStorage.setItem('userToken', `user_${data.user.id}`);
          localStorage.setItem('userData', JSON.stringify(data.user));
          return { success: true, user: data.user };
        }
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('Error en registro:', error);
      return { success: false, error: 'Error de conexión' };
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData');
  };

  const updateProfile = async (updates) => {
    try {
      const response = await fetch(`${API_BASE}/api/auth/profile/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      const data = await response.json();

      if (data.success) {
        setUser(data.user);
        localStorage.setItem('userData', JSON.stringify(data.user));
        return { success: true, user: data.user };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('Error actualizando perfil:', error);
      return { success: false, error: 'Error de conexión' };
    }
  };

  const isWholesaleUser = () => {
    return user && user.tipo === 'mayorista' && user.estado === 'activo';
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    updateProfile,
    isWholesaleUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;