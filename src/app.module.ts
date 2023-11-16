import { ConfigModule } from '@nestjs/config';
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
import { JwtService } from '@nestjs/jwt';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './exception/all.exception';
import { CategoryModule } from './resources/category/category.module';
import { VoucherModule } from './resources/voucher/voucher.module';

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
    UserModule,
    AuthModule,
    ShopModule,
    ProductModule,
    ContactModule,
    CategoryModule,
    VoucherModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    JwtService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
