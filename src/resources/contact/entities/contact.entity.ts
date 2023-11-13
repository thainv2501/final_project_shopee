import { User } from 'src/resources/user/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('contact')
export class Contact {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  address: string;

  @Column()
  phone: string;

  @ManyToOne(() => User, (user) => user.contacts)
  user: User;
}
