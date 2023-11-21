import { BadRequestException, Injectable } from '@nestjs/common';
import { SignInUserDto } from './dto/sign-in-user.dto';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/resources/user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async signIn(signInUserDto: SignInUserDto) {
    const foundUser = await this.userRepository.findOneBy({
      email: signInUserDto.email,
    });
    if (!foundUser) {
      throw new BadRequestException(`Something went wrong !`);
    }
    const matchPassword = await bcrypt.compare(
      signInUserDto.password,
      foundUser.password,
    );
    if (!matchPassword) {
      throw new BadRequestException(`Wrong password !`);
    }
    if (foundUser.status == 'inactive') {
      throw new BadRequestException(`Inactive account`);
    }
    delete foundUser.password;

    const access_token = await this.jwtService.signAsync(
      { foundUser },
      { expiresIn: '7d', secret: process.env.ACCESS_TOKEN_SECRET },
    );
    return { access_token, signInUser: foundUser };
  }
}
