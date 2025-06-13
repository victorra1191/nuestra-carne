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
  Eye
} from 'lucide-react';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetail, setShowOrderDetail] = useState(false);
  
  const API_BASE = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/api/orders/all`);
      const data = await response.json();
      
      if (data.success) {
        setOrders(data.orders || []);
      } else {
        throw new Error('Error al cargar pedidos');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Error al cargar los pedidos');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus, notas = '') => {
    try {
      const response = await fetch(`${API_BASE}/api/orders/${orderId}/status`, {
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
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-primary-900">Gestión de Pedidos</h2>
        <button onClick={fetchOrders} className="btn-outline">
          Actualizar
        </button>
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
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(order.fechaCreacion || order.fecha).toLocaleDateString('es-ES')}
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
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowOrderDetail(true);
                        }}
                        className="text-primary-600 hover:text-primary-900"
                      >
                        <Eye size={16} />
                      </button>
                      <select
                        value={order.estado}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        className="text-sm border border-gray-300 rounded px-2 py-1"
                      >
                        <option value="pendiente">Pendiente</option>
                        <option value="en_proceso">En Proceso</option>
                        <option value="en_camino">En Camino</option>
                        <option value="entregado">Entregado</option>
                        <option value="cancelado">Cancelado</option>
                      </select>
                    </td>
                  </tr>
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