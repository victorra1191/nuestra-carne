import React from 'react';
import { Wrench, Clock, Mail, Phone } from 'lucide-react';

const MaintenancePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-600 via-red-700 to-red-800 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        {/* Logo */}
        <div className="mb-8">
          <img 
            src="/images/logo/nuestra-carne-logo.png"
            alt="Nuestra Carne Logo"
            className="h-20 w-auto mx-auto mb-4"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            Nuestra Carne
          </h1>
          <p className="text-xl text-red-100">
            Carne 100% Nacional Premium
          </p>
        </div>

        {/* Maintenance Message */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-white/20">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-yellow-500 rounded-full p-4">
              <Wrench className="h-8 w-8 text-white" />
            </div>
          </div>
          
          <h2 className="text-3xl font-bold text-white mb-4">
            Mantenimiento Programado
          </h2>
          
          <p className="text-lg text-red-100 mb-6 leading-relaxed">
            Estamos actualizando nuestro sistema de pedidos para brindarte una mejor experiencia. 
            Nuestro equipo está trabajando para tener todo funcionando perfectamente.
          </p>
          
          <div className="flex items-center justify-center space-x-2 text-yellow-300 mb-6">
            <Clock className="h-5 w-5" />
            <span className="text-lg font-semibold">Tiempo estimado: 30-45 minutos</span>
          </div>
          
          <div className="bg-white/20 rounded-lg p-4 mb-6">
            <p className="text-white text-sm">
              <strong>¿Qué estamos mejorando?</strong><br/>
              • Sincronización de precios en tiempo real<br/>
              • Optimización del sistema de pedidos<br/>
              • Mejoras en la experiencia del usuario
            </p>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
          <h3 className="text-2xl font-bold text-white mb-4">
            ¿Necesitas hacer un pedido urgente?
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-3">
              <div className="bg-green-500 rounded-full p-2">
                <Phone className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-white font-semibold">WhatsApp</p>
                <a 
                  href="https://wa.me/50769172690" 
                  className="text-green-300 hover:text-green-100 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  +507 6917-2690
                </a>
              </div>
            </div>
            
            <div className="flex items-center justify-center space-x-3">
              <div className="bg-blue-500 rounded-full p-2">
                <Mail className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-white font-semibold">Email</p>
                <a 
                  href="mailto:info@nuestracarnepa.com" 
                  className="text-blue-300 hover:text-blue-100 transition-colors"
                >
                  info@nuestracarnepa.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-red-200 text-sm">
            Gracias por tu paciencia. Estaremos de vuelta pronto con mejoras increíbles.
          </p>
          <p className="text-red-300 text-xs mt-2">
            Última actualización: {new Date().toLocaleTimeString('es-ES')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MaintenancePage;