import { PaymentService } from './../payment/payment.service';
import { ContactService } from './../contact/contact.service';
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, FindOptionsWhere, Repository } from 'typeorm';
import { OrderDetailService } from './../order_detail/order_detail.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';
import { User } from '../user/entities/user.entity';
import { CreatePaymentDto } from '../payment/dto/create-payment.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,

    private orderDetailService: OrderDetailService,

    private contactService: ContactService,

    private paymentService: PaymentService,

    private dataSource: DataSource,
  ) {}
  async create(request, createOrderDto: CreateOrderDto) {
    //check current user login and check contact
    const currentUser: User = request[process.env.CURRENT_USER];
    const contact = await this.contactService.getContact(
      {
        id: createOrderDto.contact,
      },
      ['user'],
    );
    if (!contact || contact.user.id !== currentUser.id) {
      throw new BadRequestException(
        'Contact not found or Contact not match with user',
      );
    }

    // start transaction complex to complete a order
    const queryRunner = await this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const order = await this.orderRepository.create({ user: currentUser });
      order.contact = contact;
      await this.orderRepository.save(order);

      let paymentValue = 0;

      // create specific order details
      for (const orderDetailDto of createOrderDto.order_details_dto) {
        orderDetailDto.orderId = order.id;
        orderDetailDto.paymentStatus = this.paymentService.applyPaymentMethod(
          createOrderDto.paymentType,
        );
        // try catch error when  create order details
        try {
          const { orderDetail } =
            await this.orderDetailService.create(orderDetailDto);
          paymentValue += orderDetail.finalPrice;
        } catch (error) {
          await queryRunner.rollbackTransaction();
          return { err: `${error.message} at ${orderDetailDto.productId}` };
        }
      }
      const createPaymentDto = new CreatePaymentDto(order.id, paymentValue);

      await this.paymentService.create(createPaymentDto);

      await queryRunner.commitTransaction();
      return { order };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return { err: error.message || 'Unknown error occurred' };
    } finally {
      await queryRunner.release();
    }
  }

  findAll() {
    return `This action returns all order`;
  }

  async getOrder(
    fields: FindOptionsWhere<Order> | FindOptionsWhere<Order>[],
    relations?: string[],
  ) {
    return await this.orderRepository.findOne({
      where: fields,
      relations: ['orderDetails', 'orderDetails.product', 'orderDetails.shop'],
    });
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  async remove(id: string) {
    await this.orderRepository.delete({ id });
    return `This action removes a #${id} order`;
  }
}
