import { User } from './../user/entities/user.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { CreateShopDto } from './dto/create-shop.dto';
import { UpdateShopDto } from './dto/update-shop.dto';
import { Shop } from './entities/shop.entity';
import { InjectRepository } from '@nestjs/typeorm';
@Injectable()
export class ShopService {
  constructor(
    @InjectRepository(Shop)
    private shopRepository: Repository<Shop>,
  ) {}

  async create(request, createShopDto: CreateShopDto) {
    const currentUser: User = request[process.env.CURRENT_USER];
    // const contact = this;
    return 'This action adds a new shop';
  }

  findAll() {
    return `This action returns all shop`;
  }

  async getShop(
    fields: FindOptionsWhere<Shop> | FindOptionsWhere<Shop>[],
    relationOptions?: string[],
  ) {
    return await this.shopRepository.findOne({
      where: fields,
      relations: relationOptions,
    });
  }

  async update(request, id: string, updateShopDto: UpdateShopDto) {
    const shop = await this.getShop({ id });

    return `This action updates a #${id} shop`;
  }

  remove(id: number) {
    return `This action removes a #${id} shop`;
  }
}
