import { baseEntity } from 'src/common/entities/base.entity';
import { Status } from 'src/constant/status.enum';
import { OrderDetail } from 'src/resources/order_detail/entities/order_detail.entity';
import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('orders')
export class Order extends baseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @OneToMany(() => OrderDetail, (orderDetail) => orderDetail.order)
  orderDetail: OrderDetail[];

  //   @Column({ type: 'enum', enum: Status, default: Status.Active })
  //   status: Status;
}
