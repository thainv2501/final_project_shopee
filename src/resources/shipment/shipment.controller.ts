import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ShipmentService } from './shipment.service';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { LimitedStatusGuard } from 'src/common/guard/limited-status.guard';
import { OrderDetailStatus } from 'src/constant/order.detail.status.enum';
import { UpdateOrderDetailDto } from '../order_detail/dto/update-order_detail.dto';
import { Request } from 'express';

@Controller('shipment')
export class ShipmentController {
  constructor(private readonly shipmentService: ShipmentService) {}

  @UseGuards(AuthGuard)
  @UseGuards()
  @Get('/orders')
  getOrdersOnStatus(@Query('type') type: string, @Req() request: Request) {
    return this.shipmentService.getOrdersOnStatus(request, type);
  }

  @UseGuards(AuthGuard)
  @UseGuards(new LimitedStatusGuard([OrderDetailStatus.Shipping]))
  @Patch('/orders/shipping/:id')
  shippingOrder(
    @Req() request: Request,
    @Param('id') id: string,
    @Body() updateOrderDetailDto: UpdateOrderDetailDto,
  ) {
    return this.shipmentService.updateOrder(request, id, updateOrderDetailDto);
  }

  @UseGuards(AuthGuard)
  @UseGuards(new LimitedStatusGuard([OrderDetailStatus.Shipped]))
  @Patch('/orders/shipped/:id')
  shippedOrder(
    @Req() request: Request,
    @Param('id') id: string,
    @Body() updateOrderDetailDto: UpdateOrderDetailDto,
  ) {
    return this.shipmentService.updateOrder(request, id, updateOrderDetailDto);
  }
}
