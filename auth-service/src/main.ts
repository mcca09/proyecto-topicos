import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  // Crea la instancia de la aplicación usando el AppModule centralizado
  const app = await NestFactory.create(AppModule);

  // 1. Configuración de prefijo global (Opcional pero recomendado para el Gateway)
  // Esto hará que tus rutas empiecen por http://localhost:3001/api/auth/...
  app.setGlobalPrefix('api');

  // 2. Validación global de DTOs
  // Asegura que los datos que llegan (email, roles) cumplan con el formato
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // 3. Habilitar CORS
  // Necesario para que el API Gateway o el Frontend puedan comunicarse con este servicio
  app.enableCors();

  // 4. Definición del puerto
  // Usamos el 3001 para diferenciarlo de los otros microservicios (puestos, productos, etc.)
  const PORT = 3001;
  await app.listen(PORT);

  console.log(
    `Microservicio de Autenticación corriendo en: http://localhost:${PORT}/api`,
  );
}

bootstrap();
