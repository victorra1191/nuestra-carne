import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
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
  Mail
} from 'lucide-react';

const LandingPage = () => {
  const [selectedCut, setSelectedCut] = useState(null);
  const [blogPosts, setBlogPosts] = useState([]);
  const [loadingBlog, setLoadingBlog] = useState(true);
  const navigate = useNavigate();
  
  const API_BASE = process.env.REACT_APP_BACKEND_URL;

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
      imagen: "/images/productos/entraña.jpg"
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

  const blogPosts = [
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
      titulo: "Recetas Tradicionales Panameñas con Carne Angus",
      resumen: "Descubre cómo preparar tus platos favoritos con nuestros cortes...",
      imagen: "/images/blog/recetas-tradicionales.jpg",
      fecha: "10 Ene 2024"
    }
  ];

  const handleWhatsAppOrder = (corte = null) => {
    const message = corte 
      ? `¡Hola! Quiero ordenar ${corte.nombre} (${corte.precio}). ¿Tienen disponible?`
      : "¡Hola! Quiero hacer un pedido de carne Angus. ¿Cuáles son los cortes disponibles?";
    
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

  return (
    <div className="min-h-screen bg-white">
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
            {/* Logo NC Blanco */}
            <div className="mb-8">
              <div className="w-32 h-32 mx-auto bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border-2 border-white/30">
                <div className="text-center">
                  <p className="text-2xl font-bold mb-1 text-white">NC</p>
                  <p className="text-xs opacity-75 text-white">Nuestra Carne</p>
                </div>
              </div>
            </div>
            
            <div className="delivery-badge mb-6">
              <Truck size={20} />
              <span>DELIVERY GRATIS en Ciudad de Panamá</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-bold mb-6 leading-tight">
              DEL PRODUCTOR<br />
              <span className="text-accent-300">A TU MESA</span>
            </h1>
            
            <p className="text-xl md:text-2xl mb-8 text-gray-100 max-w-2xl mx-auto">
              🥩 <strong>Carne Angus Panameña Premium</strong><br/>
              Seleccionada con cuidado por expertos carniceros con +20 años de experiencia
            </p>

            <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-8">
              <motion.button
                onClick={() => handleOrderNow()}
                className="btn-primary text-lg px-10 py-4 flex items-center gap-3"
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
                <h3 className="font-semibold">100% Angus</h3>
                <p className="text-sm">Carne premium panameña</p>
              </div>
              <div className="glass-effect rounded-lg p-4">
                <ChefHat className="text-accent-300 mx-auto mb-2" size={32} />
                <h3 className="font-semibold">Expertos Carniceros</h3>
                <p className="text-sm">+20 años de experiencia</p>
              </div>
              <div className="glass-effect rounded-lg p-4">
                <Truck className="text-accent-300 mx-auto mb-2" size={32} />
                <h3 className="font-semibold">Delivery Gratis</h3>
                <p className="text-sm">En toda Ciudad de Panamá</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Conoce Tus Cortes Section */}
      <section id="cortes" className="section-padding bg-rustic-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-6xl font-bold text-rustic-900 mb-4">
              🥩 Conoce Tus <span className="text-gradient">CORTES</span>
            </h2>
            <p className="text-xl text-rustic-700 max-w-3xl mx-auto">
              20+ cortes premium de carne Angus panameña. Cada uno seleccionado y preparado 
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
                
                <h3 className="text-xl font-bold text-rustic-900 mb-2">{corte.nombre}</h3>
                <p className="text-rustic-700 mb-3">{corte.descripcion}</p>
                
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
            <h2 className="text-4xl md:text-6xl font-bold text-rustic-900 mb-4">
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
              <h3 className="text-xl font-bold text-rustic-900 mb-3">100% Angus Panameña</h3>
              <p className="text-rustic-700">
                Seleccionamos únicamente ganado Angus criado localmente con los más altos estándares de calidad.
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
              <h3 className="text-xl font-bold text-rustic-900 mb-3">Carniceros Expertos</h3>
              <p className="text-rustic-700">
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
              <h3 className="text-xl font-bold text-rustic-900 mb-3">Sin Hormonas Innecesarias</h3>
              <p className="text-rustic-700">
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
              <h3 className="text-xl font-bold text-rustic-900 mb-3">Frescura Garantizada</h3>
              <p className="text-rustic-700">
                Trabajamos diariamente para asegurar que recibas la carne más fresca del mercado.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Tipos de Cocina Section */}
      <section className="section-padding bg-rustic-100">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-6xl font-bold text-rustic-900 mb-4">
              🔥 Tipos de <span className="text-gradient">COCINA</span>
            </h2>
            <p className="text-xl text-rustic-700 max-w-3xl mx-auto">
              Cada corte tiene su método perfecto. Te ayudamos a sacar el máximo sabor de tu carne Angus.
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
                  src="/images/heroes/hero-parrilla.jpg"
                  alt="Parrilla"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-2xl font-bold text-rustic-900 mb-4">🔥 PARRILLA</h3>
              <div className="space-y-2 text-left">
                <p className="text-rustic-700"><strong>Perfectos para parrilla:</strong></p>
                <ul className="text-rustic-600 space-y-1">
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
                  src="/images/heroes/hero-plancha.jpg"
                  alt="Plancha"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-2xl font-bold text-rustic-900 mb-4">🍳 PLANCHA</h3>
              <div className="space-y-2 text-left">
                <p className="text-rustic-700"><strong>Ideales para plancha:</strong></p>
                <ul className="text-rustic-600 space-y-1">
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
                  src="/images/heroes/hero-guisados.jpg"
                  alt="Guisados"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-2xl font-bold text-rustic-900 mb-4">🍲 GUISADOS</h3>
              <div className="space-y-2 text-left">
                <p className="text-rustic-700"><strong>Perfectos para guisar:</strong></p>
                <ul className="text-rustic-600 space-y-1">
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
            <h2 className="text-4xl md:text-6xl font-bold text-rustic-900 mb-4">
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
              <h3 className="text-2xl font-bold text-rustic-900 mb-4">Delivery GRATIS</h3>
              <p className="text-rustic-700 mb-4">
                Entrega gratuita en toda Ciudad de Panamá. Pedidos mínimos de $30.
              </p>
              <div className="text-rustic-600 text-sm space-y-1 mb-6">
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
              <h3 className="text-2xl font-bold text-rustic-900 mb-4">Recogida en Tienda</h3>
              <p className="text-rustic-700 mb-4">
                Visítanos en Aguadulce. ¡Descuentos especiales para recoger en tienda!
              </p>
              <div className="text-rustic-600 text-sm space-y-1 mb-6">
                <p><MapPin size={16} className="inline mr-2" />Vía Interamericana</p>
                <p className="text-xs">Frente a Estación Puma, Aguadulce</p>
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
              <h3 className="text-2xl font-bold text-rustic-900 mb-4">Cortes Personalizados</h3>
              <p className="text-rustic-700 mb-4">
                Nuestros expertos preparan tu carne exactamente como la necesitas.
              </p>
              <div className="text-rustic-600 text-sm space-y-1 mb-6">
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
      <section className="section-padding bg-rustic-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-6xl font-bold text-rustic-900 mb-4">
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
                <p className="text-rustic-700 mb-4 italic">"{testimonio.texto}"</p>
                <div>
                  <p className="font-semibold text-rustic-900">{testimonio.nombre}</p>
                  <p className="text-sm text-rustic-600">{testimonio.ubicacion}</p>
                </div>
              </motion.div>
            ))}
          </div>
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
            <h2 className="text-4xl md:text-6xl font-bold text-rustic-900 mb-4">
              📚 <span className="text-gradient">APRENDE</span> con Nosotros
            </h2>
            <p className="text-xl text-rustic-700">
              Consejos, recetas y secretos de nuestros expertos carniceros
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="blog-card"
              >
                <div className="aspect-video bg-gray-200 overflow-hidden">
                  <img 
                    src={post.imagen}
                    alt={post.titulo}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <p className="text-sm text-primary-500 font-semibold mb-2">{post.fecha}</p>
                  <h3 className="text-xl font-bold text-rustic-900 mb-3">{post.titulo}</h3>
                  <p className="text-rustic-700 mb-4">{post.resumen}</p>
                  <button className="text-primary-500 font-semibold hover:text-primary-600">
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
              La mejor carne Angus panameña te está esperando.<br/>
              <strong>Delivery GRATIS en Ciudad de Panamá</strong>
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
                <p className="text-sm">100% satisfacción o devolvemos tu dinero</p>
              </div>
              <div className="glass-effect rounded-lg p-6">
                <Truck className="text-green-300 mx-auto mb-3" size={32} />
                <h4 className="font-bold mb-2">Entrega Rápida</h4>
                <p className="text-sm">En el mismo día en Ciudad de Panamá</p>
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
      <footer className="bg-rustic-900 text-white section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4 text-primary-300">Nuestra Carne</h3>
              <p className="text-rustic-300 mb-4">
                Del productor a tu mesa. Carne Angus panameña premium con más de 20 años de experiencia.
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
              <div className="space-y-2 text-rustic-300">
                <p className="flex items-center gap-2">
                  <Phone size={16} />
                  +507 6917-2690
                </p>
                <p className="flex items-center gap-2">
                  <MapPin size={16} />
                  Vía Interamericana, Aguadulce
                </p>
                <p className="text-sm">Frente a Estación Puma</p>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4 text-primary-300">Síguenos</h4>
              <div className="space-y-2 text-rustic-300">
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
              <div className="space-y-2 text-rustic-300">
                <p><strong>Delivery Ciudad de Panamá:</strong></p>
                <p>Lun-Vie: 8:00 AM - 5:00 PM</p>
                <p>Sáb: 9:00 AM - 12:00 PM</p>
                <p className="text-primary-300 font-semibold">¡Delivery GRATIS!</p>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4 text-primary-300">Servicios</h4>
              <ul className="space-y-2 text-rustic-300">
                <li>• Delivery gratis en Ciudad de Panamá</li>
                <li>• Recogida en tienda</li>
                <li>• Cortes personalizados</li>
                <li>• Asesoría de cocina</li>
                <li>• Carne premium Angus</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-rustic-700 mt-12 pt-8 text-center">
            <p className="text-rustic-400">
              © 2024 Nuestra Carne. Todos los derechos reservados. | 
              <strong className="text-primary-300"> ¡La mejor carne Angus de Panamá!</strong>
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
            <h3 className="text-2xl font-bold text-rustic-900 mb-4">{selectedCut.nombre}</h3>
            <div className="aspect-video bg-gray-200 rounded-lg mb-4 overflow-hidden">
              <img 
                src={selectedCut.imagen} 
                alt={selectedCut.nombre}
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-rustic-700 mb-4">{selectedCut.descripcion}</p>
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