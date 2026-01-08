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
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(userData: Record<string, any>): Promise<User> {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.passwordHash, salt);
    const newUser = this.userRepository.create({
      ...userData,
      passwordHash: hashedPassword,
    });
    return await this.userRepository.save(newUser);
  }

  async login(email: string, pass: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (user && await bcrypt.compare(pass, user.passwordHash)) {
      const payload = { id: user.id, email: user.email, role: user.role };
      return {
        access_token: this.jwtService.sign(payload),
      };
    }
    throw new UnauthorizedException('Credenciales incorrectas');
  }
}
