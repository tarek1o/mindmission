import { RoleTranslationResponseDto } from './role-translation.response.dto';
import { RoleWithTranslationsViewModel } from 'src/modules/role/application/view-models/role-with-translations.view-model';

export class RoleDetailsResponseDto {
  id: number;
  translations: RoleTranslationResponseDto[];
  permissions: number[];
  arePermissionsEditable: boolean;
  isDeletable: boolean;
  createdAt: Date;
  updateAt: Date;

  constructor(roleViewModel: RoleWithTranslationsViewModel) {
    const { role, translations } = roleViewModel;
    this.id = role.id;
    this.translations = translations.map(translation => new RoleTranslationResponseDto(translation));
    this.permissions = role.permissions.map(permission => permission.id);
    this.arePermissionsEditable = role.arePermissionsEditable;
    this.isDeletable = role.isDeletable;
    this.createdAt = role.createdAt;
    this.updateAt = role.updatedAt;
  }
}