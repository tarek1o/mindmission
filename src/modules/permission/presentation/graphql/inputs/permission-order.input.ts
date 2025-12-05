import { Field, InputType } from "@nestjs/graphql";
import { AllowedPermissionOrderColumnEnum } from "src/modules/permission/application/enums/allowed-permission-order-columns.enum";
import { OrderDirectionEnum } from "src/modules/shared/application/enums/order-direction.enum";
import { IOrder } from "src/modules/shared/application/interfaces/order.interface";

@InputType()
export class PermissionOrderInput implements IOrder<AllowedPermissionOrderColumnEnum> {
  @Field(() => AllowedPermissionOrderColumnEnum, { nullable: true, defaultValue: AllowedPermissionOrderColumnEnum.CREATED_AT })
  orderBy: AllowedPermissionOrderColumnEnum;

  @Field(() => OrderDirectionEnum, { nullable: true, defaultValue: OrderDirectionEnum.DESC })
  orderDirection: OrderDirectionEnum;
}