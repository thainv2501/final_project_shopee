import { Exclude } from 'class-transformer';
import { baseEntity } from 'src/common/entities/base.entity';
import { Status } from 'src/constant/status.enum';
import { Contact } from 'src/resources/contact/entities/contact.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Ship extends baseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
}
