import { ObjectType, Field, Int } from '@nestjs/graphql';
import { PermissionWithTranslationsViewModel } from 'src/modules/permission/application/view-models/permission-with-translations.view-model';
import { PermissionTranslationType } from './permission-translation.type';
import { ActionEnum } from 'src/modules/permission/domain/enums/action.enum';
import { ResourceEnum } from 'src/modules/permission/domain/enums/resource.enum';
import '../enums/resource.enum';
import '../enums/action.enum';

@ObjectType()
export class PermissionDetailsType {
  @Field(() => Int)
  id: number;

  @Field(() => [PermissionTranslationType])
  translations: PermissionTranslationType[];

  @Field(() => ResourceEnum)
  resource: ResourceEnum;

  @Field(() => [ActionEnum])
  actions: ActionEnum[];

  @Field(() => Int)
  level: number;

  @Field(() => Boolean)
  isResourceAndActionsEditable: boolean;

  @Field(() => Boolean)
  isDeletable: boolean;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updateAt: Date;

  constructor(permissionViewModel: PermissionWithTranslationsViewModel) {
    const { permission, translations } = permissionViewModel;
    this.id = permission.id;
    this.translations = translations.map(
      (translation) => new PermissionTranslationType(translation),
    );
    this.resource = permission.resource;
    this.actions = permission.actions;
    this.level = permission.level;
    this.isResourceAndActionsEditable = permission.isResourceAndActionsEditable;
    this.isDeletable = permission.isDeletable;
    this.createdAt = permission.createdAt;
    this.updateAt = permission.updatedAt;
  }
}
