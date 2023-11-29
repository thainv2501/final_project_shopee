import { baseEntity } from 'src/common/entities/base.entity';
import { PaymentStatus } from 'src/constant/payment.status.enum';
import { Order } from 'src/resources/order/entities/order.entity';
import { OrderDetail } from 'src/resources/order_detail/entities/order_detail.entity';
import { User } from 'src/resources/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('payments')
export class Payment extends baseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  orderId: string;

  @Column()
  value: number;

  @OneToOne(() => Order)
  @JoinColumn({ name: 'orderId' })
  order: Order;
}
