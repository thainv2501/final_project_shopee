import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty , IsString,IsEmail } from "class-validator"

export class VerifyUserDto {
    @ApiProperty({example : "thainv2501@gmail.com"})
    @IsNotEmpty()
    @IsEmail()
    email: string
    
    @ApiProperty({example : "123h12ij3h123h1k2j3hk12j3hk12h31i2o31o2i3u"})
    @IsNotEmpty()
    @IsString()
    verify_token : string 
}
