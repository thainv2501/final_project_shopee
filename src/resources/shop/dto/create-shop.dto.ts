import { Type } from 'class-transformer';
import { IsNotEmptyObject, IsString, ValidateNested } from 'class-validator';
import { CreateContactDto } from 'src/resources/contact/dto/create-contact.dto';
import { Contact } from 'src/resources/contact/entities/contact.entity';

export class CreateShopDto {
  @IsString()
  name: string;

  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => CreateContactDto)
  contact: CreateContactDto;
}
