import {
  Entity,
  Column,
  ManyToOne,
  PrimaryColumn,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from 'src/resources/user/entities/user.entity';

@Entity('shopping_cart')
export class ShoppingCart {
  @PrimaryColumn()
  ownerId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'ownerId' })
  owner: User;

  // @OneToMany(() => Cart, (cart) => cart.shoppingCart)
  // carts: Cart[];
}
