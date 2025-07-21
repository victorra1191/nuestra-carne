import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
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
  Home,
  Crown,
  AlertCircle
} from 'lucide-react';

const OrderForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [orderItems, setOrderItems] = useState([]);
  const [productos, setProductos] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const { isAuthenticated, user, isWholesaleUser } = useAuth();
  
  const getApiBase = () => {
    // Hardcode para producción (bypass env var issue)
    if (typeof window !== 'undefined' && window.location.hostname === 'nuestracarnepa.com') {
      return 'https://nuestracarnepa.com/api';
    }
    
    // Para desarrollo local
    if (process.env.REACT_APP_BACKEND_URL) {
      return `${process.env.REACT_APP_BACKEND_URL}/api`;
    }
    return 'http://localhost:8001/api';
  };

  const API_BASE = getApiBase();
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

  // Estados para promociones y delivery
  const [promocionCodigo, setPromocionCodigo] = useState('');
  const [promocionAplicada, setPromocionAplicada] = useState(null);
  const [descuentoPromocion, setDescuentoPromocion] = useState(0);
  const [loadingPromocion, setLoadingPromocion] = useState(false);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const DELIVERY_FEE_AMOUNT = 3.50;
  const DELIVERY_FREE_MINIMUM = 50.00;

  // Cargar productos según el tipo de usuario (autenticado o seleccionado en formulario)
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoadingProducts(true);
        
        // Logging detallado para debugging
        console.log('🔍 [OrderForm] Iniciando carga de productos...');
        console.log('🔍 [OrderForm] isWholesaleUser():', isWholesaleUser());
        console.log('🔍 [OrderForm] customerData.tipoCliente:', customerData.tipoCliente);
        console.log('🔍 [OrderForm] API_BASE:', API_BASE);
        
        // Usar precios mayoristas si: 1) usuario mayorista logueado, o 2) selecciona "empresa" en formulario
        const useWholesale = isWholesaleUser() || customerData.tipoCliente === 'empresa';
        const endpoint = useWholesale ? '/api/products/wholesale' : '/api/products/retail';
        const fullURL = `${API_BASE}${endpoint}`;
        
        console.log('🔍 [OrderForm] useWholesale:', useWholesale);
        console.log('🔍 [OrderForm] endpoint:', endpoint);
        console.log('🔍 [OrderForm] fullURL:', fullURL);
        
        console.log('🔍 [OrderForm] Realizando fetch a:', fullURL);
        const response = await fetch(fullURL);
        
        console.log('🔍 [OrderForm] Response status:', response.status);
        console.log('🔍 [OrderForm] Response ok:', response.ok);
        console.log('🔍 [OrderForm] Response headers:', response.headers);
        
        const data = await response.json();
        
        console.log('🔍 [OrderForm] Datos recibidos:', data);
        console.log('🔍 [OrderForm] data.success:', data.success);
        console.log('🔍 [OrderForm] data.products length:', data.products?.length);
        
        if (data.success && data.products) {
          // Verificar precios específicos para debugging
          const costillonEntero = data.products.find(p => p.codigo === '10014');
          console.log('🔍 [OrderForm] Costillón entero encontrado:', costillonEntero);
          
          setProductos(data.products);
          console.log('✅ [OrderForm] Productos cargados exitosamente desde API');
        } else {
          console.log('❌ [OrderForm] API retornó error o datos inválidos, usando fallback');
          console.log('❌ [OrderForm] Reason: data.success =', data.success, 'data.products =', data.products);
          // Fallback a productos estáticos si hay error
          setProductos(staticProductos);
        }
      } catch (error) {
        console.error('❌ [OrderForm] Error cargando productos:', error);
        console.error('❌ [OrderForm] Error message:', error.message);
        console.error('❌ [OrderForm] Error stack:', error.stack);
        // Fallback a productos estáticos
        setProductos(staticProductos);
        console.log('⚠️ [OrderForm] Usando staticProductos como fallback');
      } finally {
        setLoadingProducts(false);
        console.log('🔍 [OrderForm] Terminada carga de productos');
      }
    };

    fetchProducts();
  }, [isAuthenticated, user, customerData.tipoCliente, API_BASE]);

  // Pre-llenar datos del usuario autenticado
  useEffect(() => {
    if (isAuthenticated && user) {
      setCustomerData(prevData => ({
        ...prevData,
        tipoCliente: user.tipo || 'individual',
        nombre: user.nombre || '',
        telefono: user.telefono || '',
        email: user.email || '',
        // Solo pre-llenar si no hay datos previos
        direccion: prevData.direccion || '',
        fechaEntrega: prevData.fechaEntrega || '',
        horaEntrega: prevData.horaEntrega || '',
        notas: prevData.notas || ''
      }));
    }
  }, [isAuthenticated, user]);

  // Productos estáticos como fallback (actualizados con códigos 10001 y precios medio kilo)
  const staticProductos = [
    { codigo: '10001', nombre: 'New york rebanado', precioKg: 9.26, precioMedioKilo: 4.63, categoria: 'Premium' },
    { codigo: '10002', nombre: 'Filete Limpio /sin cordón', precioKg: 15.50, precioMedioKilo: 7.75, categoria: 'Premium' },
    { codigo: '10003', nombre: 'Lomo redondo porcionado', precioKg: 7.75, precioMedioKilo: 3.88, categoria: 'Plancha' },
    { codigo: '10004', nombre: 'Punta Palomilla entera (picanha)', precioKg: 10.55, precioMedioKilo: 5.28, categoria: 'Premium' },
    { codigo: '10005', nombre: 'Pulpa negra en bistec', precioKg: 8.84, precioMedioKilo: 4.42, categoria: 'Premium' },
    { codigo: '10006', nombre: 'Rincón en bistec', precioKg: 8.96, precioMedioKilo: 4.48, categoria: 'Premium' },
    { codigo: '10007', nombre: 'Babilla en bistec', precioKg: 7.40, precioMedioKilo: 3.70, categoria: 'Plancha' },
    { codigo: '10008', nombre: 'Lomo Mulato', precioKg: 0.00, precioMedioKilo: 0.00, categoria: 'No Disponible' },
    { codigo: '10009', nombre: 'Lomo rayado', precioKg: 7.85, precioMedioKilo: 3.93, categoria: 'Plancha' },
    { codigo: '10010', nombre: 'Puyazo', precioKg: 0.00, precioMedioKilo: 0.00, categoria: 'No Disponible' },
    { codigo: '10011', nombre: 'Bistec/Milanesa', precioKg: 7.75, precioMedioKilo: 3.88, categoria: 'Plancha' },
    { codigo: '10012', nombre: 'Lomo de cinta sin hueso', precioKg: 0.00, precioMedioKilo: 0.00, categoria: 'No Disponible' },
    { codigo: '10013', nombre: 'Fajita', precioKg: 0.00, precioMedioKilo: 0.00, categoria: 'No Disponible' },
    { codigo: '10014', nombre: 'Costillón entero', precioKg: 7.35, precioMedioKilo: 3.68, categoria: 'Parrilla' },
    { codigo: '10015', nombre: 'New york entero', precioKg: 9.06, precioMedioKilo: 4.53, categoria: 'Premium' },
    { codigo: '10017', nombre: 'Falda', precioKg: 4.75, precioMedioKilo: 2.38, categoria: 'Guisos' },
    { codigo: '10018', nombre: 'Jarrete porcionado', precioKg: 6.53, precioMedioKilo: 3.27, categoria: 'Guisos' },
    { codigo: '10019', nombre: 'Rib- eye entero', precioKg: 9.60, precioMedioKilo: 4.80, categoria: 'Premium' },
    { codigo: '10020', nombre: 'Flat Iron Steak', precioKg: 8.55, precioMedioKilo: 4.28, categoria: 'Premium' },
    { codigo: '10021', nombre: 'Costillon en porciones', precioKg: 8.69, precioMedioKilo: 4.35, categoria: 'Parrilla' },
    { codigo: '10022', nombre: 'Carne molida especial', precioKg: 7.99, precioMedioKilo: 4.00, categoria: 'Molida' },
    { codigo: '10023', nombre: 'Arrachera', precioKg: 0.00, precioMedioKilo: 0.00, categoria: 'No Disponible' },
    { codigo: '10024', nombre: 'Mondongo', precioKg: 2.30, precioMedioKilo: 1.15, categoria: 'Especiales' },
    { codigo: '10025', nombre: 'Lengua', precioKg: 5.85, precioMedioKilo: 2.93, categoria: 'Especiales' },
    { codigo: '10026', nombre: 'Hígado', precioKg: 4.20, precioMedioKilo: 2.10, categoria: 'Especiales' },
    { codigo: '10027', nombre: 'Pata', precioKg: 2.10, precioMedioKilo: 1.05, categoria: 'Especiales' },
    { codigo: '10028', nombre: 'Trip tip (punta Rincón)', precioKg: 9.60, precioMedioKilo: 4.80, categoria: 'Premium' },
    { codigo: '10029', nombre: 'Palomilla en bistec', precioKg: 6.50, precioMedioKilo: 3.25, categoria: 'Plancha' },
    { codigo: '10030', nombre: 'Costilla de res picada', precioKg: 5.72, precioMedioKilo: 2.86, categoria: 'Parrilla' },
    { codigo: '10031', nombre: 'Pulpa blanca entera', precioKg: 7.25, precioMedioKilo: 3.63, categoria: 'Premium' },
    { codigo: '10032', nombre: 'Entraña', precioKg: 11.50, precioMedioKilo: 5.75, categoria: 'Premium' },
    { codigo: '10033', nombre: 'Lomito', precioKg: 8.00, precioMedioKilo: 4.00, categoria: 'Premium' },
    { codigo: '10034', nombre: 'Vacio', precioKg: 8.00, precioMedioKilo: 4.00, categoria: 'Premium' },
    { codigo: '10035', nombre: 'Falda Gruesa', precioKg: 6.30, precioMedioKilo: 3.15, categoria: 'Guisos' },
    { codigo: '10036', nombre: 'Ropa vieja', precioKg: 6.85, precioMedioKilo: 3.43, categoria: 'Guisos' },
    { codigo: '10037', nombre: 'Rabo', precioKg: 6.90, precioMedioKilo: 3.45, categoria: 'Guisos' },
    { codigo: '10038', nombre: 'Rib- eye porcionado', precioKg: 9.85, precioMedioKilo: 4.93, categoria: 'Premium' },
    { codigo: '10039', nombre: 'Prime rib (costilla)', precioKg: 6.15, precioMedioKilo: 3.08, categoria: 'Parrilla' },
    { codigo: '10040', nombre: 'Pajarilla', precioKg: 2.00, precioMedioKilo: 1.00, categoria: 'Especiales' },
    { codigo: '10041', nombre: 'Corazón', precioKg: 3.00, precioMedioKilo: 1.50, categoria: 'Especiales' },
    { codigo: '10042', nombre: 'Bofe', precioKg: 3.55, precioMedioKilo: 1.78, categoria: 'Especiales' },
    { codigo: '10043', nombre: 'Hueso blanco', precioKg: 1.25, precioMedioKilo: 0.63, categoria: 'Especiales' },
    { codigo: '10044', nombre: 'Hueso rojo', precioKg: 2.00, precioMedioKilo: 1.00, categoria: 'Especiales' },
    { codigo: '10045', nombre: 'Piltrafa', precioKg: 0.40, precioMedioKilo: 0.20, categoria: 'Especiales' },
    { codigo: '10046', nombre: 'Ossobuco de res rebanado', precioKg: 7.00, precioMedioKilo: 3.50, categoria: 'Guisos' },
    { codigo: '10047', nombre: 'Arañita', precioKg: 20.20, precioMedioKilo: 10.10, categoria: 'Premium' },
    { codigo: '10048', nombre: 'Carne de guisar', precioKg: 8.35, precioMedioKilo: 4.18, categoria: 'Guisos' },
    { codigo: '10049', nombre: 'Brisket', precioKg: 6.75, precioMedioKilo: 3.38, categoria: 'Premium' },
    { codigo: '10050', nombre: 'Pulpa blanca en bistec', precioKg: 7.25, precioMedioKilo: 3.63, categoria: 'Premium' },
    { codigo: '10051', nombre: 'Huevo', precioKg: 2.00, precioMedioKilo: 1.00, categoria: 'Especiales' },
    { codigo: '10052', nombre: 'Tuétano /Canoa', precioKg: 5.00, precioMedioKilo: 2.50, categoria: 'Especiales' },
    { codigo: '10053', nombre: 'Lomo paleta (little)', precioKg: 7.85, precioMedioKilo: 3.93, categoria: 'Plancha' },
    { codigo: '10054', nombre: 'Bistec Picado', precioKg: 7.15, precioMedioKilo: 3.58, categoria: 'Plancha' },
    { codigo: '10055', nombre: 'Tomahawk', precioKg: 12.00, precioMedioKilo: 6.00, categoria: 'Premium' },
    { codigo: '10056', nombre: 'Carne Molida de Segunda', precioKg: 3.04, precioMedioKilo: 1.52, categoria: 'Molida' },
    { codigo: '10057', nombre: 'Filetillo', precioKg: 7.35, precioMedioKilo: 3.68, categoria: 'Plancha' },
    { codigo: '10058', nombre: 'Babilla entera', precioKg: 7.15, precioMedioKilo: 3.58, categoria: 'Plancha' },
    { codigo: '10059', nombre: 'Lomo redondo entero', precioKg: 7.50, precioMedioKilo: 3.75, categoria: 'Plancha' },
    { codigo: '10060', nombre: 'Rincón entero', precioKg: 8.71, precioMedioKilo: 4.36, categoria: 'Premium' },
    { codigo: '10061', nombre: 'Palomilla entera', precioKg: 6.25, precioMedioKilo: 3.13, categoria: 'Plancha' },
    { codigo: '10062', nombre: 'Pulpa negra entera', precioKg: 8.59, precioMedioKilo: 4.30, categoria: 'Premium' },
    { codigo: '10063', nombre: 'Costilla de res entera', precioKg: 5.50, precioMedioKilo: 2.75, categoria: 'Parrilla' },
    { codigo: '10064', nombre: 'Jarrete entero', precioKg: 6.28, precioMedioKilo: 3.14, categoria: 'Guisos' },
    { codigo: '10065', nombre: 'Carne de hamburguesa- 24 onzas', precioKg: 8.50, precioMedioKilo: 4.25, categoria: 'Molida' }
  ];

  // Agrupar productos por categoría
  const productosDisponibles = productos.filter(p => p.precioMedioKilo > 0);
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
      
      if (producto && producto.precioMedioKilo > 0) {
        setOrderItems([{
          ...producto,
          cantidad: 1,
          unidad: 'kilos',
          subtotal: producto.precioKg
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
              subtotal: (item.cantidad + 1) * (item.unidad === 'kilos' ? item.precioKg : item.precioMedioKilo)
            }
          : item
      ));
    } else {
      setOrderItems([...orderItems, {
        ...producto,
        cantidad: 1,
        unidad: 'medio kilo',
        subtotal: producto.precioMedioKilo
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
            subtotal: nuevaCantidad * (item.unidad === 'medio kilo' ? item.precioMedioKilo : item.precioKg)
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
            subtotal: item.cantidad * (nuevaUnidad === 'medio kilo' ? item.precioMedioKilo : item.precioKg)
          }
        : item
    ));
  };

  const removeFromCart = (codigo) => {
    setOrderItems(orderItems.filter(item => item.codigo !== codigo));
  };

  const calculateSubtotal = () => {
    return orderItems.reduce((total, item) => total + item.subtotal, 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const totalConDescuento = subtotal - descuentoPromocion;
    const finalTotal = totalConDescuento + deliveryFee;
    return finalTotal;
  };

  // Calcular delivery fee basado en el subtotal
  const updateDeliveryFee = () => {
    const subtotal = calculateSubtotal();
    const totalConDescuento = subtotal - descuentoPromocion;
    
    if (totalConDescuento < DELIVERY_FREE_MINIMUM) {
      setDeliveryFee(DELIVERY_FEE_AMOUNT);
    } else {
      setDeliveryFee(0);
    }
  };

  // Actualizar delivery fee cuando cambie el carrito o promoción
  useEffect(() => {
    updateDeliveryFee();
  }, [orderItems, descuentoPromocion]);

  // Función para aplicar código promocional
  const aplicarPromocion = async () => {
    if (!promocionCodigo.trim()) {
      alert('Por favor ingresa un código promocional');
      return;
    }

    setLoadingPromocion(true);
    try {
      const response = await fetch(`${API_BASE}/promociones/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          codigo: promocionCodigo,
          montoTotal: calculateSubtotal(),
          productos: orderItems
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setPromocionAplicada(data.promocion);
        setDescuentoPromocion(data.descuento);
        alert(`¡Promoción aplicada! Descuento: $${data.descuento.toFixed(2)}`);
      } else {
        alert(data.error || 'Código promocional inválido');
        setPromocionAplicada(null);
        setDescuentoPromocion(0);
      }
    } catch (error) {
      console.error('Error al validar promoción:', error);
      alert('Error al validar promoción');
    } finally {
      setLoadingPromocion(false);
    }
  };

  // Función para remover promoción
  const removerPromocion = () => {
    setPromocionCodigo('');
    setPromocionAplicada(null);
    setDescuentoPromocion(0);
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
    } else if (dayOfWeek === 0) { // Domingo
      return ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00'];
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
          'user-id': user?.id || null
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

  // Componente de Acordeón para Productos (Móvil)
  const ProductosAccordion = ({ categorias, productosDisponibles, addToCart }) => {
    const [openCategories, setOpenCategories] = useState(new Set());

    const toggleCategory = (categoria) => {
      const newOpenCategories = new Set(openCategories);
      if (newOpenCategories.has(categoria)) {
        newOpenCategories.delete(categoria);
      } else {
        newOpenCategories.add(categoria);
      }
      setOpenCategories(newOpenCategories);
    };

    return (
      <div className="lg:col-span-2 lg:order-1 order-2">
        {/* Vista Desktop - Layout Original */}
        <div className="hidden lg:block">
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
                          <p className="font-bold text-primary-500">${producto.precioKg.toFixed(2)} (1kg)</p>
                          <p className="text-sm text-primary-600">${producto.precioMedioKilo.toFixed(2)} (½kg)</p>
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

        {/* Vista Móvil - Acordeón */}
        <div className="lg:hidden space-y-4">
          {categorias.map(categoria => {
            const isOpen = openCategories.has(categoria);
            const productosCategoria = productosDisponibles.filter(producto => producto.categoria === categoria);
            
            return (
              <div key={categoria} className="border border-primary-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleCategory(categoria)}
                  className="w-full px-4 py-4 bg-primary-100 hover:bg-primary-200 transition-colors flex items-center justify-between"
                >
                  <h3 className="text-lg font-bold text-primary-900">{categoria}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-primary-600">
                      {productosCategoria.length} productos
                    </span>
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ArrowRight size={20} className="text-primary-700" />
                    </motion.div>
                  </div>
                </button>
                
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 space-y-3 bg-white">
                        {productosCategoria.map(producto => (
                          <div key={producto.codigo} className="border border-primary-100 rounded-lg p-3">
                            <div className="flex justify-between items-start mb-3">
                              <div className="flex-1">
                                <h4 className="font-semibold text-primary-900 text-sm">{producto.nombre}</h4>
                                <p className="text-xs text-primary-600">Código: {producto.codigo}</p>
                              </div>
                              <div className="text-right ml-2">
                                <p className="font-bold text-primary-500 text-sm">${producto.precioKg.toFixed(2)} (1kg)</p>
                                <p className="text-xs text-primary-600">${producto.precioMedioKilo.toFixed(2)} (½kg)</p>
                              </div>
                            </div>
                            <button
                              onClick={() => addToCart(producto)}
                              className="btn-primary w-full text-sm py-2 flex items-center justify-center gap-2"
                            >
                              <Plus size={14} />
                              Agregar al Pedido
                            </button>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    );
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
                <img 
                  src="/images/logo/nuestra-carne-logo.png"
                  alt="Nuestra Carne Logo"
                  className="h-8 w-auto"
                  onError={(e) => {
                    // Fallback al texto si no encuentra la imagen
                    e.target.style.display = 'none';
                    e.target.nextElementSibling.style.display = 'inline';
                  }}
                />
                <span style={{display: 'none'}} className="font-semibold">Nuestra Carne</span>
              </button>
              
              {isAuthenticated && (
                <>
                  <span className="text-primary-400">|</span>
                  <div className="flex items-center gap-2">
                    <User size={16} className="text-primary-600" />
                    <span className="text-primary-900 font-medium">{user?.nombre}</span>
                    {isWholesaleUser() && (
                      <div className="flex items-center gap-1">
                        <Crown size={16} className="text-yellow-500" />
                        <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                          Mayorista
                        </span>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
            
            <div className="flex items-center gap-8">
              {!isAuthenticated && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center gap-3 max-w-md">
                  <AlertCircle size={18} className="text-blue-600 flex-shrink-0" />
                  <span className="text-blue-800 text-sm leading-relaxed">
                    <button 
                      onClick={() => navigate('/auth')} 
                      className="font-medium underline hover:no-underline"
                    >
                      Regístrate
                    </button> para precios especiales y dashboard personalizado
                  </span>
                </div>
              )}
              
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
                <p className="text-xl text-primary-700 mb-6">
                  Elige de nuestra selección premium de carne 100% Nacional panameña
                </p>
                
                {/* Disclaimer */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mx-auto max-w-4xl mb-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-yellow-500 rounded-full p-1 flex-shrink-0 mt-1">
                      <AlertCircle size={16} className="text-white" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-yellow-800 font-semibold mb-2">Información Importante</h3>
                      <ul className="text-yellow-700 text-sm space-y-1">
                        <li>• Todos los pedidos serán procesados y entregados en un lapso de <strong>48 horas hábiles</strong></li>
                        <li>• <strong>No se entregan los domingos</strong></li>
                        <li>• Toda solicitud está sujeta a <strong>disponibilidad del producto</strong></li>
                        <li>• Los precios pueden oscilar según el precio final del producto en un aproximado de <strong>medio kilo o kilo</strong></li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Carrito - Arriba en móvil, derecha en desktop */}
                <div className="lg:col-span-1 lg:order-2 order-1">
                  <div className="card-rustic lg:sticky lg:top-6">
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
                                  <option value="medio kilo">medio kilo</option>
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
                          {/* Sección de Promociones */}
                          <div className="mb-4">
                            <h4 className="text-sm font-semibold text-primary-900 mb-2">Código Promocional</h4>
                            {!promocionAplicada ? (
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  placeholder="Ingresa código"
                                  value={promocionCodigo}
                                  onChange={(e) => setPromocionCodigo(e.target.value.toUpperCase())}
                                  className="flex-1 border border-primary-300 rounded px-3 py-2 text-sm"
                                />
                                <button
                                  onClick={aplicarPromocion}
                                  disabled={loadingPromocion || !promocionCodigo.trim()}
                                  className="bg-green-500 text-white px-4 py-2 rounded text-sm hover:bg-green-600 disabled:opacity-50"
                                >
                                  {loadingPromocion ? 'Validando...' : 'Aplicar'}
                                </button>
                              </div>
                            ) : (
                              <div className="bg-green-50 border border-green-200 rounded p-3">
                                <div className="flex justify-between items-center">
                                  <div>
                                    <p className="text-sm font-medium text-green-800">{promocionAplicada.codigo}</p>
                                    <p className="text-xs text-green-600">{promocionAplicada.descripcion}</p>
                                  </div>
                                  <button
                                    onClick={removerPromocion}
                                    className="text-red-500 hover:text-red-700 text-sm"
                                  >
                                    Remover
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Resumen de costos */}
                          <div className="space-y-2 mb-4">
                            <div className="flex justify-between text-sm">
                              <span>Subtotal:</span>
                              <span>${calculateSubtotal().toFixed(2)}</span>
                            </div>
                            
                            {descuentoPromocion > 0 && (
                              <div className="flex justify-between text-sm text-green-600">
                                <span>Descuento ({promocionAplicada?.codigo}):</span>
                                <span>-${descuentoPromocion.toFixed(2)}</span>
                              </div>
                            )}
                            
                            <div className="flex justify-between text-sm">
                              <span>Delivery:</span>
                              <span className={deliveryFee === 0 ? 'text-green-600' : ''}>
                                {deliveryFee === 0 ? 'GRATIS' : `$${deliveryFee.toFixed(2)}`}
                              </span>
                            </div>
                            
                            {deliveryFee > 0 && (
                              <p className="text-xs text-primary-600">
                                Delivery gratis en pedidos de $50 o más
                              </p>
                            )}
                          </div>

                          <div className="flex justify-between items-center mb-4 pt-2 border-t border-primary-200">
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

                {/* Lista de Productos con Acordeón en Móvil */}
                <ProductosAccordion 
                  categorias={categorias}
                  productosDisponibles={productosDisponibles}
                  addToCart={addToCart}
                />
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
                        <option value="empresa">Empresa (Precios Mayoristas)</option>
                      </select>
                    </div>

                    {/* Información Personal */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-primary-900 mb-2">
                          Nombre Completo *
                          {isAuthenticated && user?.nombre && (
                            <span className="text-green-600 text-xs ml-2">✓ Pre-llenado</span>
                          )}
                        </label>
                        <input
                          type="text"
                          value={customerData.nombre}
                          onChange={(e) => setCustomerData({...customerData, nombre: e.target.value})}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                            isAuthenticated && user?.nombre ? 'border-green-300 bg-green-50' : 'border-primary-200'
                          }`}
                          placeholder="Tu nombre completo"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-primary-900 mb-2">
                          Teléfono *
                          {isAuthenticated && user?.telefono && (
                            <span className="text-green-600 text-xs ml-2">✓ Pre-llenado</span>
                          )}
                        </label>
                        <input
                          type="tel"
                          value={customerData.telefono}
                          onChange={(e) => setCustomerData({...customerData, telefono: e.target.value})}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                            isAuthenticated && user?.telefono ? 'border-green-300 bg-green-50' : 'border-primary-200'
                          }`}
                          placeholder="+507 6XXX-XXXX"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-primary-900 mb-2">
                        Email *
                        {isAuthenticated && user?.email && (
                          <span className="text-green-600 text-xs ml-2">✓ Pre-llenado</span>
                        )}
                      </label>
                      <input
                        type="email"
                        value={customerData.email}
                        onChange={(e) => setCustomerData({...customerData, email: e.target.value})}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                          isAuthenticated && user?.email ? 'border-green-300 bg-green-50' : 'border-primary-200'
                        }`}
                        placeholder="tu@email.com"
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
                          Lun-Vie: 8AM-5PM | Sáb: 9AM-12PM | Dom: Cerrado
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
                            {item.cantidad} {item.unidad} × ${(item.unidad === 'medio kilo' ? item.precioMedioKilo : item.precioKg).toFixed(2)}
                          </p>
                        </div>
                        <span className="font-bold text-primary-500">
                          ${item.subtotal.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-t border-primary-300 pt-4">
                    {/* Resumen detallado de costos */}
                    <div className="space-y-3 mb-4">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>${calculateSubtotal().toFixed(2)}</span>
                      </div>
                      
                      {descuentoPromocion > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>Descuento ({promocionAplicada?.codigo}):</span>
                          <span>-${descuentoPromocion.toFixed(2)}</span>
                        </div>
                      )}
                      
                      <div className="flex justify-between">
                        <span>Delivery:</span>
                        <span className={deliveryFee === 0 ? 'text-green-600 font-semibold' : ''}>
                          {deliveryFee === 0 ? 'GRATIS' : `$${deliveryFee.toFixed(2)}`}
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center mb-4 pt-3 border-t border-primary-200">
                      <span className="text-xl font-bold">Total:</span>
                      <span className="text-2xl font-bold text-primary-500">
                        ${calculateTotal().toFixed(2)}
                      </span>
                    </div>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                      <p className="text-blue-700 text-sm flex items-center gap-2">
                        <CheckCircle size={16} />
                        {deliveryFee === 0 ? 
                          'Delivery GRATIS incluido' : 
                          `Delivery $${deliveryFee.toFixed(2)} - GRATIS en pedidos +$50`
                        }
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