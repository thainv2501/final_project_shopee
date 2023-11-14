import { PartialType } from '@nestjs/swagger';
import { CreateContactDto } from './create-contact.dto';
import { IsOptional, IsPhoneNumber, IsString } from 'class-validator';
import { Status } from 'src/constant/status.enum';

export class UpdateContactDto extends PartialType(CreateContactDto) {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  address: string;

  @IsPhoneNumber()
  @IsOptional()
  phone: string;
}
