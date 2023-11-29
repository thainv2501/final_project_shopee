import { Type } from 'class-transformer';
import { CreateOrderDetailDto } from './../../order_detail/dto/create-order_detail.dto';
import {
  IsArray,
  IsEnum,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { PaymentType } from 'src/constant/payment.type.enum';

export class CreateOrderDto {
  @IsArray()
  @ValidateNested()
  @Type(() => CreateOrderDetailDto)
  order_details_dto: CreateOrderDetailDto[];

  @IsString()
  @IsUUID()
  contact: string;

  @IsString()
  @IsEnum(PaymentType, { message: 'Invalid payment type' })
  paymentType: PaymentType;
}
