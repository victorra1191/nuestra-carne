import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Calendar, Percent, DollarSign, Tag, Save, X } from 'lucide-react';

const AdminPromociones = () => {
  const [promociones, setPromociones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPromo, setEditingPromo] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    tipo: 'porcentaje',
    valor: '',
    descripcion: '',
    codigo: '',
    montoMinimo: '',
    fechaInicio: '',
    fechaFin: '',
    usoMaximo: '',
    aplicableA: 'todos',
    categorias: []
  });

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

  useEffect(() => {
    fetchPromociones();
  }, []);

  const fetchPromociones = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE}/promociones/admin/all`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setPromociones(data.promociones || []);
      } else {
        console.error('Error al cargar promociones');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('adminToken');
      const url = editingPromo ? 
        `${API_BASE}/promociones/admin/${editingPromo.id}` : 
        `${API_BASE}/promociones/admin/create`;
      
      const method = editingPromo ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        fetchPromociones();
        resetForm();
        setShowModal(false);
      } else {
        const error = await response.json();
        alert(error.error || 'Error al guardar promoción');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al guardar promoción');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de eliminar esta promoción?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE}/promociones/admin/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        fetchPromociones();
      } else {
        alert('Error al eliminar promoción');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al eliminar promoción');
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      tipo: 'porcentaje',
      valor: '',
      descripcion: '',
      codigo: '',
      montoMinimo: '',
      fechaInicio: '',
      fechaFin: '',
      usoMaximo: '',
      aplicableA: 'todos',
      categorias: []
    });
    setEditingPromo(null);
  };

  const openEditModal = (promocion) => {
    setFormData({
      nombre: promocion.nombre,
      tipo: promocion.tipo,
      valor: promocion.valor.toString(),
      descripcion: promocion.descripcion,
      codigo: promocion.codigo,
      montoMinimo: promocion.montoMinimo.toString(),
      fechaInicio: promocion.fechaInicio.split('T')[0],
      fechaFin: promocion.fechaFin.split('T')[0],
      usoMaximo: promocion.usoMaximo.toString(),
      aplicableA: promocion.aplicableA,
      categorias: promocion.categorias
    });
    setEditingPromo(promocion);
    setShowModal(true);
  };

  const openNewModal = () => {
    resetForm();
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Cargando promociones...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Promociones</h1>
            <p className="text-gray-600">Crea y administra códigos promocionales</p>
          </div>
          <button
            onClick={openNewModal}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus size={20} />
            Nueva Promoción
          </button>
        </div>

        {/* Lista de Promociones */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {promociones.map((promocion) => (
            <motion.div
              key={promocion.id}
              className="bg-white rounded-lg shadow-md p-6 border"
              whileHover={{ y: -2 }}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <Tag className="text-blue-600" size={20} />
                  <h3 className="font-bold text-lg">{promocion.nombre}</h3>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEditModal(promocion)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(promocion.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2">
                  <span className="font-mono bg-gray-100 px-2 py-1 rounded text-sm">
                    {promocion.codigo}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs ${
                    promocion.activa ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {promocion.activa ? 'Activa' : 'Inactiva'}
                  </span>
                </div>

                <p className="text-gray-600 text-sm">{promocion.descripcion}</p>

                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    {promocion.tipo === 'porcentaje' ? <Percent size={14} /> : <DollarSign size={14} />}
                    <span className="font-semibold text-green-600">
                      {promocion.tipo === 'porcentaje' ? `${promocion.valor}%` : `$${promocion.valor}`}
                    </span>
                  </div>
                  <div className="text-gray-500">
                    Min: ${promocion.montoMinimo}
                  </div>
                </div>

                <div className="text-xs text-gray-500">
                  <p>Usos: {promocion.usoActual}/{promocion.usoMaximo}</p>
                  <p>Válida hasta: {new Date(promocion.fechaFin).toLocaleDateString()}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {promociones.length === 0 && (
          <div className="text-center py-12">
            <Tag size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No hay promociones</h3>
            <p className="text-gray-500 mb-4">Crea tu primera promoción para empezar</p>
            <button
              onClick={openNewModal}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              Crear Promoción
            </button>
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">
                  {editingPromo ? 'Editar Promoción' : 'Nueva Promoción'}
                </h2>
                <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Nombre</label>
                    <input
                      type="text"
                      value={formData.nombre}
                      onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                      className="w-full border rounded-lg px-3 py-2"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Código</label>
                    <input
                      type="text"
                      value={formData.codigo}
                      onChange={(e) => setFormData({...formData, codigo: e.target.value.toUpperCase()})}
                      className="w-full border rounded-lg px-3 py-2"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Tipo de Descuento</label>
                    <select
                      value={formData.tipo}
                      onChange={(e) => setFormData({...formData, tipo: e.target.value})}
                      className="w-full border rounded-lg px-3 py-2"
                    >
                      <option value="porcentaje">Porcentaje (%)</option>
                      <option value="fijo">Monto Fijo ($)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Valor {formData.tipo === 'porcentaje' ? '(%)' : '($)'}
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.valor}
                      onChange={(e) => setFormData({...formData, valor: e.target.value})}
                      className="w-full border rounded-lg px-3 py-2"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Monto Mínimo ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.montoMinimo}
                      onChange={(e) => setFormData({...formData, montoMinimo: e.target.value})}
                      className="w-full border rounded-lg px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Uso Máximo</label>
                    <input
                      type="number"
                      value={formData.usoMaximo}
                      onChange={(e) => setFormData({...formData, usoMaximo: e.target.value})}
                      className="w-full border rounded-lg px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Fecha Inicio</label>
                    <input
                      type="date"
                      value={formData.fechaInicio}
                      onChange={(e) => setFormData({...formData, fechaInicio: e.target.value})}
                      className="w-full border rounded-lg px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Fecha Fin</label>
                    <input
                      type="date"
                      value={formData.fechaFin}
                      onChange={(e) => setFormData({...formData, fechaFin: e.target.value})}
                      className="w-full border rounded-lg px-3 py-2"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Descripción</label>
                  <textarea
                    value={formData.descripcion}
                    onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                    className="w-full border rounded-lg px-3 py-2"
                    rows="3"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                  >
                    <Save size={16} />
                    {editingPromo ? 'Actualizar' : 'Crear'} Promoción
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPromociones;