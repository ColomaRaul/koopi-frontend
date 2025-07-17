import { API_CONFIG, buildApiUrl } from '@/config/api';

// Tipos para las respuestas de la API
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

// Clase para manejar errores de la API
export class ApiError extends Error {
  public status?: number;
  public code?: string;

  constructor(message: string, status?: number, code?: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

// Función para hacer peticiones HTTP con manejo de errores
async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeout: number = API_CONFIG.TIMEOUT
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        ...API_CONFIG.DEFAULT_HEADERS,
        ...options.headers,
      },
    });

    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new ApiError('La petición tardó demasiado tiempo', 408);
    }
    throw error;
  }
}

// Función para procesar la respuesta de la API
async function processResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorMessage = `Error ${response.status}: ${response.statusText}`;
    
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch {
      // Si no se puede parsear el JSON, usar el mensaje por defecto
    }

    throw new ApiError(errorMessage, response.status);
  }

  // Si la respuesta está vacía, retornar null
  if (response.status === 204) {
    return null as T;
  }

  // Obtener el tipo de contenido
  const contentType = response.headers.get('content-type');
  
  // Si es JSON, parsear como JSON
  if (contentType && contentType.includes('application/json')) {
    try {
      return await response.json();
    } catch (error) {
      throw new ApiError('Error al procesar la respuesta JSON de la API');
    }
  }
  
  // Si es texto plano, retornar como string
  if (contentType && contentType.includes('text/plain')) {
    try {
      const text = await response.text();
      return text as T;
    } catch (error) {
      throw new ApiError('Error al procesar la respuesta de texto de la API');
    }
  }
  
  // Por defecto, intentar como texto
  try {
    const text = await response.text();
    return text as T;
  } catch (error) {
    throw new ApiError('Error al procesar la respuesta de la API');
  }
}

// Clase principal para las llamadas a la API
export class ApiService {
  // GET request
  static async get<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = buildApiUrl(endpoint);
    const response = await fetchWithTimeout(url, {
      method: 'GET',
      ...options,
    });
    return processResponse<T>(response);
  }

  // POST request
  static async post<T>(endpoint: string, data?: any, options: RequestInit = {}): Promise<T> {
    const url = buildApiUrl(endpoint);
    const response = await fetchWithTimeout(url, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });
    return processResponse<T>(response);
  }

  // PUT request
  static async put<T>(endpoint: string, data?: any, options: RequestInit = {}): Promise<T> {
    const url = buildApiUrl(endpoint);
    const response = await fetchWithTimeout(url, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });
    return processResponse<T>(response);
  }

  // PATCH request
  static async patch<T>(endpoint: string, data?: any, options: RequestInit = {}): Promise<T> {
    const url = buildApiUrl(endpoint);
    const response = await fetchWithTimeout(url, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });
    return processResponse<T>(response);
  }

  // DELETE request
  static async delete<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = buildApiUrl(endpoint);
    const response = await fetchWithTimeout(url, {
      method: 'DELETE',
      ...options,
    });
    return processResponse<T>(response);
  }
} 