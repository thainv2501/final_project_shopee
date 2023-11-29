import { Request } from 'express';
import { VoucherService } from './../voucher/voucher.service';
import { ProductService } from './../product/product.service';
import { OrderService } from './../order/order.service';
import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateOrderDetailDto } from './dto/create-order_detail.dto';
import { UpdateOrderDetailDto } from './dto/update-order_detail.dto';
import { DataSource, Repository, FindOptionsWhere } from 'typeorm';
import { OrderDetail } from './entities/order_detail.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateProductDto } from '../product/dto/update-product.dto';
import { User } from '../user/entities/user.entity';
import { SearchOrderDto } from '../sale/dto/search.orders.dto';
import { PaymentStatus } from 'src/constant/payment.status.enum';
import { OrderDetailStatus } from 'src/constant/order.detail.status.enum';

@Injectable()
export class OrderDetailService {
  constructor(
    @InjectRepository(OrderDetail)
    private orderDetailRepository: Repository<OrderDetail>,

    private productService: ProductService,

    private voucherService: VoucherService,

    private dataSource: DataSource,
  ) {}

  async create(createOrderDetailDto: CreateOrderDetailDto) {
    const product = await this.productService.getProduct(
      {
        id: createOrderDetailDto.productId,
      },
      ['shop'],
    );

    if (!product) {
      throw new BadRequestException('Product not found');
    }

    if (createOrderDetailDto.quantity > product.quantity) {
      throw new BadRequestException(
        'Request quantity is bigger than product quantity',
      );
    }

    const queryRunner = this.dataSource.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const orderDetail =
        this.orderDetailRepository.create(createOrderDetailDto);
      orderDetail.shopId = product.shop.id;
      //apply voucher for this product
      try {
        const { finalPrice, err } =
          await this.voucherService.applyProductVoucher(orderDetail);

        if (err) {
          // Log the error from applyProductVoucher
          throw new Error(`Error applying voucher: ${err}`);
        }
        orderDetail.finalPrice = finalPrice;

        const updateProductDto = new UpdateProductDto();
        updateProductDto.quantity = product.quantity - 1;

        await this.orderDetailRepository.save(orderDetail),
          await this.productService.update(product.id, updateProductDto),
          await queryRunner.commitTransaction();
        return { orderDetail };
      } catch (error) {
        await queryRunner.rollbackTransaction();
        throw error;
      }
    } finally {
      await queryRunner.release();
    }
  }

  async getOrderDetail(conditions: string[]): Promise<OrderDetail> {
    const queryBuilder = this.orderDetailRepository
      .createQueryBuilder('orderDetail')
      .leftJoinAndSelect('orderDetail.order', 'order')
      .leftJoinAndSelect('orderDetail.shop', 'shop')
      .leftJoinAndSelect('order.user', 'user');

    for (const condition of conditions) {
      queryBuilder.andWhere(condition);
    }

    return await queryBuilder.getOne();
  }

  async getOrderDetails(conditions: string[]): Promise<OrderDetail[]> {
    const queryBuilder = this.orderDetailRepository
      .createQueryBuilder('orderDetail')
      .leftJoinAndSelect('orderDetail.order', 'order')
      .leftJoinAndSelect('orderDetail.shop', 'shop')
      .leftJoinAndSelect('order.user', 'user');

    for (const condition of conditions) {
      queryBuilder.andWhere(condition);
    }

    return await queryBuilder.getMany();
  }

  async getOrdersOfUserOnPaymentStatus(request: Request, type) {
    const currentUser: User = request[process.env.CURRENT_USER];
    const searchObj = new SearchOrderDto();
    searchObj.userId = currentUser.id;
    const validPaymentStatusTypes = Object.values(PaymentStatus);
    for (const status of validPaymentStatusTypes) {
      if (type == status) {
        searchObj.paymentStatus = status;
        break;
      }
    }
    const conditions = [`order.userId = '${searchObj.userId}'`];

    if (searchObj.paymentStatus) {
      conditions.push(
        `orderDetail.paymentStatus = '${searchObj.paymentStatus}'`,
      );
    }

    const order_details = await this.getOrderDetails(conditions);
    return { order_details };
  }

  async getOrdersOfUserOnStatus(request: Request, type) {
    const currentUser: User = request[process.env.CURRENT_USER];
    const searchObj = new SearchOrderDto();
    searchObj.userId = currentUser.id;
    const validStatusTypes = Object.values(OrderDetailStatus);
    for (const status of validStatusTypes) {
      console.log({ status, type });
      if (type == status) {
        searchObj.status = status;
        break;
      }
    }
    const conditions = [`order.userId = '${searchObj.userId}'`];

    if (searchObj.status) {
      conditions.push(`orderDetail.status = '${searchObj.status}'`);
    }

    const order_details = await this.getOrderDetails(conditions);
    return { order_details };
  }

  findOne(id: number) {
    return `This action returns a #${id} orderDetail`;
  }

  async userUpdateOrder(
    request: Request,
    id: string,
    updateOrderDetailDto: UpdateOrderDetailDto,
  ) {
    const currentUser: User = request[process.env.CURRENT_USER];
    const preconditionOfOrderDetailsStatus =
      this.preconditionOfOrderDetailsStatus(updateOrderDetailDto.status);
    if (!preconditionOfOrderDetailsStatus) {
      throw new BadRequestException('Request invalid');
    }
    const conditions = [
      `order.userId = '${currentUser.id}'`,
      `orderDetail.id = '${id}'`,
      `orderDetail.status = '${preconditionOfOrderDetailsStatus}'`,
    ];

    const orderDetail = await this.getOrderDetail(conditions);

    if (!orderDetail) {
      throw new BadRequestException();
    }
    return await this.update(id, updateOrderDetailDto);
  }

  async update(id: string, updateOrderDetailDto: UpdateOrderDetailDto) {
    return await this.orderDetailRepository.update(
      { id },
      updateOrderDetailDto,
    );
  }

  remove(id: number) {
    return `This action removes a #${id} orderDetail`;
  }

  preconditionOfOrderDetailsStatus(updateType: OrderDetailStatus) {
    switch (updateType) {
      case OrderDetailStatus.PickUp:
        return OrderDetailStatus.Preparing;

      case OrderDetailStatus.Shipping:
        return OrderDetailStatus.PickUp;

      case OrderDetailStatus.Shipped:
        return OrderDetailStatus.Shipping;

      case OrderDetailStatus.Done:
        return OrderDetailStatus.Shipped;

      case OrderDetailStatus.Cancel:
        return OrderDetailStatus.Preparing;
    }
  }
  preconditionOfPaymentStatus(updateType: PaymentStatus) {
    switch (updateType) {
      case PaymentStatus.Return:
        return PaymentStatus.Processing;

      case PaymentStatus.Processing:
        return PaymentStatus.Paid;
    }
  }
}
