import { InputType, PartialType } from '@nestjs/graphql';
import { RoleInput } from 'src/modules/role/application/inputs/role.input';
import { CreateRoleInput } from './create-role.input';

@InputType()
export class UpdateRoleInput extends PartialType(CreateRoleInput) implements Partial<RoleInput> {}

