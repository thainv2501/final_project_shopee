import { OrderDetailStatus } from 'src/constant/order.detail.status.enum';
import { OrderDetailService } from './../order_detail/order_detail.service';
import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { SearchOrderDto } from '../sale/dto/search.orders.dto';
import { PaymentStatus } from 'src/constant/payment.status.enum';
import { User } from '../user/entities/user.entity';
import { UpdateOrderDetailDto } from '../order_detail/dto/update-order_detail.dto';

@Injectable()
export class ShipmentService {
  constructor(private orderDetailService: OrderDetailService) {}

  async updateOrder(request, id, updateOrderDetailDto: UpdateOrderDetailDto) {
    const preconditionOfOrderDetailsStatus =
      this.orderDetailService.preconditionOfOrderDetailsStatus(
        updateOrderDetailDto.status,
      );
    if (!preconditionOfOrderDetailsStatus) {
      throw new BadRequestException('Request invalid');
    }
    const conditions = [
      `orderDetail.id = '${id}'`,
      `orderDetail.status = '${preconditionOfOrderDetailsStatus}'`,
    ];

    const orderDetail =
      await this.orderDetailService.getOrderDetail(conditions);

    if (!orderDetail) {
      throw new BadRequestException();
    }

    if (updateOrderDetailDto.status == OrderDetailStatus.Shipped) {
      updateOrderDetailDto.shippedDate = new Date();
      updateOrderDetailDto.paymentStatus = PaymentStatus.Paid;
    }
    return await this.orderDetailService.update(id, updateOrderDetailDto);
  }

  async getOrdersOnPaymentStatus(request: Request, type) {
    const searchObj = new SearchOrderDto();
    const validPaymentStatusTypes = Object.values(PaymentStatus);
    for (const status of validPaymentStatusTypes) {
      if (type == status) {
        searchObj.paymentStatus = status;
        break;
      }
    }
    const conditions = [];
    if (searchObj.paymentStatus) {
      conditions.push(
        `orderDetail.paymentStatus = '${searchObj.paymentStatus}'`,
      );
    }
    const order_details =
      await this.orderDetailService.getOrderDetails(conditions);
    return { order_details };
  }

  async getOrdersOnStatus(request, type) {
    const searchObj = new SearchOrderDto();
    const validStatusTypes = Object.values(OrderDetailStatus);
    for (const status of validStatusTypes) {
      if (type == status) {
        searchObj.status = status;
        break;
      }
    }

    const conditions = [];
    if (searchObj.status) {
      conditions.push(`orderDetail.status = '${searchObj.status}'`);
    }
    const order_details =
      await this.orderDetailService.getOrderDetails(conditions);
    return { order_details };
  }
}
