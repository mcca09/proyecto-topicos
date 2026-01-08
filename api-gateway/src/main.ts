import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AllExceptionsFilter } from './common/rpc-exception.filter';

async function bootstrap() {
  const logger = new Logger('Main-Gateway');
  
  // 1. Crear la aplicación HTTP normal (Puerto 3000)
  const app = await NestFactory.create(AppModule);

  // 2. Configuración de prefijo global
  // Esto hace que tus rutas sean http://localhost:3000/api/...
  app.setGlobalPrefix('api');

  // 3. Filtro de excepciones global
  // Captura errores TCP del microservicio y los convierte a HTTP para Postman
  app.useGlobalFilters(new AllExceptionsFilter());

  // 4. Pipes de validación global
  // Asegura que los datos enviados en el Body (como email) sean válidos
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // 5. Habilitar CORS para permitir peticiones externas
  app.enableCors();

  // 6. Definir el puerto del Gateway
  const PORT = process.env.PORT || 3000;
  await app.listen(PORT);

  logger.log(`API Gateway corriendo en: http://localhost:${PORT}/api`);
}

bootstrap();