import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
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

  async findOneByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async create(userData: Partial<User>): Promise<User> {
    if (!userData.email || !userData.passwordHash) {
      throw new Error('Datos incompletos');
    }

    const existingUser = await this.findOneByEmail(userData.email);
    if (existingUser) {
      throw new ConflictException('El correo electrónico ya está registrado');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.passwordHash, salt);

    const newUser = this.userRepository.create({
      ...userData,
      passwordHash: hashedPassword,
    });

    return this.userRepository.save(newUser);
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  async update(id: string, updateData: Partial<User>): Promise<User> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    if (updateData.passwordHash) {
      const salt = await bcrypt.genSalt(10);
      updateData.passwordHash = await bcrypt.hash(updateData.passwordHash, salt);
    }

    // Eliminamos campos protegidos para evitar el Error 500 y errores de ESLint
    const dataToUpdate = { ...updateData };
    delete dataToUpdate.id;
    delete dataToUpdate.email;

    // Actualización directa garantizada por ID para que no afecte a otros
    await this.userRepository.update(id, dataToUpdate);

    const updatedUser = await this.findById(id);
    if (!updatedUser) {
      throw new NotFoundException();
    }
    return updatedUser;
  }
}