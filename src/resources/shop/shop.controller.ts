import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ShopService } from './shop.service';
import { CreateShopDto } from './dto/create-shop.dto';
import { UpdateShopDto } from './dto/update-shop.dto';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { Request } from 'express';

@Controller('shops')
export class ShopController {
  constructor(private readonly shopService: ShopService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Req() request: Request, @Body() createShopDto: CreateShopDto) {
    return this.shopService.create(request, createShopDto);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.shopService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  getShop(@Param('id') id: string) {
    return this.shopService.getShop({ id });
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(
    @Req() request: Request,
    @Param('id') id: string,
    @Body() updateShopDto: UpdateShopDto,
  ) {
    return this.shopService.update(request, id, updateShopDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.shopService.remove(+id);
  }
}
