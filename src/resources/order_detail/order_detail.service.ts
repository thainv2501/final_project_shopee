import { VoucherService } from './../voucher/voucher.service';
import { ProductService } from './../product/product.service';
import { OrderService } from './../order/order.service';
import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateOrderDetailDto } from './dto/create-order_detail.dto';
import { UpdateOrderDetailDto } from './dto/update-order_detail.dto';
import { DataSource, Repository } from 'typeorm';
import { OrderDetail } from './entities/order_detail.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateProductDto } from '../product/dto/update-product.dto';

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
    const product = await this.productService.getProduct({
      id: createOrderDetailDto.productId,
    });

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

  findOne(id: number) {
    return `This action returns a #${id} orderDetail`;
  }

  update(id: number, updateOrderDetailDto: UpdateOrderDetailDto) {
    return `This action updates a #${id} orderDetail`;
  }

  remove(id: number) {
    return `This action removes a #${id} orderDetail`;
  }
}
