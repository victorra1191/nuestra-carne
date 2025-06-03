import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, User, Share2, Facebook, Twitter, MessageCircle } from 'lucide-react';

const BlogPost = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  
  // Detectar automáticamente la URL del backend
  const getBackendURL = () => {
    // En desarrollo local
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'http://localhost:8080/api';
    }
    // En producción
    return 'https://nuestracarnepa.com/api';
  };
  
  const API_BASE = process.env.REACT_APP_BACKEND_URL || getBackendURL();

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
      const response = await fetch(`${API_BASE}/admin/blog/articles`);
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
      const response = await fetch(`${API_BASE}/admin/blog/articles`);
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

  const shareOnWhatsApp = () => {
    const url = window.location.href;
    const text = `¡Mira este artículo sobre carne premium! ${article?.titulo}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
  };

  const shareOnFacebook = () => {
    const url = window.location.href;
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
  };

  const shareOnTwitter = () => {
    const url = window.location.href;
    const text = `${article?.titulo} | Nuestra Carne`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rustic-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-rustic-600">Cargando artículo...</p>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rustic-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-rustic-900 mb-4">Artículo no encontrado</h1>
          <p className="text-rustic-600 mb-6">{error || 'El artículo que buscas no existe.'}</p>
          <button
            onClick={() => navigate('/blog')}
            className="bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition-colors"
          >
            Ver todos los artículos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rustic-50 to-amber-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-rustic-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/blog')}
              className="flex items-center text-rustic-600 hover:text-primary-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Volver al blog
            </button>
            
            <button
              onClick={() => navigate('/')}
              className="text-rustic-600 hover:text-primary-600 transition-colors font-semibold"
            >
              🥩 Nuestra Carne
            </button>
          </div>
        </div>
      </div>

      <article className="max-w-4xl mx-auto px-4 py-12">
        {/* Article Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-rustic-900 mb-6 leading-tight">
            {article.titulo}
          </h1>
          
          <div className="flex flex-wrap items-center text-rustic-600 mb-6">
            <div className="flex items-center mr-6 mb-2">
              <Calendar className="w-5 h-5 mr-2" />
              <span>
                {new Date(article.fecha || article.published_at || Date.now()).toLocaleDateString('es-ES', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </span>
            </div>
            
            <div className="flex items-center mr-6 mb-2">
              <User className="w-5 h-5 mr-2" />
              <span>Nuestra Carne</span>
            </div>
            
            <div className="flex items-center mb-2">
              <Clock className="w-5 h-5 mr-2" />
              <span>5 min lectura</span>
            </div>
          </div>

          {/* Share Buttons */}
          <div className="flex items-center space-x-4 mb-8">
            <span className="text-rustic-600 font-semibold">Compartir:</span>
            <button
              onClick={shareOnWhatsApp}
              className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp</span>
            </button>
            <button
              onClick={shareOnFacebook}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Facebook className="w-4 h-4" />
              <span>Facebook</span>
            </button>
            <button
              onClick={shareOnTwitter}
              className="flex items-center space-x-2 bg-blue-400 text-white px-4 py-2 rounded-lg hover:bg-blue-500 transition-colors"
            >
              <Twitter className="w-4 h-4" />
              <span>Twitter</span>
            </button>
          </div>
        </motion.header>

        {/* Featured Image */}
        {(article.imagen || article.image) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <img
              src={article.imagen || article.image}
              alt={article.titulo}
              className="w-full h-64 md:h-96 object-cover rounded-xl shadow-lg"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </motion.div>
        )}

        {/* Article Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="prose prose-lg max-w-none mb-12"
        >
          <div 
            className="text-rustic-800 leading-relaxed"
            dangerouslySetInnerHTML={{ 
              __html: article.contenido || 'Contenido del artículo próximamente disponible...' 
            }}
          />
        </motion.div>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="border-t border-rustic-200 pt-12"
          >
            <h2 className="text-2xl font-bold text-rustic-900 mb-8">Artículos relacionados</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((relatedArticle, index) => (
                <article
                  key={relatedArticle.id || index}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => navigate(`/blog/${createSlug(relatedArticle.titulo)}`)}
                >
                  <div className="aspect-video bg-gradient-to-br from-rustic-100 to-primary-100 relative">
                    {relatedArticle.imagen || relatedArticle.image ? (
                      <img
                        src={relatedArticle.imagen || relatedArticle.image}
                        alt={relatedArticle.titulo}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-4xl">🥩</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-bold text-rustic-900 mb-2 line-clamp-2">
                      {relatedArticle.titulo}
                    </h3>
                    <p className="text-sm text-rustic-600 line-clamp-2">
                      {relatedArticle.resumen || 
                       (relatedArticle.contenido ? relatedArticle.contenido.replace(/<[^>]*>/g, '').substring(0, 100) + '...' : '')}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </motion.section>
        )}

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="bg-primary-50 border border-primary-200 rounded-xl p-8 mt-12 text-center"
        >
          <h3 className="text-2xl font-bold text-rustic-900 mb-4">
            ¿Te gustó este artículo?
          </h3>
          <p className="text-rustic-700 mb-6">
            Descubre nuestra selección premium de carnes Angus y haz tu pedido hoy mismo.
          </p>
          <button
            onClick={() => navigate('/')}
            className="bg-primary-500 text-white px-8 py-3 rounded-lg hover:bg-primary-600 transition-colors font-semibold"
          >
            Ver productos 🥩
          </button>
        </motion.div>
      </article>
    </div>
  );
};

export default BlogPost;