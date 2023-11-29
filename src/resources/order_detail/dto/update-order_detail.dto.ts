import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderDetailDto } from './create-order_detail.dto';
import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { PaymentStatus } from 'src/constant/payment.status.enum';
import { OrderDetailStatus } from 'src/constant/order.detail.status.enum';

export class UpdateOrderDetailDto extends PartialType(CreateOrderDetailDto) {
  @IsString()
  @IsEnum(OrderDetailStatus)
  status: OrderDetailStatus;

  shippedDate: Date;

  paymentStatus: PaymentStatus;
}
