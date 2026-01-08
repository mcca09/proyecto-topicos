import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { databaseConfig } from './database/database.config';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [
    // Permite el uso de variables de entorno (.env)
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // Configuración de conexión a PostgreSQL para la DB orders_service
    TypeOrmModule.forRoot(databaseConfig),

    // Módulo principal que gestiona pedidos y sus ítems
    OrdersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}