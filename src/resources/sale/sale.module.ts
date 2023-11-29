import { Module } from '@nestjs/common';
import { SaleService } from './sale.service';
import { SaleController } from './sale.controller';
import { ShopModule } from '../shop/shop.module';
import { OrderDetailModule } from '../order_detail/order_detail.module';

@Module({
  imports: [ShopModule, OrderDetailModule],
  controllers: [SaleController],
  providers: [SaleService],
})
export class SaleModule {}
