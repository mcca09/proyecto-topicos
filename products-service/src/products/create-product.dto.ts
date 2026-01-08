import { IsString, IsNotEmpty, IsNumber, IsPositive, IsUUID, Min } from 'class-validator';

export class CreateProductDto {
  @IsUUID()
  @IsNotEmpty()
  stall_id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsPositive()
  price: number;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsNumber()
  @Min(0)
  stock: number;
}