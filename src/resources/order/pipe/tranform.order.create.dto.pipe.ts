// combine-order-details.pipe.ts
import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class CombineOrderDetailsPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type !== 'body') {
      return value; // Only apply this transformation to the request body
    }

    if (!value.order_details_dto || !Array.isArray(value.order_details_dto)) {
      throw new BadRequestException('Invalid request body');
    }

    // Combine objects with the same productId and sum up their quantities
    const combinedOrderDetails = value.order_details_dto.reduce(
      (result, orderDetail) => {
        const existingOrderDetail = result.find(
          (item) => item.productId === orderDetail.productId,
        );

        if (existingOrderDetail) {
          existingOrderDetail.quantity += orderDetail.quantity;
        } else {
          result.push({ ...orderDetail });
        }

        return result;
      },
      [],
    );

    return { ...value, order_details_dto: combinedOrderDetails };
  }
}
