import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';
import { CreateOrderDto } from './create-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private dataSource: DataSource,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const { items, ...orderData } = createOrderDto;

    // Calcular el total de la orden
    const total = items.reduce((acc, item) => acc + (item.unit_price * item.quantity), 0);

    // Iniciar transacción
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const order = queryRunner.manager.create(Order, {
        ...orderData,
        total,
        status: 'pendiente',
      });
      const savedOrder = await queryRunner.manager.save(order);

      const orderItems = items.map(item => {
        return queryRunner.manager.create(OrderItem, {
          ...item,
          order: savedOrder,
        });
      });
      await queryRunner.manager.save(orderItems);

      await queryRunner.commitTransaction();
      return this.findOne(savedOrder.id);
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(): Promise<Order[]> {
    return await this.orderRepository.find({ relations: ['items'] });
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['items']
    });
    if (!order) throw new NotFoundException('Pedido no encontrado');
    return order;
  }
}