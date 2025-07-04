import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Crown,
  User,
  Mail,
  Phone,
  Calendar,
  CheckCircle,
  X,
  MessageCircle,
  AlertCircle,
  Clock
} from 'lucide-react';

const AdminWholesale = ({ API_BASE }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processingRequest, setProcessingRequest] = useState(null);
  const [comments, setComments] = useState('');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/auth/wholesale-requests`, {
        headers: {
          'Authorization': `Basic ${btoa('admin:nuestra123')}`
        }
      });

      const data = await response.json();

      if (data.success) {
        setRequests(data.requests || []);
      } else {
        setError('Error al cargar solicitudes');
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (requestId) => {
    try {
      const response = await fetch(`${API_BASE}/auth/wholesale-requests/${requestId}/approve`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${btoa('admin:nuestra123')}`
        },
        body: JSON.stringify({ comentarios: comments })
      });

      const data = await response.json();

      if (data.success) {
        // Actualizar la solicitud en la lista local
        setRequests(requests.map(r => 
          r.id === requestId 
            ? { ...r, estado: 'aprobada', fechaAprobacion: new Date().toISOString(), comentarios: comments }
            : r
        ));
        setProcessingRequest(null);
        setComments('');
      } else {
        setError(data.error || 'Error al aprobar solicitud');
      }
    } catch (error) {
      console.error('Error approving request:', error);
      setError('Error de conexión');
    }
  };

  const handleReject = async (requestId) => {
    try {
      const response = await fetch(`${API_BASE}/api/auth/wholesale-requests/${requestId}/reject`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${btoa('admin:nuestra123')}`
        },
        body: JSON.stringify({ comentarios: comments })
      });

      const data = await response.json();

      if (data.success) {
        // Actualizar la solicitud en la lista local
        setRequests(requests.map(r => 
          r.id === requestId 
            ? { ...r, estado: 'rechazada', fechaRechazo: new Date().toISOString(), comentarios: comments }
            : r
        ));
        setProcessingRequest(null);
        setComments('');
      } else {
        setError(data.error || 'Error al rechazar solicitud');
      }
    } catch (error) {
      console.error('Error rejecting request:', error);
      setError('Error de conexión');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pendiente': return 'text-yellow-600 bg-yellow-100';
      case 'aprobada': return 'text-green-600 bg-green-100';
      case 'rechazada': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pendiente': return 'Pendiente';
      case 'aprobada': return 'Aprobada';
      case 'rechazada': return 'Rechazada';
      default: return status;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pendiente': return <Clock size={16} />;
      case 'aprobada': return <CheckCircle size={16} />;
      case 'rechazada': return <X size={16} />;
      default: return <AlertCircle size={16} />;
    }
  };

  const pendingRequests = requests.filter(r => r.estado === 'pendiente');
  const processedRequests = requests.filter(r => r.estado !== 'pendiente');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Crown className="text-yellow-500" size={24} />
          <h2 className="text-2xl font-bold text-primary-900">Solicitudes Mayoristas</h2>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-primary-600">
            {pendingRequests.length} pendientes de {requests.length} total
          </span>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
          <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
          <span className="text-red-700">{error}</span>
        </div>
      )}

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center space-x-3">
            <div className="bg-yellow-100 p-2 rounded-lg">
              <Clock className="text-yellow-600" size={20} />
            </div>
            <div>
              <p className="text-primary-600 text-sm">Pendientes</p>
              <p className="text-xl font-bold text-primary-900">{pendingRequests.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center space-x-3">
            <div className="bg-green-100 p-2 rounded-lg">
              <CheckCircle className="text-green-600" size={20} />
            </div>
            <div>
              <p className="text-primary-600 text-sm">Aprobadas</p>
              <p className="text-xl font-bold text-primary-900">
                {requests.filter(r => r.estado === 'aprobada').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center space-x-3">
            <div className="bg-red-100 p-2 rounded-lg">
              <X className="text-red-600" size={20} />
            </div>
            <div>
              <p className="text-primary-600 text-sm">Rechazadas</p>
              <p className="text-xl font-bold text-primary-900">
                {requests.filter(r => r.estado === 'rechazada').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mr-2"></div>
            Cargando solicitudes...
          </div>
        </div>
      ) : (
        <>
          {/* Solicitudes Pendientes */}
          {pendingRequests.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-4 border-b border-primary-200">
                <h3 className="text-lg font-bold text-primary-900 flex items-center space-x-2">
                  <Clock className="text-yellow-600" size={20} />
                  <span>Solicitudes Pendientes ({pendingRequests.length})</span>
                </h3>
              </div>
              
              <div className="divide-y divide-primary-100">
                {pendingRequests.map((request) => (
                  <div key={request.id} className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-3">
                            <div className="flex items-center space-x-2">
                              <User className="text-primary-600" size={16} />
                              <span className="font-semibold text-primary-900">{request.nombre}</span>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <Mail className="text-primary-600" size={16} />
                              <span className="text-primary-700">{request.email}</span>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <Phone className="text-primary-600" size={16} />
                              <span className="text-primary-700">{request.telefono}</span>
                            </div>
                          </div>
                          
                          <div className="space-y-3">
                            <div className="flex items-center space-x-2">
                              <Calendar className="text-primary-600" size={16} />
                              <span className="text-primary-700">
                                {new Date(request.fechaSolicitud).toLocaleDateString('es-ES')}
                              </span>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              {getStatusIcon(request.estado)}
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.estado)}`}>
                                {getStatusText(request.estado)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => setProcessingRequest({ ...request, action: 'approve' })}
                          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2"
                        >
                          <CheckCircle size={16} />
                          <span>Aprobar</span>
                        </button>
                        
                        <button
                          onClick={() => setProcessingRequest({ ...request, action: 'reject' })}
                          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center space-x-2"
                        >
                          <X size={16} />
                          <span>Rechazar</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Solicitudes Procesadas */}
          {processedRequests.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-4 border-b border-primary-200">
                <h3 className="text-lg font-bold text-primary-900">
                  Historial de Solicitudes ({processedRequests.length})
                </h3>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-primary-50 border-b border-primary-200">
                    <tr>
                      <th className="text-left py-3 px-4 font-semibold text-primary-900">Solicitante</th>
                      <th className="text-left py-3 px-4 font-semibold text-primary-900">Email</th>
                      <th className="text-left py-3 px-4 font-semibold text-primary-900">Fecha Solicitud</th>
                      <th className="text-left py-3 px-4 font-semibold text-primary-900">Estado</th>
                      <th className="text-left py-3 px-4 font-semibold text-primary-900">Comentarios</th>
                    </tr>
                  </thead>
                  <tbody>
                    {processedRequests.map((request) => (
                      <tr key={request.id} className="border-b border-primary-100 hover:bg-primary-25">
                        <td className="py-3 px-4">
                          <div className="font-medium text-primary-900">{request.nombre}</div>
                          <div className="text-sm text-primary-600">{request.telefono}</div>
                        </td>
                        <td className="py-3 px-4 text-primary-700">{request.email}</td>
                        <td className="py-3 px-4 text-primary-700">
                          {new Date(request.fechaSolicitud).toLocaleDateString('es-ES')}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.estado)}`}>
                            {getStatusText(request.estado)}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-primary-700 max-w-xs truncate">
                          {request.comentarios || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {requests.length === 0 && (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <Crown className="text-primary-400 mx-auto mb-4" size={48} />
              <h3 className="text-lg font-medium text-primary-900 mb-2">No hay solicitudes mayoristas</h3>
              <p className="text-primary-600">
                Las nuevas solicitudes de mayoristas aparecerán aquí para su revisión.
              </p>
            </div>
          )}
        </>
      )}

      {/* Modal de Procesamiento */}
      {processingRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-xl w-full max-w-md"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-primary-900">
                  {processingRequest.action === 'approve' ? 'Aprobar' : 'Rechazar'} Solicitud
                </h3>
                <button
                  onClick={() => setProcessingRequest(null)}
                  className="text-primary-500 hover:text-primary-700"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="mb-4">
                <p className="text-primary-700 mb-2">
                  ¿Estás seguro de que quieres {processingRequest.action === 'approve' ? 'aprobar' : 'rechazar'} 
                  la solicitud de <strong>{processingRequest.nombre}</strong>?
                </p>
                
                {processingRequest.action === 'approve' && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="text-green-600" size={16} />
                      <span className="text-green-800 text-sm">
                        El usuario obtendrá acceso a precios mayoristas (30% descuento)
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-primary-700 mb-2">
                  Comentarios {processingRequest.action === 'reject' ? '(requerido)' : '(opcional)'}
                </label>
                <textarea
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder={
                    processingRequest.action === 'approve' 
                      ? 'Mensaje de bienvenida o instrucciones adicionales...'
                      : 'Razón del rechazo...'
                  }
                  className="w-full px-3 py-2 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  rows="3"
                />
              </div>

              <div className="flex items-center justify-end space-x-4">
                <button
                  onClick={() => setProcessingRequest(null)}
                  className="px-4 py-2 border border-primary-300 text-primary-700 rounded-lg hover:bg-primary-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    if (processingRequest.action === 'approve') {
                      handleApprove(processingRequest.id);
                    } else {
                      if (!comments.trim()) {
                        setError('Los comentarios son requeridos para rechazar una solicitud');
                        return;
                      }
                      handleReject(processingRequest.id);
                    }
                  }}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-white transition-colors ${
                    processingRequest.action === 'approve' 
                      ? 'bg-green-500 hover:bg-green-600' 
                      : 'bg-red-500 hover:bg-red-600'
                  }`}
                >
                  {processingRequest.action === 'approve' ? (
                    <CheckCircle size={16} />
                  ) : (
                    <X size={16} />
                  )}
                  <span>
                    {processingRequest.action === 'approve' ? 'Aprobar' : 'Rechazar'} Solicitud
                  </span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminWholesale;