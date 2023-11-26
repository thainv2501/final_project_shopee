import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductModule } from '../product/product.module';
import { VoucherModule } from '../voucher/voucher.module';
import { OrderDetail } from './entities/order_detail.entity';
import { OrderDetailController } from './order_detail.controller';
import { OrderDetailService } from './order_detail.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderDetail]),
    ProductModule,
    VoucherModule,
  ],
  controllers: [OrderDetailController],
  providers: [OrderDetailService],
  exports: [OrderDetailService],
})
export class OrderDetailModule {}
