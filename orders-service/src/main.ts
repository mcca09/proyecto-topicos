import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { LoggingInterceptor } from './common/logging.interceptor';
import { HttpExceptionFilter } from './common/http-exception.filter';

async function bootstrap() {
  // Crea la instancia de la aplicación NestJS
  const app = await NestFactory.create(AppModule);

  // Prefijo global para todas las rutas: http://localhost:3004/api/orders
  app.setGlobalPrefix('api');

  // Configuración de ValidationPipe para procesar los DTOs (CreateOrderDto)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remueve propiedades que no estén en el DTO
      forbidNonWhitelisted: true, // Lanza error si hay propiedades no permitidas
      transform: true, // Convierte los tipos de datos automáticamente
    }),
  );

  // Filtro global para manejar errores de HTTP de forma estandarizada
  app.useGlobalFilters(new HttpExceptionFilter());

  // Interceptor global para registrar logs en la base de datos orders_service
  const dataSource = app.get(DataSource);
  app.useGlobalInterceptors(new LoggingInterceptor(dataSource));

  // Definición del puerto desde variables de entorno o por defecto 3004
  const PORT = process.env.PORT || 3004;

  await app.listen(PORT);

  console.log(`🚀 Microservicio de Pedidos corriendo en: http://localhost:${PORT}/api`);
}

bootstrap();