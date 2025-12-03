import { registerEnumType } from '@nestjs/graphql';
import { ActionEnum } from 'src/modules/permission/domain/enums/action.enum';

registerEnumType(ActionEnum, {
  name: 'ActionEnum',
  description: 'Supported actions',
});