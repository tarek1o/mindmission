import { IsEnum, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { AllowedUserOrderColumnsEnum } from 'src/modules/user/application/enums/allowed-user-order-columns.enum';
import { IOrder } from 'src/modules/shared/application/interfaces/order.interface';
import { OrderDirectionEnum } from 'src/modules/shared/application/enums/order-direction.enum';

export class UserOrderDto implements IOrder<AllowedUserOrderColumnsEnum> {
  @Transform(({ value }) =>
    Array.isArray(value) ? value[value.length - 1] : value,
  )
  @IsEnum(AllowedUserOrderColumnsEnum, { each: true })
  @IsOptional()
  orderBy: AllowedUserOrderColumnsEnum = AllowedUserOrderColumnsEnum.CREATED_AT;

  @Transform(({ value }) =>
    Array.isArray(value) ? value[value.length - 1] : value,
  )
  @IsEnum(OrderDirectionEnum, { each: true })
  @IsOptional()
  orderDirection: OrderDirectionEnum = OrderDirectionEnum.DESC;
}
