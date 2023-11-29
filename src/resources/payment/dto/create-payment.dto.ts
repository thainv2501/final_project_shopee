import { Type } from 'class-transformer';
import {
  IsEnum,
  IsObject,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { PaymentStatus } from 'src/constant/payment.status.enum';
import { PaymentType } from 'src/constant/payment.type.enum';
import { CreateOrderDto } from 'src/resources/order/dto/create-order.dto';

export class CreatePaymentDto {
  // @IsUUID()
  // orderId: string;

  orderDetailId: string;

  value: number;

  remitterId: string;

  receiverId: string;

  @IsObject()
  @ValidateNested()
  @Type(() => CreateOrderDto)
  createOrderDto: CreateOrderDto;

  @IsString()
  @IsEnum(PaymentType, { message: 'Invalid payment type' })
  paymentType: PaymentType;

  status: PaymentStatus;
}
