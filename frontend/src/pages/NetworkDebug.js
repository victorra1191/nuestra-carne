import React, { useState, useEffect } from 'react';

const NetworkDebug = () => {
  const [debugInfo, setDebugInfo] = useState({});
  const [testResults, setTestResults] = useState({});

  useEffect(() => {
    // Recopilar información de debug
    const info = {
      hostname: window.location?.hostname,
      href: window.location?.href,
      protocol: window.location?.protocol,
      port: window.location?.port,
      env_backend_url: process.env.REACT_APP_BACKEND_URL,
      node_env: process.env.NODE_ENV,
      all_env: Object.keys(process.env).filter(key => key.startsWith('REACT_APP'))
    };
    
    setDebugInfo(info);
    console.log('🔍 Debug Info:', info);
  }, []);

  const constructApiUrl = () => {
    if (process.env.REACT_APP_BACKEND_URL) {
      return `${process.env.REACT_APP_BACKEND_URL}/api`;
    }
    return 'http://localhost:8001/api';
  };

  const testEndpoint = async (endpoint, method = 'GET', body = null) => {
    try {
      const url = `${constructApiUrl()}${endpoint}`;
      console.log(`🧪 Testing: ${method} ${url}`);
      
      const options = {
        method,
        headers: {
          'Content-Type': 'application/json',
        }
      };
      
      if (body) {
        options.body = JSON.stringify(body);
      }

      const response = await fetch(url, options);
      const data = await response.json();
      
      return {
        success: true,
        status: response.status,
        url,
        data
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        url: `${constructApiUrl()}${endpoint}`
      };
    }
  };

  const runAllTests = async () => {
    setTestResults({ loading: true });
    
    const tests = {
      health: await testEndpoint('/health'),
      authLogin: await testEndpoint('/auth/login', 'POST', { email: 'test@test.com', password: 'test123' }),
      adminArticles: await testEndpoint('/admin/articles'),
      promociones: await testEndpoint('/promociones/'),
    };

    setTestResults(tests);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">🔧 Network Debug - Nuestra Carne</h1>
        
        {/* Environment Info */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">📊 Environment Info</h2>
          <div className="space-y-2 font-mono text-sm">
            <div><strong>Hostname:</strong> {debugInfo.hostname}</div>
            <div><strong>Full URL:</strong> {debugInfo.href}</div>
            <div><strong>Protocol:</strong> {debugInfo.protocol}</div>
            <div><strong>Port:</strong> {debugInfo.port || 'default'}</div>
            <div><strong>NODE_ENV:</strong> {debugInfo.node_env}</div>
            <div><strong>REACT_APP_BACKEND_URL:</strong> 
              <span className={debugInfo.env_backend_url ? 'text-green-600' : 'text-red-600'}>
                {debugInfo.env_backend_url || 'NO DEFINIDA'}
              </span>
            </div>
            <div><strong>All REACT_APP vars:</strong> {debugInfo.all_env?.join(', ') || 'none'}</div>
          </div>
        </div>

        {/* Constructed URL */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">🔗 Constructed API URL</h2>
          <div className="font-mono text-sm bg-gray-100 p-3 rounded">
            {constructApiUrl()}
          </div>
        </div>

        {/* Test Button */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">🧪 Endpoint Tests</h2>
          <button 
            onClick={runAllTests}
            className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600"
          >
            Run All Tests
          </button>
          
          {testResults.loading && (
            <div className="mt-4 text-blue-600">Running tests...</div>
          )}
          
          {testResults.health && !testResults.loading && (
            <div className="mt-6 space-y-4">
              {Object.entries(testResults).map(([testName, result]) => (
                <div key={testName} className="border border-gray-200 rounded p-4">
                  <h3 className="font-bold text-lg mb-2">{testName}</h3>
                  <div><strong>URL:</strong> {result.url}</div>
                  <div><strong>Status:</strong> 
                    <span className={result.success ? 'text-green-600' : 'text-red-600'}>
                      {result.success ? `✅ ${result.status}` : `❌ ${result.error}`}
                    </span>
                  </div>
                  {result.data && (
                    <details className="mt-2">
                      <summary className="cursor-pointer text-blue-600">Show Response</summary>
                      <pre className="text-xs mt-2 bg-gray-100 p-2 rounded overflow-auto">
                        {JSON.stringify(result.data, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NetworkDebug;