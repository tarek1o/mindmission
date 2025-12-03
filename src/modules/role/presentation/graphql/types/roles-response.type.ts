import { ObjectType, Field, Int } from '@nestjs/graphql';
import { RoleType } from './role.type';
import { PaginationType } from './pagination.type';

@ObjectType()
export class RolesResponseType {
  @Field(() => [RoleType])
  data: RoleType[];

  @Field(() => Int)
  count: number;

  @Field(() => PaginationType)
  pagination?: PaginationType;
}

