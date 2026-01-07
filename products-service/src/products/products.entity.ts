import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  stall_id: string; // Relación lógica con el stalls-service

  @Column({ length: 255 })
  name: string;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  price: number;

  @Column({ length: 100 })
  category: string;

  @Column({ type: 'int' })
  stock: number; // Debe ser >= 0

  @Column({ name: 'is_available', default: true })
  isAvailable: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}