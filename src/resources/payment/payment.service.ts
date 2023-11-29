import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { DataSource, Repository } from 'typeorm';
import { OrderService } from './../order/order.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { Payment } from './entities/payment.entity';
import { PaymentType } from 'src/constant/payment.type.enum';
import { PaymentStatus } from 'src/constant/payment.status.enum';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,

    private dataSource: DataSource,
  ) {}

  async create(createPaymentDto: CreatePaymentDto) {
    const queryRunner = await this.dataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const payment = await this.paymentRepository.create(createPaymentDto);
      await this.paymentRepository.save(payment);
      await queryRunner.commitTransaction();
      return { payment };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return { error: error.message || 'Error while processing payments' };
    } finally {
      await queryRunner.release();
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

  getPayments(request: Request) {
    const currentUser = request[process.env.CURRENT_USER];
    const { payment, orderStatus } = request.query;
    return { currentUser, payment, orderStatus };
  }

  update(id: number, updatePaymentDto: UpdatePaymentDto) {
    return `This action updates a #${id} payment`;
  }

  remove(id: number) {
    return `This action removes a #${id} payment`;
  }
}
