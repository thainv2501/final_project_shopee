import { ProductService } from './../product/product.service';
import { Product } from 'src/resources/product/entities/product.entity';
import { ShoppingCart } from './entities/shopping_cart.entity';
import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateShoppingCartDto } from './dto/create-shopping_cart.dto';
import { UpdateShoppingCartDto } from './dto/update-shopping_cart.dto';
import { FindOptionsWhere, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { async } from 'rxjs';

@Injectable()
export class ShoppingCartService {
  constructor(
    @InjectRepository(ShoppingCart)
    private shoppingCartRepository: Repository<ShoppingCart>,

    private productService: ProductService,
  ) {}
  async create(request) {
    const currentUser = request[process.env.CURRENT_USER];
    const shoppingCart = await this.shoppingCartRepository.create({
      owner: currentUser,
    });
    await this.shoppingCartRepository.save(shoppingCart);
    return { shoppingCart };
  }

  findAll() {
    return `This action returns all shoppingCart`;
  }

  getShoppingCart(
    fields: FindOptionsWhere<ShoppingCart> | FindOptionsWhere<ShoppingCart>[],
    relations?: string[],
  ) {
    const shoppingCart = this.shoppingCartRepository.find({
      where: fields,
      relations: relations,
    });
    return { shoppingCart };
  }

  update(id: number, updateShoppingCartDto: UpdateShoppingCartDto) {
    return `This action updates a #${id} shoppingCart`;
  }

  remove(id: number) {
    return `This action removes a #${id} shoppingCart`;
  }
}
