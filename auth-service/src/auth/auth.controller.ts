import { Controller } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern({ cmd: 'register' })
  async register(@Payload() data: any) {
    try {
      return await this.authService.register(data);
    } catch (error) {
      throw new RpcException(error.message);
    }
  }

  @MessagePattern({ cmd: 'login' })
  async login(@Payload() data: any) {
    try {
      return await this.authService.login(data);
    } catch (error) {
      throw new RpcException(error.message);
    }
  }

  @MessagePattern({ cmd: 'get_profile' })
  async getProfile(@Payload() data: any) {
    // Verificamos múltiples orígenes posibles del ID para evitar el "Empty criteria"
    const userId = data?.id || data?.user?.id || data?.user?.sub;
    
    if (!userId) {
      throw new RpcException('ID de usuario no proporcionado');
    }
    
    return this.authService.getProfile(userId);
  }

  @MessagePattern({ cmd: 'update_profile' })
  async updateProfile(@Payload() data: any) {
    //Extraemos el ID y los datos de actualización asegurándonos de que existan.
    const id = data?.id;
    const updateData = data?.updateData;

    if (!id) {
      // Este mensaje coincide con tu log de las 11:24:42 p.m.
      throw new RpcException('Error: Criterio de búsqueda (ID) vacío para actualizar.');
    }

    try {
      return await this.authService.updateProfile(id, updateData);
    } catch (error) {
      // Al usar RpcException evitamos que el socket TCP se rompa
      throw new RpcException(error.message);
    }
  }
}