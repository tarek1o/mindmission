import { Field, Int, ObjectType } from "@nestjs/graphql";
import { GetAllPermissionsByLanguageViewModel } from "src/modules/permission/application/view-models/get-all-permissions-by-language.view.model";
import { ActionEnum } from "src/modules/permission/domain/enums/action.enum";
import { ResourceEnum } from "src/modules/permission/domain/enums/resource.enum";
import '../enums/resource.enum';
import '../enums/action.enum';

@ObjectType()
export class PermissionType {
  @Field(() => Number)
  id: number;

  @Field(() => String)
  name: string;

  @Field(() => String, { nullable: true })
  description: string | null;

  @Field(() => ResourceEnum)
  resource: ResourceEnum;

  @Field(() => [ActionEnum])
  actions: ActionEnum[];

  @Field(() => Int)
  level: number;

  @Field(() => Boolean)
  isDeletable: boolean;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updateAt: Date;

  constructor(permissionViewModel: GetAllPermissionsByLanguageViewModel) {
    this.id = permissionViewModel.id;
    this.name = permissionViewModel.name;
    this.resource = permissionViewModel.resource;
    this.actions = permissionViewModel.actions;
    this.level = permissionViewModel.level;
    this.description = permissionViewModel.description;
    this.isDeletable = permissionViewModel.isDeletable;
    this.createdAt = permissionViewModel.createdAt;
    this.updateAt = permissionViewModel.updatedAt;
  }
}