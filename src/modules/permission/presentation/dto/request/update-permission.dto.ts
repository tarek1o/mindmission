import { PartialType } from '@nestjs/mapped-types';
import { CreatePermissionDto } from './create-permission.dto';
import { PermissionInput } from 'src/modules/permission/application/inputs/permission.input';

export class UpdatePermissionDto extends PartialType(CreatePermissionDto) implements Partial<PermissionInput> {}
