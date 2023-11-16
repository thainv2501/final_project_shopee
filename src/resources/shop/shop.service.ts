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

  async getShopByUser(user: User): Promise<Shop | null> {
    try {
      // Use TypeORM query to find the shop associated with the provided user
      const shop = await this.shopRepository
        .createQueryBuilder('shop')
        .leftJoinAndSelect('shop.owner', 'owner')
        .where('owner.id = :userId', { userId: user.id })
        .getOne();

      return shop || null;
    } catch (error) {
      throw error;
    }
  }

  async create(request, createShopDto: CreateShopDto) {
    const currentUser: User = request[process.env.CURRENT_USER];
    const queryRunner = await this.dataSource.createQueryRunner();
    const hasShop = await this.getShopByUser(currentUser);
    if (hasShop) {
      throw new BadRequestException('User has shop, can not create more ');
    }
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const { contact } = await this.contactService.create(
        request,
        createShopDto.contact,
      );
      const shop = await this.shopRepository.create(createShopDto);
      shop.contact = contact;
      shop.owner = currentUser;
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
    return shop.owner.id == userId;
  }

  async update(request, id: string, updateShopDto: UpdateShopDto) {
    const currentUser: User = request[process.env.CURRENT_USER];
    const shop = await this.getShop({ id }, ['owner']);
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
