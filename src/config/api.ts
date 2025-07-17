// Configuración de la API
export const API_CONFIG = {
  // URL base de la API - puedes cambiar esto en producción
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  
  // Timeout para las peticiones (en milisegundos)
  TIMEOUT: 10000,
  
  // Headers por defecto
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
  },
} as const;

// Función para construir URLs completas de la API
export const buildApiUrl = (endpoint: string): string => {
  const baseUrl = API_CONFIG.BASE_URL.replace(/\/$/, ''); // Remover trailing slash
  const cleanEndpoint = endpoint.replace(/^\//, ''); // Remover leading slash
  return `${baseUrl}/${cleanEndpoint}`;
};

// Función para obtener información de debug
export const getApiDebugInfo = () => ({
  baseUrl: API_CONFIG.BASE_URL,
  frontendPort: typeof window !== 'undefined' ? window.location.port : 'unknown',
  fullUrl: buildApiUrl('/'),
}); 