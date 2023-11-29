import { IsNumber, IsUUID } from 'class-validator';

export class CreatePaymentDto {
  @IsUUID()
  orderId: string;

  @IsNumber()
  value: number;

  constructor(orderId, value) {
    this.orderId = orderId;
    this.value = value;
  }
}
