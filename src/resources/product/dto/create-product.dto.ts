import { IsInt, IsNumber, IsString, Min, min } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsInt()
  @Min(0)
  quantity: number;

  @IsString()
  categoryId: string;
}
