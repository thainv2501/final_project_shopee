import { ContactService } from './../contact/contact.service';
import { User } from './../user/entities/user.entity';
import { FindOptionsWhere, Repository, DataSource } from 'typeorm';
import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateShopDto } from './dto/create-shop.dto';
import { UpdateShopDto } from './dto/update-shop.dto';
import { Shop } from './entities/shop.entity';
import { InjectRepository } from '@nestjs/typeorm';
@Injectable()
export class ShopService {
  constructor(
    @InjectRepository(Shop)
    private shopRepository: Repository<Shop>,

    private contactService: ContactService,

    private dataSource: DataSource,
  ) {}

  async create(request, createShopDto: CreateShopDto) {
    const queryRunner = await this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const { contact } = await this.contactService.create(
        request,
        createShopDto.contact,
      );
      const shop = await this.shopRepository.create(createShopDto);
      shop.contact = contact;
      await this.shopRepository.save(shop);
      await queryRunner.commitTransaction();
      return { shop };
    } catch (err) {
      // since we have errors lets rollback the changes we made
      await queryRunner.rollbackTransaction();
      return { err: err.message || 'Unknown error occurred' };
    } finally {
      // you need to release a queryRunner which was manually instantiated
      await queryRunner.release();
    }
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

  ownerOfShop(shop: Shop, userId: string) {
    return shop.contact.user.id == userId;
  }

  async update(request, id: string, updateShopDto: UpdateShopDto) {
    const currentUser: User = request[process.env.CURRENT_USER];
    const shop = await this.getShop({ id }, ['contact', 'contact.user']);
    if (!shop) {
      throw new Error('Shop nit found');
    }
    if (!this.ownerOfShop(shop, currentUser.id)) {
      throw new BadRequestException('Not owner od this shop');
    }
    await this.shopRepository.update({ id }, updateShopDto);
    return `This action updates a #${shop.name} shop`;
  }

  remove(id: number) {
    return `This action removes a #${id} shop`;
  }
}
