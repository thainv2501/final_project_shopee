import { IsInt, IsString, IsUUID, Min } from 'class-validator';

export class CreateOrderDetailDto {
  orderId: string;

  @IsString()
  @IsUUID()
  productId: string;

  @IsInt()
  @Min(0)
  quantity: number;

  finalPrice: number;
}
