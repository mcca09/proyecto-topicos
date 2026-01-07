import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Order } from '../orders/order.entity';
import { OrderItem } from '../orders/order-item.entity';
import { ApiLog } from './api-log.entity';
import * as dotenv from 'dotenv';

dotenv.config();

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: 'orders_service', //
  entities: [Order, OrderItem, ApiLog],
  synchronize: false, // Usamos los scripts SQL manuales
  logging: true,
};