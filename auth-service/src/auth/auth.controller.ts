import { Controller } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern({ cmd: 'register' })
  async register(@Payload() data: any) {
    // Procesa el registro y hasheo de la contraseña
    return this.authService.register(data);
  }

  @MessagePattern({ cmd: 'login' })
  async login(@Payload() data: any) {
    // Valida credenciales y genera el access_token
    return this.authService.login(data);
  }

  @MessagePattern({ cmd: 'get_profile' })
  async getProfile(@Payload() data: any) {
    // Extraemos el id que viene dentro del objeto user enviado por el gateway
    const userId = data.user?.id || data.user?.sub;
    
    if (!userId) {
      throw new RpcException('No se encontró el ID del usuario en la petición');
    }
    
    return this.authService.getProfile(userId);
  }

  @MessagePattern({ cmd: 'update_profile' })
  async updateProfile(@Payload() data: { id: number; updateData: any }) {
    // Aquí recibimos el 'id' y el 'updateData' que enviamos desde el Gateway.
    const { id, updateData } = data;

    // Si el 'id' llega como undefined, TypeORM no sabría a quién actualizar.
    if (!id) {
      throw new RpcException('Error: Criterio de búsqueda (ID) vacío para actualizar.');
    }

    try {
      // Llamamos al método que ya creamos en el AuthService
      return await this.authService.updateProfile(id, updateData);
    } catch (error) {
      // Retornamos el error al Gateway de forma controlada
      throw new RpcException(error.message);
    }
  }
}
/*
import { Controller, Post, Body, Patch, Get, UseGuards, Request, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './roles.guard';
import { Roles } from './roles.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('login')
  async login(@Body() body: Record<string, string>) {
    const result = await this.authService.login(body.email, body.passwordHash);
    if (!result) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }
    return result;
  }

  @Post('register')
  async register(@Body() body: Record<string, any>) {
    return this.authService.register(body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req: any) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('organizador')
  @Patch('profile')
  async updateProfile(
    @Request() req: any,
    @Body() updateData: Record<string, any>,
  ) {
    return this.usersService.update(req.user.id, updateData);
  }
}
*/
