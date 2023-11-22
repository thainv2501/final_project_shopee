import { IsInt, IsString, Min } from 'class-validator';
import { Order } from 'src/resources/order/entities/order.entity';
import { Product } from 'src/resources/product/entities/product.entity';

export class CreateOrderDetailDto {
  orderId: string;

  @IsString()
  productId: string;

  @IsInt()
  @Min(0)
  quantity: number;

  finalPrice: number;
}
