import { useState, useCallback } from 'react';
import { ApiService, ApiError } from '@/services/api';

// Estados de la petición
export type RequestState = 'idle' | 'loading' | 'success' | 'error';

// Hook para manejar peticiones a la API
export function useApi<T = any>() {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<ApiError | null>(null);
  const [state, setState] = useState<RequestState>('idle');

  // Función para hacer peticiones GET
  const get = useCallback(async (endpoint: string, options?: RequestInit) => {
    setState('loading');
    setError(null);

    try {
      const result = await ApiService.get<T>(endpoint, options);
      setData(result);
      setState('success');
      return result;
    } catch (err) {
      const apiError = err instanceof ApiError ? err : new ApiError('Error desconocido');
      setError(apiError);
      setState('error');
      throw apiError;
    }
  }, []);

  // Función para hacer peticiones POST
  const post = useCallback(async (endpoint: string, data?: any, options?: RequestInit) => {
    setState('loading');
    setError(null);

    try {
      const result = await ApiService.post<T>(endpoint, data, options);
      setData(result);
      setState('success');
      return result;
    } catch (err) {
      const apiError = err instanceof ApiError ? err : new ApiError('Error desconocido');
      setError(apiError);
      setState('error');
      throw apiError;
    }
  }, []);

  // Función para hacer peticiones PUT
  const put = useCallback(async (endpoint: string, data?: any, options?: RequestInit) => {
    setState('loading');
    setError(null);

    try {
      const result = await ApiService.put<T>(endpoint, data, options);
      setData(result);
      setState('success');
      return result;
    } catch (err) {
      const apiError = err instanceof ApiError ? err : new ApiError('Error desconocido');
      setError(apiError);
      setState('error');
      throw apiError;
    }
  }, []);

  // Función para hacer peticiones PATCH
  const patch = useCallback(async (endpoint: string, data?: any, options?: RequestInit) => {
    setState('loading');
    setState('loading');
    setError(null);

    try {
      const result = await ApiService.patch<T>(endpoint, data, options);
      setData(result);
      setState('success');
      return result;
    } catch (err) {
      const apiError = err instanceof ApiError ? err : new ApiError('Error desconocido');
      setError(apiError);
      setState('error');
      throw apiError;
    }
  }, []);

  // Función para hacer peticiones DELETE
  const del = useCallback(async (endpoint: string, options?: RequestInit) => {
    setState('loading');
    setError(null);

    try {
      const result = await ApiService.delete<T>(endpoint, options);
      setData(result);
      setState('success');
      return result;
    } catch (err) {
      const apiError = err instanceof ApiError ? err : new ApiError('Error desconocido');
      setError(apiError);
      setState('error');
      throw apiError;
    }
  }, []);

  // Función para resetear el estado
  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setState('idle');
  }, []);

  return {
    data,
    error,
    state,
    isLoading: state === 'loading',
    isSuccess: state === 'success',
    isError: state === 'error',
    get,
    post,
    put,
    patch,
    delete: del,
    reset,
  };
} 