import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Request } from 'express';
import { OrderDetailStatus } from 'src/constant/order.detail.status.enum';
import { PaymentStatus } from 'src/constant/payment.status.enum';
import { User } from '../user/entities/user.entity';
import { UpdateOrderDetailDto } from './../order_detail/dto/update-order_detail.dto';
import { OrderDetailService } from './../order_detail/order_detail.service';
import { ShopService } from './../shop/shop.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { SearchOrderDto } from './dto/search.orders.dto';

@Injectable()
export class SaleService {
  constructor(
    private shopService: ShopService,

    private orderDetailService: OrderDetailService,
  ) {}

  async getOrdersOnPaymentStatus(request: Request, type) {
    const currentUser: User = request[process.env.CURRENT_USER];
    const shop = await this.shopService.getShop({ ownerId: currentUser.id });
    if (!shop) {
      throw new NotFoundException('User do not have shop');
    }
    const searchObj = new SearchOrderDto();
    searchObj.shopId = shop.id;
    const validPaymentStatusTypes = Object.values(PaymentStatus);
    for (const status of validPaymentStatusTypes) {
      if (type == status) {
        searchObj.paymentStatus = status;
        break;
      }
    }
    const conditions = [`orderDetail.shopId = '${searchObj.shopId}'`];

    if (searchObj.paymentStatus) {
      conditions.push(
        `orderDetail.paymentStatus = '${searchObj.paymentStatus}'`,
      );
    }

    const order_details =
      await this.orderDetailService.getOrderDetails(conditions);
    return { order_details };
  }

  async getOrdersOnStatus(request: Request, type) {
    const currentUser: User = request[process.env.CURRENT_USER];
    const shop = await this.shopService.getShop({ ownerId: currentUser.id });
    if (!shop) {
      throw new NotFoundException('User do not have shop');
    }
    const searchObj = new SearchOrderDto();
    searchObj.shopId = shop.id;
    const validStatusTypes = Object.values(OrderDetailStatus);
    for (const status of validStatusTypes) {
      if (type == status) {
        searchObj.status = status;
        break;
      }
    }

    const conditions = [`orderDetail.shopId = '${searchObj.shopId}'`];
    if (searchObj.status) {
      conditions.push(`orderDetail.status = '${searchObj.status}'`);
    }
    const order_details =
      await this.orderDetailService.getOrderDetails(conditions);
    return { order_details };
  }

  create(createSaleDto: CreateSaleDto) {
    return 'This action adds a new sale';
  }

  findAll() {
    return `This action returns all sale`;
  }

  findOne(id: number) {
    return `This action returns a #${id} sale`;
  }

  async update(
    request: Request,
    id: string,
    updateOrderDetailDto: UpdateOrderDetailDto,
  ) {
    const currentUser: User = request[process.env.CURRENT_USER];
    const shop = await this.shopService.getShop({ ownerId: currentUser.id });
    if (!shop) {
      throw new NotFoundException('User do not have shop');
    }
    const preconditionOfOrderDetailsStatus =
      this.orderDetailService.preconditionOfOrderDetailsStatus(
        updateOrderDetailDto.status,
      );
    if (!preconditionOfOrderDetailsStatus) {
      throw new BadRequestException('Request invalid');
    }
    const conditions = [
      `orderDetail.shopId = '${shop.id}'`,
      `orderDetail.id = '${id}'`,
      `orderDetail.status = '${preconditionOfOrderDetailsStatus}'`,
    ];

    const orderDetail =
      await this.orderDetailService.getOrderDetail(conditions);

    if (!orderDetail) {
      throw new BadRequestException();
    }
    return await this.orderDetailService.update(id, updateOrderDetailDto);
  }

  remove(id: number) {
    return `This action removes a #${id} sale`;
  }
}
