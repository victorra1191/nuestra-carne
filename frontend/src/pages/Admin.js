import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import MediaUploader from '../components/MediaUploader';
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
  Camera
} from 'lucide-react';

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [articles, setArticles] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showMediaUploader, setShowMediaUploader] = useState(false);
  const [showMediaGallery, setShowMediaGallery] = useState(false);
  
  // Forzar URL del backend para producción
  const API_BASE = 'https://nuestracarnepa.com/api';

  const [formData, setFormData] = useState({
    titulo: '',
    contenido: '',
    resumen: '',
    imagen: '',
    fecha: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    const authStatus = localStorage.getItem('adminAuth');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
      fetchArticles();
    }
  }, []);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/admin/blog/all-articles`, {
        headers: {
          'Authorization': `Basic ${btoa('admin:nuestra123')}`
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        setArticles(data.articles || []);
      } else {
        throw new Error(data.error || 'Error al cargar artículos');
      }
    } catch (error) {
      console.error('Error fetching articles:', error);
      setError('Error al cargar los artículos');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (username, password) => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch(`${API_BASE}/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });
      
      const data = await response.json();
      
      if (data.success) {
        localStorage.setItem('adminAuth', 'true');
        setIsAuthenticated(true);
        fetchArticles();
      } else {
        throw new Error(data.error || 'Error de autenticación');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Error de conexión. Verifica tu conexión a internet.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    setIsAuthenticated(false);
    setArticles([]);
    setShowForm(false);
    setEditingArticle(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError('');
      
      const url = editingArticle 
        ? `${API_BASE}/admin/blog/articles/${editingArticle.id}`
        : `${API_BASE}/admin/blog/articles`;
      
      const method = editingArticle ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${btoa('admin:nuestra123')}`
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (data.success) {
        fetchArticles();
        setShowForm(false);
        setEditingArticle(null);
        setFormData({
          titulo: '',
          contenido: '',
          resumen: '',
          imagen: '',
          fecha: new Date().toISOString().split('T')[0]
        });
      } else {
        throw new Error(data.error || 'Error al guardar artículo');
      }
    } catch (error) {
      console.error('Error saving article:', error);
      setError('Error al guardar el artículo');
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
      imagen: article.imagen || article.image || '',
      fecha: article.fecha || article.published_at || new Date().toISOString().split('T')[0]
    });
    setShowForm(true);
  };

  const handleDelete = async (articleId) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este artículo?')) {
      return;
    }
    
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/admin/blog/articles/${articleId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Basic ${btoa('admin:nuestra123')}`
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        fetchArticles();
      } else {
        throw new Error(data.error || 'Error al eliminar artículo');
      }
    } catch (error) {
      console.error('Error deleting article:', error);
      setError('Error al eliminar el artículo');
    } finally {
      setLoading(false);
    }
  };

  const LoginForm = () => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);

    const onSubmit = (e) => {
      e.preventDefault();
      handleLogin(credentials.username, credentials.password);
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary-900 mb-2">🥩 Admin Panel</h1>
            <p className="text-primary-600">Panel de administración Nuestra Carne</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
              <span className="text-red-700">{error}</span>
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-6">
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

          <div className="mt-6 text-center text-sm text-primary-500">
            <p>Credenciales por defecto: admin / nuestra123</p>
          </div>
        </motion.div>
      </div>
    );
  };

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-50">
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
              <h1 className="text-2xl font-bold text-primary-900">🥩 Panel Admin</h1>
              <p className="text-primary-600">Gestión de blog Nuestra Carne</p>
            </div>
            
            <div className="flex items-center space-x-4">
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
              
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center">
            <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
            <span className="text-red-700">{error}</span>
          </div>
        )}

        {/* Article Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-primary-900">
                    {editingArticle ? 'Editar Artículo' : 'Nuevo Artículo'}
                  </h2>
                  <button
                    onClick={() => {
                      setShowForm(false);
                      setEditingArticle(null);
                    }}
                    className="text-primary-500 hover:text-primary-700"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-primary-700 mb-2">
                        Título *
                      </label>
                      <input
                        type="text"
                        value={formData.titulo}
                        onChange={(e) => setFormData({...formData, titulo: e.target.value})}
                        className="w-full px-4 py-3 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-primary-700 mb-2">
                        Fecha
                      </label>
                      <input
                        type="date"
                        value={formData.fecha}
                        onChange={(e) => setFormData({...formData, fecha: e.target.value})}
                        className="w-full px-4 py-3 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-primary-700 mb-2">
                      Imagen del artículo
                    </label>
                    
                    {/* Imagen actual o placeholder */}
                    <div className="mb-4">
                      {formData.imagen ? (
                        <div className="relative">
                          <img
                            src={formData.imagen}
                            alt="Vista previa"
                            className="w-full h-48 object-cover rounded-lg border border-primary-200"
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/400x200/f3f4f6/9ca3af?text=Imagen+no+disponible';
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => setFormData({...formData, imagen: ''})}
                            className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-lg"
                            title="Eliminar imagen"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="w-full h-48 bg-gray-100 rounded-lg border border-primary-200 flex items-center justify-center">
                          <div className="text-center">
                            <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                            <p className="text-gray-500">Sin imagen seleccionada</p>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Opciones de imagen */}
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-3">
                        <button
                          type="button"
                          onClick={() => setShowMediaUploader(true)}
                          className="flex items-center space-x-2 bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors"
                        >
                          <Upload className="w-4 h-4" />
                          <span>Subir nueva imagen</span>
                        </button>
                        
                        <button
                          type="button"
                          onClick={() => setShowMediaGallery(true)}
                          className="flex items-center space-x-2 bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors"
                        >
                          <Camera className="w-4 h-4" />
                          <span>Galería de medios</span>
                        </button>
                      </div>
                      
                      {/* URL manual como alternativa */}
                      <div className="border-t border-primary-200 pt-3">
                        <label className="block text-xs font-medium text-primary-500 mb-2">
                          O ingresa una URL manualmente:
                        </label>
                        <input
                          type="url"
                          value={formData.imagen}
                          onChange={(e) => setFormData({...formData, imagen: e.target.value})}
                          className="w-full px-3 py-2 text-sm border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="https://ejemplo.com/imagen.jpg"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-primary-700 mb-2">
                      Resumen *
                    </label>
                    <textarea
                      value={formData.resumen}
                      onChange={(e) => setFormData({...formData, resumen: e.target.value})}
                      rows={3}
                      className="w-full px-4 py-3 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Breve descripción del artículo..."
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-primary-700 mb-2">
                      Contenido *
                    </label>
                    <textarea
                      value={formData.contenido}
                      onChange={(e) => setFormData({...formData, contenido: e.target.value})}
                      rows={12}
                      className="w-full px-4 py-3 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Contenido completo del artículo (HTML permitido)..."
                      required
                    />
                  </div>

                  <div className="flex items-center justify-end space-x-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowForm(false);
                        setEditingArticle(null);
                      }}
                      className="px-6 py-3 border border-primary-300 text-primary-700 rounded-lg hover:bg-primary-50 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex items-center space-x-2 bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Save className="w-4 h-4" />
                      <span>{loading ? 'Guardando...' : 'Guardar'}</span>
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}

        {/* Articles List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {loading && articles.length === 0 ? (
            // Loading state
            [1, 2, 3, 4, 5, 6].map((index) => (
              <div key={index} className="bg-white rounded-xl shadow-md p-6 animate-pulse">
                <div className="h-4 bg-gray-300 rounded mb-4 w-3/4"></div>
                <div className="h-3 bg-gray-300 rounded mb-2"></div>
                <div className="h-3 bg-gray-300 rounded mb-2 w-5/6"></div>
                <div className="h-3 bg-gray-300 rounded w-2/3"></div>
              </div>
            ))
          ) : articles.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <FileText className="w-16 h-16 text-primary-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-primary-700 mb-2">No hay artículos</h3>
              <p className="text-primary-500">Crea tu primer artículo para comenzar</p>
            </div>
          ) : (
            articles.map((article, index) => (
              <motion.div
                key={article.id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow"
              >
                {(article.imagen || article.image) && (
                  <div className="aspect-video bg-gray-200 rounded-t-xl overflow-hidden">
                    <img 
                      src={article.imagen || article.image}
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
                        onClick={() => handleDelete(article.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Eliminar artículo"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;