import { baseEntity } from 'src/common/entities/base.entity';
import { Status } from 'src/constant/status.enum';
import { Category } from 'src/resources/category/entities/category.entity';
import { Shop } from 'src/resources/shop/entities/shop.entity';
import { Voucher } from 'src/resources/voucher/entities/voucher.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('products')
export class Product extends baseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  price: number;

  @Column()
  quantity: number;

  @ManyToOne(() => Category, (category) => category.products)
  category: Category;

  @ManyToOne(() => Shop, (shop) => shop.products)
  shop: Shop;

  @OneToMany(() => Voucher, (voucher) => voucher.product)
  vouchers: Voucher;

  @Column({ type: 'enum', enum: Status, default: Status.Active })
  status: Status;
}
