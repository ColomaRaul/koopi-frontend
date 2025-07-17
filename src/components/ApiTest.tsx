'use client';

import { useApi } from '@/hooks/useApi';
import { getApiDebugInfo } from '@/config/api';

// Tipo de ejemplo para los datos de la API
interface TestData {
  message?: string;
  timestamp?: string;
}

export default function ApiTest() {
  const { data, error, isLoading, isSuccess, isError, get, reset } = useApi<TestData | string>();

  const handleTestApi = async () => {
    try {
      // Ejemplo de petición GET a tu API
      await get('/');
    } catch (error) {
      console.error('Error al hacer la petición:', error);
    }
  };

  const handleReset = () => {
    reset();
  };

  const debugInfo = getApiDebugInfo();

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Prueba de API</h2>
      
      <div className="space-y-4">
        <div className="flex gap-2">
          <button
            onClick={handleTestApi}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Cargando...' : 'Probar API'}
          </button>
          
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Reset
          </button>
        </div>

        {/* Estado de la petición */}
        <div className="text-sm">
          {isLoading && (
            <div className="text-blue-600">🔄 Haciendo petición...</div>
          )}
          
          {isSuccess && (
            <div className="text-green-600">✅ Petición exitosa</div>
          )}
          
          {isError && (
            <div className="text-red-600">❌ Error en la petición</div>
          )}
        </div>

        {/* Datos de la respuesta */}
        {data && (
          <div className="bg-green-50 p-4 rounded border border-green-200">
            <h3 className="font-semibold text-green-800 mb-2">Respuesta de la API:</h3>
            <pre className="text-sm text-green-700 whitespace-pre-wrap">
              {typeof data === 'string' ? data : JSON.stringify(data, null, 2)}
            </pre>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 p-4 rounded border border-red-200">
            <h3 className="font-semibold text-red-800 mb-2">Error:</h3>
            <p className="text-sm text-red-700">
              {error.message}
              {error.status && ` (${error.status})`}
            </p>
            {error.message.includes('CORS') && (
              <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
                <strong>💡 Solución:</strong> Necesitas configurar CORS en tu backend de NestJS. 
                Revisa el archivo <code>CORS_SETUP.md</code> para las instrucciones.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 