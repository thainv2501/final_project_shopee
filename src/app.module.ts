import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { appConfig } from './config/app.config';
import { UserModule } from './resources/user/user.module';
import { AuthModule } from './auth/auth.module';
import { ShopModule } from './resources/shop/shop.module';
import { ProductModule } from './resources/product/product.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfig } from './db/data.config';
import { ContactModule } from './resources/contact/contact.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './exception/all.exception';
import { CategoryModule } from './resources/category/category.module';
import { VoucherModule } from './resources/voucher/voucher.module';
import { OrderModule } from './resources/order/order.module';
import { OrderDetailModule } from './resources/order_detail/order_detail.module';
import { ShoppingCartModule } from './resources/shopping_cart/shopping_cart.module';
import { CartModule } from './resources/cart/cart.module';
import { PaymentModule } from './resources/payment/payment.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: true,
      load: [appConfig],
    }),
    TypeOrmModule.forRootAsync({
      useClass: DatabaseConfig,
    }),
    // JwtModule.register({
    //   global: true,
    //   signOptions: { expiresIn: '7d' },
    // }),
    UserModule,
    AuthModule,
    ShopModule,
    ProductModule,
    ContactModule,
    CategoryModule,
    VoucherModule,
    OrderModule,
    OrderDetailModule,
    CartModule,
    PaymentModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
