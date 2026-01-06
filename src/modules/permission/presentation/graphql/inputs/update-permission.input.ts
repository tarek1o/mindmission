import { InputType, PartialType } from '@nestjs/graphql';
import { PermissionInput } from 'src/modules/permission/application/inputs/permission.input';
import { CreatePermissionInput } from './create-permission.input';

@InputType()
export class UpdatePermissionInput
  extends PartialType(CreatePermissionInput)
  implements Partial<PermissionInput> {}
