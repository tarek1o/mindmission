import { IsEnum, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { IOrder } from 'src/modules/shared/application/interfaces/order.interface';
import { OrderDirectionEnum } from 'src/modules/shared/application/enums/order-direction.enum';
import { AllowedRoleOrderColumnsEnum } from 'src/modules/role/application/enums/allowed-role-order-columns.enum';

export class PermissionOrderDto implements IOrder<AllowedRoleOrderColumnsEnum> {
  @Transform(({ value }) =>
    Array.isArray(value) ? value[value.length - 1] : value,
  )
  @IsEnum(AllowedRoleOrderColumnsEnum, { each: true })
  @IsOptional()
  orderBy: AllowedRoleOrderColumnsEnum = AllowedRoleOrderColumnsEnum.CREATED_AT;

  @Transform(({ value }) =>
    Array.isArray(value) ? value[value.length - 1] : value,
  )
  @IsEnum(OrderDirectionEnum, { each: true })
  @IsOptional()
  orderDirection: OrderDirectionEnum = OrderDirectionEnum.DESC;
}
