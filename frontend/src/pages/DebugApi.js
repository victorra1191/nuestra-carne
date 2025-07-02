import React, { useState, useEffect } from 'react';

const DebugApi = () => {
  const [debugInfo, setDebugInfo] = useState({});
  const [testResult, setTestResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Recopilar información de debug
    const info = {
      hostname: window.location?.hostname,
      href: window.location?.href,
      protocol: window.location?.protocol,
      port: window.location?.port,
      env_backend_url: process.env.REACT_APP_BACKEND_URL,
      node_env: process.env.NODE_ENV,
    };
    
    setDebugInfo(info);
    console.log('🐛 [DebugApi] Info recopilada:', info);
  }, []);

  const constructApiUrl = () => {
    if (process.env.REACT_APP_BACKEND_URL) {
      return `${process.env.REACT_APP_BACKEND_URL}/api/admin/articles`;
    }
    return 'http://localhost:8001/api/admin/articles';
  };

  const testApiCall = async () => {
    setLoading(true);
    setTestResult(null);
    
    try {
      const apiUrl = constructApiUrl();
      console.log('🧪 [DebugApi] Testing URL:', apiUrl);
      
      const response = await fetch(apiUrl);
      console.log('🧪 [DebugApi] Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('🧪 [DebugApi] Response data:', data);
      
      setTestResult({
        success: true,
        url: apiUrl,
        status: response.status,
        articlesCount: data.articles?.length || 0,
        data: data
      });
    } catch (error) {
      console.error('🧪 [DebugApi] Error:', error);
      setTestResult({
        success: false,
        url: constructApiUrl(),
        error: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">🐛 Debug API - Nuestra Carne</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">📊 Información del Entorno</h2>
          <div className="space-y-2 font-mono text-sm">
            <div><strong>Hostname:</strong> {debugInfo.hostname}</div>
            <div><strong>Full URL:</strong> {debugInfo.href}</div>
            <div><strong>Protocol:</strong> {debugInfo.protocol}</div>
            <div><strong>Port:</strong> {debugInfo.port}</div>
            <div><strong>REACT_APP_BACKEND_URL:</strong> {debugInfo.env_backend_url || 'NO DEFINIDA'}</div>
            <div><strong>NODE_ENV:</strong> {debugInfo.node_env}</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">🔗 URL Construida</h2>
          <div className="font-mono text-sm bg-gray-100 p-3 rounded">
            {constructApiUrl()}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">🧪 Test de API</h2>
          <button 
            onClick={testApiCall}
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Probando...' : 'Probar API'}
          </button>
          
          {testResult && (
            <div className="mt-4">
              <h3 className="font-bold mb-2">Resultado:</h3>
              <div className={`p-4 rounded ${testResult.success ? 'bg-green-100' : 'bg-red-100'}`}>
                <div><strong>URL:</strong> {testResult.url}</div>
                <div><strong>Estado:</strong> {testResult.success ? '✅ Éxito' : '❌ Error'}</div>
                {testResult.success ? (
                  <>
                    <div><strong>Status HTTP:</strong> {testResult.status}</div>
                    <div><strong>Artículos encontrados:</strong> {testResult.articlesCount}</div>
                  </>
                ) : (
                  <div><strong>Error:</strong> {testResult.error}</div>
                )}
                
                {testResult.data && (
                  <details className="mt-4">
                    <summary className="cursor-pointer font-bold">Ver datos completos</summary>
                    <pre className="text-xs mt-2 bg-gray-200 p-2 rounded overflow-auto">
                      {JSON.stringify(testResult.data, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DebugApi;