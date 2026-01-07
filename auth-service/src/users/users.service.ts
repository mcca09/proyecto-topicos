import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // Método para buscar por email (usado por AuthService)
  async findOneByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  // Método para crear un nuevo usuario (Registro)
  async create(userData: Partial<User>): Promise<User> {
    // Verificamos que el email exista
    if (!userData.email || !userData.passwordHash) {
      throw new Error('Datos incompletos');
    }

    const existingUser = await this.findOneByEmail(userData.email);
    if (existingUser) {
      throw new ConflictException('El correo electrónico ya está registrado');
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(userData.passwordHash, salt);

    // CORRECCIÓN: Usar la interfaz correctamente para crear la entidad
    const newUser = this.userRepository.create({
      ...userData,
      passwordHash: hashedPassword,
    });

    return this.userRepository.save(newUser);
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }
}
