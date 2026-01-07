import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { LoggingInterceptor } from './common/logging.interceptor';
import { HttpExceptionFilter } from './common/http-exception.filter';

async function bootstrap() {
  // Crea la instancia de la aplicación basada en el AppModule
  const app = await NestFactory.create(AppModule);

  // 1. Configuración de prefijo global (Rutas: http://localhost:3002/api/...)
  app.setGlobalPrefix('api');

  // 2. Configuración de Validaciones Globales (Uso de DTOs)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Elimina campos que no estén en el DTO
      forbidNonWhitelisted: true, // Lanza error si envían campos extra
      transform: true, // Transforma tipos automáticamente (ej. string a number)
    }),
  );

  // 3. Filtro de Excepciones Global (AOP)
  app.useGlobalFilters(new HttpExceptionFilter());

  // 4. Interceptor de Logs Global (AOP)
  // Obtenemos el DataSource de la base de datos para pasarlo al interceptor
  const dataSource = app.get(DataSource);
  app.useGlobalInterceptors(new LoggingInterceptor(dataSource));

  // 5. Configuración del puerto del microservicio
  const PORT = 3002;
  await app.listen(PORT);

  console.log(
    `🚀 Microservicio de Puestos ejecutándose en: http://localhost:${PORT}/api`,
  );
}
bootstrap();
