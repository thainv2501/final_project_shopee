import { Entity, Column, ManyToOne, PrimaryColumn, JoinColumn } from 'typeorm';
import { Order } from 'src/resources/order/entities/order.entity';
import { Product } from 'src/resources/product/entities/product.entity';
import { Status } from 'src/constant/status.enum';

@Entity('order_details')
export class OrderDetail {
  @PrimaryColumn()
  orderId: string;

  @PrimaryColumn()
  productId: string;

  @ManyToOne(() => Order, (order) => order.orderDetail)
  @JoinColumn({ name: 'orderId' })
  order: Order;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column()
  quantity: number;

  @Column({ type: 'money' })
  finalPrice: number;

  @Column({ type: 'enum', enum: Status, default: Status.Active })
  status: Status;
}
