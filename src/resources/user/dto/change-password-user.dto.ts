import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty , IsString,IsEmail } from "class-validator"

export class ChangeUserPasswordDto {
    
    @ApiProperty({example : "oldPassword"})
    @IsNotEmpty()
    @IsString()
    password: string
    
    @ApiProperty({example :"newPassword"})
    @IsNotEmpty()
    @IsString()
    newPassword: string

}
