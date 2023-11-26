import { ContactService } from './../contact/contact.service';
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, FindOptionsWhere, Repository } from 'typeorm';
import { OrderDetailService } from './../order_detail/order_detail.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';
import { User } from '../user/entities/user.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,

    private orderDetailService: OrderDetailService,

    private contactService: ContactService,

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

      // create specific order details
      for (const orderDetailDto of createOrderDto.order_details_dto) {
        orderDetailDto.orderId = order.id;

        try {
          const { orderDetail } =
            await this.orderDetailService.create(orderDetailDto);
        } catch (error) {
          console.log(`${error.message} at ${orderDetailDto.productId}`);
          await queryRunner.rollbackTransaction();
          return `${error.message} at ${orderDetailDto.productId}`;
        }
      }

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
      relations: ['orderDetails', 'orderDetails.product'],
    });
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
