// Google Analytics Utilities para Nuestra Carne
// Tracking de eventos importantes

// Función para enviar eventos a Google Analytics
export const trackEvent = (eventName, parameters = {}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, parameters);
    console.log('📊 [GA] Event tracked:', eventName, parameters);
  }
};

// Tracking específico para pedidos
export const trackOrderPlaced = (orderData) => {
  const { total, productos, cliente } = orderData;
  
  trackEvent('purchase', {
    transaction_id: orderData.id || 'unknown',
    value: total,
    currency: 'USD',
    items: productos?.map((producto, index) => ({
      item_id: producto.codigo,
      item_name: producto.nombre,
      category: 'Carnes',
      quantity: producto.cantidad,
      price: producto.subtotal
    })) || []
  });
  
  // Evento personalizado adicional
  trackEvent('order_completed', {
    order_value: total,
    customer_type: cliente?.tipoCliente || 'unknown',
    product_count: productos?.length || 0
  });
};

// Tracking de productos más vistos
export const trackProductView = (producto) => {
  trackEvent('view_item', {
    currency: 'USD',
    value: producto.precioKg || 0,
    items: [{
      item_id: producto.codigo,
      item_name: producto.nombre,
      category: 'Carnes',
      price: producto.precioKg
    }]
  });
};

// Tracking de búsquedas
export const trackSearch = (searchTerm, resultCount = 0) => {
  trackEvent('search', {
    search_term: searchTerm,
    result_count: resultCount
  });
};

// Tracking de páginas personalizadas
export const trackPageView = (pageName, pageTitle) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', 'G-9CSGB3WL03', {
      page_title: pageTitle,
      page_location: window.location.href,
      custom_map: {
        'custom_parameter_1': pageName
      }
    });
  }
};

// Tracking de engagement con productos
export const trackAddToCart = (producto) => {
  trackEvent('add_to_cart', {
    currency: 'USD',
    value: producto.subtotal || 0,
    items: [{
      item_id: producto.codigo,
      item_name: producto.nombre,
      category: 'Carnes',
      quantity: producto.cantidad,
      price: producto.subtotal
    }]
  });
};

// Tracking de interacciones del admin
export const trackAdminAction = (action, details = {}) => {
  trackEvent('admin_action', {
    action_type: action,
    ...details
  });
};

// Tracking de registro/login de usuarios
export const trackUserAction = (action, userType = 'individual') => {
  trackEvent(action, {
    user_type: userType,
    timestamp: new Date().toISOString()
  });
};

export default {
  trackEvent,
  trackOrderPlaced,
  trackProductView,
  trackSearch,
  trackPageView,
  trackAddToCart,
  trackAdminAction,
  trackUserAction
};