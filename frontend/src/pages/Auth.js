import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  User, 
  Mail, 
  Phone, 
  Lock, 
  Eye, 
  EyeOff, 
  UserPlus, 
  LogIn,
  Building,
  Home,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    password: '',
    confirmPassword: '',
    tipo: 'individual'
  });

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (isLogin) {
        // Login
        const result = await login(formData.email, formData.password);
        
        if (result.success) {
          navigate(from, { replace: true });
        } else {
          setError(result.error);
        }
      } else {
        // Registro
        if (formData.password !== formData.confirmPassword) {
          setError('Las contraseñas no coinciden');
          return;
        }

        if (formData.password.length < 6) {
          setError('La contraseña debe tener al menos 6 caracteres');
          return;
        }

        const result = await register(formData);
        
        if (result.success) {
          if (result.requiresApproval) {
            setSuccess(result.message);
            setIsLogin(true);
            setFormData({ ...formData, password: '', confirmPassword: '' });
          } else {
            navigate(from, { replace: true });
          }
        } else {
          setError(result.error);
        }
      }
    } catch (error) {
      setError('Error de conexión. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setSuccess('');
    setFormData({
      nombre: '',
      email: '',
      telefono: '',
      password: '',
      confirmPassword: '',
      tipo: 'individual'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-wine-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-primary-500 rounded-full flex items-center justify-center">
            <div className="text-white font-bold text-xl">NC</div>
          </div>
          <h1 className="text-3xl font-bold text-primary-900 mb-2">
            {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
          </h1>
          <p className="text-primary-600">
            {isLogin 
              ? 'Accede a tu cuenta para hacer pedidos' 
              : 'Regístrate para una experiencia personalizada'}
          </p>
        </div>

        {/* Alerts */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center">
            <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
            <span className="text-red-700">{error}</span>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center">
            <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
            <span className="text-green-700">{success}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Tipo de Usuario (solo en registro) */}
          {!isLogin && (
            <div>
              <label className="block text-sm font-semibold text-primary-700 mb-2">
                Tipo de Cliente
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, tipo: 'individual' })}
                  className={`p-3 border-2 rounded-lg flex items-center justify-center space-x-2 transition-all ${
                    formData.tipo === 'individual'
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-primary-200 text-primary-600 hover:border-primary-300'
                  }`}
                >
                  <User size={20} />
                  <span className="font-medium">Individual</span>
                </button>
                
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, tipo: 'mayorista' })}
                  className={`p-3 border-2 rounded-lg flex items-center justify-center space-x-2 transition-all ${
                    formData.tipo === 'mayorista'
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-primary-200 text-primary-600 hover:border-primary-300'
                  }`}
                >
                  <Building size={20} />
                  <span className="font-medium">Mayorista</span>
                </button>
              </div>
              {formData.tipo === 'mayorista' && (
                <p className="text-sm text-primary-600 mt-2">
                  * Las cuentas mayoristas requieren aprobación del administrador
                </p>
              )}
            </div>
          )}

          {/* Nombre (solo en registro) */}
          {!isLogin && (
            <div>
              <label className="block text-sm font-semibold text-primary-700 mb-2">
                Nombre Completo *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-400" size={20} />
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Tu nombre completo"
                  required
                />
              </div>
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-primary-700 mb-2">
              Email *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-400" size={20} />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-12 pr-4 py-3 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="tu@email.com"
                required
              />
            </div>
          </div>

          {/* Teléfono (solo en registro) */}
          {!isLogin && (
            <div>
              <label className="block text-sm font-semibold text-primary-700 mb-2">
                Teléfono *
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-400" size={20} />
                <input
                  type="tel"
                  value={formData.telefono}
                  onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="+507 6XXX-XXXX"
                  required
                />
              </div>
            </div>
          )}

          {/* Contraseña */}
          <div>
            <label className="block text-sm font-semibold text-primary-700 mb-2">
              Contraseña *
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-400" size={20} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-12 pr-12 py-3 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Tu contraseña"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary-400 hover:text-primary-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Confirmar contraseña (solo en registro) */}
          {!isLogin && (
            <div>
              <label className="block text-sm font-semibold text-primary-700 mb-2">
                Confirmar Contraseña *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-400" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Confirma tu contraseña"
                  required
                  minLength={6}
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-500 text-white py-3 px-4 rounded-lg hover:bg-primary-600 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                {isLogin ? <LogIn size={20} /> : <UserPlus size={20} />}
                <span>{isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}</span>
              </>
            )}
          </button>
        </form>

        {/* Toggle Mode */}
        <div className="mt-6 text-center">
          <p className="text-primary-600">
            {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
          </p>
          <button
            onClick={toggleMode}
            className="text-primary-500 hover:text-primary-700 font-semibold ml-1"
          >
            {isLogin ? 'Regístrate aquí' : 'Inicia sesión aquí'}
          </button>
        </div>

        {/* Guest Option */}
        <div className="mt-6 text-center border-t border-primary-200 pt-6">
          <p className="text-primary-600 mb-3">¿Solo quieres hacer un pedido?</p>
          <button
            onClick={() => navigate('/haz-tu-pedido')}
            className="text-primary-500 hover:text-primary-700 font-semibold flex items-center justify-center space-x-2 mx-auto"
          >
            <Home size={16} />
            <span>Continuar sin cuenta</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;