import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async login(email: string, pass: string) {
    // Buscar usuario por email según la tabla users
    const user = await this.usersRepository.findOne({ where: { email } });

    // Comparar contraseña usando bcrypt
    if (user && (await bcrypt.compare(pass, user.passwordHash))) {
      const payload = {
        sub: user.id,
        email: user.email,
        role: user.role, // Incluimos el rol solicitado
      };

      return {
        access_token: this.jwtService.sign(payload),
        user: {
          fullName: user.fullName, // Antes era full_name
          role: user.role,
        },
      };
    }

    throw new UnauthorizedException('Credenciales incorrectas');
  }
}
