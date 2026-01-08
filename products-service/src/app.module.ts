import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './database/database.config';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [
    // Configuración de TypeORM para la base de datos de productos
    TypeOrmModule.forRoot(databaseConfig),

    // Módulo de gestión de catálogo
    ProductsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}