import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    // Registramos el cliente para comunicarnos con el microservicio de Auth
    ClientsModule.registerAsync([
      {
        name: 'AUTH_SERVICE', // Nombre que usaremos para inyectar el cliente
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            // Valores obtenidos del archivo .env
            host: configService.get('AUTH_SERVICE_HOST', 'localhost'),
            port: configService.get('AUTH_SERVICE_PORT', 3001),
          },
        }),
      },
    ]),
  ],
  controllers: [AuthController],
})
export class AuthModule {}