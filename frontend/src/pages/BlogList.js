import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, User, Search } from 'lucide-react';

const BlogList = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  
  const API_BASE = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8080/api';

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/admin/blog/articles`);
      const data = await response.json();
      
      if (data.success) {
        setArticles(data.articles || []);
      } else {
        throw new Error('Error al cargar artículos');
      }
    } catch (error) {
      console.error('Error fetching articles:', error);
      setError('Error al cargar los artículos del blog');
    } finally {
      setLoading(false);
    }
  };

  const createSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[áàäâ]/g, 'a')
      .replace(/[éèëê]/g, 'e')
      .replace(/[íìïî]/g, 'i')
      .replace(/[óòöô]/g, 'o')
      .replace(/[úùüû]/g, 'u')
      .replace(/ñ/g, 'n')
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim();
  };

  const filteredArticles = articles.filter(article =>
    article.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.contenido?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rustic-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-rustic-600">Cargando artículos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rustic-50 to-amber-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-rustic-200">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/')}
              className="flex items-center text-rustic-600 hover:text-primary-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Volver al inicio
            </button>
            
            <div className="text-center">
              <h1 className="text-3xl font-bold text-rustic-900">
                🥩 Blog Nuestra Carne
              </h1>
              <p className="text-rustic-600 mt-2">
                Consejos, recetas y todo sobre carne premium
              </p>
            </div>
            
            <div className="w-24"></div> {/* Spacer */}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-lg mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-rustic-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar artículos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-rustic-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Articles Grid */}
        {filteredArticles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-rustic-600 text-lg">
              {searchTerm ? 'No se encontraron artículos con ese término' : 'No hay artículos disponibles'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((article, index) => (
              <motion.article
                key={article.id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
                onClick={() => navigate(`/blog/${createSlug(article.titulo)}`)}
              >
                <div className="aspect-video bg-gradient-to-br from-rustic-100 to-primary-100 relative overflow-hidden">
                  {article.imagen || article.image ? (
                    <img
                      src={article.imagen || article.image}
                      alt={article.titulo}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-6xl">🥩</div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center text-sm text-rustic-500 mb-3">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>
                      {new Date(article.fecha || article.published_at || Date.now()).toLocaleDateString('es-ES', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </span>
                    <Clock className="w-4 h-4 ml-4 mr-1" />
                    <span>5 min lectura</span>
                  </div>
                  
                  <h2 className="text-xl font-bold text-rustic-900 mb-3 group-hover:text-primary-600 transition-colors">
                    {article.titulo}
                  </h2>
                  
                  <p className="text-rustic-700 line-clamp-3 mb-4">
                    {article.resumen || 
                     (article.contenido ? article.contenido.replace(/<[^>]*>/g, '').substring(0, 150) + '...' : 'Contenido disponible próximamente...')}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-rustic-500">
                      <User className="w-4 h-4 mr-1" />
                      <span>Nuestra Carne</span>
                    </div>
                    
                    <span className="text-primary-600 font-semibold text-sm group-hover:text-primary-700">
                      Leer más →
                    </span>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogList;