import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { baseEntity } from 'src/common/entities/base.entity';
import { Status } from 'src/constant/status.enum';
import { Contact } from 'src/resources/contact/entities/contact.entity';

@Entity('user')
export class User extends baseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Exclude() // This will exclude the password field from serialization
  @Column()
  password: string;

  @OneToMany(() => Contact, (contact) => contact.user, { onDelete: 'CASCADE' })
  contacts?: Contact[];

  @Column({ type: 'enum', enum: Status, default: Status.Active })
  status: Status;
}
