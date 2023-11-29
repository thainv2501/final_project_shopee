import { OrderService } from './../order/order.service';
import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { Repository, DataSource } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { PaymentType } from 'src/constant/payment.type.enum';
import { PaymentStatus } from 'src/constant/payment.status.enum';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,

    private orderService: OrderService,

    private dataSource: DataSource,
  ) {}

  async create(request, createPaymentDto: CreatePaymentDto) {
    const currentUser: User = request[process.env.CURRENT_USER];
    const { order: createdOrder, err } = await this.orderService.create(
      request,
      createPaymentDto.createOrderDto,
    );

    if (!createdOrder) {
      return { err: `${err}` || 'Error while processing order' };
    }

    const order = await this.orderService.getOrder({ id: createdOrder.id });

    const queryRunner = await this.dataSource.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      try {
        for (const orderDetail of order.orderDetails) {
          createPaymentDto.orderDetailId = orderDetail.id;
          createPaymentDto.remitterId = currentUser.id;
          createPaymentDto.receiverId = orderDetail.shop.ownerId;
          createPaymentDto.status = this.applyPaymentMethod(
            createPaymentDto.paymentType,
          );

          const payment = await this.paymentRepository.create(createPaymentDto);
          await this.paymentRepository.save(payment);
        }
        await queryRunner.commitTransaction();
        return { message: `Payments for order ${order.id} created` };
      } catch (error) {
        await queryRunner.rollbackTransaction();
        await this.orderService.remove(order.id);
        return { error: error.message || 'Error while processing payments' };
      } finally {
        await queryRunner.release();
      }
    } catch (error) {
      return {
        error: error.message || 'Error while connecting to the database',
      };
    }
  }

  applyPaymentMethod(paymentType: PaymentType) {
    switch (paymentType) {
      case PaymentType.Cash:
        return PaymentStatus.Unpaid;
      case PaymentType.Banking:
        return PaymentStatus.Paid;
    }
  }

  findAll() {
    return `This action returns all payment`;
  }

  findOne(id: number) {
    return `This action returns a #${id} payment`;
  }

  update(id: number, updatePaymentDto: UpdatePaymentDto) {
    return `This action updates a #${id} payment`;
  }

  remove(id: number) {
    return `This action removes a #${id} payment`;
  }
}
