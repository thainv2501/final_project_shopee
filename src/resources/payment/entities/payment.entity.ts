import { baseEntity } from 'src/common/entities/base.entity';
import { PaymentStatus } from 'src/constant/payment.status.enum';
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
  orderDetailId: string;

  @OneToOne(() => OrderDetail)
  @JoinColumn({ name: 'orderDetailId' })
  orderDetail: OrderDetail;

  @Column()
  remitterId: string;

  @Column()
  receiverId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'remitterId' })
  remitter: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'receiverId' })
  receiver: User;

  @Column({ type: 'enum', enum: PaymentStatus })
  status: PaymentStatus;
}
