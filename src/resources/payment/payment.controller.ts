import { Request } from 'express';
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
  UsePipes,
  Query,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { TransformPaymentCreateDtoPipe } from './pipe/tranform.payment.create.dto.pipe';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  // @UseGuards(AuthGuard)
  // @UsePipes(new TransformPaymentCreateDtoPipe())
  // @Post()
  // create(@Req() request: Request, @Body() createPaymentDto: CreatePaymentDto) {
  //   return this.paymentService.create(request, createPaymentDto);
  // }

  @UseGuards(AuthGuard)
  @Get()
  getPayments(@Req() request: Request) {
    return this.paymentService.getPayments(request);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePaymentDto: UpdatePaymentDto) {
    return this.paymentService.update(+id, updatePaymentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paymentService.remove(+id);
  }
}
