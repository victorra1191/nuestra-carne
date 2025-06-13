import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import MediaUploader from '../components/MediaUploader';
import AdminProducts from '../components/AdminProducts';
import AdminWholesale from '../components/AdminWholesale';
import AdminOrders from '../components/AdminOrders';
import { 
  Eye, 
  EyeOff, 
  Plus, 
  Edit3, 
  Trash2, 
  Save, 
  X, 
  Calendar,
  User,
  LogOut,
  FileText,
  Image as ImageIcon,
  AlertCircle,
  Upload,
  Camera,
  Package,
  Crown,
  Home,
  Settings,
  BarChart3,
  ShoppingCart
} from 'lucide-react';

const Admin = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [articles, setArticles] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showMediaUploader, setShowMediaUploader] = useState(false);
  const [showMediaGallery, setShowMediaGallery] = useState(false);
  const [activeSection, setActiveSection] = useState('blog');
  
  // URL del backend desde variable de entorno
  const API_BASE = process.env.REACT_APP_BACKEND_URL || 'https://nuestracarnepa.com/api';

  const [formData, setFormData] = useState({
    titulo: '',
    contenido: '',
    resumen: '',
    imagen: '',
    fecha: new Date().toISOString().split('T')[0]
  });

  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });

  const [showPassword, setShowPassword] = useState(false);

  // Verificar autenticación al cargar
  useEffect(() => {
    const savedAuth = localStorage.getItem('adminAuth');
    if (savedAuth === 'authenticated') {
      setIsAuthenticated(true);
      fetchArticles();
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (credentials.username === 'admin' && credentials.password === 'nuestra123') {
        setIsAuthenticated(true);
        localStorage.setItem('adminAuth', 'authenticated');
        await fetchArticles();
      } else {
        setError('Credenciales incorrectas');
      }
    } catch (error) {
      setError('Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('adminAuth');
    setCredentials({ username: '', password: '' });
    setArticles([]);
    setShowForm(false);
    setEditingArticle(null);
    setActiveSection('blog');
  };

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/api/admin/articles`, {
        headers: {
          'Authorization': `Basic ${btoa('admin:nuestra123')}`
        }
      });

      if (!response.ok) {
        throw new Error('Error al cargar artículos');
      }

      const data = await response.json();
      setArticles(data.articles || []);
    } catch (error) {
      console.error('Error fetching articles:', error);
      setError('Error al cargar artículos');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const url = editingArticle 
        ? `${API_BASE}/admin/articles/${editingArticle.slug}`
        : `${API_BASE}/admin/articles`;
      
      const method = editingArticle ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${btoa('admin:nuestra123')}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Error al guardar artículo');
      }

      await fetchArticles();
      setShowForm(false);
      setEditingArticle(null);
      setFormData({
        titulo: '',
        contenido: '',
        resumen: '',
        imagen: '',
        fecha: new Date().toISOString().split('T')[0]
      });
    } catch (error) {
      console.error('Error saving article:', error);
      setError('Error al guardar artículo');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (article) => {
    setEditingArticle(article);
    setFormData({
      titulo: article.titulo || '',
      contenido: article.contenido || '',
      resumen: article.resumen || '',
      imagen: article.imagen || '',
      fecha: article.fecha ? article.fecha.split('T')[0] : new Date().toISOString().split('T')[0]
    });
    setShowForm(true);
  };

  const handleDelete = async (articleSlug) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este artículo?')) {
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/api/admin/articles/${articleSlug}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Basic ${btoa('admin:nuestra123')}`
        }
      });

      if (!response.ok) {
        throw new Error('Error al eliminar artículo');
      }

      await fetchArticles();
    } catch (error) {
      console.error('Error deleting article:', error);
      setError('Error al eliminar artículo');
    } finally {
      setLoading(false);
    }
  };

  // Si no está autenticado, mostrar formulario de login
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-wine-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-primary-500 rounded-full flex items-center justify-center">
              <div className="text-white font-bold text-xl">NC</div>
            </div>
            <h1 className="text-3xl font-bold text-primary-900 mb-2">Panel Admin</h1>
            <p className="text-primary-600">Nuestra Carne - Gestión de Contenido</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
              <span className="text-red-700">{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-primary-700 mb-2">
                Usuario
              </label>
              <input
                type="text"
                value={credentials.username}
                onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                className="w-full px-4 py-3 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Ingresa tu usuario"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-primary-700 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={credentials.password}
                  onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                  className="w-full px-4 py-3 pr-12 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Ingresa tu contraseña"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary-400 hover:text-primary-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-500 text-white py-3 px-4 rounded-lg hover:bg-primary-600 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary-50">
      {/* Media Uploaders */}
      {showMediaUploader && (
        <MediaUploader
          onImageSelect={(imageUrl) => {
            setFormData({...formData, imagen: imageUrl});
            setShowMediaUploader(false);
          }}
          selectedImage={formData.imagen}
          onClose={() => setShowMediaUploader(false)}
        />
      )}
      
      {showMediaGallery && (
        <MediaUploader
          showGallery={true}
          onImageSelect={(imageUrl) => {
            setFormData({...formData, imagen: imageUrl});
            setShowMediaGallery(false);
          }}
          selectedImage={formData.imagen}
          onClose={() => setShowMediaGallery(false)}
        />
      )}

      {/* Header */}
      <div className="bg-white shadow-sm border-b border-primary-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <img 
                src="/images/logo/nuestra-carne-logo.png"
                alt="Nuestra Carne Logo"
                className="h-12 w-auto"
                onError={(e) => {
                  // Fallback al texto si no encuentra la imagen
                  e.target.style.display = 'none';
                  e.target.nextElementSibling.style.display = 'block';
                }}
              />
              <div style={{display: 'none'}}>
                <h1 className="text-2xl font-bold text-primary-900">🥩 Panel Admin</h1>
                <p className="text-primary-600">Gestión completa Nuestra Carne</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/')}
                className="flex items-center space-x-2 text-primary-600 hover:text-primary-800 transition-colors"
              >
                <Home className="w-4 h-4" />
                <span>Ver Sitio</span>
              </button>
              
              {activeSection === 'blog' && (
                <button
                  onClick={() => {
                    setShowForm(true);
                    setEditingArticle(null);
                    setFormData({
                      titulo: '',
                      contenido: '',
                      resumen: '',
                      imagen: '',
                      fecha: new Date().toISOString().split('T')[0]
                    });
                  }}
                  className="flex items-center space-x-2 bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Nuevo Artículo</span>
                </button>
              )}
              
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveSection('blog')}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeSection === 'blog'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-primary-500 hover:text-primary-700 hover:border-primary-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <FileText size={16} />
                <span>Blog</span>
              </div>
            </button>
            
            <button
              onClick={() => setActiveSection('products')}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeSection === 'products'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-primary-500 hover:text-primary-700 hover:border-primary-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Package size={16} />
                <span>Productos</span>
              </div>
            </button>
            
            <button
              onClick={() => setActiveSection('wholesale')}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeSection === 'wholesale'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-primary-500 hover:text-primary-700 hover:border-primary-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Crown size={16} />
                <span>Mayoristas</span>
              </div>
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Blog Section */}
        {activeSection === 'blog' && (
          <div>
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center">
                <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                <span className="text-red-700">{error}</span>
              </div>
            )}

            {/* Form */}
            {showForm && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow-sm p-6 mb-8"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-primary-900">
                    {editingArticle ? 'Editar Artículo' : 'Nuevo Artículo'}
                  </h2>
                  <button
                    onClick={() => {
                      setShowForm(false);
                      setEditingArticle(null);
                      setFormData({
                        titulo: '',
                        contenido: '',
                        resumen: '',
                        imagen: '',
                        fecha: new Date().toISOString().split('T')[0]
                      });
                    }}
                    className="p-2 text-primary-500 hover:bg-primary-50 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-primary-700 mb-2">
                        Título del Artículo
                      </label>
                      <input
                        type="text"
                        value={formData.titulo}
                        onChange={(e) => setFormData({...formData, titulo: e.target.value})}
                        className="w-full px-3 py-2 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Ingresa el título del artículo"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-primary-700 mb-2">
                        Fecha de Publicación
                      </label>
                      <input
                        type="date"
                        value={formData.fecha}
                        onChange={(e) => setFormData({...formData, fecha: e.target.value})}
                        className="w-full px-3 py-2 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-primary-700 mb-2">
                      Resumen
                    </label>
                    <textarea
                      value={formData.resumen}
                      onChange={(e) => setFormData({...formData, resumen: e.target.value})}
                      className="w-full px-3 py-2 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Resumen del artículo (opcional)"
                      rows="3"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-primary-700 mb-2">
                      Imagen Principal
                    </label>
                    <div className="flex items-center space-x-4">
                      <button
                        type="button"
                        onClick={() => setShowMediaUploader(true)}
                        className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        <Upload className="w-4 h-4" />
                        <span>Subir Nueva</span>
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => setShowMediaGallery(true)}
                        className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                      >
                        <ImageIcon className="w-4 h-4" />
                        <span>Galería</span>
                      </button>
                      
                      {formData.imagen && (
                        <button
                          type="button"
                          onClick={() => setFormData({...formData, imagen: ''})}
                          className="flex items-center space-x-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                        >
                          <X className="w-4 h-4" />
                          <span>Quitar</span>
                        </button>
                      )}
                    </div>
                    
                    {formData.imagen && (
                      <div className="mt-4">
                        <img 
                          src={formData.imagen} 
                          alt="Preview" 
                          className="max-w-xs h-auto rounded-lg shadow-md"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-primary-700 mb-2">
                      Contenido del Artículo
                    </label>
                    <textarea
                      value={formData.contenido}
                      onChange={(e) => setFormData({...formData, contenido: e.target.value})}
                      className="w-full px-3 py-2 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Escribe el contenido completo del artículo aquí..."
                      rows="12"
                      required
                    />
                  </div>

                  <div className="flex items-center justify-end space-x-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowForm(false);
                        setEditingArticle(null);
                        setFormData({
                          titulo: '',
                          contenido: '',
                          resumen: '',
                          imagen: '',
                          fecha: new Date().toISOString().split('T')[0]
                        });
                      }}
                      className="px-6 py-2 border border-primary-300 text-primary-700 rounded-lg hover:bg-primary-50 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex items-center space-x-2 bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      <span>{loading ? 'Guardando...' : 'Guardar Artículo'}</span>
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* Articles List */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-primary-900">Artículos del Blog</h2>
                <span className="text-primary-600">{articles.length} artículos</span>
              </div>

              {loading && !showForm ? (
                <div className="text-center py-8">
                  <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-primary-600">Cargando artículos...</p>
                </div>
              ) : articles.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-primary-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-primary-900 mb-2">No hay artículos</h3>
                  <p className="text-primary-600">Crea tu primer artículo para comenzar.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {articles.map((article) => (
                    <motion.div
                      key={article.slug}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border border-primary-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      {article.imagen && (
                        <div className="aspect-video bg-primary-100">
                          <img 
                            src={article.imagen}
                            alt={article.titulo}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                      
                      <div className="p-6">
                        <div className="flex items-center text-sm text-primary-500 mb-3">
                          <Calendar className="w-4 h-4 mr-1" />
                          <span>
                            {new Date(article.fecha || article.published_at || Date.now()).toLocaleDateString('es-ES')}
                          </span>
                        </div>
                        
                        <h3 className="text-xl font-bold text-primary-900 mb-3 line-clamp-2">
                          {article.titulo}
                        </h3>
                        
                        <p className="text-primary-700 mb-4 line-clamp-3">
                          {article.resumen || 
                           (article.contenido ? article.contenido.replace(/<[^>]*>/g, '').substring(0, 150) + '...' : '')}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-sm text-primary-500">
                            <User className="w-4 h-4 mr-1" />
                            <span>Nuestra Carne</span>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleEdit(article)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Editar artículo"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            
                            <button
                              onClick={() => handleDelete(article.slug)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Eliminar artículo"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Products Section */}
        {activeSection === 'products' && (
          <AdminProducts API_BASE={API_BASE} />
        )}

        {/* Wholesale Section */}
        {activeSection === 'wholesale' && (
          <AdminWholesale API_BASE={API_BASE} />
        )}
      </div>
    </div>
  );
};

export default Admin;