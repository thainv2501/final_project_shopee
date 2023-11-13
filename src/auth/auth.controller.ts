import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInUserDto } from './dto/sign-in-user.dto';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  signIn(@Body() signInUserDto:SignInUserDto){
    return this.authService.signIn(signInUserDto)
  }
}
