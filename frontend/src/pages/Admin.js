import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit3, Trash2, Eye, EyeOff, LogOut, Upload, Save, ArrowLeft } from 'lucide-react';

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [articles, setArticles] = useState([]);
  const [currentView, setCurrentView] = useState('login'); // login, dashboard, create, edit
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  // Estados del formulario
  const [formData, setFormData] = useState({
    titulo: '',
    resumen: '',
    contenido: '',
    imagen: ''
  });

  const navigate = useNavigate();
  const API_BASE = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      setIsAuthenticated(true);
      setCurrentView('dashboard');
      loadArticles();
    }
  }, []);

  const login = async (username, password) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      
      const data = await response.json();
      
      if (data.success) {
        localStorage.setItem('adminToken', data.token);
        setIsAuthenticated(true);
        setCurrentView('dashboard');
        loadArticles();
        setMessage('¡Login exitoso!');
      } else {
        setMessage('Credenciales inválidas');
      }
    } catch (error) {
      setMessage('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    setIsAuthenticated(false);
    setCurrentView('login');
    setMessage('');
  };

  const getAuthHeaders = () => {
    const token = localStorage.getItem('adminToken');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${token}`
    };
  };

  const loadArticles = async () => {
    try {
      const response = await fetch(`${API_BASE}/admin/blog/all-articles`, {
        headers: getAuthHeaders()
      });
      const data = await response.json();
      if (data.success) {
        setArticles(data.articles);
      }
    } catch (error) {
      console.error('Error cargando artículos:', error);
    }
  };

  const handleImageUpload = async (file) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await fetch(`${API_BASE}/admin/upload-image`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${localStorage.getItem('adminToken')}`
        },
        body: formData
      });
      
      const data = await response.json();
      if (data.success) {
        return data.imageUrl;
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      setMessage('Error subiendo imagen: ' + error.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const saveArticle = async () => {
    try {
      setLoading(true);
      const url = selectedArticle 
        ? `${API_BASE}/admin/blog/articles/${selectedArticle.id}`
        : `${API_BASE}/admin/blog/articles`;
      
      const method = selectedArticle ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      if (data.success) {
        setMessage(selectedArticle ? 'Artículo actualizado!' : 'Artículo creado!');
        loadArticles();
        setCurrentView('dashboard');
        resetForm();
      } else {
        setMessage('Error: ' + data.error);
      }
    } catch (error) {
      setMessage('Error guardando artículo');
    } finally {
      setLoading(false);
    }
  };

  const deleteArticle = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este artículo?')) return;
    
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/admin/blog/articles/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      
      const data = await response.json();
      if (data.success) {
        setMessage('Artículo eliminado!');
        loadArticles();
      } else {
        setMessage('Error eliminando artículo');
      }
    } catch (error) {
      setMessage('Error eliminando artículo');
    } finally {
      setLoading(false);
    }
  };

  const toggleArticleStatus = async (article) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/admin/blog/articles/${article.id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ ...article, activo: !article.activo })
      });
      
      const data = await response.json();
      if (data.success) {
        setMessage(article.activo ? 'Artículo ocultado!' : 'Artículo publicado!');
        loadArticles();
      }
    } catch (error) {
      setMessage('Error actualizando estado');
    } finally {
      setLoading(false);
    }
  };

  const editArticle = (article) => {
    setSelectedArticle(article);
    setFormData({
      titulo: article.titulo,
      resumen: article.resumen,
      contenido: article.contenido,
      imagen: article.imagen
    });
    setCurrentView('edit');
  };

  const resetForm = () => {
    setFormData({ titulo: '', resumen: '', contenido: '', imagen: '' });
    setSelectedArticle(null);
  };

  // Componente de Login
  const LoginForm = () => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    
    const handleSubmit = (e) => {
      e.preventDefault();
      login(credentials.username, credentials.password);
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-500 to-rustic-600 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-rustic-900 mb-2">Panel Admin</h1>
            <p className="text-rustic-600">Nuestra Carne Blog</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-rustic-700 mb-2">
                Usuario
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 border border-rustic-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                value={credentials.username}
                onChange={(e) => setCredentials({...credentials, username: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-rustic-700 mb-2">
                Contraseña
              </label>
              <input
                type="password"
                required
                className="w-full px-4 py-3 border border-rustic-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                value={credentials.password}
                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-500 text-white py-3 rounded-lg font-semibold hover:bg-primary-600 disabled:opacity-50"
            >
              {loading ? 'Iniciando...' : 'Iniciar Sesión'}
            </button>
          </form>
          
          {message && (
            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg text-center">
              {message}
            </div>
          )}
          
          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/')}
              className="text-rustic-600 hover:text-rustic-800 text-sm"
            >
              ← Volver al sitio
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Componente Dashboard
  const Dashboard = () => (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Panel de Administración</h1>
              <p className="text-gray-600">Gestión del Blog - Nuestra Carne</p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => navigate('/')}
                className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                <ArrowLeft size={20} className="mr-2" />
                Ver Sitio
              </button>
              <button
                onClick={() => {
                  resetForm();
                  setCurrentView('create');
                }}
                className="flex items-center px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
              >
                <Plus size={20} className="mr-2" />
                Nuevo Artículo
              </button>
              <button
                onClick={logout}
                className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                <LogOut size={20} className="mr-2" />
                Salir
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {message && (
          <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg">
            {message}
          </div>
        )}

        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Artículos del Blog ({articles.length})
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Título
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {articles.map((article) => (
                  <tr key={article.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {article.titulo}
                        </div>
                        <div className="text-sm text-gray-500">
                          {article.resumen.substring(0, 100)}...
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(article.fecha).toLocaleDateString('es-ES')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        article.activo 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {article.activo ? 'Publicado' : 'Oculto'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => editArticle(article)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        onClick={() => toggleArticleStatus(article)}
                        className="text-yellow-600 hover:text-yellow-900"
                      >
                        {article.activo ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                      <button
                        onClick={() => deleteArticle(article.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  // Componente Formulario de Artículo
  const ArticleForm = () => {
    const handleImageChange = async (e) => {
      const file = e.target.files[0];
      if (file) {
        const imageUrl = await handleImageUpload(file);
        if (imageUrl) {
          setFormData({...formData, imagen: imageUrl});
        }
      }
    };

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <h1 className="text-2xl font-bold text-gray-900">
                {selectedArticle ? 'Editar Artículo' : 'Nuevo Artículo'}
              </h1>
              <div className="flex space-x-4">
                <button
                  onClick={() => setCurrentView('dashboard')}
                  className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  <ArrowLeft size={20} className="mr-2" />
                  Volver
                </button>
                <button
                  onClick={saveArticle}
                  disabled={loading}
                  className="flex items-center px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50"
                >
                  <Save size={20} className="mr-2" />
                  {loading ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {message && (
            <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg">
              {message}
            </div>
          )}

          <div className="bg-white rounded-lg shadow p-6">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título del Artículo
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  value={formData.titulo}
                  onChange={(e) => setFormData({...formData, titulo: e.target.value})}
                  placeholder="Ej: Los mejores cortes para parrilla"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Resumen (se muestra en la lista de artículos)
                </label>
                <textarea
                  required
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  value={formData.resumen}
                  onChange={(e) => setFormData({...formData, resumen: e.target.value})}
                  placeholder="Breve descripción del artículo..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contenido del Artículo
                </label>
                <textarea
                  required
                  rows={12}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  value={formData.contenido}
                  onChange={(e) => setFormData({...formData, contenido: e.target.value})}
                  placeholder="Escribe el contenido completo del artículo aquí..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Imagen del Artículo
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                  />
                  {formData.imagen && (
                    <img 
                      src={formData.imagen} 
                      alt="Preview" 
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Renderizado principal
  if (!isAuthenticated && currentView === 'login') {
    return <LoginForm />;
  }

  if (currentView === 'dashboard') {
    return <Dashboard />;
  }

  if (currentView === 'create' || currentView === 'edit') {
    return <ArticleForm />;
  }

  return <LoginForm />;
};

export default Admin;