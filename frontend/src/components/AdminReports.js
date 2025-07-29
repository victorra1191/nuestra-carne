import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Download, 
  FileText, 
  TrendingUp, 
  Users, 
  Package,
  DollarSign,
  BarChart3,
  Clock,
  Mail,
  Smartphone
} from 'lucide-react';

const AdminReports = ({ API_BASE }) => {
  const [loading, setLoading] = useState(false);
  const [currentReport, setCurrentReport] = useState(null);
  const [reportHistory, setReportHistory] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Función para obtener API base si no se pasa como prop
  const getApiBase = () => {
    if (API_BASE) return API_BASE;
    
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
        return 'https://nuestracarnepa.com/api';
      }
      return 'http://localhost:8001/api';
    }
    return 'https://nuestracarnepa.com/api';
  };

  const API_URL = getApiBase();

  useEffect(() => {
    fetchReportHistory();
  }, []);

  const fetchReportHistory = async () => {
    try {
      const response = await fetch(`${API_URL}/reports/history`, {
        headers: {
          'Authorization': `Basic ${btoa('admin:nuestra123')}`
        }
      });
      const data = await response.json();
      
      if (data.success) {
        setReportHistory(data.reports);
      }
    } catch (error) {
      console.error('Error fetching report history:', error);
    }
  };

  const generateWeeklyReport = async (date = null) => {
    try {
      setLoading(true);
      
      const url = date 
        ? `${API_URL}/reports/weekly/${date}`
        : `${API_URL}/reports/weekly`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Basic ${btoa('admin:nuestra123')}`
        }
      });
      const data = await response.json();
      
      if (data.success) {
        setCurrentReport(data.report);
      } else {
        alert('Error generando reporte: ' + data.error);
      }
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Error generando reporte');
    } finally {
      setLoading(false);
    }
  };

  const sendWeeklyReport = async () => {
    try {
      setLoading(true);
      
      const response = await fetch(`${API_URL}/reports/send-weekly`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${btoa('admin:nuestra123')}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      
      if (data.success) {
        alert('✅ Reporte enviado exitosamente por WhatsApp/Email');
      } else {
        alert('Error enviando reporte: ' + data.error);
      }
    } catch (error) {
      console.error('Error sending report:', error);
      alert('Error enviando reporte');
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = () => {
    if (!currentReport) return;
    
    const reportData = {
      ...currentReport,
      downloadedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reporte-semanal-${currentReport.reportId}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-primary-900">Reportes Semanales</h2>
        <div className="flex gap-3">
          <button
            onClick={() => generateWeeklyReport()}
            disabled={loading}
            className="btn-primary flex items-center gap-2"
          >
            <FileText size={16} />
            {loading ? 'Generando...' : 'Reporte Actual'}
          </button>
          
          <button
            onClick={sendWeeklyReport}
            disabled={loading}
            className="btn-outline flex items-center gap-2"
          >
            <Mail size={16} />
            Enviar por WhatsApp
          </button>
        </div>
      </div>

      {/* Generador de reportes por fecha */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Generar Reporte por Fecha</h3>
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Seleccionar Fecha (cualquier día de la semana)
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <button
            onClick={() => generateWeeklyReport(selectedDate)}
            disabled={loading}
            className="btn-outline flex items-center gap-2"
          >
            <Calendar size={16} />
            Generar
          </button>
        </div>
      </div>

      {/* Historial de reportes */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Historial de Reportes</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reportHistory.map((report) => (
            <div key={report.id} className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">
                  {report.period.description}
                </h4>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                {new Date(report.period.start).toLocaleDateString('es-ES')} - {new Date(report.period.end).toLocaleDateString('es-ES')}
              </p>
              <button
                onClick={() => generateWeeklyReport(report.period.start)}
                className="btn-outline text-sm w-full"
              >
                Ver Reporte
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Reporte actual */}
      {currentReport && (
        <div className="space-y-6">
          {/* Header del reporte */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-primary-900">
                  {currentReport.period.description}
                </h3>
                <p className="text-sm text-gray-600">
                  Generado el {new Date(currentReport.generatedAt).toLocaleString('es-ES')}
                </p>
              </div>
              <button
                onClick={downloadReport}
                className="btn-outline flex items-center gap-2"
              >
                <Download size={16} />
                Descargar JSON
              </button>
            </div>
          </div>

          {/* Métricas principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Package className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Pedidos</p>
                  <p className="text-2xl font-bold text-gray-900">{currentReport.summary.totalOrders}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Ingresos</p>
                  <p className="text-2xl font-bold text-gray-900">${currentReport.summary.totalRevenue.toFixed(2)}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Ticket Promedio</p>
                  <p className="text-2xl font-bold text-gray-900">${currentReport.summary.averageOrderValue.toFixed(2)}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Entregados</p>
                  <p className="text-2xl font-bold text-gray-900">{currentReport.summary.ordersByStatus.entregado}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Cortes más vendidos */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              Cortes Más Vendidos
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentReport.topProducts.map((producto, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg border-l-4 border-primary-500">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-900">#{index + 1} {producto.nombre}</p>
                      <p className="text-sm text-gray-600">Código: {producto.codigo}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-primary-600">{producto.cantidad}</p>
                      <p className="text-xs text-gray-500">unidades</p>
                    </div>
                  </div>
                  <div className="mt-2 text-sm text-gray-600">
                    <p>💰 Ingresos: ${producto.ingresos?.toFixed(2)}</p>
                    <p>📦 En {producto.pedidos} pedidos</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mejores clientes */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Mejores Clientes
            </h3>
            <div className="space-y-4">
              {currentReport.topCustomers.map((cliente, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-primary-600 font-medium">#{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{cliente.nombre}</p>
                      <p className="text-sm text-gray-600">📞 {cliente.telefono}</p>
                      <p className="text-sm text-gray-600">📧 {cliente.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-primary-600">${cliente.totalGastado.toFixed(2)}</p>
                    <p className="text-sm text-gray-600">{cliente.pedidos} pedidos</p>
                    <p className="text-xs text-gray-500">{cliente.productos.length} productos</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Análisis diario */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Análisis Diario</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pedidos
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ingresos
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Productos
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentReport.dailyAnalysis.map((day, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {new Date(day.fecha).toLocaleDateString('es-ES', { 
                          weekday: 'long', 
                          day: '2-digit', 
                          month: '2-digit' 
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {day.pedidos}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${day.ingresos.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {day.productos}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReports;