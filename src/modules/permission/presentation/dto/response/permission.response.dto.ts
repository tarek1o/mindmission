import { ActionEnum } from 'src/modules/permission/domain/enums/action.enum';
import { ResourceEnum } from 'src/modules/permission/domain/enums/resource.enum';
import { GetAllPermissionsByLanguageViewModel } from 'src/modules/permission/application/view-models/get-all-permissions-by-language.view.model';

export class PermissionResponseDto {
  id: number;
  name: string;
  description: string;
  resource: ResourceEnum;
  actions: ActionEnum[];
  level: number;
  isDeletable: boolean;
  createdAt: Date;
  updateAt: Date;

  constructor(permission: GetAllPermissionsByLanguageViewModel) {
    this.id = permission.id;
    this.name = permission.name;
    this.description = permission.description;
    this.resource = permission.resource;
    this.actions = permission.actions;
    this.level = permission.level;
    this.isDeletable = permission.isDeletable;
    this.createdAt = permission.createdAt;
    this.updateAt = permission.updatedAt;
  }
}
