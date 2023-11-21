import { ProductService } from './../product/product.service';
import { Cart } from 'src/resources/cart/entities/cart.entity';
import { ShoppingCartService } from './../shopping_cart/shopping_cart.service';
import { ShoppingCart } from 'src/resources/shopping_cart/entities/shopping_cart.entity';
import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { Repository, DataSource, FindOptionsWhere } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,

    // private shoppingCartService: ShoppingCartService,

    private productService: ProductService,

    private dataSource: DataSource,
  ) {}
  async create(request, createCartDto: CreateCartDto) {
    const product = await this.productService.getProduct({
      id: createCartDto.productId,
    });
    if (!product) {
      throw new BadRequestException('Product not found');
    }
    const queryRunner = await this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const currentUser: User = request[process.env.CURRENT_USER];
      createCartDto.ownerId = currentUser.id;
      const cart = this.cartRepository.create(createCartDto);
      await this.cartRepository.save(cart);
      await queryRunner.commitTransaction();
      return { cart };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return { err: error.message || 'Unknown error occurred' };
    } finally {
      await queryRunner.release();
    }
  }

  findAll() {
    return `This action returns all cart`;
  }

  async getMyCarts(ownerId: string) {
    const carts = await this.cartRepository.find({
      where: { ownerId },
      relations: ['product'],
    });
    const transformedCarts = carts.map((cart) => ({
      product: cart.product,
      quantity: cart.quantity,
    }));
    return {
      shoppingCart: {
        ownerId: ownerId,
        carts: transformedCarts,
      },
    };
  }

  update(id: number, updateCartDto: UpdateCartDto) {
    return `This action updates a #${id} cart`;
  }

  async remove(request, id: string) {
    const currentUser: User = request[process.env.CURRENT_USER];
    return await this.cartRepository.delete({
      ownerId: currentUser.id,
      productId: id,
    });
  }
}
