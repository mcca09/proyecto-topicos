import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { LoggingInterceptor } from './common/logging.interceptor';
import { HttpExceptionFilter } from './common/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Prefijo global para las rutas: http://localhost:3003/api/...
  app.setGlobalPrefix('api');

  // Habilitar validaciones para los DTOs (CreateProductDto)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Aplicar Filtro de Excepciones global
  app.useGlobalFilters(new HttpExceptionFilter());

  // Aplicar Interceptor de Logs específico para la base de datos de productos
  const dataSource = app.get(DataSource);
  app.useGlobalInterceptors(new LoggingInterceptor(dataSource));

  // IMPORTANTE: Puerto 3003 para evitar conflictos con otros microservicios
  const PORT = 3003;
  await app.listen(PORT);

  console.log(`🚀 Microservicio de Productos corriendo en: http://localhost:${PORT}/api`);
}
bootstrap();
