import { IsNotEmpty, IsString, IsEmail, isEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignInUserDto {
  @ApiProperty({ example: 'thainv2501@gmail.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: '123456' })
  @IsNotEmpty()
  @IsString()
  password: string;
}
