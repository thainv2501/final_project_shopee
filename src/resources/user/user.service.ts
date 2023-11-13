import { ChangeUserPasswordDto } from './dto/change-password-user.dto';
import { ResetPasswordUserDto } from './dto/reset-password-user.dto';
import { VerifyUserDto } from './dto/verify-user.dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Status } from 'src/constant/status.enum';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const duplicatedUser = await this.userRepository.findOneBy({
      email: createUserDto.email,
    });
    if (duplicatedUser) {
      throw new BadRequestException(`This user is created`);
    }
    createUserDto.password = await bcrypt.hash(createUserDto.password, 10);
    const user = await this.userRepository.create(createUserDto);
    await this.userRepository.save(user);
    delete user.password;
    return user;
  }

  async verifyUser(verifyUserDto: VerifyUserDto) {
    const foundUser = await this.userRepository.findOneBy({
      email: verifyUserDto.email,
    });
    if (!foundUser || verifyUserDto.verify_token !== '111111') {
      throw new BadRequestException(`Something went wrong !`);
    }
    const updatedUser = await this.userRepository.update(
      { email: verifyUserDto.email },
      { status: Status.Active },
    );
    return updatedUser;
  }

  async getResetPasswordToken(email: string) {
    if (!email) {
      throw new BadRequestException('Email is required');
    }
    const foundUser = await this.userRepository.findOneBy({ email });
    if (!foundUser) {
      throw new BadRequestException('Something went wrong with the request');
    }
    const token = await bcrypt.hash(
      foundUser.email + process.env.ACCESS_SECRET_TOKEN,
      10,
    );
    return token;
  }

  async resetPassword(resetPasswordUserDto: ResetPasswordUserDto) {
    if (
      resetPasswordUserDto.password !== resetPasswordUserDto.confirmPassword
    ) {
      throw new BadRequestException('New password do not match !');
    }
    const foundUser = await this.userRepository.findOneBy({
      email: resetPasswordUserDto.email,
    });
    if (!foundUser) {
      throw new BadRequestException('Something went wrong with the request');
    }
    const tokenMatch = await bcrypt.compare(
      foundUser.email + process.env.ACCESS_SECRET_TOKEN,
      resetPasswordUserDto.resetToken,
    );
    if (!tokenMatch) {
      throw new BadRequestException('Token not match,Request denied !');
    }
    const newPassword = await bcrypt.hash(resetPasswordUserDto.password, 10);
    await this.userRepository.update(
      { id: foundUser.id },
      { password: newPassword },
    );
    return { status: 200, message: 'Password reset' };
  }

  findAll() {
    return `This action returns all users`;
  }

  async getUser(
    fields: FindOptionsWhere<User> | FindOptionsWhere<User>[],
    relationOptions?: string[],
  ): Promise<User> {
    return await this.userRepository.findOne({
      where: fields,
      relations: relationOptions,
    });
  }

  async update(email: string, updateUserDto: UpdateUserDto) {
    const foundUser = await this.userRepository.findOneBy({ email });
    if (!foundUser) {
      throw new BadRequestException('No user found');
    }
    await this.userRepository.update({ email: foundUser.email }, updateUserDto);
    return ` updated ${foundUser.email}`;
  }

  async changePassword(
    email: string,
    changeUserPasswordDto: ChangeUserPasswordDto,
  ) {
    const foundUser = await this.userRepository.findOneBy({ email });
    if (!foundUser) {
      throw new BadRequestException('No user found');
    }
    const matchPassword = await bcrypt.compare(
      changeUserPasswordDto.password,
      foundUser.password,
    );
    if (
      !changeUserPasswordDto.password ||
      changeUserPasswordDto.password === changeUserPasswordDto.newPassword ||
      !matchPassword
    ) {
      throw new BadRequestException('Change Password fail');
    }
    const newPassword = await bcrypt.hash(
      changeUserPasswordDto.newPassword,
      10,
    );
    await this.userRepository.update(
      { id: foundUser.id },
      { password: newPassword },
    );

    return `This action change password # ${foundUser.email} user`;
  }

  async remove(email: string) {
    return await this.userRepository.delete({ email });
  }
}
