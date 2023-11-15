import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany,
  JoinTable,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { baseEntity } from 'src/common/entities/base.entity';
import { Status } from 'src/constant/status.enum';
import { Contact } from 'src/resources/contact/entities/contact.entity';
import { User } from 'src/resources/user/entities/user.entity';

@Entity('shops')
export class Shop extends baseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @OneToOne(() => Contact)
  @JoinColumn()
  contact: Contact;

  @Column({ type: 'enum', enum: Status, default: Status.Active })
  status: Status;
}
