import { Field, ObjectType } from '@nestjs/graphql';
import { PaginationType } from 'src/modules/shared/presentation/graphql/types/pagination.type';
import { PermissionType } from './permission.type';

@ObjectType()
export class PermissionsResponseType {
  @Field(() => [PermissionType])
  data: PermissionType[];

  @Field(() => PaginationType)
  pagination?: PaginationType;
}
