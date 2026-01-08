import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../users/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  // Procesa el registro de nuevos usuarios
  async register(data: any) {
    const { passwordHash, ...userData } = data;
    const hashed = await bcrypt.hash(passwordHash, 10);
    
    const newUser = this.usersRepository.create({
      ...userData,
      passwordHash: hashed,
    });
    
    return this.usersRepository.save(newUser);
  }

  // Valida credenciales y genera el token
  async login(data: any) {
    const { email, passwordHash } = data;
    const user = await this.usersRepository.findOneBy({ email } as any);

    if (user && (await bcrypt.compare(passwordHash, user.passwordHash))) {
      const payload = { 
        email: user.email, 
        id: user.id, 
        role: user.role 
      };
      
      return {
        access_token: this.jwtService.sign(payload),
      };
    }
    
    throw new UnauthorizedException('Credenciales inválidas');
  }

  // Obtener perfil (usa 'any' por si el ID es UUID)
  async getProfile(id: any) {
    return this.usersRepository.findOneBy({ id });
  }

  // Actualizar perfil (solución al error "Empty criteria")
  async updateProfile(id: any, updateData: any) {
    // Primero actualizamos
    await this.usersRepository.update(id, updateData);
    // Luego retornamos el usuario actualizado
    return this.usersRepository.findOneBy({ id });
  }
}