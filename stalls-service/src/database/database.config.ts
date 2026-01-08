import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Stall } from '../stalls/stalls.entity';
import { ApiLog } from './api-log.entity';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'password', // Tu contraseña de PostgreSQL
  database: 'stalls_service', //
  entities: [Stall, ApiLog],
  synchronize: false, // Se mantiene en false porque ya ejecutaste el script SQL
  logging: true,
};
