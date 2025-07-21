import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Package,
  Edit3,
  ToggleLeft,
  ToggleRight,
  DollarSign,
  Tag,
  Search,
  Filter,
  Save,
  X,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Users,
  ShoppingBag,
  Crown
} from 'lucide-react';

const AdminProducts = ({ API_BASE }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [stats, setStats] = useState({});

  const [editForm, setEditForm] = useState({
    precioKg: '',
    precioMedioKilo: '',
    categoria: '',
    disponible: true
  });

  // Cargar productos y estadísticas
  useEffect(() => {
    fetchProducts();
    fetchStats();
  }, []);

  // Filtrar productos
  useEffect(() => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.codigo.includes(searchTerm)
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(product => product.categoria === selectedCategory);
    }

    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategory]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/admin/products/all`, {
        headers: {
          'Authorization': `Basic ${btoa('admin:nuestra123')}`
        }
      });

      const data = await response.json();

      if (data.success) {
        setProducts(data.products);
      } else {
        setError('Error al cargar productos');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_BASE}/admin/stats`, {
        headers: {
          'Authorization': `Basic ${btoa('admin:nuestra123')}`
        }
      });

      const data = await response.json();

      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setEditForm({
      precioKg: product.precioKg,
      precioMedioKilo: product.precioMedioKilo,
      categoria: product.categoria,
      disponible: product.disponible
    });
  };

  const handleSaveEdit = async () => {
    try {
      const response = await fetch(`${API_BASE}/admin/products/${editingProduct.codigo}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${btoa('admin:nuestra123')}`
        },
        body: JSON.stringify(editForm)
      });

      const data = await response.json();

      if (data.success) {
        // Refrescar todos los productos desde el servidor para mostrar datos actualizados
        await fetchProducts();
        setEditingProduct(null);
        setError('');
      } else {
        setError('Error al actualizar producto');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      setError('Error de conexión');
    }
  };

  const handleToggleAvailability = async (product) => {
    try {
      const response = await fetch(`${API_BASE}/admin/products/${product.codigo}/toggle`, {
        method: 'PUT',
        headers: {
          'Authorization': `Basic ${btoa('admin:nuestra123')}`
        }
      });

      const data = await response.json();

      if (data.success) {
        // Refrescar todos los productos desde el servidor para mostrar datos actualizados
        await fetchProducts();
        await fetchStats(); // Actualizar estadísticas
        setError('');
      } else {
        setError('Error al cambiar disponibilidad');
      }
    } catch (error) {
      console.error('Error toggling availability:', error);
      setError('Error de conexión');
    }
  };

  const categories = ['Premium', 'Plancha', 'Parrilla', 'Guisos', 'Molida', 'Especiales'];

  const getStatusColor = (available) => {
    return available 
      ? 'text-green-600 bg-green-100' 
      : 'text-red-600 bg-red-100';
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Premium': 'text-yellow-600 bg-yellow-100',
      'Plancha': 'text-blue-600 bg-blue-100',
      'Parrilla': 'text-red-600 bg-red-100',
      'Guisos': 'text-orange-600 bg-orange-100',
      'Molida': 'text-purple-600 bg-purple-100',
      'Especiales': 'text-gray-600 bg-gray-100'
    };
    return colors[category] || 'text-gray-600 bg-gray-100';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-primary-900">Gestión de Productos</h2>
        <div className="flex items-center space-x-4">
          <span className="text-primary-600">
            {products.filter(p => p.disponible).length} activos de {products.length} productos
          </span>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center space-x-3">
            <div className="bg-green-100 p-2 rounded-lg">
              <CheckCircle className="text-green-600" size={20} />
            </div>
            <div>
              <p className="text-primary-600 text-sm">Productos Activos</p>
              <p className="text-xl font-bold text-primary-900">{stats.productosActivos || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center space-x-3">
            <div className="bg-red-100 p-2 rounded-lg">
              <AlertCircle className="text-red-600" size={20} />
            </div>
            <div>
              <p className="text-primary-600 text-sm">No Disponibles</p>
              <p className="text-xl font-bold text-primary-900">{stats.productosInactivos || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center space-x-3">
            <div className="bg-yellow-100 p-2 rounded-lg">
              <Crown className="text-yellow-600" size={20} />
            </div>
            <div>
              <p className="text-primary-600 text-sm">Solicitudes Mayoristas</p>
              <p className="text-xl font-bold text-primary-900">{stats.solicitudesMayoristas || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <ShoppingBag className="text-blue-600" size={20} />
            </div>
            <div>
              <p className="text-primary-600 text-sm">Pedidos Hoy</p>
              <p className="text-xl font-bold text-primary-900">{stats.pedidosHoy || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center space-x-3">
            <div className="bg-green-100 p-2 rounded-lg">
              <TrendingUp className="text-green-600" size={20} />
            </div>
            <div>
              <p className="text-primary-600 text-sm">Ventas Hoy</p>
              <p className="text-xl font-bold text-primary-900">${stats.ventasHoy || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-400" size={20} />
              <input
                type="text"
                placeholder="Buscar por nombre o código..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter size={20} className="text-primary-600" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border border-primary-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Todas las categorías</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
          <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
          <span className="text-red-700">{error}</span>
        </div>
      )}

      {/* Lista de Productos */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-primary-50 border-b border-primary-200">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-primary-900">Código</th>
                <th className="text-left py-3 px-4 font-semibold text-primary-900">Producto</th>
                <th className="text-left py-3 px-4 font-semibold text-primary-900">Categoría</th>
                <th className="text-left py-3 px-4 font-semibold text-primary-900">Precio/Lb</th>
                <th className="text-left py-3 px-4 font-semibold text-primary-900">Precio/Kg</th>
                <th className="text-left py-3 px-4 font-semibold text-primary-900">Estado</th>
                <th className="text-left py-3 px-4 font-semibold text-primary-900">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-8">
                    <div className="flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mr-2"></div>
                      Cargando productos...
                    </div>
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-primary-600">
                    No se encontraron productos
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.codigo} className="border-b border-primary-100 hover:bg-primary-25">
                    <td className="py-3 px-4 font-mono text-sm">{product.codigo}</td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-primary-900">{product.nombre}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(product.categoria)}`}>
                        {product.categoria}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono">${product.precioMedioKilo?.toFixed(2) || '0.00'}</td>
                    <td className="py-3 px-4 font-mono">${product.precioKg?.toFixed(2) || '0.00'}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(product.disponible)}`}>
                        {product.disponible ? 'Disponible' : 'No Disponible'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                          title="Editar producto"
                        >
                          <Edit3 size={16} />
                        </button>
                        
                        <button
                          onClick={() => handleToggleAvailability(product)}
                          className="p-1 text-primary-600 hover:bg-primary-50 rounded"
                          title={product.disponible ? 'Deshabilitar' : 'Habilitar'}
                        >
                          {product.disponible ? (
                            <ToggleRight size={16} className="text-green-600" />
                          ) : (
                            <ToggleLeft size={16} className="text-red-600" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Edición */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-xl w-full max-w-md"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-primary-900">
                  Editar Producto - {editingProduct.codigo}
                </h3>
                <button
                  onClick={() => setEditingProduct(null)}
                  className="text-primary-500 hover:text-primary-700"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-primary-700 mb-2">
                    Nombre del Producto
                  </label>
                  <input
                    type="text"
                    value={editingProduct.nombre}
                    disabled
                    className="w-full px-3 py-2 border border-primary-200 rounded-lg bg-primary-50 text-primary-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-primary-700 mb-2">
                      Precio Medio Kilo ($)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={editForm.precioMedioKilo}
                      onChange={(e) => setEditForm({ ...editForm, precioMedioKilo: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-primary-700 mb-2">
                      Precio por Kilogramo ($)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={editForm.precioKg}
                      onChange={(e) => setEditForm({ ...editForm, precioKg: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-primary-700 mb-2">
                    Categoría
                  </label>
                  <select
                    value={editForm.categoria}
                    onChange={(e) => setEditForm({ ...editForm, categoria: e.target.value })}
                    className="w-full px-3 py-2 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                    <option value="No Disponible">No Disponible</option>
                  </select>
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="disponible"
                    checked={editForm.disponible}
                    onChange={(e) => setEditForm({ ...editForm, disponible: e.target.checked })}
                    className="w-4 h-4 text-primary-600 border-primary-300 rounded focus:ring-primary-500"
                  />
                  <label htmlFor="disponible" className="text-sm font-medium text-primary-700">
                    Producto disponible para venta
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-4 mt-6">
                <button
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 border border-primary-300 text-primary-700 rounded-lg hover:bg-primary-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="flex items-center space-x-2 bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors"
                >
                  <Save size={16} />
                  <span>Guardar Cambios</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;