import { Module } from '@nestjs/common';
import { VoucherService } from './voucher.service';
import { VoucherController } from './voucher.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Voucher } from './entities/voucher.entity';
import { ProductModule } from '../product/product.module';
import { ShopModule } from '../shop/shop.module';

@Module({
  imports: [TypeOrmModule.forFeature([Voucher]), ProductModule, ShopModule],
  controllers: [VoucherController],
  providers: [VoucherService],
  exports: [VoucherService],
})
export class VoucherModule {}
