import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, User, Share2, Facebook, Twitter, MessageCircle, Eye, Heart, Bookmark, ChefHat, Award } from 'lucide-react';

const BlogPost = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  
  // URL del backend - Usar variable de entorno
  const getApiBase = () => {
    if (process.env.REACT_APP_BACKEND_URL) {
      return `${process.env.REACT_APP_BACKEND_URL}/api`;
    }
    return 'http://localhost:8001/api';
  };
  
  const API_BASE = getApiBase();

  // Imágenes de fondo con URLs confiables
  const backgroundImages = [
    '/images/blog/parrilla.svg', // Carne principal
    '/images/blog/parrilla.svg', // Parrilla
    '/images/blog/plancha.svg', // Plancha
    '/images/blog/guisados.svg'  // Guisados
  ];

  useEffect(() => {
    fetchArticle();
    fetchRelatedArticles();
  }, [slug]);

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

  const fetchArticle = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/admin/articles`);
      const data = await response.json();
      
      if (data.success && data.articles) {
        const foundArticle = data.articles.find(article => 
          createSlug(article.titulo) === slug
        );
        
        if (foundArticle) {
          setArticle(foundArticle);
          // Update page title
          document.title = `${foundArticle.titulo} | Nuestra Carne Blog`;
        } else {
          setError('Artículo no encontrado');
        }
      } else {
        throw new Error('Error al cargar el artículo');
      }
    } catch (error) {
      console.error('Error fetching article:', error);
      setError('Error al cargar el artículo');
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedArticles = async () => {
    try {
      const response = await fetch(`${API_BASE}/admin/articles`);
      const data = await response.json();
      
      if (data.success && data.articles) {
        // Get 3 random articles (excluding current one)
        const others = data.articles.filter(article => 
          createSlug(article.titulo) !== slug
        );
        const shuffled = others.sort(() => 0.5 - Math.random());
        setRelatedArticles(shuffled.slice(0, 3));
      }
    } catch (error) {
      console.error('Error fetching related articles:', error);
    }
  };

  // Función para procesar el contenido markdown a HTML
  const processContent = (content) => {
    if (!content) return 'Contenido del artículo próximamente disponible...';
    
    return content
      // Convertir negritas **texto** a <strong>texto</strong>
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Convertir párrafos (doble salto de línea) a <p>
      .split('\n\n')
      .map(paragraph => {
        if (paragraph.trim()) {
          // Si es un título (empieza con **)
          if (paragraph.trim().startsWith('**') && paragraph.trim().endsWith('**')) {
            const title = paragraph.replace(/\*\*(.*?)\*\*/g, '$1');
            return `<h3 class="text-xl font-bold text-primary-800 mt-8 mb-4">${title}</h3>`;
          }
          // Si es una lista (contiene •)
          else if (paragraph.includes('•')) {
            const items = paragraph.split('\n').filter(line => line.trim().startsWith('•'));
            const listItems = items.map(item => 
              `<li class="mb-2">${item.replace('•', '').trim().replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</li>`
            ).join('');
            return `<ul class="list-disc list-inside space-y-2 my-6 ml-4">${listItems}</ul>`;
          }
          // Párrafo normal
          else {
            return `<p class="mb-6 leading-relaxed">${paragraph.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</p>`;
          }
        }
        return '';
      })
      .join('');
  };

  const shareOnWhatsApp = () => {
    const url = window.location.href;
    const text = `🥩 ¡Mira este artículo increíble sobre carne premium! ${article?.titulo}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
  };

  const shareOnFacebook = () => {
    const url = window.location.href;
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
  };

  const shareOnTwitter = () => {
    const url = window.location.href;
    const text = `🥩 ${article?.titulo} | Nuestra Carne - Los mejores consejos sobre carne premium`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
  };

  // URL del patrón de fondo  
  const backgroundPattern = "data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E";
  const decorativePattern = "data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='white' fill-opacity='0.1'%3E%3Cpolygon points='50 0 60 40 100 50 60 60 50 100 40 60 0 50 40 40'/%3E%3C/g%3E%3C/svg%3E";

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 flex items-center justify-center relative">
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
            Preparando el artículo...
          </motion.p>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 flex items-center justify-center relative">
        <div 
          className="absolute inset-0"
          style={{ backgroundImage: `url('${backgroundPattern}')` }}
        ></div>
        
        <div className="text-center z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-12 border border-white/20"
          >
            <div className="text-8xl mb-6">🔍</div>
            <h1 className="text-4xl font-bold text-white mb-4">Artículo no encontrado</h1>
            <p className="text-white/70 mb-8 text-lg">{error || 'El artículo que buscas no existe.'}</p>
            <div className="space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/blog')}
                className="bg-amber-500 text-white px-8 py-3 rounded-xl hover:bg-amber-600 transition-colors font-semibold"
              >
                Ver todos los artículos
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/')}
                className="bg-white/10 backdrop-blur-sm text-white px-8 py-3 rounded-xl hover:bg-white/20 transition-colors font-semibold border border-white/30"
              >
                Ir al inicio
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 relative">
      {/* Fondo con patrón */}
      <div 
          className="absolute inset-0"
          style={{ backgroundImage: `url('${backgroundPattern}')` }}
        ></div>
      
      {/* Hero Header con imagen del artículo */}
      <div className="relative">
        <div 
          className="h-96 bg-cover bg-center relative"
          style={{ 
            backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.4)), url('${article.imagen || article.image || backgroundImages[0]}')`
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary-900/80 to-primary-900/60"></div>
          
          {/* Navigation */}
          <div className="relative z-10 max-w-5xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between mb-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/blog')}
                className="flex items-center text-white/90 hover:text-white transition-colors bg-black/20 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Volver al blog
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/')}
                className="text-white/90 hover:text-white transition-colors font-semibold bg-black/20 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20"
              >
                🥩 Nuestra Carne
              </motion.button>
            </div>
          </div>

          {/* Article Title */}
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="max-w-5xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="flex flex-wrap items-center gap-4 mb-6">
                  <span className="bg-amber-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                    🔥 Premium
                  </span>
                  <span className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold border border-white/30">
                    <ChefHat className="w-4 h-4 inline mr-2" />
                    Consejos Pro
                  </span>
                </div>
                
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
                  {article.titulo}
                </h1>
                
                <div className="flex flex-wrap items-center text-white/90 space-x-6">
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
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
                  </div>
                  
                  <div className="flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    <span className="font-semibold">Nuestra Carne</span>
                  </div>
                  
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 mr-2" />
                    <span>5 min lectura</span>
                  </div>
                  
                  <div className="flex items-center">
                    <Eye className="w-5 h-5 mr-2" />
                    <span>2.3k vistas</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      <article className="relative z-10 max-w-5xl mx-auto px-4 py-16">
        {/* Floating Action Bar */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="fixed right-8 top-1/2 transform -translate-y-1/2 bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-4 space-y-4 border border-gray-200 z-30 hidden lg:block"
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={shareOnWhatsApp}
            className="flex items-center justify-center w-12 h-12 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors shadow-lg"
            title="Compartir en WhatsApp"
          >
            <MessageCircle className="w-5 h-5" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={shareOnFacebook}
            className="flex items-center justify-center w-12 h-12 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-lg"
            title="Compartir en Facebook"
          >
            <Facebook className="w-5 h-5" />
          </motion.button>
          
          <div className="border-t border-gray-200 pt-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setLiked(!liked)}
              className={`flex items-center justify-center w-12 h-12 rounded-xl transition-colors shadow-lg ${
                liked ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-500'
              }`}
              title="Me gusta"
            >
              <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setBookmarked(!bookmarked)}
              className={`flex items-center justify-center w-12 h-12 rounded-xl transition-colors shadow-lg mt-2 ${
                bookmarked ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-amber-50 hover:text-amber-500'
              }`}
              title="Guardar"
            >
              <Bookmark className={`w-5 h-5 ${bookmarked ? 'fill-current' : ''}`} />
            </motion.button>
          </div>
        </motion.div>

        {/* Mobile Share Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:hidden mb-8"
        >
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-gray-200">
            <h3 className="text-lg font-bold text-primary-900 mb-4">Compartir este artículo:</h3>
            <div className="flex space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={shareOnWhatsApp}
                className="flex items-center space-x-2 bg-green-500 text-white px-4 py-3 rounded-xl hover:bg-green-600 transition-colors flex-1 justify-center shadow-lg"
              >
                <MessageCircle className="w-5 h-5" />
                <span className="font-semibold">WhatsApp</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={shareOnFacebook}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-3 rounded-xl hover:bg-blue-700 transition-colors flex-1 justify-center shadow-lg"
              >
                <Facebook className="w-5 h-5" />
                <span className="font-semibold">Facebook</span>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Article Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-12 mb-12 border border-gray-200"
        >
          <div 
            className="content-area max-w-none text-gray-700"
            style={{
              fontSize: '1.1rem',
              lineHeight: '1.8',
            }}
            dangerouslySetInnerHTML={{ 
              __html: processContent(article.contenido)
            }}
          />
        </motion.div>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mb-12"
          >
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-gray-200">
              <div className="flex items-center mb-8">
                <Award className="w-8 h-8 text-amber-500 mr-3" />
                <h2 className="text-3xl font-bold text-primary-900">Artículos relacionados</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedArticles.map((relatedArticle, index) => (
                  <motion.article
                    key={relatedArticle.id || index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
                    className="group bg-gray-50 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
                    onClick={() => navigate(`/blog/${createSlug(relatedArticle.titulo)}`)}
                    whileHover={{ y: -5 }}
                  >
                    <div className="aspect-video bg-gradient-to-br from-primary-100 to-primary-100 relative overflow-hidden">
                      {relatedArticle.imagen || relatedArticle.image ? (
                        <img
                          src={relatedArticle.imagen || relatedArticle.image}
                          alt={relatedArticle.titulo}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          onError={(e) => {
                            e.target.src = backgroundImages[index % backgroundImages.length];
                          }}
                        />
                      ) : (
                        <div 
                          className="w-full h-full bg-cover bg-center flex items-center justify-center"
                          style={{ 
                            backgroundImage: `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.1)), url('${backgroundImages[index % backgroundImages.length]}')`
                          }}
                        >
                          <span className="text-4xl">🥩</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="p-4">
                      <h3 className="font-bold text-primary-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
                        {relatedArticle.titulo}
                      </h3>
                      <p className="text-sm text-primary-600 line-clamp-2">
                        {relatedArticle.resumen || 
                         (relatedArticle.contenido ? relatedArticle.contenido.replace(/<[^>]*>/g, '').substring(0, 100) + '...' : '')}
                      </p>
                    </div>
                  </motion.article>
                ))}
              </div>
            </div>
          </motion.section>
        )}

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="bg-gradient-to-r from-primary-600 to-amber-600 rounded-3xl p-8 md:p-12 text-center shadow-2xl relative overflow-hidden"
        >
          <div 
            className="absolute inset-0 opacity-20"
            style={{ backgroundImage: `url('${decorativePattern}')` }}
          ></div>
          
          <div className="relative z-10">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="text-6xl mb-6"
            >
              🥩
            </motion.div>
            
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
              ¿Te gustó este artículo?
            </h3>
            <p className="text-white/95 mb-8 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
              Descubre nuestra selección premium de carnes 100% Nacional y haz realidad todas estas técnicas y recetas increíbles.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/')}
              className="bg-white text-primary-600 px-10 py-4 rounded-2xl hover:bg-gray-50 transition-colors font-bold text-lg md:text-xl shadow-2xl"
            >
              Ver productos premium 🔥
            </motion.button>
          </div>
        </motion.div>
      </article>
    </div>
  );
};

export default BlogPost;