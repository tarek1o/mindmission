import { IsEnum, IsOptional } from "class-validator";
import { Transform } from "class-transformer";
import { AllowedPermissionOrderColumnEnum } from "src/modules/permission/application/enums/allowed-permission-order-columns.enum";
import { IOrder } from "src/modules/shared/application/interfaces/order.interface";
import { OrderDirectionEnum } from "src/modules/shared/application/enums/order-direction.enum";

export class PermissionOrderDto implements IOrder<AllowedPermissionOrderColumnEnum> {

  @Transform(({ value }) => Array.isArray(value) ? value[value.length - 1] : value)
  @IsEnum(AllowedPermissionOrderColumnEnum, { each: true })
  @IsOptional()
  orderBy: AllowedPermissionOrderColumnEnum = AllowedPermissionOrderColumnEnum.CREATED_AT;

  @Transform(({ value }) => Array.isArray(value) ? value[value.length - 1] : value)
  @IsEnum(OrderDirectionEnum, { each: true })
  @IsOptional()
  orderDirection: OrderDirectionEnum = OrderDirectionEnum.DESC;
}