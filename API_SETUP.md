# Configuración de API REST

Este proyecto está configurado para conectarse a una API REST. A continuación se explica cómo configurar y usar la API.

## Configuración

### Variables de Entorno

Para configurar la URL de tu API, crea un archivo `.env.local` en la raíz del proyecto:

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Configuración por Defecto

Si no se especifica la variable de entorno `NEXT_PUBLIC_API_URL`, el sistema usará por defecto:
- **URL por defecto**: `http://localhost:3001`

## Estructura de Archivos

```
src/
├── config/
│   └── api.ts          # Configuración de la API
├── services/
│   └── api.ts          # Servicio principal para llamadas HTTP
├── hooks/
│   └── useApi.ts       # Hook personalizado para manejar peticiones
└── components/
    └── ApiTest.tsx     # Componente de ejemplo
```

## Uso

### 1. Usando el Hook `useApi`

```tsx
import { useApi } from '@/hooks/useApi';

interface User {
  id: number;
  name: string;
  email: string;
}

function UserComponent() {
  const { data, error, isLoading, get, post } = useApi<User>();

  const fetchUser = async () => {
    try {
      await get('/users/1');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const createUser = async () => {
    try {
      await post('/users', {
        name: 'Juan Pérez',
        email: 'juan@example.com'
      });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      {isLoading && <p>Cargando...</p>}
      {error && <p>Error: {error.message}</p>}
      {data && <p>Usuario: {data.name}</p>}
      <button onClick={fetchUser}>Obtener Usuario</button>
      <button onClick={createUser}>Crear Usuario</button>
    </div>
  );
}
```

### 2. Usando el Servicio `ApiService` directamente

```tsx
import { ApiService } from '@/services/api';

// GET request
const users = await ApiService.get('/users');

// POST request
const newUser = await ApiService.post('/users', {
  name: 'María García',
  email: 'maria@example.com'
});

// PUT request
const updatedUser = await ApiService.put('/users/1', {
  name: 'María García López'
});

// DELETE request
await ApiService.delete('/users/1');
```

## Características

### ✅ Manejo de Errores
- Timeout configurable (10 segundos por defecto)
- Errores de red y HTTP
- Mensajes de error descriptivos

### ✅ Tipado TypeScript
- Interfaces para respuestas de API
- Tipado completo para todas las funciones

### ✅ Estados de Carga
- Estados: `idle`, `loading`, `success`, `error`
- Indicadores de carga automáticos

### ✅ Headers Automáticos
- `Content-Type: application/json` por defecto
- Posibilidad de agregar headers personalizados

## Endpoints de Ejemplo

Para probar la configuración, asegúrate de que tu API tenga estos endpoints:

### GET /api/test
```json
{
  "message": "API funcionando correctamente",
  "timestamp": "2024-01-01T12:00:00Z"
}
```

### GET /users
```json
[
  {
    "id": 1,
    "name": "Juan Pérez",
    "email": "juan@example.com"
  }
]
```

### POST /users
```json
{
  "name": "María García",
  "email": "maria@example.com"
}
```

## Configuración para Diferentes Entornos

### Desarrollo
```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Producción
```bash
# .env.production
NEXT_PUBLIC_API_URL=https://api.tudominio.com
```

### Staging
```bash
# .env.staging
NEXT_PUBLIC_API_URL=https://staging-api.tudominio.com
```

## Troubleshooting

### Error de CORS
Si tu API está en un puerto diferente, asegúrate de que tu servidor de API tenga configurado CORS:

```javascript
// En tu servidor de API
app.use(cors({
  origin: 'http://localhost:3000', // URL de tu frontend
  credentials: true
}));
```

### Error de Conexión
- Verifica que tu API esté ejecutándose en el puerto correcto
- Confirma que la URL en `.env.local` sea correcta
- Revisa los logs del servidor de API

### Error de Timeout
Si las peticiones tardan demasiado, puedes ajustar el timeout en `src/config/api.ts`:

```typescript
export const API_CONFIG = {
  TIMEOUT: 30000, // 30 segundos
  // ... resto de la configuración
};
``` 