import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty , IsString,IsEmail } from "class-validator"

export class ResetPasswordUserDto {
    @ApiProperty({example : "thainv2501@gmail.com"})
    @IsNotEmpty()
    @IsEmail()
    email: string

    @ApiProperty({example : "123456"})
    @IsNotEmpty()
    @IsString()
    password: string
    
    @ApiProperty({example : "123456"})
    @IsNotEmpty()
    @IsString()
    confirmPassword: string

    @ApiProperty({example : "1200u9crm0q9cru0qwuv0nqc9wru0qx,9ewm"})
    @IsNotEmpty()
    @IsString()
    resetToken: string
}
