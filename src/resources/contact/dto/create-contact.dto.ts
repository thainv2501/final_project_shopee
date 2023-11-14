import { IsPhoneNumber, IsString } from 'class-validator';

export class CreateContactDto {
  @IsString()
  name: string;

  @IsString()
  address: string;

  @IsPhoneNumber()
  phone: string;
}
