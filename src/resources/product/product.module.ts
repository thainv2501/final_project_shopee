import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ShopService } from '../shop/shop.service';
import { JwtService } from '@nestjs/jwt';
import { Shop } from '../shop/entities/shop.entity';
import { ShopModule } from '../shop/shop.module';
import { ContactService } from '../contact/contact.service';
import { Contact } from '../contact/entities/contact.entity';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { CategoryService } from '../category/category.service';
import { Category } from '../category/entities/category.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Shop, Contact, User, Category]),
    ShopModule,
  ],
  controllers: [ProductController],
  providers: [
    ProductService,
    ShopService,
    JwtService,
    ContactService,
    UserService,
    CategoryService,
  ],
})
export class ProductModule {}
