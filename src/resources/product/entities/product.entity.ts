import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { baseEntity } from 'src/common/entities/base.entity';
import { Category } from 'src/resources/category/entities/category.entity';
import { Shop } from 'src/resources/shop/entities/shop.entity';

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
}
