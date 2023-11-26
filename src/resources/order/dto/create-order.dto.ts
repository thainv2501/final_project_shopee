import { Type } from 'class-transformer';
import { CreateOrderDetailDto } from './../../order_detail/dto/create-order_detail.dto';
import { IsArray, IsString, IsUUID, ValidateNested } from 'class-validator';

export class CreateOrderDto {
  @IsArray()
  @ValidateNested()
  @Type(() => CreateOrderDetailDto)
  order_details_dto: CreateOrderDetailDto[];

  @IsString()
  @IsUUID()
  contact: string;
}
