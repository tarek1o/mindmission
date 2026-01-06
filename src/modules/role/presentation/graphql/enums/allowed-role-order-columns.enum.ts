import { registerEnumType } from '@nestjs/graphql';
import { AllowedRoleOrderColumnsEnum } from 'src/modules/role/application/enums/allowed-role-order-columns.enum';

registerEnumType(AllowedRoleOrderColumnsEnum, {
  name: 'AllowedRoleOrderColumnsEnum',
  description: 'Allowed columns for ordering roles',
});
