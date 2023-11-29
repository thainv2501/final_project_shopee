// limited-status.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { OrderDetailStatus } from 'src/constant/order.detail.status.enum';

@Injectable()
export class LimitedStatusGuard implements CanActivate {
  constructor(private OrderDetailStatuses: OrderDetailStatus[]) {}

  canActivate(context: ExecutionContext): boolean {
    const allowedStatuses = this.OrderDetailStatuses;

    const { status } = context.switchToHttp().getRequest().body;

    return allowedStatuses.includes(status);
  }
}
