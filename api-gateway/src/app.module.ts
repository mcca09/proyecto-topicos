import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth/auth.controller';
import { JwtStrategy } from './auth/jwt.strategy';

@Module({
  imports: [
    // Registro de Passport para usar la estrategia JWT
    PassportModule.register({ defaultStrategy: 'jwt' }),

    // Configuración del JWT: El secreto DEBE ser 'password'
    JwtModule.register({
      secret: 'password', 
      signOptions: { expiresIn: '1h' }, 
    }),

    // Configuración del Cliente para conectar con el Microservicio de Auth
    ClientsModule.register([
      {
        name: 'AUTH_SERVICE', // Nombre usado en @Inject() del controlador
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: 3001, // Puerto del microservicio TCP
        },
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [JwtStrategy], // La lógica para validar el token
  exports: [JwtStrategy, PassportModule],
})
export class AppModule {}