import { Module } from '@nestjs/common';
import { ShopService } from './shop.service';
import { ShopController } from './shop.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Shop } from './entities/shop.entity';
import { JwtService } from '@nestjs/jwt';
import { ContactService } from '../contact/contact.service';
import { Contact } from '../contact/entities/contact.entity';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([Shop, Contact, User])],
  controllers: [ShopController],
  providers: [ShopService, JwtService, ContactService, UserService],
})
export class ShopModule {}
