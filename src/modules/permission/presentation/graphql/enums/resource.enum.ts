import { registerEnumType } from '@nestjs/graphql';
import { ResourceEnum } from 'src/modules/permission/domain/enums/resource.enum';

registerEnumType(ResourceEnum, {
  name: 'ResourceEnum',
  description: 'Supported resources',
});
