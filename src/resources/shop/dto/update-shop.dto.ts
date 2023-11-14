import { PartialType } from '@nestjs/mapped-types';
import { CreateShopDto } from './create-shop.dto';
import { IsOptional, IsString } from 'class-validator';
import { Status } from 'src/constant/status.enum';

export class UpdateShopDto extends PartialType(CreateShopDto) {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  contact?: string;

  @IsString()
  @IsOptional()
  status: Status;
}
