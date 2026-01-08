import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices'; // <--- CAMBIO: Importar opciones de microservicio
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Auth-Microservice');

  // 1. CAMBIO: En lugar de NestFactory.create (HTTP), usamos createMicroservice (TCP)
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.TCP,
    options: {
      host: 'localhost', // O '0.0.0.0' si usas Docker
      port: 3001,        // El puerto que el Gateway tiene configurado
    },
  });

  // 2. Escuchamos las peticiones TCP
  await app.listen();

  logger.log('Microservicio de Auth (TCP) listo en el puerto 3001');
}

bootstrap();
/*
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.TCP,
    options: {
      host: 'localhost',
      port: 3001, // El puerto que definiste en el Gateway
    },
  });
  await app.listen();
  console.log('Microservicio de Auth (TCP) listo');
}
bootstrap();
*/
/*
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  // Crea la instancia de la aplicación usando el AppModule centralizado
  const app = await NestFactory.create(AppModule);

  // 1. Configuración de prefijo global (Opcional pero recomendado para el Gateway)
  // Esto hará que tus rutas empiecen por htnpm run start:devtp://localhost:3001/api/auth/...
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
*/