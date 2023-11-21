import { Product } from 'src/resources/product/entities/product.entity';
import { ShoppingCart } from 'src/resources/shopping_cart/entities/shopping_cart.entity';
import { User } from 'src/resources/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('carts')
export class Cart {
  @PrimaryColumn()
  ownerId: string;

  @PrimaryColumn()
  productId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'ownerId' })
  owner: User;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column()
  quantity: number;
}
