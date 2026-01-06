import { PermissionWithTranslationsViewModel } from 'src/modules/permission/application/view-models/permission-with-translations.view-model';
import { ActionEnum } from 'src/modules/permission/domain/enums/action.enum';
import { ResourceEnum } from 'src/modules/permission/domain/enums/resource.enum';
import { PermissionTranslationResponseDto } from './permission-translation.response.dto';

export class PermissionDetailsResponseDto {
  id: number;
  translations: PermissionTranslationResponseDto[];
  resource: ResourceEnum;
  actions: ActionEnum[];
  level: number;
  isResourceAndActionsEditable: boolean;
  isDeletable: boolean;
  createdAt: Date;
  updateAt: Date;

  constructor(permissionModel: PermissionWithTranslationsViewModel) {
    const { permission, translations } = permissionModel;
    this.id = permission.id;
    this.translations = translations.map(
      (translation) => new PermissionTranslationResponseDto(translation),
    );
    this.resource = permission.resource;
    this.actions = permission.actions;
    ((this.level = permission.level),
      (this.isResourceAndActionsEditable =
        permission.isResourceAndActionsEditable));
    this.isDeletable = permission.isDeletable;
    this.createdAt = permission.createdAt;
    this.updateAt = permission.updatedAt;
  }
}
