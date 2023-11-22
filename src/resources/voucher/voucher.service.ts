import { ProductService } from './../product/product.service';
import { ShopService } from './../shop/shop.service';
import { Shop } from './../shop/entities/shop.entity';
import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateVoucherDto } from './dto/create-voucher.dto';
import { UpdateVoucherDto } from './dto/update-voucher.dto';
import { Repository } from 'typeorm';
import { Voucher } from './entities/voucher.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { VoucherType } from 'src/constant/voucher.type.enum';

@Injectable()
export class VoucherService {
  constructor(
    @InjectRepository(Voucher)
    private voucherRepository: Repository<Voucher>,

    private shopService: ShopService,

    private productService: ProductService,
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

  findAll() {
    return `This action returns all voucher`;
  }

  getVoucher(id: number) {
    return `This action returns a #${id} voucher`;
  }

  update(id: number, updateVoucherDto: UpdateVoucherDto) {
    return `This action updates a #${id} voucher`;
  }

  remove(id: number) {
    return `This action removes a #${id} voucher`;
  }
}
