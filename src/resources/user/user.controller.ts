import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { VerifyUserDto } from './dto/verify-user.dto';
import { ResetPasswordUserDto } from './dto/reset-password-user.dto';
import { ChangeUserPasswordDto } from './dto/change-password-user.dto';
import { ApiCreatedResponse, ApiBadRequestResponse } from '@nestjs/swagger';
import { UserService } from './user.service';
import { AuthGuard } from 'src/auth/guard/auth.guard';

@Controller('users')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Post()
  @ApiCreatedResponse({ description: 'create user successful !' })
  @ApiBadRequestResponse({ description: 'create user fail ! duplicated ,...' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Post('verify')
  @ApiCreatedResponse({ description: 'verify user successful !' })
  @ApiBadRequestResponse({ description: 'verify user fail !  ,...' })
  verifyUser(@Body() verifyUserDto: VerifyUserDto) {
    return this.usersService.verifyUser(verifyUserDto);
  }

  @Get('getResetPasswordToken')
  @ApiCreatedResponse({ description: 'get a token !' })
  @ApiBadRequestResponse({ description: 'create token fail !  ,...' })
  getResetPasswordToken(@Body('email') email: string) {
    return this.usersService.getResetPasswordToken(email);
  }

  @Patch('resetPassword')
  @ApiCreatedResponse({ description: 'reset user password successful !' })
  @ApiBadRequestResponse({ description: 'reset user password  fail !  ,...' })
  resetPassword(@Body() resetPasswordUserDto: ResetPasswordUserDto) {
    return this.usersService.resetPassword(resetPasswordUserDto);
  }

  @UseGuards(AuthGuard)
  @Get(':email')
  getUser(@Param('email') email: string) {
    return this.usersService.getUser({ email });
  }

  @UseGuards(AuthGuard)
  @Patch(':email')
  update(@Param('email') email: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(email, updateUserDto);
  }

  @UseGuards(AuthGuard)
  @Patch('changePassword/:id')
  changePassword(
    @Param('email') email: string,
    @Body() changeUserPasswordDto: ChangeUserPasswordDto,
  ) {
    return this.usersService.changePassword(email, changeUserPasswordDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':email')
  remove(@Param('email') email: string) {
    return this.usersService.remove(email);
  }
}
