import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { LimitedStatusGuard } from 'src/common/guard/limited-status.guard';
import { OrderDetailStatus } from 'src/constant/order.detail.status.enum';
import { UpdateOrderDetailDto } from '../order_detail/dto/update-order_detail.dto';
import { CreateSaleDto } from './dto/create-sale.dto';
import { SaleService } from './sale.service';

@Controller('sale')
export class SaleController {
  constructor(private readonly saleService: SaleService) {}

  @Post()
  create(@Body() createSaleDto: CreateSaleDto) {
    return this.saleService.create(createSaleDto);
  }

  @UseGuards(AuthGuard)
  @Get('orders')
  getOrdersOnStatus(@Req() request: Request, @Query('type') type: string) {
    return this.saleService.getOrdersOnStatus(request, type);
  }

  @UseGuards(AuthGuard)
  @Get('payments')
  getOrdersOnPaymentStatus(
    @Req() request: Request,
    @Query('type') type: string,
  ) {
    return this.saleService.getOrdersOnPaymentStatus(request, type);
  }

  @UseGuards(AuthGuard)
  @UseGuards(new LimitedStatusGuard([OrderDetailStatus.PickUp]))
  @Patch('/orders/pick-up/:id')
  requestPickUpOrder(
    @Req() request: Request,
    @Param('id') id: string,
    @Body() updateOrderDetailDto: UpdateOrderDetailDto,
  ) {
    return this.saleService.update(request, id, updateOrderDetailDto);
  }

  @UseGuards(AuthGuard)
  @UseGuards(new LimitedStatusGuard([OrderDetailStatus.Cancel]))
  @Patch('/orders/cancel/:id')
  cancelOrder(
    @Req() request: Request,
    @Param('id') id: string,
    @Body() updateOrderDetailDto: UpdateOrderDetailDto,
  ) {
    return this.saleService.update(request, id, updateOrderDetailDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.saleService.remove(+id);
  }
}
