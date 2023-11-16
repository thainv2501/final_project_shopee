import { baseEntity } from 'src/common/entities/base.entity';
import { Product } from 'src/resources/product/entities/product.entity';
import { Shop } from 'src/resources/shop/entities/shop.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Voucher extends baseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  discount: number;

  @Column({ type: 'timestamp' })
  from: Date;

  @Column({ type: 'timestamp' })
  to: Date;

  @Column()
  quantity: number;

  @OneToOne(() => Shop)
  @JoinColumn()
  shop: Shop;

  @OneToOne(() => Product)
  @JoinColumn()
  product: Product;
}
