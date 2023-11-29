import { IsInt, IsString, IsUUID, Min } from 'class-validator';
import { PaymentStatus } from 'src/constant/payment.status.enum';

export class CreateOrderDetailDto {
  orderId: string;

  @IsString()
  @IsUUID()
  productId: string;

  @IsInt()
  @Min(0)
  quantity: number;

  finalPrice: number;

  paymentStatus: PaymentStatus;
}
