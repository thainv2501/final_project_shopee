import {
  IsNotEmpty,
  IsString,
  IsEmail,
  IsOptional,
  Length,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateUserDto {
  @ApiProperty({ example: 'Boipho2k1' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: '123456' })
  @IsNotEmpty()
  @IsString()
  @Length(6, 20, {
    message: 'Password length Must be between 6 and 20 characters',
  })
  password: string;

  @ApiProperty({ example: 'thainv2501@gmail.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
