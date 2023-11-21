import { baseEntity } from 'src/common/entities/base.entity';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class CreateVoucherDto extends baseEntity {
  @PrimaryColumn()
  id: string;
}
