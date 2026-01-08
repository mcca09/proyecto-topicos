import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity'; // Verifica que la ruta sea correcta
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  // Procesa el registro de usuarios
  async register(data: any) {
    const { passwordHash, ...userData } = data;
    // Encriptamos la contraseña antes de guardar
    const hashed = await bcrypt.hash(passwordHash, 10);
    
    const newUser = this.usersRepository.create({
      ...userData,
      passwordHash: hashed,
    });
    
    return this.usersRepository.save(newUser);
  }

  /**
   * SOLUCIÓN AL ERROR TS2554: 
   * Ahora recibe un objeto 'data' completo en lugar de argumentos separados.
   */
  async login(data: any) {
    const { email, passwordHash } = data;
    const user = await this.usersRepository.findOneBy({ email });

    // Comparamos la contraseña enviada con el hash de la DB
    if (user && (await bcrypt.compare(passwordHash, user.passwordHash))) {
      // El payload incluye el ID para que el Gateway pueda usarlo en el PATCH
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

  /**
   * SOLUCIÓN AL ERROR getProfile
   */
  async getProfile(id: number) {
    return this.usersRepository.findOneBy({ id });
  }

  /**
   * SOLUCIÓN AL ERROR updateProfile y "Empty criteria"
   * Recibe el ID por separado para el WHERE y los datos para el SET
   */
  async updateProfile(id: number, updateData: any) {
    // 1. Ejecuta el UPDATE en PostgreSQL: WHERE id = $1
    await this.usersRepository.update(id, updateData);
    
    // 2. Busca y retorna el usuario ya actualizado
    return this.usersRepository.findOneBy({ id });
  }
}