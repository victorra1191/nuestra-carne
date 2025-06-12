import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, 
  User, 
  CheckCircle, 
  ArrowLeft, 
  ArrowRight,
  Plus,
  Minus,
  Trash2,
  MessageCircle,
  Mail,
  Phone,
  MapPin,
  Clock,
  Home
} from 'lucide-react';

const OrderForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [orderItems, setOrderItems] = useState([]);
  const [customerData, setCustomerData] = useState({
    tipoCliente: 'individual',
    nombre: '',
    telefono: '',
    email: '',
    direccion: '',
    fechaEntrega: '',
    horaEntrega: '',
    notas: ''
  });

  // Productos completos con códigos - LISTA OFICIAL COMPLETA 63 PRODUCTOS
  const productos = [
    { codigo: '20001', nombre: 'New york rebanado', precioKg: 9.26, precioLb: 4.20, categoria: 'Premium' },
    { codigo: '20002', nombre: 'Filete Limpio /sin cordón', precioKg: 15.50, precioLb: 7.03, categoria: 'Premium' },
    { codigo: '20003', nombre: 'Lomo redondo porcionado', precioKg: 7.75, precioLb: 3.52, categoria: 'Plancha' },
    { codigo: '20004', nombre: 'Punta Palomilla entera (picanha)', precioKg: 10.55, precioLb: 4.79, categoria: 'Premium' },
    { codigo: '20005', nombre: 'Pulpa negra en bistec', precioKg: 8.84, precioLb: 4.01, categoria: 'Premium' },
    { codigo: '20006', nombre: 'Rincón en bistec', precioKg: 8.96, precioLb: 4.06, categoria: 'Premium' },
    { codigo: '20007', nombre: 'Babilla en bistec', precioKg: 7.40, precioLb: 3.36, categoria: 'Plancha' },
    { codigo: '20008', nombre: 'Lomo Mulato', precioKg: 0.00, precioLb: 0.00, categoria: 'No Disponible' },
    { codigo: '20009', nombre: 'Lomo rayado', precioKg: 7.85, precioLb: 3.56, categoria: 'Plancha' },
    { codigo: '20010', nombre: 'Puyazo', precioKg: 0.00, precioLb: 0.00, categoria: 'No Disponible' },
    { codigo: '20011', nombre: 'Bistec/Milanesa', precioKg: 7.75, precioLb: 3.52, categoria: 'Plancha' },
    { codigo: '20012', nombre: 'Lomo de cinta sin hueso', precioKg: 0.00, precioLb: 0.00, categoria: 'No Disponible' },
    { codigo: '20013', nombre: 'Fajita', precioKg: 0.00, precioLb: 0.00, categoria: 'No Disponible' },
    { codigo: '20014', nombre: 'Costillón entero', precioKg: 7.25, precioLb: 3.29, categoria: 'Parrilla' },
    { codigo: '20015', nombre: 'New york entero', precioKg: 7.45, precioLb: 3.38, categoria: 'Premium' },
    { codigo: '20017', nombre: 'Falda', precioKg: 4.75, precioLb: 2.15, categoria: 'Guisos' },
    { codigo: '20018', nombre: 'Jarrete porcionado', precioKg: 6.53, precioLb: 2.96, categoria: 'Guisos' },
    { codigo: '20019', nombre: 'Rib- eye entero', precioKg: 9.25, precioLb: 4.20, categoria: 'Premium' },
    { codigo: '20020', nombre: 'Flat Iron Steak', precioKg: 8.50, precioLb: 3.86, categoria: 'Premium' },
    { codigo: '20021', nombre: 'Costillon en porciones', precioKg: 8.69, precioLb: 3.94, categoria: 'Parrilla' },
    { codigo: '20022', nombre: 'Carne molida especial', precioKg: 7.99, precioLb: 3.62, categoria: 'Molida' },
    { codigo: '20023', nombre: 'Arrachera', precioKg: 0.00, precioLb: 0.00, categoria: 'No Disponible' },
    { codigo: '20024', nombre: 'Mondongo', precioKg: 2.30, precioLb: 1.04, categoria: 'Especiales' },
    { codigo: '20025', nombre: 'Lengua', precioKg: 5.54, precioLb: 2.51, categoria: 'Especiales' },
    { codigo: '20026', nombre: 'Hígado', precioKg: 4.20, precioLb: 1.91, categoria: 'Especiales' },
    { codigo: '20027', nombre: 'Pata', precioKg: 2.00, precioLb: 0.91, categoria: 'Especiales' },
    { codigo: '20028', nombre: 'Trip tip (punta Rincón)', precioKg: 9.60, precioLb: 4.35, categoria: 'Premium' },
    { codigo: '20029', nombre: 'Palomilla en bistec', precioKg: 6.50, precioLb: 2.95, categoria: 'Plancha' },
    { codigo: '20030', nombre: 'Costilla de res picada', precioKg: 5.72, precioLb: 2.59, categoria: 'Parrilla' },
    { codigo: '20031', nombre: 'Pulpa blanca entera', precioKg: 7.00, precioLb: 3.18, categoria: 'Premium' },
    { codigo: '20032', nombre: 'Entraña', precioKg: 9.39, precioLb: 4.26, categoria: 'Premium' },
    { codigo: '20033', nombre: 'Lomito', precioKg: 8.00, precioLb: 3.63, categoria: 'Premium' },
    { codigo: '20034', nombre: 'Vacio', precioKg: 8.00, precioLb: 3.63, categoria: 'Premium' },
    { codigo: '20035', nombre: 'Falda Gruesa', precioKg: 6.25, precioLb: 2.83, categoria: 'Guisos' },
    { codigo: '20036', nombre: 'Ropa vieja', precioKg: 6.75, precioLb: 3.06, categoria: 'Guisos' },
    { codigo: '20037', nombre: 'Rabo', precioKg: 6.85, precioLb: 3.11, categoria: 'Guisos' },
    { codigo: '20038', nombre: 'Rib- eye porcionado', precioKg: 9.50, precioLb: 4.31, categoria: 'Premium' },
    { codigo: '20039', nombre: 'Prime rib (asado en tiras)', precioKg: 6.00, precioLb: 2.72, categoria: 'Parrilla' },
    { codigo: '20040', nombre: 'Pajarilla', precioKg: 2.00, precioLb: 0.91, categoria: 'Especiales' },
    { codigo: '20041', nombre: 'Corazón', precioKg: 3.00, precioLb: 1.36, categoria: 'Especiales' },
    { codigo: '20042', nombre: 'Bofe', precioKg: 3.50, precioLb: 1.59, categoria: 'Especiales' },
    { codigo: '20043', nombre: 'Hueso blanco', precioKg: 1.25, precioLb: 0.57, categoria: 'Especiales' },
    { codigo: '20044', nombre: 'Hueso rojo', precioKg: 2.00, precioLb: 0.91, categoria: 'Especiales' },
    { codigo: '20045', nombre: 'Piltrafa', precioKg: 0.04, precioLb: 0.02, categoria: 'Especiales' },
    { codigo: '20046', nombre: 'Ossobuco de res rebanado', precioKg: 6.77, precioLb: 3.07, categoria: 'Guisos' },
    { codigo: '20047', nombre: 'Arañita', precioKg: 20.20, precioLb: 9.16, categoria: 'Premium' },
    { codigo: '20048', nombre: 'Carne de guisar', precioKg: 8.35, precioLb: 3.79, categoria: 'Guisos' },
    { codigo: '20049', nombre: 'Brisket', precioKg: 6.50, precioLb: 2.95, categoria: 'Premium' },
    { codigo: '20050', nombre: 'Pulpa blanca en bistec', precioKg: 7.25, precioLb: 3.29, categoria: 'Premium' },
    { codigo: '20051', nombre: 'Huevo', precioKg: 1.00, precioLb: 0.45, categoria: 'Especiales' },
    { codigo: '20052', nombre: 'Tuétano /Canoa', precioKg: 5.00, precioLb: 2.27, categoria: 'Especiales' },
    { codigo: '20053', nombre: 'Lomo paleta (little)', precioKg: 7.85, precioLb: 3.56, categoria: 'Plancha' },
    { codigo: '20054', nombre: 'Bistec Picado', precioKg: 7.00, precioLb: 3.18, categoria: 'Plancha' },
    { codigo: '20055', nombre: 'Tomahawk', precioKg: 12.00, precioLb: 5.44, categoria: 'Premium' },
    { codigo: '20056', nombre: 'Carne Molida de Segunda', precioKg: 3.04, precioLb: 1.38, categoria: 'Molida' },
    { codigo: '20057', nombre: 'Filetillo', precioKg: 7.00, precioLb: 3.18, categoria: 'Plancha' },
    { codigo: '20058', nombre: 'Babilla entera', precioKg: 7.15, precioLb: 3.24, categoria: 'Plancha' },
    { codigo: '20059', nombre: 'Lomo redondo entero', precioKg: 7.50, precioLb: 3.40, categoria: 'Plancha' },
    { codigo: '20060', nombre: 'Rincón entero', precioKg: 8.71, precioLb: 3.95, categoria: 'Premium' },
    { codigo: '20061', nombre: 'Palomilla entera', precioKg: 6.25, precioLb: 2.83, categoria: 'Plancha' },
    { codigo: '20062', nombre: 'Pulpa negra entera', precioKg: 8.59, precioLb: 3.90, categoria: 'Premium' },
    { codigo: '20063', nombre: 'Costilla de res entera', precioKg: 5.47, precioLb: 2.48, categoria: 'Parrilla' },
    { codigo: '20064', nombre: 'Jarrete entero', precioKg: 6.28, precioLb: 2.85, categoria: 'Guisos' },
    { codigo: '20065', nombre: 'Carne de hamburguesa- 24 onzas', precioKg: 8.50, precioLb: 3.86, categoria: 'Molida' }
  ];

  // Agrupar productos por categoría
  const productosDisponibles = productos.filter(p => p.precioLb > 0);
  const categorias = [...new Set(productosDisponibles.map(p => p.categoria))];

  // Pre-cargar producto si viene del landing
  useEffect(() => {
    if (location.state?.selectedCut) {
      const selectedCut = location.state.selectedCut;
      // Buscar el producto correspondiente
      const producto = productos.find(p => 
        p.nombre.toLowerCase().includes(selectedCut.nombre.toLowerCase()) ||
        selectedCut.nombre.toLowerCase().includes(p.nombre.toLowerCase())
      );
      
      if (producto && producto.precioLb > 0) {
        setOrderItems([{
          ...producto,
          cantidad: 1,
          unidad: 'libras',
          subtotal: producto.precioLb
        }]);
      }
    }
  }, [location.state]);

  // Funciones de manejo del carrito
  const addToCart = (producto) => {
    const existingItem = orderItems.find(item => item.codigo === producto.codigo);
    
    if (existingItem) {
      setOrderItems(orderItems.map(item =>
        item.codigo === producto.codigo
          ? { 
              ...item, 
              cantidad: item.cantidad + 1,
              subtotal: (item.cantidad + 1) * (item.unidad === 'libras' ? item.precioLb : item.precioKg)
            }
          : item
      ));
    } else {
      setOrderItems([...orderItems, {
        ...producto,
        cantidad: 1,
        unidad: 'libras',
        subtotal: producto.precioLb
      }]);
    }
  };

  const updateQuantity = (codigo, nuevaCantidad) => {
    if (nuevaCantidad <= 0) {
      removeFromCart(codigo);
      return;
    }
    
    setOrderItems(orderItems.map(item =>
      item.codigo === codigo
        ? {
            ...item,
            cantidad: nuevaCantidad,
            subtotal: nuevaCantidad * (item.unidad === 'libras' ? item.precioLb : item.precioKg)
          }
        : item
    ));
  };

  const changeUnit = (codigo, nuevaUnidad) => {
    setOrderItems(orderItems.map(item =>
      item.codigo === codigo
        ? {
            ...item,
            unidad: nuevaUnidad,
            subtotal: item.cantidad * (nuevaUnidad === 'libras' ? item.precioLb : item.precioKg)
          }
        : item
    ));
  };

  const removeFromCart = (codigo) => {
    setOrderItems(orderItems.filter(item => item.codigo !== codigo));
  };

  const calculateTotal = () => {
    return orderItems.reduce((total, item) => total + item.subtotal, 0);
  };

  // Validar fechas y horas de entrega
  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const isValidDeliveryDate = (dateString) => {
    const date = new Date(dateString);
    const dayOfWeek = date.getDay();
    // Lunes a Viernes (1-5), Sábado hasta 12pm (6)
    return dayOfWeek >= 1 && dayOfWeek <= 6;
  };

  const getAvailableHours = () => {
    if (!customerData.fechaEntrega) return [];
    
    const date = new Date(customerData.fechaEntrega);
    const dayOfWeek = date.getDay();
    
    if (dayOfWeek >= 1 && dayOfWeek <= 5) { // Lunes a Viernes
      return [
        '08:00', '09:00', '10:00', '11:00', '12:00',
        '13:00', '14:00', '15:00', '16:00', '17:00'
      ];
    } else if (dayOfWeek === 6) { // Sábado
      return ['09:00', '10:00', '11:00', '12:00'];
    }
    return [];
  };

  // Enviar pedido
  const submitOrder = async () => {
    const orderData = {
      cliente: customerData,
      productos: orderItems,
      total: calculateTotal(),
      fecha: new Date().toISOString(),
      estado: 'pendiente'
    };

    // Variables para manejar el estado del botón
    let submitButton = null;
    let originalButtonText = '';

    try {
      console.log('📦 Enviando pedido al backend...');

      // Mostrar loading en el botón
      submitButton = document.querySelector('.submit-button');
      if (submitButton) {
        originalButtonText = submitButton.textContent;
        submitButton.textContent = 'Enviando pedido...';
        submitButton.disabled = true;
      }

      // Enviar al backend para procesar emails
      const backendUrl = import.meta.env.REACT_APP_BACKEND_URL || 
                        process.env.REACT_APP_BACKEND_URL || 
                        'http://localhost:8002';
      
      const response = await fetch(`${backendUrl}/api/orders/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });

      const result = await response.json();

      if (result.success) {
        // Éxito - mostrar confirmación
        alert(`¡Pedido #${result.orderId} enviado exitosamente!\n\n✅ Confirmación enviada a tu email\n📧 Notificación enviada a la empresa\n\nTe contactaremos pronto para coordinar la entrega.`);
        
        // Enviar WhatsApp como respaldo/adicional
        const whatsappMessage = formatWhatsAppMessage({
          ...orderData,
          id: result.orderId
        });
        const whatsappUrl = `https://wa.me/50769172690?text=${encodeURIComponent(whatsappMessage)}`;
        
        // Abrir WhatsApp en nueva ventana
        const shouldOpenWhatsApp = window.confirm('¿Quieres también enviar el pedido por WhatsApp como respaldo?');
        if (shouldOpenWhatsApp) {
          window.open(whatsappUrl, '_blank');
        }
        
        // Limpiar formulario y volver al inicio
        setOrderItems([]);
        setCustomerData({
          tipoCliente: 'individual',
          nombre: '',
          telefono: '',
          email: '',
          direccion: '',
          fechaEntrega: '',
          horaEntrega: '',
          notas: ''
        });
        setCurrentStep(1);
        
        // Opcional: navegar de vuelta al home después de un delay
        setTimeout(() => {
          navigate('/');
        }, 3000);

      } else {
        // Error del servidor - mostrar mensaje y fallback
        console.error('Error del servidor:', result);
        
        const errorMessage = result.message || 'Error procesando el pedido';
        const hasWhatsAppFallback = result.fallback?.whatsapp;
        
        if (hasWhatsAppFallback) {
          const shouldTryWhatsApp = window.confirm(
            `${errorMessage}\n\n¿Quieres enviar tu pedido por WhatsApp en su lugar?`
          );
          
          if (shouldTryWhatsApp) {
            const whatsappMessage = formatWhatsAppMessage(orderData);
            const whatsappUrl = `https://wa.me/${result.fallback.whatsapp}?text=${encodeURIComponent(whatsappMessage)}`;
            window.open(whatsappUrl, '_blank');
          }
        } else {
          alert(`Error: ${errorMessage}\n\nPor favor intenta de nuevo o contáctanos directamente.`);
        }
      }
      
    } catch (error) {
      console.error('Error de conexión:', error);
      
      // Error de conexión - ofrecer WhatsApp como fallback
      const shouldTryWhatsApp = window.confirm(
        'No se pudo conectar con el servidor.\n\n¿Quieres enviar tu pedido por WhatsApp en su lugar?'
      );
      
      if (shouldTryWhatsApp) {
        const whatsappMessage = formatWhatsAppMessage(orderData);
        const whatsappUrl = `https://wa.me/50769172690?text=${encodeURIComponent(whatsappMessage)}`;
        window.open(whatsappUrl, '_blank');
      }
      
    } finally {
      // Restaurar botón
      if (submitButton) {
        submitButton.textContent = originalButtonText || '🔥 ENVIAR PEDIDO FINAL 🔥';
        submitButton.disabled = false;
      }
    }
  };

  const formatWhatsAppMessage = (orderData) => {
    let message = `🥩 *NUEVO PEDIDO - NUESTRA CARNE*\n\n`;
    message += `👤 *Cliente:* ${orderData.cliente.nombre}\n`;
    message += `📞 *Teléfono:* ${orderData.cliente.telefono}\n`;
    message += `📧 *Email:* ${orderData.cliente.email}\n`;
    message += `📍 *Dirección:* ${orderData.cliente.direccion}\n`;
    message += `📅 *Fecha Entrega:* ${orderData.cliente.fechaEntrega}\n`;
    message += `🕐 *Hora Entrega:* ${orderData.cliente.horaEntrega}\n\n`;
    
    message += `🛒 *PRODUCTOS:*\n`;
    orderData.productos.forEach(item => {
      message += `• ${item.nombre} - ${item.cantidad} ${item.unidad} - $${item.subtotal.toFixed(2)}\n`;
    });
    
    message += `\n💰 *TOTAL: $${orderData.total.toFixed(2)}*\n\n`;
    
    if (orderData.cliente.notas) {
      message += `📝 *Notas:* ${orderData.cliente.notas}\n`;
    }
    
    message += `\n✅ *Pedido generado desde:* nuestracarnepa.com`;
    
    return message;
  };

  return (
    <div className="min-h-screen bg-primary-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-primary-200">
        <div className="container-custom section-padding py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 text-primary-700 hover:text-primary-500 transition-colors"
              >
                <Home size={20} />
                <span className="font-semibold">Nuestra Carne</span>
              </button>
            </div>
            
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-4">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                      currentStep === step
                        ? 'bg-primary-500 text-white'
                        : currentStep > step
                        ? 'bg-green-500 text-white'
                        : 'bg-primary-200 text-primary-600'
                    }`}>
                      {currentStep > step ? <CheckCircle size={16} /> : step}
                    </div>
                    <span className={`text-sm font-medium ${
                      currentStep >= step ? 'text-primary-900' : 'text-primary-500'
                    }`}>
                      {step === 1 && 'Productos'}
                      {step === 2 && 'Datos'}
                      {step === 3 && 'Confirmar'}
                    </span>
                    {step < 3 && <ArrowRight size={16} className="text-primary-400" />}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="container-custom section-padding">
        <AnimatePresence mode="wait">
          {/* PASO 1: Selección de Productos */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-12">
                <h1 className="text-4xl md:text-6xl font-bold text-primary-900 mb-4">
                  🛒 Selecciona Tus <span className="text-gradient">PRODUCTOS</span>
                </h1>
                <p className="text-xl text-primary-700">
                  Elige de nuestra selección premium de carne Angus panameña
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Lista de Productos */}
                <div className="lg:col-span-2">
                  {categorias.map(categoria => (
                    <div key={categoria} className="mb-8">
                      <h3 className="text-2xl font-bold text-primary-900 mb-4 border-b-2 border-primary-500 pb-2">
                        {categoria}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {productosDisponibles
                          .filter(producto => producto.categoria === categoria)
                          .map(producto => (
                            <div key={producto.codigo} className="card-rustic">
                              <div className="flex justify-between items-start mb-3">
                                <div>
                                  <h4 className="font-semibold text-primary-900">{producto.nombre}</h4>
                                  <p className="text-sm text-primary-600">Código: {producto.codigo}</p>
                                </div>
                                <div className="text-right">
                                  <p className="font-bold text-primary-500">${producto.precioLb.toFixed(2)}/lb</p>
                                  <p className="text-sm text-primary-600">${producto.precioKg.toFixed(2)}/kg</p>
                                </div>
                              </div>
                              <button
                                onClick={() => addToCart(producto)}
                                className="btn-primary w-full flex items-center justify-center gap-2"
                              >
                                <Plus size={16} />
                                Agregar al Pedido
                              </button>
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Carrito */}
                <div className="lg:col-span-1">
                  <div className="card-rustic sticky top-6">
                    <h3 className="text-xl font-bold text-primary-900 mb-4 flex items-center gap-2">
                      <ShoppingCart size={20} />
                      Tu Pedido
                    </h3>
                    
                    {orderItems.length === 0 ? (
                      <p className="text-primary-600 text-center py-8">
                        Agrega productos a tu pedido
                      </p>
                    ) : (
                      <>
                        <div className="space-y-4 mb-6">
                          {orderItems.map(item => (
                            <div key={item.codigo} className="border border-primary-200 rounded-lg p-3">
                              <div className="flex justify-between items-start mb-2">
                                <h5 className="font-medium text-primary-900 text-sm">{item.nombre}</h5>
                                <button
                                  onClick={() => removeFromCart(item.codigo)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                              
                              <div className="flex items-center gap-2 mb-2">
                                <button
                                  onClick={() => updateQuantity(item.codigo, item.cantidad - 1)}
                                  className="w-6 h-6 bg-primary-200 rounded flex items-center justify-center"
                                >
                                  <Minus size={12} />
                                </button>
                                <span className="font-semibold">{item.cantidad}</span>
                                <button
                                  onClick={() => updateQuantity(item.codigo, item.cantidad + 1)}
                                  className="w-6 h-6 bg-primary-500 text-white rounded flex items-center justify-center"
                                >
                                  <Plus size={12} />
                                </button>
                                <select
                                  value={item.unidad}
                                  onChange={(e) => changeUnit(item.codigo, e.target.value)}
                                  className="ml-2 text-sm border border-primary-300 rounded px-2 py-1"
                                >
                                  <option value="libras">libras</option>
                                  <option value="kilos">kilos</option>
                                </select>
                              </div>
                              
                              <p className="text-right font-bold text-primary-500">
                                ${item.subtotal.toFixed(2)}
                              </p>
                            </div>
                          ))}
                        </div>
                        
                        <div className="border-t border-primary-300 pt-4">
                          <div className="flex justify-between items-center mb-4">
                            <span className="text-lg font-bold">Total:</span>
                            <span className="text-xl font-bold text-primary-500">
                              ${calculateTotal().toFixed(2)}
                            </span>
                          </div>
                          
                          <button
                            onClick={() => setCurrentStep(2)}
                            disabled={orderItems.length === 0}
                            className="btn-primary w-full flex items-center justify-center gap-2"
                          >
                            Continuar
                            <ArrowRight size={16} />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* PASO 2: Datos del Cliente */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-12">
                <h1 className="text-4xl md:text-6xl font-bold text-primary-900 mb-4">
                  📋 Tus <span className="text-gradient">DATOS</span>
                </h1>
                <p className="text-xl text-primary-700">
                  Información para procesar tu pedido
                </p>
              </div>

              <div className="max-w-2xl mx-auto">
                <div className="card-rustic">
                  <form className="space-y-6">
                    {/* Tipo de Cliente */}
                    <div>
                      <label className="block text-sm font-semibold text-primary-900 mb-2">
                        Tipo de Cliente
                      </label>
                      <select
                        value={customerData.tipoCliente}
                        onChange={(e) => setCustomerData({...customerData, tipoCliente: e.target.value})}
                        className="w-full border border-primary-300 rounded-lg px-4 py-3 focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                      >
                        <option value="individual">Individual</option>
                        <option value="empresa">Empresa</option>
                      </select>
                    </div>

                    {/* Información Personal */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-primary-900 mb-2">
                          Nombre Completo *
                        </label>
                        <input
                          type="text"
                          value={customerData.nombre}
                          onChange={(e) => setCustomerData({...customerData, nombre: e.target.value})}
                          className="w-full border border-primary-300 rounded-lg px-4 py-3 focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-primary-900 mb-2">
                          Teléfono *
                        </label>
                        <input
                          type="tel"
                          value={customerData.telefono}
                          onChange={(e) => setCustomerData({...customerData, telefono: e.target.value})}
                          className="w-full border border-primary-300 rounded-lg px-4 py-3 focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                          placeholder="+507 6XXX-XXXX"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-primary-900 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        value={customerData.email}
                        onChange={(e) => setCustomerData({...customerData, email: e.target.value})}
                        className="w-full border border-primary-300 rounded-lg px-4 py-3 focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-primary-900 mb-2">
                        Dirección de Entrega *
                      </label>
                      <textarea
                        value={customerData.direccion}
                        onChange={(e) => setCustomerData({...customerData, direccion: e.target.value})}
                        className="w-full border border-primary-300 rounded-lg px-4 py-3 focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                        rows="3"
                        placeholder="Dirección completa en Ciudad de Panamá"
                        required
                      />
                      <p className="text-sm text-primary-600 mt-1">
                        Solo delivery en Ciudad de Panamá
                      </p>
                    </div>

                    {/* Fecha y Hora de Entrega */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-primary-900 mb-2">
                          Fecha de Entrega *
                        </label>
                        <input
                          type="date"
                          value={customerData.fechaEntrega}
                          onChange={(e) => setCustomerData({...customerData, fechaEntrega: e.target.value, horaEntrega: ''})}
                          min={getMinDate()}
                          className="w-full border border-primary-300 rounded-lg px-4 py-3 focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                          required
                        />
                        <p className="text-sm text-primary-600 mt-1">
                          Lun-Vie: 8AM-5PM | Sáb: 9AM-12PM
                        </p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-primary-900 mb-2">
                          Hora de Entrega *
                        </label>
                        <select
                          value={customerData.horaEntrega}
                          onChange={(e) => setCustomerData({...customerData, horaEntrega: e.target.value})}
                          className="w-full border border-primary-300 rounded-lg px-4 py-3 focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                          required
                          disabled={!customerData.fechaEntrega}
                        >
                          <option value="">Seleccionar hora</option>
                          {getAvailableHours().map(hora => (
                            <option key={hora} value={hora}>{hora}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-primary-900 mb-2">
                        Notas Especiales
                      </label>
                      <textarea
                        value={customerData.notas}
                        onChange={(e) => setCustomerData({...customerData, notas: e.target.value})}
                        className="w-full border border-primary-300 rounded-lg px-4 py-3 focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                        rows="3"
                        placeholder="Instrucciones especiales, grosor de cortes, etc."
                      />
                    </div>
                  </form>

                  <div className="flex gap-4 mt-8">
                    <button
                      onClick={() => setCurrentStep(1)}
                      className="btn-outline flex items-center gap-2"
                    >
                      <ArrowLeft size={16} />
                      Volver a Productos
                    </button>
                    
                    <button
                      onClick={() => setCurrentStep(3)}
                      disabled={!customerData.nombre || !customerData.telefono || !customerData.email || !customerData.direccion || !customerData.fechaEntrega || !customerData.horaEntrega}
                      className="btn-primary flex-1 flex items-center justify-center gap-2"
                    >
                      Revisar Pedido
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* PASO 3: Confirmación */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-12">
                <h1 className="text-4xl md:text-6xl font-bold text-primary-900 mb-4">
                  ✅ Confirma Tu <span className="text-gradient">PEDIDO</span>
                </h1>
                <p className="text-xl text-primary-700">
                  Revisa toda la información antes de enviar
                </p>
              </div>

              <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Información del Cliente */}
                <div className="card-rustic">
                  <h3 className="text-xl font-bold text-primary-900 mb-4 flex items-center gap-2">
                    <User size={20} />
                    Información del Cliente
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-primary-600">Nombre:</span>
                      <span className="font-semibold">{customerData.nombre}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-primary-600">Teléfono:</span>
                      <span className="font-semibold">{customerData.telefono}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-primary-600">Email:</span>
                      <span className="font-semibold">{customerData.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-primary-600">Dirección:</span>
                      <span className="font-semibold text-right">{customerData.direccion}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-primary-600">Fecha Entrega:</span>
                      <span className="font-semibold">{customerData.fechaEntrega}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-primary-600">Hora Entrega:</span>
                      <span className="font-semibold">{customerData.horaEntrega}</span>
                    </div>
                    {customerData.notas && (
                      <div className="pt-3 border-t border-primary-200">
                        <span className="text-primary-600">Notas:</span>
                        <p className="font-semibold mt-1">{customerData.notas}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Resumen del Pedido */}
                <div className="card-rustic">
                  <h3 className="text-xl font-bold text-primary-900 mb-4 flex items-center gap-2">
                    <ShoppingCart size={20} />
                    Resumen del Pedido
                  </h3>
                  
                  <div className="space-y-3 mb-6">
                    {orderItems.map(item => (
                      <div key={item.codigo} className="flex justify-between items-center border-b border-primary-200 pb-2">
                        <div>
                          <h5 className="font-medium">{item.nombre}</h5>
                          <p className="text-sm text-primary-600">
                            {item.cantidad} {item.unidad} × ${(item.unidad === 'libras' ? item.precioLb : item.precioKg).toFixed(2)}
                          </p>
                        </div>
                        <span className="font-bold text-primary-500">
                          ${item.subtotal.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-t border-primary-300 pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-xl font-bold">Total:</span>
                      <span className="text-2xl font-bold text-primary-500">
                        ${calculateTotal().toFixed(2)}
                      </span>
                    </div>
                    
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                      <p className="text-green-700 text-sm flex items-center gap-2">
                        <CheckCircle size={16} />
                        Delivery GRATIS en Ciudad de Panamá
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Botones de Acción */}
              <div className="max-w-4xl mx-auto mt-8">
                <div className="flex flex-col md:flex-row gap-4">
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="btn-outline flex items-center justify-center gap-2"
                  >
                    <ArrowLeft size={16} />
                    Modificar Datos
                  </button>
                  
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="btn-secondary flex items-center justify-center gap-2"
                  >
                    <ShoppingCart size={16} />
                    Agregar más productos
                  </button>
                  
                  <button
                    onClick={submitOrder}
                    className="btn-primary flex-1 flex items-center justify-center gap-2 animate-pulse-glow submit-button"
                  >
                    <CheckCircle size={20} />
                    🔥 ENVIAR PEDIDO FINAL 🔥
                  </button>
                </div>
                
                <div className="text-center mt-6">
                  <p className="text-primary-600 text-sm">
                    Al enviar tu pedido, recibirás una confirmación por email y WhatsApp.
                    <br />
                    Nuestro equipo te contactará para coordinar la entrega.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default OrderForm;