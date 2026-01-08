import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Stall } from './stalls.entity';
import { CreateStallDto } from './create-stall.dto';

@Injectable()
export class StallsService {
  constructor(
    @InjectRepository(Stall)
    private readonly stallRepository: Repository<Stall>,
  ) {}

  async create(createStallDto: CreateStallDto): Promise<Stall> {
    const newStall = this.stallRepository.create({
      ...createStallDto,
      status: 'pendiente', // Todo puesto nuevo inicia como pendiente
    });
    return await this.stallRepository.save(newStall);
  }

  async findAll(): Promise<Stall[]> {
    return await this.stallRepository.find();
  }

  async findOne(id: string): Promise<Stall | null> {
    return await this.stallRepository.findOneBy({ id });
  }
}
