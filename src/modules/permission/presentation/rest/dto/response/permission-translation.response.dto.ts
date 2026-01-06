import { PermissionTranslationModel } from 'src/modules/permission/domain/models/permission-translation.model';
import { LanguageEnum } from 'src/modules/shared/domain/enums/language.enum';

export class PermissionTranslationResponseDto {
  language: LanguageEnum;
  name: string;
  description: string;

  constructor(permissionTranslationModel: PermissionTranslationModel) {
    this.language = permissionTranslationModel.language;
    this.name = permissionTranslationModel.name;
    this.description = permissionTranslationModel.description;
  }
}
