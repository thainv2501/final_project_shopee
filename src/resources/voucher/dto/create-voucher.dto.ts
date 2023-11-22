import { Transform } from 'class-transformer';
import {
  IsDate,
  IsDateString,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  MinDate,
  Validate,
} from 'class-validator';
import { VoucherType } from 'src/constant/voucher.type.enum';
import { Product } from 'src/resources/product/entities/product.entity';
import { Shop } from 'src/resources/shop/entities/shop.entity';

export class CreateVoucherDto {
  @IsString()
  @IsEnum(VoucherType, { message: 'Invalid Voucher Type' })
  voucher_type: VoucherType;

  @IsString()
  name: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  discount: number;

  @IsDate()
  @Transform(({ value }) => new Date(value))
  @MinDate(new Date())
  from: Date;

  @IsDate()
  @Transform(({ value }) => new Date(value))
  @MinDate(new Date())
  expiredIn: Date;

  @IsInt()
  @Min(0)
  quantity: number;

  @IsOptional()
  @IsString()
  shopId: string;

  @IsOptional()
  @IsString()
  productId: string;

  product: Product;

  shop: Shop;
}
