import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { baseEntity } from 'src/common/entities/base.entity';
import { Category } from 'src/resources/category/entities/category.entity';
import { Shop } from 'src/resources/shop/entities/shop.entity';
import { OrderDetail } from 'src/resources/order_detail/entities/order_detail.entity';
import { Status } from 'src/constant/status.enum';
import { Cart } from 'src/resources/cart/entities/cart.entity';

@Entity('products')
export class Product extends baseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'money' })
  price: number;

  @Column()
  quantity: number;

  @ManyToOne(() => Category, (category) => category.products)
  category: Category;

  @ManyToOne(() => Shop, (shop) => shop.products)
  shop: Shop;

  @Column({ type: 'enum', enum: Status, default: Status.Active })
  status: Status;
}
