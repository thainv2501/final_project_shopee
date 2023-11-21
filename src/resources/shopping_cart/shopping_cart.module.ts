import { Module } from '@nestjs/common';
import { ShoppingCartService } from './shopping_cart.service';
import { ShoppingCartController } from './shopping_cart.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShoppingCart } from './entities/shopping_cart.entity';
import { Product } from '../product/entities/product.entity';
import { ProductModule } from '../product/product.module';
import { ProductService } from '../product/product.service';
import { OrderDetailModule } from '../order_detail/order_detail.module';

@Module({
  imports: [TypeOrmModule.forFeature([ShoppingCart]), ProductModule],
  controllers: [ShoppingCartController],
  providers: [ShoppingCartService],
  exports: [ShoppingCartService],
})
export class ShoppingCartModule {}
