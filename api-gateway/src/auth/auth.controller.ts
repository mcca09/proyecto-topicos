import { 
  Controller, 
  Post, 
  Body, 
  Get, 
  UseGuards, 
  Req, 
  Inject, 
  Patch 
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth') // Ruta: http://localhost:3000/api/auth
export class AuthController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
  ) {}

  @Post('register')
  async register(@Body() registerDto: any) {
    // Envía los datos de registro al microservicio de Auth
    return this.authClient.send({ cmd: 'register' }, registerDto);
  }

  @Post('login')
  async login(@Body() loginDto: any) {
    // Envía credenciales y recibe el access_token
    return this.authClient.send({ cmd: 'login' }, loginDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Req() req: any) {
    // req.user contiene el payload decodificado del JWT
    return this.authClient.send({ cmd: 'get_profile' }, { user: req.user });
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  async updateProfile(@Req() req: any, @Body() updateData: any) {
    /**
     * SOLUCIÓN AL ERROR 500: "Empty criteria(s)"
     * Extraemos el identificador único del usuario. 
     * Verificamos 'id' y 'sub' para asegurar que nunca viaje vacío.
     */
    const userId = req.user.id || req.user.sub;

    // Enviamos un objeto estructurado: 
    // 'id' para el WHERE de la base de datos y 'updateData' con los cambios.
    return this.authClient.send(
      { cmd: 'update_profile' }, 
      { 
        id: userId, 
        updateData: updateData 
      }
    );
  }
}