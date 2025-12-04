import { ObjectType, Field } from '@nestjs/graphql';
import { RoleType } from './role.type';
import { PaginationType } from './pagination.type';

@ObjectType()
export class RolesResponseType {
  @Field(() => [RoleType])
  data: RoleType[];

  @Field(() => PaginationType)
  pagination?: PaginationType;
}

