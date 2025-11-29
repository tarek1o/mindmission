import { ObjectType, Field, Int } from '@nestjs/graphql';
import { RoleTranslationType } from './role-translation.type';
import { RoleModel } from 'src/modules/role/domain/models/role.model';
import { RoleWithTranslationsViewModel } from 'src/modules/role/application/view-models/role-with-translations.view-model';

@ObjectType()
export class RoleDetailsType {
  @Field(() => Int)
  id: number;

  @Field(() => [RoleTranslationType])
  translations: RoleTranslationType[];

  @Field(() => [Int])
  permissions: number[];

  @Field(() => Boolean)
  arePermissionsEditable: boolean;

  @Field(() => Boolean)
  isDeletable: boolean;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updateAt: Date;

  constructor(roleViewModel: RoleWithTranslationsViewModel) {
    const { role, translations } = roleViewModel;
    this.id = role.id;
    this.translations = translations.map(translation => new RoleTranslationType(translation));
    this.permissions = role.permissions.map(permission => permission.id);
    this.arePermissionsEditable = role.arePermissionsEditable;
    this.isDeletable = roleViewModel.role.isDeletable;
    this.createdAt = roleViewModel.role.createdAt;
    this.updateAt = roleViewModel.role.updatedAt;
  }
}

