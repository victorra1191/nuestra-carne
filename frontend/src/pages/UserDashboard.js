import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  User,
  ShoppingBag,
  Gift,
  Clock,
  Edit3,
  LogOut,
  Home,
  Star,
  MapPin,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  Package,
  CheckCircle,
  AlertCircle,
  Crown
} from 'lucide-react';

const UserDashboard = () => {
  const { user, logout, updateProfile, isWholesaleUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    nombre: user?.nombre || '',
    telefono: user?.telefono || ''
  });
  
  const API_BASE = process.env.REACT_APP_BACKEND_URL;
  
  // Estados para pedidos reales
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [ordersError, setOrdersError] = useState(null);

  // Cargar pedidos del usuario
  useEffect(() => {
    const fetchUserOrders = async () => {
      console.log('🔍 Fetching user orders...');
      console.log('User:', user);
      console.log('API_BASE:', API_BASE);
      
      if (!user?.id) {
        console.log('❌ No user ID, skipping fetch');
        setLoadingOrders(false);
        return;
      }
      
      try {
        setLoadingOrders(true);
        setOrdersError(null);
        
        const url = `${API_BASE}/orders/user/${user.id}?email=${user.email}`;
        console.log('🌐 Fetching from URL:', url);
        
        const response = await fetch(url);
        console.log('📥 Response status:', response.status);
        
        const data = await response.json();
        console.log('📦 Response data:', data);
        
        if (data.success) {
          setOrders(data.orders || []);
          console.log('✅ Orders loaded:', data.orders?.length || 0);
        } else {
          throw new Error(data.error || 'Error al cargar pedidos');
        }
      } catch (error) {
        console.error('Error fetching user orders:', error);
        console.error('API_BASE:', API_BASE);
        console.error('User ID:', user?.id);
        console.error('User email:', user?.email);
        setOrdersError(`Error al cargar tus pedidos: ${error.message}`);
        setOrders([]); // Sin fallback de datos simulados
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchUserOrders();
  }, [user, API_BASE]);

  const [promotions] = useState([
    {
      id: '1',
      titulo: '20% OFF en Cortes Premium',
      descripcion: 'Descuento especial en Rib-eye, Filet Mignon y Tomahawk',
      validHasta: '2024-12-31',
      activa: true
    },
    {
      id: '2',
      titulo: 'Delivery Gratis',
      descripcion: 'Entrega gratuita en compras mayores a $50',
      validHasta: '2024-12-25',
      activa: true
    }
  ]);

  const handleProfileUpdate = async () => {
    const result = await updateProfile(profileData);
    if (result.success) {
      setEditingProfile(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'entregado': return 'text-green-600 bg-green-100';
      case 'en_camino': return 'text-blue-600 bg-blue-100';
      case 'pendiente': return 'text-yellow-600 bg-yellow-100';
      case 'cancelado': return 'text-red-600 bg-red-100';
      default: return 'text-primary-600 bg-primary-100';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'entregado': return 'Entregado';
      case 'en_camino': return 'En Camino';
      case 'pendiente': return 'Pendiente';
      case 'cancelado': return 'Cancelado';
      default: return status;
    }
  };

  const tabs = [
    { id: 'overview', name: 'Resumen', icon: User },
    { id: 'orders', name: 'Mis Pedidos', icon: ShoppingBag },
    { id: 'promotions', name: 'Promociones', icon: Gift },
    { id: 'profile', name: 'Mi Perfil', icon: Edit3 }
  ];

  return (
    <div className="min-h-screen bg-primary-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-primary-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/')}
                className="flex items-center space-x-2 text-primary-700 hover:text-primary-500 transition-colors"
              >
                <Home size={20} />
                <span className="font-semibold">Nuestra Carne</span>
              </button>
              <span className="text-primary-400">|</span>
              <div className="flex items-center space-x-2">
                {isWholesaleUser() && (
                  <Crown className="text-yellow-500" size={20} />
                )}
                <span className="text-primary-900 font-semibold">
                  Hola, {user?.nombre}
                </span>
                {isWholesaleUser() && (
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                    Mayorista
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/haz-tu-pedido')}
                className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors flex items-center space-x-2"
              >
                <ShoppingBag size={16} />
                <span>Hacer Pedido</span>
              </button>
              
              <button
                onClick={logout}
                className="text-primary-600 hover:text-primary-800 flex items-center space-x-2"
              >
                <LogOut size={16} />
                <span>Salir</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="text-white" size={32} />
                </div>
                <h3 className="text-xl font-bold text-primary-900">{user?.nombre}</h3>
                <p className="text-primary-600">{user?.email}</p>
                {isWholesaleUser() && (
                  <div className="mt-2">
                    <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium flex items-center justify-center space-x-1">
                      <Crown size={16} />
                      <span>Cliente Mayorista</span>
                    </span>
                  </div>
                )}
              </div>

              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors text-left ${
                        activeTab === tab.id
                          ? 'bg-primary-500 text-white'
                          : 'text-primary-700 hover:bg-primary-100'
                      }`}
                    >
                      <Icon size={20} />
                      <span>{tab.name}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                <h1 className="text-3xl font-bold text-primary-900">Dashboard</h1>
                
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center space-x-3">
                      <div className="bg-green-100 p-3 rounded-lg">
                        <CheckCircle className="text-green-600" size={24} />
                      </div>
                      <div>
                        <p className="text-primary-600 text-sm">Pedidos Completados</p>
                        <p className="text-2xl font-bold text-primary-900">
                          {orders.filter(o => o.estado === 'entregado').length}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-100 p-3 rounded-lg">
                        <Package className="text-blue-600" size={24} />
                      </div>
                      <div>
                        <p className="text-primary-600 text-sm">Pedidos Activos</p>
                        <p className="text-2xl font-bold text-primary-900">
                          {orders.filter(o => o.estado !== 'entregado' && o.estado !== 'cancelado').length}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center space-x-3">
                      <div className="bg-yellow-100 p-3 rounded-lg">
                        <Gift className="text-yellow-600" size={24} />
                      </div>
                      <div>
                        <p className="text-primary-600 text-sm">Promociones Activas</p>
                        <p className="text-2xl font-bold text-primary-900">
                          {promotions.filter(p => p.activa).length}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Orders */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-bold text-primary-900 mb-4">Últimos Pedidos</h2>
                  <div className="space-y-4">
                    {orders.slice(0, 3).map((order) => (
                      <div key={order.id} className="flex items-center justify-between border-b border-primary-100 pb-4">
                        <div>
                          <p className="font-semibold text-primary-900">Pedido #{order.id}</p>
                          <p className="text-primary-600 text-sm">{order.productos.join(', ')}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-primary-900">${order.total.toFixed(2)}</p>
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.estado)}`}>
                            {getStatusText(order.estado)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                <h1 className="text-3xl font-bold text-primary-900">Mis Pedidos</h1>
                
                {loadingOrders ? (
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
                      <p className="text-primary-600">Cargando tus pedidos...</p>
                    </div>
                  </div>
                ) : ordersError ? (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                    <div className="text-center">
                      <AlertCircle className="text-red-500 mx-auto mb-2" size={24} />
                      <p className="text-red-600 mb-4">{ordersError}</p>
                      <button 
                        onClick={() => window.location.reload()}
                        className="btn-primary"
                      >
                        Intentar de nuevo
                      </button>
                    </div>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="text-center py-8">
                      <ShoppingBag className="text-gray-400 mx-auto mb-4" size={48} />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No tienes pedidos aún</h3>
                      <p className="text-gray-600 mb-6">¡Haz tu primer pedido y disfruta de nuestra carne premium!</p>
                      <button 
                        onClick={() => navigate('/haz-tu-pedido')}
                        className="btn-primary"
                      >
                        Hacer mi primer pedido
                      </button>
                    </div>
                  </div>
                ) : (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="space-y-6">
                    {orders.map((order) => (
                      <div key={order.id} className="border border-primary-200 rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-bold text-primary-900">Pedido #{order.id.slice(-8)}</h3>
                            <div className="flex items-center space-x-4 text-sm text-primary-600">
                              <span className="flex items-center space-x-1">
                                <Calendar size={16} />
                                <span>{new Date(order.fecha || order.fechaCreacion).toLocaleDateString('es-ES')}</span>
                              </span>
                              <span className="flex items-center space-x-1">
                                <DollarSign size={16} />
                                <span>${order.total.toFixed(2)}</span>
                              </span>
                            </div>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.estado)}`}>
                            {getStatusText(order.estado)}
                          </span>
                        </div>
                        
                        <div className="mb-4">
                          <h4 className="font-semibold text-primary-900 mb-2">Productos:</h4>
                          <ul className="list-disc list-inside text-primary-700 space-y-1">
                            {(Array.isArray(order.productos) ? order.productos : []).map((producto, index) => (
                              <li key={index}>
                                {typeof producto === 'string' ? 
                                  producto : 
                                  `${producto.nombre} - ${producto.cantidad}${producto.unidad || 'lb'} - $${producto.subtotal.toFixed(2)}`
                                }
                              </li>
                            ))}
                          </ul>
                        </div>

                        {order.cliente?.fechaEntrega && (
                          <div className="mb-4">
                            <h4 className="font-semibold text-primary-900 mb-2">Entrega programada:</h4>
                            <p className="text-primary-700">
                              📅 {order.cliente.fechaEntrega} a las {order.cliente.horaEntrega}
                            </p>
                            <p className="text-primary-600 text-sm">
                              📍 {order.cliente.direccion}
                            </p>
                          </div>
                        )}

                        {order.estado === 'en_camino' && (
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                            <div className="flex items-center space-x-2">
                              <Clock className="text-blue-600" size={16} />
                              <span className="text-blue-800 font-medium">
                                Tu pedido está en camino y llegará pronto
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                )}
              </motion.div>
            )}

            {/* Promotions Tab */}
            {activeTab === 'promotions' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                <h1 className="text-3xl font-bold text-primary-900">Promociones Disponibles</h1>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {promotions.filter(p => p.activa).map((promo) => (
                    <div key={promo.id} className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-primary-500">
                      <div className="flex items-start space-x-3">
                        <div className="bg-primary-100 p-2 rounded-lg">
                          <Gift className="text-primary-600" size={20} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-primary-900 mb-2">{promo.titulo}</h3>
                          <p className="text-primary-700 mb-3">{promo.descripcion}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-primary-600">
                              Válido hasta: {new Date(promo.validHasta).toLocaleDateString('es-ES')}
                            </span>
                            <button
                              onClick={() => navigate('/haz-tu-pedido')}
                              className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors text-sm"
                            >
                              Usar Ahora
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {isWholesaleUser() && (
                  <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-xl shadow-sm p-6 text-white">
                    <div className="flex items-center space-x-3 mb-4">
                      <Crown size={24} />
                      <h2 className="text-xl font-bold">Beneficios Mayorista</h2>
                    </div>
                    <ul className="space-y-2">
                      <li className="flex items-center space-x-2">
                        <CheckCircle size={16} />
                        <span>Precios especiales en todos los productos</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle size={16} />
                        <span>Descuentos adicionales por volumen</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle size={16} />
                        <span>Atención prioritaria</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle size={16} />
                        <span>Delivery gratuito sin mínimo</span>
                      </li>
                    </ul>
                  </div>
                )}
              </motion.div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                <h1 className="text-3xl font-bold text-primary-900">Mi Perfil</h1>
                
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-primary-900">Información Personal</h2>
                    <button
                      onClick={() => setEditingProfile(!editingProfile)}
                      className="flex items-center space-x-2 text-primary-600 hover:text-primary-800"
                    >
                      <Edit3 size={16} />
                      <span>{editingProfile ? 'Cancelar' : 'Editar'}</span>
                    </button>
                  </div>

                  {editingProfile ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-primary-700 mb-2">
                          Nombre Completo
                        </label>
                        <input
                          type="text"
                          value={profileData.nombre}
                          onChange={(e) => setProfileData({ ...profileData, nombre: e.target.value })}
                          className="w-full px-4 py-3 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-primary-700 mb-2">
                          Teléfono
                        </label>
                        <input
                          type="tel"
                          value={profileData.telefono}
                          onChange={(e) => setProfileData({ ...profileData, telefono: e.target.value })}
                          className="w-full px-4 py-3 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>

                      <div className="flex space-x-4">
                        <button
                          onClick={handleProfileUpdate}
                          className="bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600 transition-colors"
                        >
                          Guardar Cambios
                        </button>
                        <button
                          onClick={() => setEditingProfile(false)}
                          className="border border-primary-300 text-primary-700 px-6 py-2 rounded-lg hover:bg-primary-50 transition-colors"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <User className="text-primary-600" size={20} />
                        <div>
                          <p className="text-primary-600 text-sm">Nombre</p>
                          <p className="font-semibold text-primary-900">{user?.nombre}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Mail className="text-primary-600" size={20} />
                        <div>
                          <p className="text-primary-600 text-sm">Email</p>
                          <p className="font-semibold text-primary-900">{user?.email}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Phone className="text-primary-600" size={20} />
                        <div>
                          <p className="text-primary-600 text-sm">Teléfono</p>
                          <p className="font-semibold text-primary-900">{user?.telefono}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <Calendar className="text-primary-600" size={20} />
                        <div>
                          <p className="text-primary-600 text-sm">Miembro desde</p>
                          <p className="font-semibold text-primary-900">
                            {new Date(user?.fechaRegistro).toLocaleDateString('es-ES')}
                          </p>
                        </div>
                      </div>

                      {isWholesaleUser() && (
                        <div className="flex items-center space-x-3">
                          <Crown className="text-yellow-500" size={20} />
                          <div>
                            <p className="text-primary-600 text-sm">Tipo de Cliente</p>
                            <p className="font-semibold text-yellow-600">Cliente Mayorista</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;