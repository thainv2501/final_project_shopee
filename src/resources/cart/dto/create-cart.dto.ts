import { IsInt, IsString, Min } from 'class-validator';
import { Product } from 'src/resources/product/entities/product.entity';
import { ShoppingCart } from 'src/resources/shopping_cart/entities/shopping_cart.entity';
import { User } from 'src/resources/user/entities/user.entity';

export class CreateCartDto {
  @IsString()
  productId: string;

  ownerId: string;

  //   shoppingCartId: ShoppingCart;

  //   shoppingCart: ShoppingCart;

  owner: User;

  product: Product;

  @IsInt()
  @Min(0)
  quantity: number;
}
