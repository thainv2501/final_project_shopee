import { baseEntity } from 'src/common/entities/base.entity';
import { Product } from 'src/resources/product/entities/product.entity';
import { Shop } from 'src/resources/shop/entities/shop.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Voucher extends baseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  discount: number;

  @Column({ type: 'timestamp' })
  from: Date;

  @Column({ type: 'timestamp' })
  expiredIn: Date;

  @Column()
  quantity: number;

  @ManyToOne(() => Shop)
  @JoinColumn()
  shop: Shop;

  @ManyToOne(() => Product)
  @JoinColumn()
  product: Product;
}
