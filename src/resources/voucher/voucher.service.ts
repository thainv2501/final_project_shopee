import { ProductService } from './../product/product.service';
import { ShopService } from './../shop/shop.service';
import { Shop } from './../shop/entities/shop.entity';
import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { CreateVoucherDto } from './dto/create-voucher.dto';
import { UpdateVoucherDto } from './dto/update-voucher.dto';
import {
  DataSource,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { Voucher } from './entities/voucher.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { VoucherType } from 'src/constant/voucher.type.enum';
import { OrderDetail } from '../order_detail/entities/order_detail.entity';

@Injectable()
export class VoucherService {
  constructor(
    @InjectRepository(Voucher)
    private voucherRepository: Repository<Voucher>,

    private shopService: ShopService,

    private productService: ProductService,

    private dataSource: DataSource,
  ) {}

  async create(createVoucherDto: CreateVoucherDto) {
    if (createVoucherDto.from > createVoucherDto.expiredIn) {
      throw new BadRequestException(
        'Expired date have to bigger than from date',
      );
    }
    switch (createVoucherDto.voucher_type) {
      case VoucherType.App:
        break;
      case VoucherType.Shop:
        if (!createVoucherDto.shopId) {
          throw new BadRequestException('Shop Id is required');
        }
        const shop = await this.shopService.getShop({
          id: createVoucherDto.shopId,
        });
        createVoucherDto.shop = shop;
        break;
      case VoucherType.Product:
        if (!createVoucherDto.productId) {
          throw new BadRequestException('Product Id is required');
        }
        const product = await this.productService.getProduct({
          id: createVoucherDto.productId,
        });
        createVoucherDto.product = product;
        break;
    }
    const voucher = await this.voucherRepository.create(createVoucherDto);
    await this.voucherRepository.save(voucher);
    return { voucher };
  }

  async applyProductVoucher(orderDetail: OrderDetail) {
    const vouchers = await this.getVouchersOfProduct(orderDetail.productId);
    const product = await this.productService.getProduct({
      id: orderDetail.productId,
    });
    let totalPrice = product.price * orderDetail.quantity;
    // Start transaction for voucher application
    const voucherTransaction = await this.dataSource.createQueryRunner();
    await voucherTransaction.connect();
    await voucherTransaction.startTransaction();

    try {
      for (const voucher of vouchers.availableVouchers) {
        // Simulate an error by throwing an exception
        // if (voucher.id !== 'specificVoucherId') {
        //   throw new Error('Simulated error during voucher application');
        // }
        totalPrice = totalPrice * (1 - voucher.discount / 100);
        await this.voucherRepository.update(
          { id: voucher.id },
          { quantity: voucher.quantity - 1 },
        );
      }
      await voucherTransaction.commitTransaction();
      return { finalPrice: totalPrice };
    } catch (error) {
      await voucherTransaction.rollbackTransaction();
      await voucherTransaction.release();
      return { err: error.message || 'Error while processing' };
    }
  }

  async getVoucher(voucherId: string) {
    const voucher = await this.voucherRepository.findOne({
      where: {
        id: voucherId,
        from: MoreThanOrEqual(new Date()),
        expiredIn: LessThanOrEqual(new Date()),
      },
    });

    if (!voucher) {
      throw new NotFoundException('Voucher not found or not valid today.');
    }

    return voucher;
  }

  async getVouchersOfProduct(productId: string) {
    if (!productId) {
      throw new BadRequestException('Product id is required');
    }
    const product = await this.productService.getProduct({ id: productId });
    if (!product) {
      throw new BadRequestException('Product not found');
    }
    const today = new Date();

    const availableVouchers = await this.voucherRepository
      .createQueryBuilder('voucher')
      .leftJoinAndSelect('voucher.product', 'product')
      .where('product.id = :productId', { productId })
      .andWhere('voucher.from <= :today', { today })
      .andWhere('voucher.expiredIn >= :today', { today })
      .andWhere('voucher.quantity > 0')
      .getMany();

    return { availableVouchers };
  }

  update(id: number, updateVoucherDto: UpdateVoucherDto) {
    return `This action updates a #${id} voucher`;
  }

  remove(id: number) {
    return `This action removes a #${id} voucher`;
  }
}
