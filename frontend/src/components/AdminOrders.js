import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Package, 
  Calendar, 
  DollarSign, 
  User, 
  MapPin, 
  Phone, 
  Mail,
  Clock,
  CheckCircle,
  AlertCircle,
  TruckIcon,
  Edit3,
  Eye,
  BarChart3,
  ShoppingBag,
  TrendingUp
} from 'lucide-react';

const AdminOrders = ({ API_BASE }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetail, setShowOrderDetail] = useState(false);
  const [dashboardStats, setDashboardStats] = useState({
    totalOrders: 0,
    completedOrders: 0,
    activeOrders: 0,
    todayOrders: 0,
    totalRevenue: 0,
    topProducts: [],
    recentOrders: []
  });
  
  // Filtros
  const [filters, setFilters] = useState({
    dateFrom: '',
    dateTo: '',
    client: '',
    status: 'all'
  });
  
  const [expandedOrders, setExpandedOrders] = useState(new Set());
  
  // Función para obtener API base si no se pasa como prop
  const getApiBase = () => {
    if (API_BASE) return API_BASE;
    
    // FORZAR URL de producción - Fix crítico
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      console.log('🌐 [AdminOrders] Hostname detected:', hostname);
      
      // Si NO es localhost, asumir que es producción
      if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
        console.log('🌐 [AdminOrders] FORCING production URL: https://nuestracarnepa.com/api');
        return 'https://nuestracarnepa.com/api';
      }
      
      // Solo usar localhost si realmente estamos en localhost
      if (hostname === 'localhost' || hostname === '127.0.0.1') {
        console.log('🌐 [AdminOrders] Using localhost URL: http://localhost:8001/api');
        return 'http://localhost:8001/api';
      }
    }
    
    // Fallback a producción
    console.log('🌐 [AdminOrders] Fallback to production URL');
    return 'https://nuestracarnepa.com/api';
  };

  const API_URL = getApiBase();

  useEffect(() => {
    fetchOrders();
    fetchDashboardStats();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      console.log('🔍 [AdminOrders] Fetching orders from:', `${API_URL}/orders/all`);
      
      const response = await fetch(`${API_URL}/orders/all`);
      const data = await response.json();
      
      console.log('🔍 [AdminOrders] Orders response:', data);
      
      if (data.success) {
        setOrders(data.orders || []);
      } else {
        throw new Error('Error al cargar pedidos');
      }
    } catch (error) {
      console.error('❌ [AdminOrders] Error fetching orders:', error);
      setError('Error al cargar los pedidos');
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboardStats = async () => {
    try {
      console.log('🔍 [AdminOrders] Fetching dashboard stats from:', `${API_URL}/admin/orders/stats`);
      
      const response = await fetch(`${API_URL}/admin/orders/stats`, {
        headers: {
          'Authorization': `Basic ${btoa('admin:nuestra123')}`
        }
      });
      const data = await response.json();
      
      console.log('🔍 [AdminOrders] Dashboard stats response:', data);
      
      if (data.success) {
        setDashboardStats(data.stats || {});
      }
    } catch (error) {
      console.error('❌ [AdminOrders] Error fetching dashboard stats:', error);
    }
  };

  // Filtrar pedidos
  const filteredOrders = orders.filter(order => {
    // Filtro por fecha
    if (filters.dateFrom) {
      const orderDate = new Date(order.fechaCreacion || order.fecha);
      const fromDate = new Date(filters.dateFrom);
      if (orderDate < fromDate) return false;
    }
    
    if (filters.dateTo) {
      const orderDate = new Date(order.fechaCreacion || order.fecha);
      const toDate = new Date(filters.dateTo);
      toDate.setHours(23, 59, 59, 999); // Incluir todo el día
      if (orderDate > toDate) return false;
    }
    
    // Filtro por cliente
    if (filters.client) {
      const clientName = order.cliente?.nombre?.toLowerCase() || '';
      if (!clientName.includes(filters.client.toLowerCase())) return false;
    }
    
    // Filtro por estado
    if (filters.status !== 'all') {
      if (order.estado !== filters.status) return false;
    }
    
    return true;
  });

  const toggleOrderExpansion = (orderId) => {
    const newExpanded = new Set(expandedOrders);
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);
    }
    setExpandedOrders(newExpanded);
  };

  const clearFilters = () => {
    setFilters({
      dateFrom: '',
      dateTo: '',
      client: '',
      status: 'all'
    });
  };

  const updateOrderStatus = async (orderId, newStatus, notas = '') => {
    try {
      const response = await fetch(`${API_URL}/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ estado: newStatus, notas })
      });

      const data = await response.json();
      
      if (data.success) {
        // Actualizar la lista de pedidos
        setOrders(orders.map(order => 
          order.id === orderId 
            ? { ...order, estado: newStatus, fechaActualizacion: new Date().toISOString() }
            : order
        ));
        
        // Actualizar estadísticas
        fetchDashboardStats();
        
        // Cerrar el modal si está abierto
        setShowOrderDetail(false);
        setSelectedOrder(null);
        
        alert('Estado del pedido actualizado exitosamente');
      } else {
        throw new Error(data.error || 'Error al actualizar el pedido');
      }
    } catch (error) {
      console.error('Error updating order:', error);
      alert('Error al actualizar el estado del pedido');
    }
  };

  const getStatusColor = (estado) => {
    switch (estado) {
      case 'pendiente': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'en_proceso': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'en_camino': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'entregado': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelado': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (estado) => {
    switch (estado) {
      case 'pendiente': return 'Pendiente';
      case 'en_proceso': return 'En Proceso';
      case 'en_camino': return 'En Camino';
      case 'entregado': return 'Entregado';
      case 'cancelado': return 'Cancelado';
      default: return estado;
    }
  };

  const getStatusIcon = (estado) => {
    switch (estado) {
      case 'pendiente': return <Clock size={16} />;
      case 'en_proceso': return <Package size={16} />;
      case 'en_camino': return <TruckIcon size={16} />;
      case 'entregado': return <CheckCircle size={16} />;
      case 'cancelado': return <AlertCircle size={16} />;
      default: return <Package size={16} />;
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
        <p className="text-primary-600">Cargando pedidos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="text-center">
          <AlertCircle className="text-red-500 mx-auto mb-2" size={24} />
          <p className="text-red-600 mb-4">{error}</p>
          <button onClick={fetchOrders} className="btn-primary">
            Intentar de nuevo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Dashboard de Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <ShoppingBag className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Pedidos</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardStats.totalOrders || orders.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completados</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardStats.completedOrders || orders.filter(o => o.estado === 'entregado').length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Activos</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardStats.activeOrders || orders.filter(o => ['pendiente', 'en_proceso', 'en_camino'].includes(o.estado)).length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Ingresos</p>
              <p className="text-2xl font-bold text-gray-900">${(dashboardStats.totalRevenue || orders.reduce((sum, order) => sum + (order.total || 0), 0)).toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-primary-900">Gestión de Pedidos</h2>
        <button onClick={() => { fetchOrders(); fetchDashboardStats(); }} className="btn-outline">
          Actualizar
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Filtros</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha Desde
            </label>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => setFilters({...filters, dateFrom: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha Hasta
            </label>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => setFilters({...filters, dateTo: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cliente
            </label>
            <input
              type="text"
              placeholder="Buscar por nombre..."
              value={filters.client}
              onChange={(e) => setFilters({...filters, client: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estado
            </label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">Todos</option>
              <option value="pendiente">Pendiente</option>
              <option value="en_proceso">En Proceso</option>
              <option value="en_camino">En Camino</option>
              <option value="entregado">Entregado</option>
              <option value="cancelado">Cancelado</option>
            </select>
          </div>
        </div>
        
        <div className="mt-4 flex gap-2">
          <button onClick={clearFilters} className="btn-outline text-sm">
            Limpiar Filtros
          </button>
          <span className="text-sm text-gray-600 self-center">
            Mostrando {filteredOrders.length} de {orders.length} pedidos
          </span>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <Package className="text-gray-400 mx-auto mb-4" size={48} />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay pedidos</h3>
          <p className="text-gray-600">Los pedidos aparecerán aquí cuando los clientes hagan sus compras.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Total de pedidos: {orders.length}
            </h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pedido
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Productos/Cortes
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <React.Fragment key={order.id}>
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          #{order.id.slice(-8)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.productos?.length || 0} producto(s)
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {order.cliente?.nombre}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.cliente?.telefono}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs">
                          {order.productos && order.productos.length > 0 ? (
                            <div className="space-y-1">
                              {order.productos.slice(0, 2).map((producto, index) => (
                                <div key={index} className="flex justify-between text-xs">
                                  <span className="font-medium truncate mr-2">
                                    {producto.nombre}
                                  </span>
                                  <span className="text-gray-500 whitespace-nowrap">
                                    {producto.cantidad} {producto.unidad} - ${producto.subtotal?.toFixed(2)}
                                  </span>
                                </div>
                              ))}
                              {order.productos.length > 2 && (
                                <div className="text-xs text-gray-500">
                                  +{order.productos.length - 2} más...
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className="text-gray-400 text-xs">Sin productos</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(order.fechaCreacion || order.fecha).toLocaleDateString('es-ES', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ${order.total?.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(order.estado)}`}>
                          {getStatusIcon(order.estado)}
                          <span className="ml-1">{getStatusText(order.estado)}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => toggleOrderExpansion(order.id)}
                          className="text-primary-600 hover:text-primary-900 transition-colors"
                          title={expandedOrders.has(order.id) ? "Ocultar detalles" : "Ver detalles"}
                        >
                          {expandedOrders.has(order.id) ? (
                            <BarChart3 size={16} />
                          ) : (
                            <Eye size={16} />
                          )}
                        </button>
                        <select
                          value={order.estado}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                          className="text-xs px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                        >
                          <option value="pendiente">Pendiente</option>
                          <option value="en_proceso">En Proceso</option>
                          <option value="en_camino">En Camino</option>
                          <option value="entregado">Entregado</option>
                          <option value="cancelado">Cancelado</option>
                        </select>
                      </td>
                    </tr>
                    
                    {/* Fila expandida con detalles completos */}
                    {expandedOrders.has(order.id) && (
                      <tr>
                        <td colSpan="7" className="px-6 py-4 bg-gray-50">
                          <div className="space-y-4">
                            {/* Información completa del cliente */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="bg-white p-4 rounded-lg border">
                                <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                                  <User className="w-4 h-4 mr-2" />
                                  Información del Cliente
                                </h4>
                                <div className="space-y-2 text-sm">
                                  <p><span className="font-medium">Nombre:</span> {order.cliente?.nombre}</p>
                                  <p><span className="font-medium">Teléfono:</span> {order.cliente?.telefono}</p>
                                  <p><span className="font-medium">Email:</span> {order.cliente?.email}</p>
                                  <p><span className="font-medium">Dirección:</span> {order.cliente?.direccion}</p>
                                  <p><span className="font-medium">Tipo:</span> {order.cliente?.tipoCliente === 'individual' ? 'Individual' : 'Mayorista'}</p>
                                  <p><span className="font-medium">Entrega:</span> {order.cliente?.fechaEntrega} - {order.cliente?.horaEntrega}</p>
                                  {order.cliente?.notas && (
                                    <p><span className="font-medium">Notas:</span> {order.cliente?.notas}</p>
                                  )}
                                </div>
                              </div>
                              
                              <div className="bg-white p-4 rounded-lg border">
                                <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                                  <DollarSign className="w-4 h-4 mr-2" />
                                  Resumen del Pedido
                                </h4>
                                <div className="space-y-2 text-sm">
                                  <p><span className="font-medium">ID Pedido:</span> #{order.id}</p>
                                  <p><span className="font-medium">Total Productos:</span> {order.productos?.length || 0}</p>
                                  <p><span className="font-medium">Subtotal:</span> ${(order.total - 3.50)?.toFixed(2)}</p>
                                  <p><span className="font-medium">Delivery:</span> $3.50</p>
                                  <p className="text-lg"><span className="font-medium">Total:</span> ${order.total?.toFixed(2)}</p>
                                  <p><span className="font-medium">Estado:</span> {getStatusText(order.estado)}</p>
                                  <p><span className="font-medium">Creado:</span> {new Date(order.fechaCreacion || order.fecha).toLocaleString('es-ES')}</p>
                                </div>
                              </div>
                            </div>
                            
                            {/* Productos detallados */}
                            <div className="bg-white p-4 rounded-lg border">
                              <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                                <Package className="w-4 h-4 mr-2" />
                                Cortes de Carne Detallados ({order.productos?.length || 0} productos)
                              </h4>
                              {order.productos && order.productos.length > 0 ? (
                                <div className="space-y-3">
                                  {order.productos.map((producto, index) => (
                                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded border-l-4 border-primary-500">
                                      <div className="flex-1">
                                        <p className="font-medium text-gray-900">{producto.nombre}</p>
                                        <div className="text-sm text-gray-600 mt-1">
                                          <span className="inline-block mr-4">📝 Código: {producto.codigo}</span>
                                          <span className="inline-block mr-4">⚖️ Unidad: {producto.unidad}</span>
                                        </div>
                                        <div className="text-sm text-gray-600 mt-1">
                                          <span className="inline-block mr-4">💰 Precio/kg: ${producto.precioKg?.toFixed(2)}</span>
                                          <span className="inline-block">🥩 Precio/½kg: ${producto.precioMedioKilo?.toFixed(2)}</span>
                                        </div>
                                      </div>
                                      <div className="text-right">
                                        <p className="font-medium text-lg text-gray-900">
                                          {producto.cantidad} {producto.unidad}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                          Subtotal: <span className="font-medium">${producto.subtotal?.toFixed(2)}</span>
                                        </p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-gray-500 text-center py-4">No hay productos especificados</p>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal de detalles del pedido */}
      {showOrderDetail && selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-black opacity-50" onClick={() => setShowOrderDetail(false)}></div>
            <div className="bg-white rounded-lg max-w-2xl w-full p-6 relative">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Pedido #{selectedOrder.id.slice(-8)}
                </h3>
                <button
                  onClick={() => setShowOrderDetail(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                {/* Información del cliente */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Información del Cliente</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Nombre:</span>
                      <p className="font-medium">{selectedOrder.cliente?.nombre}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Teléfono:</span>
                      <p className="font-medium">{selectedOrder.cliente?.telefono}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Email:</span>
                      <p className="font-medium">{selectedOrder.cliente?.email}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Tipo:</span>
                      <p className="font-medium">{selectedOrder.cliente?.tipoCliente}</p>
                    </div>
                  </div>
                </div>

                {/* Dirección de entrega */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Entrega</h4>
                  <div className="text-sm space-y-2">
                    <p><span className="text-gray-500">Dirección:</span> {selectedOrder.cliente?.direccion}</p>
                    <p><span className="text-gray-500">Fecha:</span> {selectedOrder.cliente?.fechaEntrega}</p>
                    <p><span className="text-gray-500">Hora:</span> {selectedOrder.cliente?.horaEntrega}</p>
                  </div>
                </div>

                {/* Productos */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Productos</h4>
                  <div className="space-y-2">
                    {selectedOrder.productos?.map((producto, index) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                        <div>
                          <p className="font-medium">{producto.nombre}</p>
                          <p className="text-sm text-gray-500">
                            {producto.cantidad}{producto.unidad || 'lb'} × ${producto.precio?.toFixed(2)}
                          </p>
                        </div>
                        <p className="font-medium">${producto.subtotal?.toFixed(2)}</p>
                      </div>
                    ))}
                    <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                      <p className="font-bold text-lg">Total:</p>
                      <p className="font-bold text-lg text-primary-600">${selectedOrder.total?.toFixed(2)}</p>
                    </div>
                  </div>
                </div>

                {/* Notas */}
                {selectedOrder.cliente?.notas && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Notas del cliente</h4>
                    <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                      {selectedOrder.cliente.notas}
                    </p>
                  </div>
                )}

                {/* Acciones rápidas */}
                <div className="flex space-x-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => updateOrderStatus(selectedOrder.id, 'en_proceso')}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                    disabled={selectedOrder.estado === 'en_proceso'}
                  >
                    Marcar En Proceso
                  </button>
                  <button
                    onClick={() => updateOrderStatus(selectedOrder.id, 'en_camino')}
                    className="flex-1 bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700"
                    disabled={selectedOrder.estado === 'en_camino'}
                  >
                    Marcar En Camino
                  </button>
                  <button
                    onClick={() => updateOrderStatus(selectedOrder.id, 'entregado')}
                    className="flex-1 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
                    disabled={selectedOrder.estado === 'entregado'}
                  >
                    Marcar Entregado
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;