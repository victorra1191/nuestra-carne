import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, User, Search, Flame, Award, Star } from 'lucide-react';

const BlogList = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  
  // URL del backend desde variable de entorno
  const API_BASE = process.env.REACT_APP_BACKEND_URL || 'https://nuestracarnepa.com/api';

  // Imágenes de fondo locales y confiables
  const backgroundImages = [
    '/images/blog/parrilla.svg', // Parrilla
    '/images/blog/parrilla.svg', // Parrilla
    '/images/blog/plancha.svg', // Plancha
    '/images/blog/guisados.svg'  // Guisados
  ];

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/admin/articles`);
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

  // URL del patrón de fondo
  const backgroundPattern = "data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E";

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 flex items-center justify-center relative">
        {/* Fondo con patrón */}
        <div 
          className="absolute inset-0"
          style={{ backgroundImage: `url('${backgroundPattern}')` }}
        ></div>
        
        <div className="text-center z-10">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full mx-auto mb-6"
          />
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-white text-lg font-semibold"
          >
            Cargando deliciosos artículos...
          </motion.p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 relative">
      {/* Fondo con patrón decorativo */}
      <div 
        className="absolute inset-0"
        style={{ backgroundImage: `url('${backgroundPattern}')` }}
      ></div>
      
      {/* Header Hero con imagen de fondo */}
      <div className="relative">
        <div 
          className="h-80 bg-cover bg-center relative"
          style={{ 
            backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.5)), url('${backgroundImages[0]}')`
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary-900/80 to-primary-900/80"></div>
          
          <div className="relative z-10 max-w-6xl mx-auto px-4 h-full flex items-center">
            <div className="w-full">
              <div className="flex items-center justify-between mb-8">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/')}
                  className="flex items-center text-white/90 hover:text-white transition-colors bg-black/20 backdrop-blur-sm px-4 py-2 rounded-lg"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Volver al inicio
                </motion.button>
                
                <div className="hidden md:flex items-center space-x-4 text-white/70">
                  <div className="flex items-center">
                    <Flame className="w-5 h-5 mr-2 text-amber-400" />
                    <span>Consejos Premium</span>
                  </div>
                  <div className="flex items-center">
                    <Award className="w-5 h-5 mr-2 text-amber-400" />
                    <span>Recetas Exclusivas</span>
                  </div>
                </div>
              </div>
              
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center"
              >
                <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
                  🥩 <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">Blog</span> Nuestra Carne
                </h1>
                <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
                  Descubre los secretos de la carne premium, técnicas de parrilla profesionales y recetas que elevarán tus platos al siguiente nivel
                </p>
                
                <div className="flex items-center justify-center space-x-6 text-white/80">
                  <div className="flex items-center">
                    <Star className="w-5 h-5 mr-2 text-amber-400" />
                    <span>+{articles.length} Artículos</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-amber-400" />
                    <span>Actualizado diariamente</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-12">
        {/* Search Bar mejorada */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <div className="relative max-w-2xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-amber-500 rounded-xl blur opacity-20"></div>
            <div className="relative bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl">
              <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-primary-400 w-6 h-6" />
              <input
                type="text"
                placeholder="Buscar artículos sobre carne, parrilla, recetas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-16 pr-6 py-4 bg-transparent text-primary-800 placeholder-primary-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-lg"
              />
            </div>
          </div>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-500/10 backdrop-blur-sm border border-red-500/20 rounded-xl p-6 mb-8 text-center"
          >
            <p className="text-red-200 text-lg">{error}</p>
          </motion.div>
        )}

        {/* Articles Grid */}
        {filteredArticles.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="text-8xl mb-6">🔍</div>
            <h3 className="text-3xl font-bold text-white mb-4">
              {searchTerm ? 'No se encontraron artículos' : 'No hay artículos disponibles'}
            </h3>
            <p className="text-white/70 text-lg">
              {searchTerm ? 'Intenta con otro término de búsqueda' : 'Pronto tendremos contenido increíble para ti'}
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((article, index) => (
              <motion.article
                key={article.id || index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden hover:shadow-3xl transition-all duration-500 cursor-pointer"
                onClick={() => navigate(`/blog/${createSlug(article.titulo)}`)}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                {/* Efecto de brillo */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                
                <div className="aspect-video bg-gradient-to-br from-primary-100 to-primary-100 relative overflow-hidden">
                  {article.imagen || article.image ? (
                    <img
                      src={article.imagen || article.image}
                      alt={article.titulo}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      onError={(e) => {
                        e.target.src = backgroundImages[index % backgroundImages.length];
                      }}
                    />
                  ) : (
                    <div 
                      className="w-full h-full bg-cover bg-center flex items-center justify-center"
                      style={{ 
                        backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.1)), url('${backgroundImages[index % backgroundImages.length]}')`
                      }}
                    >
                      <div className="text-6xl">🥩</div>
                    </div>
                  )}
                  
                  {/* Overlay con gradiente */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Badge de categoría */}
                  <div className="absolute top-4 left-4">
                    <span className="bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                      Premium
                    </span>
                  </div>
                </div>
                
                <div className="p-6 relative">
                  <div className="flex items-center text-sm text-primary-500 mb-3">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>
                      {(() => {
                        try {
                          const date = new Date(article.fecha || article.published_at);
                          return date.toLocaleDateString('es-ES', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          });
                        } catch (error) {
                          return 'Fecha no disponible';
                        }
                      })()}
                    </span>
                    <Clock className="w-4 h-4 ml-4 mr-2" />
                    <span>5 min lectura</span>
                  </div>
                  
                  <h2 className="text-xl font-bold text-primary-900 mb-3 group-hover:text-primary-600 transition-colors line-clamp-2">
                    {article.titulo}
                  </h2>
                  
                  <p className="text-primary-700 line-clamp-3 mb-4 leading-relaxed">
                    {article.resumen || 
                     (article.contenido ? article.contenido.replace(/<[^>]*>/g, '').substring(0, 150) + '...' : 'Contenido disponible próximamente...')}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-primary-500">
                      <User className="w-4 h-4 mr-2" />
                      <span className="font-semibold">Nuestra Carne</span>
                    </div>
                    
                    <motion.div
                      whileHover={{ x: 5 }}
                      className="flex items-center text-primary-600 font-semibold text-sm group-hover:text-primary-700"
                    >
                      <span>Leer más</span>
                      <motion.span
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="ml-2"
                      >
                        →
                      </motion.span>
                    </motion.div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-primary-600 to-amber-600 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
            <div 
              className="absolute inset-0 opacity-20"
              style={{ backgroundImage: `url('${backgroundPattern}')` }}
            ></div>
            
            <div className="relative z-10">
              <h3 className="text-3xl font-bold text-white mb-4">
                ¿Te gustó nuestro contenido?
              </h3>
              <p className="text-white/90 mb-6 text-lg max-w-2xl mx-auto">
                Descubre nuestra selección premium de carnes 100% Nacional y haz realidad todas estas recetas increíbles.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/')}
                className="bg-white text-primary-600 px-8 py-4 rounded-xl hover:bg-gray-50 transition-colors font-bold text-lg shadow-xl"
              >
                Ver productos premium 🥩
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BlogList;