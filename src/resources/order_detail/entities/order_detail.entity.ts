import {
  Entity,
  Column,
  ManyToOne,
  PrimaryColumn,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Order } from 'src/resources/order/entities/order.entity';
import { Product } from 'src/resources/product/entities/product.entity';
import { OrderDetailStatus } from 'src/constant/order.detail.status.enum';
import { User } from 'src/resources/user/entities/user.entity';
import { Shop } from 'src/resources/shop/entities/shop.entity';

@Entity('order_details')
export class OrderDetail {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  orderId: string;

  @Column()
  productId: string;

  @Column()
  shopId: string;

  @ManyToOne(() => Order, (order) => order.orderDetails, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'orderId' })
  order: Order;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'productId' })
  product: Product;

  @ManyToOne(() => Shop)
  @JoinColumn({ name: 'shopId' })
  shop: Shop;

  @Column()
  quantity: number;

  @Column({ nullable: true })
  shippedDate: Date;

  @Column()
  finalPrice: number;

  @Column({
    type: 'enum',
    enum: OrderDetailStatus,
    default: OrderDetailStatus.Preparing,
  })
  status: OrderDetailStatus;
}
