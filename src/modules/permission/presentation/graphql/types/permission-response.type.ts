import { Field, Int, ObjectType } from "@nestjs/graphql";
import { PaginationType } from "src/modules/role/presentation/graphql/types/pagination.type";
import { PermissionType } from "./permission.type";

@ObjectType()
export class PermissionsResponseType {
  @Field(() => [PermissionType])
  data: PermissionType[];

  @Field(() => Int, { nullable: true })
  count: number;

  @Field(() => PaginationType)
  pagination?: PaginationType;
}
