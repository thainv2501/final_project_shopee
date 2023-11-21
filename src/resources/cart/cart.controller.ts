import { Request } from 'express';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { AuthGuard } from 'src/auth/guard/auth.guard';

@Controller('carts')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Req() request: Request, @Body() createCartDto: CreateCartDto) {
    return this.cartService.create(request, createCartDto);
  }

  // @Get()
  // findAll() {
  //   return this.cartService.findAll();
  // }

  @UseGuards(AuthGuard)
  @Get()
  getCarts(@Req() request: Request) {
    const ownerId = request[process.env.CURRENT_USER].id;
    return this.cartService.getMyCarts(ownerId);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCartDto: UpdateCartDto) {
    return this.cartService.update(+id, updateCartDto);
  }

  @UseGuards(AuthGuard)
  @Delete()
  remove(@Req() request: Request, @Body() id: string) {
    return this.cartService.remove(request, id);
  }
}
