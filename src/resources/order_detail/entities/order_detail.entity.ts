import { Entity, Column, ManyToOne, PrimaryColumn, JoinColumn } from 'typeorm';
import { Order } from 'src/resources/order/entities/order.entity';
import { Product } from 'src/resources/product/entities/product.entity';

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
  totalPrice: number;
}
