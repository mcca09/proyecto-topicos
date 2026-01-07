import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './database/database.config';
import { StallsModule } from './stalls/stalls.module';

@Module({
  imports: [
    // Configuración global de la base de datos stalls_service
    TypeOrmModule.forRoot(databaseConfig),

    // Módulo que contiene la lógica de los puestos gastronómicos
    StallsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
