import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Product } from '../products/products.entity';
import { ApiLog } from './api-log.entity';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'password', // Tu contraseña de PostgreSQL
  database: 'products_service', //
  entities: [Product, ApiLog],
  synchronize: false, // Usamos los scripts SQL manuales
  logging: true,
};
