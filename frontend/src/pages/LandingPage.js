import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Phone, 
  MapPin, 
  Clock, 
  Star, 
  Truck, 
  Award, 
  ChefHat, 
  Flame,
  MessageCircle,
  ShoppingCart,
  CheckCircle,
  Mail,
  User,
  LogIn,
  UserPlus,
  LogOut
} from 'lucide-react';

const LandingPage = () => {
  const [selectedCut, setSelectedCut] = useState(null);
  const [blogPosts, setBlogPosts] = useState([]);
  const [loadingBlog, setLoadingBlog] = useState(true);
  const [blogError, setBlogError] = useState(null);
  const { isAuthenticated, user, logout } = useAuth();

  // SEO dinámico - actualizar meta tags cuando carguen los artículos
  useEffect(() => {
    if (blogPosts.length > 0) {
      // Actualizar meta description con contenido dinámico del blog
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        const latestArticle = blogPosts[0];
        const dynamicDescription = `🥩 Carne 100% Nacional en Panamá. Ribeye, New York Strip, Filet Mignon y más. Blog: "${latestArticle.titulo}". Entrega a domicilio. ¡Ordena ya!`;
        metaDescription.setAttribute('content', dynamicDescription);
      }
      
      // Actualizar Open Graph title con último artículo
      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle && blogPosts[0]) {
        ogTitle.setAttribute('content', `Nuestra Carne - ${blogPosts[0].titulo} | Carne 100% Nacional`);
      }
    }
  }, [blogPosts]);
  const navigate = useNavigate();
  
  // URL del backend desde variable de entorno
  const API_BASE = process.env.REACT_APP_BACKEND_URL || 'https://nuestracarnepa.com/api';

  // Datos de cortes panameños - SOLO 11 SELECCIONADOS PARA EL LANDING
  const cortes = [
    {
      nombre: "Arrachera",
      descripcion: "Corte premium para parrilla, lleno de sabor",
      precio: "Consultar precio", 
      cocina: ["Parrilla", "Marinado", "Plancha"],
      imagen: "/images/productos/arrachera.jpg"
    },
    {
      nombre: "Bistec Picado",
      descripcion: "Ideal para plancha y frituras rápidas",
      precio: "$3.18/lb",
      cocina: ["Plancha", "Frito", "Parrilla"],
      imagen: "/images/productos/bistec-picado.jpg"
    },
    {
      nombre: "Bofe",
      descripcion: "Corte especial tradicional, muy nutritivo",
      precio: "$1.59/lb",
      cocina: ["Guisado", "Estofado", "Tradicional"],
      imagen: "/images/productos/bofe.jpg"
    },
    {
      nombre: "Carne de guisar",
      descripcion: "Perfecta para todos tus guisos favoritos",
      precio: "$3.79/lb",
      cocina: ["Guisado", "Estofado", "Sancocho"],
      imagen: "/images/productos/carne-guisar.jpg"
    },
    {
      nombre: "Carne de hamburguesa- 24 onzas",
      descripcion: "Mezcla especial para hamburguesas gourmet",
      precio: "$3.86/lb",
      cocina: ["Hamburguesas", "Parrilla", "Plancha"],
      imagen: "/images/productos/carne-hamburguesa.jpg"
    },
    {
      nombre: "Carne molida especial",
      descripcion: "Molida premium para múltiples preparaciones",
      precio: "$3.62/lb",
      cocina: ["Albóndigas", "Tacos", "Rellenos"],
      imagen: "/images/productos/carne-molida.jpg"
    },
    {
      nombre: "Costillón entero",
      descripcion: "Ideal para parrilladas familiares",
      precio: "$3.29/lb",
      cocina: ["Parrilla", "BBQ", "Asado lento"],
      imagen: "/images/productos/costilla-res.jpg"
    },
    {
      nombre: "Entraña",
      descripcion: "El rey de la parrilla, jugoso y sabroso",
      precio: "$4.26/lb",
      cocina: ["Parrilla", "Plancha", "Marinado"],
      imagen: "/images/productos/entrana.jpg"
    },
    {
      nombre: "Punta Palomilla entera (picanha)",
      descripcion: "Corte brasileño premium, muy jugoso",
      precio: "$4.79/lb",
      cocina: ["Parrilla", "Asado", "Rodizio"],
      imagen: "/images/productos/picanha.jpg"
    },
    {
      nombre: "Rib- eye entero",
      descripcion: "Corte premium americano, máximo sabor",
      precio: "$4.20/lb",
      cocina: ["Parrilla", "Plancha", "Horno"],
      imagen: "/images/productos/rib-eye.jpg"
    },
    {
      nombre: "Trip tip (punta Rincón)",
      descripcion: "Corte californiano, tierno y versátil",
      precio: "$4.35/lb",
      cocina: ["Parrilla", "Plancha", "Asado"],
      imagen: "/images/productos/tip-trip.jpg"
    }
  ];

  const testimonios = [
    {
      nombre: "María González",
      texto: "La mejor carne de Panamá. Siempre fresca y el delivery súper rápido.",
      rating: 5,
      ubicacion: "San Francisco"
    },
    {
      nombre: "Carlos Rodríguez", 
      texto: "Los cortes son espectaculares. Mi familia no compra carne en otro lugar.",
      rating: 5,
      ubicacion: "Casco Viejo"
    },
    {
      nombre: "Ana Martínez",
      texto: "Calidad premium a precio justo. Los recomiendo 100%.",
      rating: 5,
      ubicacion: "Costa del Este"
    }
  ];

  const handleWhatsAppOrder = (corte = null) => {
    const message = corte 
      ? `¡Hola! Quiero ordenar ${corte.nombre} (${corte.precio}). ¿Tienen disponible?`
      : "¡Hola! Quiero hacer un pedido de carne 100% Nacional. ¿Cuáles son los cortes disponibles?";
    
    const whatsappUrl = `https://wa.me/50769172690?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleOrderNow = (corte = null) => {
    if (corte) {
      // Navegamos al formulario con el corte pre-seleccionado
      navigate('/haz-tu-pedido', { state: { selectedCut: corte } });
    } else {
      // Navegamos al formulario sin preselección
      navigate('/haz-tu-pedido');
    }
  };

  // Cargar artículos del blog desde el backend
  useEffect(() => {
    const fetchBlogArticles = async () => {
      try {
        setLoadingBlog(true);
        setBlogError(null);
        
        const response = await fetch(`${API_BASE}/api/admin/articles`);
        const data = await response.json();
        
        if (data.success && data.articles) {
          // Limitamos a los primeros 3 artículos para el landing page
          setBlogPosts(data.articles.slice(0, 3));
        } else {
          throw new Error('Error al cargar artículos');
        }
      } catch (error) {
        console.error('Error fetching blog articles:', error);
        setBlogError('Error al cargar los artículos del blog');
        // Fallback a datos estáticos si falla la API
        setBlogPosts([
          {
            titulo: "5 Secretos para la Parrilla Perfecta",
            resumen: "Aprende los trucos de los expertos para conseguir el punto exacto...",
            imagen: "/images/blog/secretos-parrilla.jpg",
            fecha: "15 Ene 2024"
          },
          {
            titulo: "Guía Completa: Cómo Elegir el Corte Perfecto", 
            resumen: "Todo lo que necesitas saber para seleccionar la carne ideal...",
            imagen: "/images/blog/guia-cortes.jpg",
            fecha: "12 Ene 2024"
          },
          {
            titulo: "Recetas Tradicionales Panameñas con Carne 100% Nacional",
            resumen: "Descubre cómo preparar tus platos favoritos con nuestros cortes...",
            imagen: "/images/blog/recetas-tradicionales.jpg",
            fecha: "10 Ene 2024"
          }
        ]);
      } finally {
        setLoadingBlog(false);
      }
    };

    fetchBlogArticles();
  }, [API_BASE]);

  return (
    <div className="min-h-screen bg-white">
      {/* Top Navigation Bar */}
      <div className="bg-white/95 backdrop-blur-md border-b border-primary-200 sticky top-0 z-40">
        <div className="container-custom py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <img 
                  src="/images/logo/nuestra-carne-logo.png"
                  alt="Nuestra Carne Logo"
                  className="h-16 w-auto"
                  onError={(e) => {
                    // Fallback al icono NC si no encuentra la imagen
                    e.target.style.display = 'none';
                    e.target.nextElementSibling.style.display = 'flex';
                  }}
                />
                <div className="w-16 h-16 bg-primary-500 rounded-lg flex items-center justify-center" style={{display: 'none'}}>
                  <span className="text-white font-bold text-xl">NC</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <span className="text-primary-700">Hola, {user?.nombre}</span>
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="flex items-center space-x-2 text-primary-600 hover:text-primary-800 transition-colors"
                  >
                    <User size={16} />
                    <span>Mi Dashboard</span>
                  </button>
                  <button
                    onClick={logout}
                    className="flex items-center space-x-2 text-primary-600 hover:text-primary-800 transition-colors"
                  >
                    <LogOut size={16} />
                    <span>Salir</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => navigate('/auth')}
                    className="flex items-center space-x-2 text-primary-600 hover:text-primary-800 transition-colors"
                  >
                    <LogIn size={16} />
                    <span>Iniciar Sesión</span>
                  </button>
                  <button
                    onClick={() => navigate('/auth')}
                    className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors flex items-center space-x-2"
                  >
                    <UserPlus size={16} />
                    <span>Registrarse</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* WhatsApp Float Button */}
      <motion.button
        onClick={() => handleWhatsAppOrder()}
        className="whatsapp-float"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <MessageCircle size={24} />
        <span className="ml-2 font-semibold">¡Ordena Ya!</span>
      </motion.button>

      {/* Hero Section */}
      <section className="hero-bg flex items-center justify-center text-white relative">
        <div className="container-custom text-center z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <div className="delivery-badge mb-6">
              <Truck size={20} />
              <span>DELIVERY GRATIS en Ciudad de Panamá (pedidos +$50)</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-bold mb-6 leading-tight">
              DEL PRODUCTOR<br />
              <span className="text-accent-300">A TU MESA</span>
            </h1>
            
            <p className="text-xl md:text-2xl mb-8 text-gray-100 max-w-2xl mx-auto">
              🥩 <strong>Carne 100% Nacional Premium</strong><br/>
              Seleccionada con cuidado por expertos carniceros
            </p>

            <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-8">
              <motion.button
                onClick={() => handleOrderNow()}
                className="bg-green-600 hover:bg-green-700 text-white text-lg px-10 py-4 flex items-center gap-3 rounded-lg font-bold transition-all duration-300 shadow-lg hover:shadow-xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ShoppingCart size={24} />
                ¡HAZ TU PEDIDO YA! 🛒
              </motion.button>
              
              <motion.button
                onClick={() => handleWhatsAppOrder()}
                className="btn-outline text-lg px-8 py-4 flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
              >
                <MessageCircle size={20} />
                WhatsApp: 6917-2609
              </motion.button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <div className="glass-effect rounded-lg p-4">
                <Award className="text-accent-300 mx-auto mb-2" size={32} />
                <h3 className="font-semibold">100% Nacional</h3>
                <p className="text-sm">Carne premium panameña</p>
              </div>
              <div className="glass-effect rounded-lg p-4">
                <ChefHat className="text-accent-300 mx-auto mb-2" size={32} />
                <h3 className="font-semibold">Expertos Carniceros</h3>
                <p className="text-sm">Expertos carniceros</p>
              </div>
              <div className="glass-effect rounded-lg p-4">
                <Truck className="text-accent-300 mx-auto mb-2" size={32} />
                <h3 className="font-semibold">Delivery Gratis</h3>
                <p className="text-sm">En toda Ciudad de Panamá (pedidos +$50)</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Conoce Tus Cortes Section */}
      <section id="cortes" className="section-padding bg-primary-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-6xl font-bold text-primary-900 mb-4">
              🥩 Conoce Tus <span className="text-gradient">CORTES</span>
            </h2>
            <p className="text-xl text-primary-700 max-w-3xl mx-auto">
              20+ cortes premium de carne 100% Nacional panameña. Cada uno seleccionado y preparado 
              por nuestros expertos carniceros para garantizar la máxima calidad y sabor.
            </p>
          </motion.div>

          <div className="cuts-grid">
            {cortes.map((corte, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="cut-card card-rustic cursor-pointer"
                onClick={() => setSelectedCut(corte)}
              >
                <div className="aspect-video bg-gray-200 rounded-lg mb-4 overflow-hidden">
                  <img 
                    src={corte.imagen} 
                    alt={corte.nombre}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                  />
                </div>
                
                <h3 className="text-xl font-bold text-primary-900 mb-2">{corte.nombre}</h3>
                <p className="text-primary-700 mb-3">{corte.descripcion}</p>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  {corte.cocina.map((metodo, idx) => (
                    <span key={idx} className="cooking-method">
                      {metodo}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="price-badge">{corte.precio}</span>
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOrderNow(corte);
                    }}
                    className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors flex items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ShoppingCart size={16} />
                    Ordenar
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div 
            className="text-center mt-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <button
              onClick={() => handleOrderNow()}
              className="btn-primary text-xl px-12 py-4 animate-pulse-glow"
            >
              🔥 ¡HAZ TU PEDIDO COMPLETO! 🔥
            </button>
          </motion.div>
        </div>
      </section>

      {/* Por Qué Elegirnos Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-6xl font-bold text-primary-900 mb-4">
              ¿Por Qué Elegir <span className="text-gradient">NUESTRA CARNE?</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <div className="bg-primary-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                <Award className="text-primary-500" size={40} />
              </div>
              <h3 className="text-xl font-bold text-primary-900 mb-3">100% Nacional Panameña</h3>
              <p className="text-primary-700">
                Seleccionamos únicamente ganado criado localmente con los más altos estándares de calidad.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-center"
            >
              <div className="bg-primary-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                <ChefHat className="text-primary-500" size={40} />
              </div>
              <h3 className="text-xl font-bold text-primary-900 mb-3">Carniceros Expertos</h3>
              <p className="text-primary-700">
                Más de 20 años de experiencia en el arte de seleccionar y preparar los mejores cortes.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-center"
            >
              <div className="bg-primary-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="text-primary-500" size={40} />
              </div>
              <h3 className="text-xl font-bold text-primary-900 mb-3">Sin Hormonas Innecesarias</h3>
              <p className="text-primary-700">
                Garantizamos carne natural, libre de hormonas y antibióticos innecesarios para tu tranquilidad.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-center"
            >
              <div className="bg-primary-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                <Flame className="text-primary-500" size={40} />
              </div>
              <h3 className="text-xl font-bold text-primary-900 mb-3">Frescura Garantizada</h3>
              <p className="text-primary-700">
                Trabajamos diariamente para asegurar que recibas la carne más fresca del mercado.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Tipos de Cocina Section */}
      <section className="section-padding bg-primary-100">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-6xl font-bold text-primary-900 mb-4">
              🔥 Tipos de <span className="text-gradient">COCINA</span>
            </h2>
            <p className="text-xl text-primary-700 max-w-3xl mx-auto">
              Cada corte tiene su método perfecto. Te ayudamos a sacar el máximo sabor de tu carne 100% Nacional.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="card-rustic text-center"
            >
              <div className="aspect-video bg-gray-200 rounded-lg mb-6 overflow-hidden">
                <img 
                  src="/images/blog/parrilla.svg"
                  alt="Parrilla - Carne Premium"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-2xl font-bold text-primary-900 mb-4">🔥 PARRILLA</h3>
              <div className="space-y-2 text-left">
                <p className="text-primary-700"><strong>Perfectos para parrilla:</strong></p>
                <ul className="text-primary-600 space-y-1">
                  <li>• Filet Mignon - Término medio</li>
                  <li>• Costilla - Cocción lenta</li>
                  <li>• Entraña - Fuego alto</li>
                  <li>• Chuleta - Con hueso</li>
                  <li>• Lomo - Término medio raro</li>
                </ul>
              </div>
              <button
                onClick={() => handleOrderNow()}
                className="btn-primary mt-6 w-full"
              >
                Hacer Pedido de Parrilla
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="card-rustic text-center"
            >
              <div className="aspect-video bg-gray-200 rounded-lg mb-6 overflow-hidden">
                <img 
                  src="/images/blog/plancha.svg"
                  alt="Plancha - Carne Pan Seared"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-2xl font-bold text-primary-900 mb-4">🍳 PLANCHA</h3>
              <div className="space-y-2 text-left">
                <p className="text-primary-700"><strong>Ideales para plancha:</strong></p>
                <ul className="text-primary-600 space-y-1">
                  <li>• Bistec - Rápido y jugoso</li>
                  <li>• Palomilla - Tierno</li>
                  <li>• Medallones - Premium</li>
                  <li>• Solomo - Magro</li>
                  <li>• Falda - Marinada</li>
                </ul>
              </div>
              <button
                onClick={() => handleOrderNow()}
                className="btn-primary mt-6 w-full"
              >
                Hacer Pedido de Plancha
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="card-rustic text-center"
            >
              <div className="aspect-video bg-gray-200 rounded-lg mb-6 overflow-hidden">
                <img 
                  src="/images/blog/guisados.svg"
                  alt="Guisados - Beef Stew"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-2xl font-bold text-primary-900 mb-4">🍲 GUISADOS</h3>
              <div className="space-y-2 text-left">
                <p className="text-primary-700"><strong>Perfectos para guisar:</strong></p>
                <ul className="text-primary-600 space-y-1">
                  <li>• Falda - Estofados</li>
                  <li>• Pecho - Cocción lenta</li>
                  <li>• Rabo - Caldos</li>
                  <li>• Brisket - Guisos</li>
                  <li>• Carne para guisar - Sancocho</li>
                </ul>
              </div>
              <button
                onClick={() => handleOrderNow()}
                className="btn-primary mt-6 w-full"
              >
                Hacer Pedido para Guisar
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Servicios Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-6xl font-bold text-primary-900 mb-4">
              🚚 Nuestros <span className="text-gradient">SERVICIOS</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="card-rustic text-center"
            >
              <Truck className="text-primary-500 mx-auto mb-4" size={48} />
              <h3 className="text-2xl font-bold text-primary-900 mb-4">Delivery GRATIS</h3>
              <p className="text-primary-700 mb-4">
                Entrega gratuita en toda Ciudad de Panamá. Pedidos mínimos de $50.
              </p>
              <div className="text-primary-600 text-sm space-y-1 mb-6">
                <p><Clock size={16} className="inline mr-2" />Lun-Vie: 8:00 AM - 5:00 PM</p>
                <p><Clock size={16} className="inline mr-2" />Sáb: 9:00 AM - 12:00 PM</p>
              </div>
              <button
                onClick={() => handleOrderNow()}
                className="btn-primary w-full"
              >
                ¡Hacer Pedido con Delivery!
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="card-rustic text-center"
            >
              <MapPin className="text-primary-500 mx-auto mb-4" size={48} />
              <h3 className="text-2xl font-bold text-primary-900 mb-4">Recogida en Tienda</h3>
              <p className="text-primary-700 mb-4">
                Visítanos en nuestra tienda. ¡Descuentos especiales para recoger en tienda!
              </p>
              <div className="text-primary-600 text-sm space-y-1 mb-6">
                <p><MapPin size={16} className="inline mr-2" />Coopugan - Llanos de Curundú</p>
                <p className="text-xs">Provincia de Panamá</p>
              </div>
              <button
                onClick={() => handleOrderNow()}
                className="btn-outline w-full"
              >
                Hacer Pedido Recogida
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="card-rustic text-center"
            >
              <ChefHat className="text-primary-500 mx-auto mb-4" size={48} />
              <h3 className="text-2xl font-bold text-primary-900 mb-4">Cortes Personalizados</h3>
              <p className="text-primary-700 mb-4">
                Nuestros expertos preparan tu carne exactamente como la necesitas.
              </p>
              <div className="text-primary-600 text-sm space-y-1 mb-6">
                <p>• Grosor personalizado</p>
                <p>• Porciones específicas</p>
                <p>• Marinados especiales</p>
              </div>
              <button
                onClick={() => handleOrderNow()}
                className="btn-secondary w-full"
              >
                Solicitar Corte Personalizado
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonios Section */}
      <section className="section-padding bg-primary-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-6xl font-bold text-primary-900 mb-4">
              ⭐ Lo Que Dicen <span className="text-gradient">NUESTROS CLIENTES</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonios.map((testimonio, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="testimonial-card card-rustic"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonio.rating)].map((_, i) => (
                    <Star key={i} className="text-accent-500 fill-current" size={20} />
                  ))}
                </div>
                <p className="text-primary-700 mb-4 italic">"{testimonio.texto}"</p>
                <div>
                  <p className="font-semibold text-primary-900">{testimonio.nombre}</p>
                  <p className="text-sm text-primary-600">{testimonio.ubicacion}</p>
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* Ver todos los artículos */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mt-12"
          >
            <button
              onClick={() => navigate('/blog')}
              className="bg-primary-500 text-white px-8 py-4 rounded-lg hover:bg-primary-600 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
            >
              Ver todos los artículos →
            </button>
          </motion.div>
        </div>
      </section>

      {/* Blog Preview Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-6xl font-bold text-primary-900 mb-4">
              📚 <span className="text-gradient">APRENDE</span> con Nosotros
            </h2>
            <p className="text-xl text-primary-700">
              Consejos, recetas y secretos de nuestros expertos carniceros
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {loadingBlog ? (
              // Estado de carga
              [1, 2, 3].map((index) => (
                <div key={index} className="blog-card animate-pulse">
                  <div className="aspect-video bg-gray-300"></div>
                  <div className="p-6">
                    <div className="h-4 bg-gray-300 rounded mb-2 w-20"></div>
                    <div className="h-6 bg-gray-300 rounded mb-3"></div>
                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  </div>
                </div>
              ))
            ) : blogError ? (
              // Estado de error
              <div className="col-span-full text-center py-8">
                <p className="text-primary-600 mb-4">⚠️ {blogError}</p>
                <p className="text-sm text-primary-500">Mostrando contenido de respaldo</p>
              </div>
            ) : null}
            
            {!loadingBlog && blogPosts.map((post, index) => (
              <motion.div
                key={post.id || index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="blog-card"
              >
                <div className="aspect-video bg-gray-200 overflow-hidden">
                  <img 
                    src={post.imagen || post.image || "/images/blog/default.jpg"}
                    alt={post.titulo}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "/images/blog/default.jpg";
                    }}
                  />
                </div>
                <div className="p-6">
                  <p className="text-sm text-primary-500 font-semibold mb-2">
                    {new Date(post.fecha || post.published_at || Date.now()).toLocaleDateString('es-ES', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </p>
                  <h3 className="text-xl font-bold text-primary-900 mb-3">{post.titulo}</h3>
                  <p className="text-primary-700 mb-4">
                    {post.resumen || post.contenido?.substring(0, 150) + '...' || 'Contenido disponible próximamente...'}
                  </p>
                  <button 
                    onClick={() => {
                      const slug = post.titulo
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
                      navigate(`/blog/${slug}`);
                    }}
                    className="text-primary-500 font-semibold hover:text-primary-600 transition-colors"
                  >
                    Leer más →
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final Section */}
      <section className="cta-section section-padding text-white relative z-10">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              🔥 ¡NO ESPERES MÁS! 🔥
            </h2>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              La mejor carne 100% Nacional panameña te está esperando.<br/>
              <strong>Delivery GRATIS en Ciudad de Panamá (pedidos +$50)</strong>
            </p>
            
            <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
              <motion.button
                onClick={() => handleOrderNow()}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-12 rounded-lg text-xl flex items-center gap-3 shadow-xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ShoppingCart size={28} />
                HACER PEDIDO COMPLETO
              </motion.button>
              
              <motion.button
                onClick={() => handleWhatsAppOrder()}
                className="bg-white/20 backdrop-blur-md hover:bg-white/30 text-white font-bold py-4 px-12 rounded-lg text-xl flex items-center gap-3"
                whileHover={{ scale: 1.05 }}
              >
                <MessageCircle size={28} />
                WhatsApp: 6917-2609
              </motion.button>
            </div>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="glass-effect rounded-lg p-6">
                <CheckCircle className="text-green-300 mx-auto mb-3" size={32} />
                <h4 className="font-bold mb-2">Calidad Garantizada</h4>
                <p className="text-sm">100% satisfacción asegurada</p>
              </div>
              <div className="glass-effect rounded-lg p-6">
                <Truck className="text-green-300 mx-auto mb-3" size={32} />
                <h4 className="font-bold mb-2">Entrega Rápida</h4>
                <p className="text-sm">Su pedido en menos de 2 días. Entrega gratis dentro del área metropolitana para pedidos de mínimo USD $50</p>
              </div>
              <div className="glass-effect rounded-lg p-6">
                <Star className="text-green-300 mx-auto mb-3" size={32} />
                <h4 className="font-bold mb-2">+20 Años</h4>
                <p className="text-sm">De experiencia en carnicería premium</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary-900 text-white section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4 text-primary-300">Nuestra Carne</h3>
              <p className="text-primary-300 mb-4">
                Del productor a tu mesa. Carne 100% Nacional panameña premium con más de 20 años de experiencia.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => handleWhatsAppOrder()}
                  className="bg-green-500 p-3 rounded-full hover:bg-green-600 transition-colors"
                >
                  <MessageCircle size={20} />
                </button>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4 text-primary-300">Contacto</h4>
              <div className="space-y-2 text-primary-300">
                <p className="flex items-center gap-2">
                  <Phone size={16} />
                  +507 6917-2690
                </p>
                <p className="flex items-center gap-2">
                  <MapPin size={16} />
                  Coopugan - Llanos de Curundú
                </p>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4 text-primary-300">Síguenos</h4>
              <div className="space-y-2 text-primary-300">
                <p className="flex items-center gap-2">
                  <span className="text-green-400">@</span>
                  @nuestracarnepa
                </p>
                <p className="flex items-center gap-2">
                  <Mail size={16} />
                  info@nuestracarnepa.com
                </p>
                <p className="text-sm text-primary-300 font-semibold">
                  ¡Escríbenos para pedidos especiales!
                </p>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4 text-primary-300">Horarios</h4>
              <div className="space-y-2 text-primary-300">
                <p><strong>Delivery Ciudad de Panamá:</strong></p>
                <p>Lun-Vie: 8:00 AM - 5:00 PM</p>
                <p>Sáb: 9:00 AM - 12:00 PM</p>
                <p className="text-primary-300 font-semibold">¡Delivery GRATIS! (pedidos +$50)</p>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4 text-primary-300">Métodos de Pago</h4>
              <div className="space-y-2 text-primary-300">
                <p>• Visa</p>
                <p>• Mastercard</p>
                <p>• ACH</p>
                <p>• Yappy</p>
                <p className="text-sm">Aceptamos múltiples formas de pago</p>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4 text-primary-300">Servicios</h4>
              <ul className="space-y-2 text-primary-300">
                <li>• Delivery gratis en Ciudad de Panamá (pedidos +$50)</li>
                <li>• Recogida en tienda</li>
                <li>• Cortes personalizados</li>
                <li>• Asesoría de cocina</li>
                <li>• Carne premium 100% Nacional</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-primary-700 mt-12 pt-8 text-center">
            <p className="text-primary-400">
              © 2024 Nuestra Carne. Todos los derechos reservados. | 
              <strong className="text-primary-300"> ¡La mejor carne 100% Nacional de Panamá!</strong>
            </p>
          </div>
        </div>
      </footer>

      {/* Modal para cortes seleccionados */}
      {selectedCut && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedCut(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-xl p-8 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl font-bold text-primary-900 mb-4">{selectedCut.nombre}</h3>
            <div className="aspect-video bg-gray-200 rounded-lg mb-4 overflow-hidden">
              <img 
                src={selectedCut.imagen} 
                alt={selectedCut.nombre}
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-primary-700 mb-4">{selectedCut.descripcion}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedCut.cocina.map((metodo, idx) => (
                <span key={idx} className="cooking-method">
                  {metodo}
                </span>
              ))}
            </div>
            <div className="flex items-center justify-between mb-6">
              <span className="price-badge text-lg">{selectedCut.precio}</span>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => handleOrderNow(selectedCut)}
                className="btn-primary flex-1 flex items-center justify-center gap-2"
              >
                <ShoppingCart size={20} />
                Hacer Pedido
              </button>
              <button
                onClick={() => setSelectedCut(null)}
                className="btn-outline px-6"
              >
                Cerrar
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default LandingPage;