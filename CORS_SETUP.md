# Configuración de CORS en NestJS

Para resolver el error de CORS, necesitas configurar tu backend de NestJS para permitir peticiones desde tu frontend.

## Solución 1: Configuración Global (Recomendada)

En tu archivo `main.ts` de NestJS, agrega la configuración de CORS:

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Configuración de CORS
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001', 
      'http://localhost:3002',
      'http://localhost:3003',
      'http://localhost:3004',
      'http://localhost:3005',
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  await app.listen(3001);
}
bootstrap();
```

## Solución 2: Configuración más Permisiva (Solo para desarrollo)

Si quieres una configuración más simple para desarrollo:

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Configuración CORS permisiva (solo para desarrollo)
  app.enableCors({
    origin: true, // Permite todos los orígenes
    credentials: true,
  });

  await app.listen(3001);
}
bootstrap();
```

## Solución 3: Configuración con Variables de Entorno

Para una configuración más robusta:

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
  ];

  app.enableCors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  await app.listen(3001);
}
bootstrap();
```

## Verificación

Después de aplicar la configuración:

1. **Reinicia tu servidor de NestJS**
2. **Prueba la conexión** desde el frontend
3. **Verifica en las herramientas de desarrollador** del navegador (F12 → Network) que no haya errores de CORS

## Troubleshooting

### Si sigues teniendo problemas:

1. **Verifica que el servidor se reinició** correctamente
2. **Limpia la caché del navegador** (Ctrl+F5 o Cmd+Shift+R)
3. **Revisa la consola del navegador** para ver errores específicos
4. **Verifica que las URLs coincidan** exactamente

### Para producción:

```typescript
app.enableCors({
  origin: ['https://tu-dominio.com'],
  credentials: true,
});
```

## Comando para reiniciar NestJS

```bash
# Si usas npm
npm run start:dev

# Si usas yarn
yarn start:dev

# Si usas pnpm
pnpm start:dev
``` 