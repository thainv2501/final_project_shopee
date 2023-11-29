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
  Query,
} from '@nestjs/common';
import { OrderDetailService } from './order_detail.service';
import { CreateOrderDetailDto } from './dto/create-order_detail.dto';
import { UpdateOrderDetailDto } from './dto/update-order_detail.dto';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { LimitedStatusGuard } from 'src/common/guard/limited-status.guard';
import { OrderDetailStatus } from 'src/constant/order.detail.status.enum';

@Controller('order-details')
export class OrderDetailController {
  constructor(private readonly orderDetailService: OrderDetailService) {}

  @UseGuards(AuthGuard)
  @Get('payments')
  getOrdersOnPaymentStatus(
    @Req() request: Request,
    @Query('type') type: string,
  ) {
    return this.orderDetailService.getOrdersOfUserOnPaymentStatus(
      request,
      type,
    );
  }

  @UseGuards(AuthGuard)
  @Get()
  getOrdersOnStatus(@Req() request: Request, @Query('type') type: string) {
    return this.orderDetailService.getOrdersOfUserOnStatus(request, type);
  }

  @UseGuards(new LimitedStatusGuard([OrderDetailStatus.Cancel]))
  @Patch('/cancel/:id')
  cancelOrder(
    @Req() request: Request,
    @Param('id') id: string,
    @Body() updateOrderDetailDto: UpdateOrderDetailDto,
  ) {
    return this.orderDetailService.userUpdateOrder(
      request,
      id,
      updateOrderDetailDto,
    );
  }

  @UseGuards(AuthGuard)
  @UseGuards(new LimitedStatusGuard([OrderDetailStatus.Done]))
  @Patch('/confirmReceived/:id')
  confirmReceived(
    @Req() request: Request,
    @Param('id') id: string,
    @Body() updateOrderDetailDto: UpdateOrderDetailDto,
  ) {
    return this.orderDetailService.userUpdateOrder(
      request,
      id,
      updateOrderDetailDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderDetailService.remove(+id);
  }
}
