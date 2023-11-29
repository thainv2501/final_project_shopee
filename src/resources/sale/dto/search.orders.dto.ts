import { OrderDetailStatus } from 'src/constant/order.detail.status.enum';
import { PaymentStatus } from 'src/constant/payment.status.enum';

export class SearchOrderDto {
  shopId: string;
  userId: string;
  status: OrderDetailStatus;
  paymentStatus: PaymentStatus;
  constructor(userId?, shopId?, status?, paymentStatus?) {
    this.userId = userId;
    this.shopId = shopId;
    this.status = status;
    this.paymentStatus = paymentStatus;
  }
}
