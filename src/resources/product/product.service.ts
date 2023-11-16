import { CategoryService } from './../category/category.service';
import { ShopService } from './../shop/shop.service';
import { FindOptionsWhere, Repository, DataSource } from 'typeorm';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,

    private dataSource: DataSource,

    private shopService: ShopService,

    private categoryService: CategoryService,
  ) {}

  async create(request, createProductDto: CreateProductDto) {
    const currentUser = request[process.env.CURRENT_USER];
    const shop = await this.shopService.getShopByUser(currentUser);
    if (!shop) {
      throw new BadRequestException('User not have any shop');
    }
    const category = await this.categoryService.getCategory({
      id: createProductDto.categoryId,
    });
    if (!category) {
      throw new BadRequestException('No category found');
    }
    const queryRunner = await this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const product = await this.productRepository.create(createProductDto);
      product.shop = shop;
      product.category = category;
      await this.productRepository.save(product);
      await queryRunner.commitTransaction();
      return { product };
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
    return `This action returns all product`;
  }

  async getProduct(
    fields: FindOptionsWhere<Product> | FindOptionsWhere<Product>[],
    relations?: string[],
  ) {
    return await this.productRepository.findOne({
      where: fields,
      relations: relations,
    });
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.getProduct({ id });
    if (!product) {
      throw new BadRequestException('Product not found !');
    }
    await this.productRepository.update({ id }, updateProductDto);
    return `This action updates a #${product.name} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
