import { Controller } from '@nestjs/common';
import { Post } from '@nestjs/common';
import { Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service'; // 1. Importar el servicio de usuarios

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService, // 2. Inyectar el servicio aquí
  ) {}

  @Post('login')
  async login(@Body() body: any) {
    return this.authService.login(body.email, body.password);
  }

  // 3. Nuevo endpoint para registrar usuarios en la DB
  @Post('register')
  async register(@Body() body: any) {
    // Esto enviará los datos a la tabla public.users
    return this.usersService.create(body);
  }
}
