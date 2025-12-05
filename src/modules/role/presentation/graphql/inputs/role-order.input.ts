import { InputType, Field } from '@nestjs/graphql';
import { AllowedRoleOrderColumnsEnum } from 'src/modules/role/application/enums/allowed-role-order-columns.enum';
import { OrderDirectionEnum } from 'src/modules/shared/application/enums/order-direction.enum';
import '../enums/allowed-role-order-columns.enum';
import '../../../../shared/presentation/graphql/enums/order-direction.enum';
import { IOrder } from 'src/modules/shared/application/interfaces/order.interface';

@InputType()
export class RoleOrderInput implements IOrder<AllowedRoleOrderColumnsEnum> {
  @Field(() => AllowedRoleOrderColumnsEnum, { nullable: true, defaultValue: AllowedRoleOrderColumnsEnum.CREATED_AT })
  orderBy: AllowedRoleOrderColumnsEnum;

  @Field(() => OrderDirectionEnum, { nullable: true, defaultValue: OrderDirectionEnum.DESC })
  orderDirection: OrderDirectionEnum;
}

