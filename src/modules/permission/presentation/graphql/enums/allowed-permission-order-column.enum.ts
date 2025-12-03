import { registerEnumType } from '@nestjs/graphql';
import { AllowedPermissionOrderColumnEnum } from 'src/modules/permission/application/enums/allowed-permission-order-columns.enum';

registerEnumType(AllowedPermissionOrderColumnEnum, {
  name: 'AllowedPermissionOrderColumnEnum',
  description: 'Allowed columns for ordering permissions',
});
